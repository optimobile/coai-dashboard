import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  forumThreads,
  forumPosts,
  forumPostLikes,
  forumNotifications,
  users,
  courses
} from "../../drizzle/schema";
import { eq, and, desc, sql, or, isNull } from "drizzle-orm";

export const forumsRouter = router({
  /**
   * Get all threads for a course
   */
  getCourseThreads: protectedProcedure
    .input(z.object({ 
      courseId: z.number(),
      lessonId: z.number().optional(),
      sortBy: z.enum(['recent', 'popular', 'unanswered']).optional().default('recent'),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      let query = db
        .select({
          thread: forumThreads,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.userId, users.id))
        .where(eq(forumThreads.courseId, input.courseId))
        .$dynamic();

      // Filter by lesson if provided
      if (input.lessonId) {
        query = query.where(eq(forumThreads.lessonId, input.lessonId));
      }

      // Apply sorting
      if (input.sortBy === 'recent') {
        query = query.orderBy(desc(forumThreads.lastActivityAt));
      } else if (input.sortBy === 'popular') {
        query = query.orderBy(desc(forumThreads.viewCount));
      } else if (input.sortBy === 'unanswered') {
        query = query.where(eq(forumThreads.replyCount, 0)).orderBy(desc(forumThreads.createdAt));
      }

      const threads = await query;

      return threads.map(t => ({
        ...t.thread,
        author: t.user,
      }));
    }),

  /**
   * Get a single thread with all posts
   */
  getThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      // Get thread
      const threadData = await db
        .select({
          thread: forumThreads,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
          course: {
            id: courses.id,
            title: courses.title,
          },
        })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.userId, users.id))
        .leftJoin(courses, eq(forumThreads.courseId, courses.id))
        .where(eq(forumThreads.id, input.threadId))
        .limit(1);

      if (threadData.length === 0) {
        throw new Error('Thread not found');
      }

      // Increment view count
      await db
        .update(forumThreads)
        .set({ viewCount: sql`${forumThreads.viewCount} + 1` })
        .where(eq(forumThreads.id, input.threadId));

      // Get all posts for this thread
      const posts = await db
        .select({
          post: forumPosts,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
          },
        })
        .from(forumPosts)
        .leftJoin(users, eq(forumPosts.userId, users.id))
        .where(eq(forumPosts.threadId, input.threadId))
        .orderBy(forumPosts.createdAt);

      // Get user's likes
      const userLikes = await db
        .select()
        .from(forumPostLikes)
        .where(
          and(
            eq(forumPostLikes.userId, userId),
            sql`${forumPostLikes.postId} IN (${sql.join(posts.map(p => sql`${p.post.id}`), sql`, `)})`
          )
        );

      const likedPostIds = new Set(userLikes.map(l => l.postId));

      const postsWithLikes = posts.map(p => ({
        ...p.post,
        author: p.user,
        isLikedByUser: likedPostIds.has(p.post.id),
      }));

      return {
        ...threadData[0].thread,
        author: threadData[0].user,
        course: threadData[0].course,
        posts: postsWithLikes,
      };
    }),

  /**
   * Create a new thread
   */
  createThread: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      lessonId: z.number().optional(),
      title: z.string().min(5).max(255),
      content: z.string().min(10),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;
      const now = new Date().toISOString();

      const result = await db.insert(forumThreads).values({
        courseId: input.courseId,
        lessonId: input.lessonId || null,
        userId,
        title: input.title,
        content: input.content,
        isPinned: false,
        isLocked: false,
        viewCount: 0,
        replyCount: 0,
        lastActivityAt: now,
        createdAt: now,
        updatedAt: now,
      });

      return { 
        success: true, 
        threadId: Number(result.insertId),
      };
    }),

  /**
   * Create a post/reply in a thread
   */
  createPost: protectedProcedure
    .input(z.object({
      threadId: z.number(),
      content: z.string().min(1),
      parentPostId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;
      const now = new Date().toISOString();

      // Check if thread is locked
      const thread = await db
        .select()
        .from(forumThreads)
        .where(eq(forumThreads.id, input.threadId))
        .limit(1);

      if (thread.length === 0) {
        throw new Error('Thread not found');
      }

      if (thread[0].isLocked) {
        throw new Error('Thread is locked');
      }

      // Create post
      const result = await db.insert(forumPosts).values({
        threadId: input.threadId,
        userId,
        parentPostId: input.parentPostId || null,
        content: input.content,
        isEdited: false,
        editedAt: null,
        likeCount: 0,
        isInstructorPost: false,
        isSolution: false,
        createdAt: now,
        updatedAt: now,
      });

      // Update thread reply count and last activity
      await db
        .update(forumThreads)
        .set({
          replyCount: sql`${forumThreads.replyCount} + 1`,
          lastActivityAt: now,
          updatedAt: now,
        })
        .where(eq(forumThreads.id, input.threadId));

      // Create notification for thread author (if not self)
      if (thread[0].userId !== userId) {
        await db.insert(forumNotifications).values({
          userId: thread[0].userId,
          threadId: input.threadId,
          postId: Number(result.insertId),
          type: 'reply',
          isRead: false,
          createdAt: now,
        });
      }

      // Create notification for parent post author (if replying)
      if (input.parentPostId) {
        const parentPost = await db
          .select()
          .from(forumPosts)
          .where(eq(forumPosts.id, input.parentPostId))
          .limit(1);

        if (parentPost.length > 0 && parentPost[0].userId !== userId) {
          await db.insert(forumNotifications).values({
            userId: parentPost[0].userId,
            threadId: input.threadId,
            postId: Number(result.insertId),
            type: 'reply',
            isRead: false,
            createdAt: now,
          });
        }
      }

      return { 
        success: true, 
        postId: Number(result.insertId),
      };
    }),

  /**
   * Edit a post
   */
  editPost: protectedProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      // Check if user owns the post
      const post = await db
        .select()
        .from(forumPosts)
        .where(eq(forumPosts.id, input.postId))
        .limit(1);

      if (post.length === 0) {
        throw new Error('Post not found');
      }

      if (post[0].userId !== userId) {
        throw new Error('Unauthorized');
      }

      const now = new Date().toISOString();

      await db
        .update(forumPosts)
        .set({
          content: input.content,
          isEdited: true,
          editedAt: now,
          updatedAt: now,
        })
        .where(eq(forumPosts.id, input.postId));

      return { success: true };
    }),

  /**
   * Like/unlike a post
   */
  togglePostLike: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      // Check if already liked
      const existing = await db
        .select()
        .from(forumPostLikes)
        .where(
          and(
            eq(forumPostLikes.postId, input.postId),
            eq(forumPostLikes.userId, userId)
          )
        )
        .limit(1);

      const now = new Date().toISOString();

      if (existing.length > 0) {
        // Unlike
        await db
          .delete(forumPostLikes)
          .where(eq(forumPostLikes.id, existing[0].id));

        await db
          .update(forumPosts)
          .set({ likeCount: sql`${forumPosts.likeCount} - 1` })
          .where(eq(forumPosts.id, input.postId));

        return { success: true, liked: false };
      } else {
        // Like
        await db.insert(forumPostLikes).values({
          postId: input.postId,
          userId,
          createdAt: now,
        });

        await db
          .update(forumPosts)
          .set({ likeCount: sql`${forumPosts.likeCount} + 1` })
          .where(eq(forumPosts.id, input.postId));

        // Create notification for post author
        const post = await db
          .select()
          .from(forumPosts)
          .where(eq(forumPosts.id, input.postId))
          .limit(1);

        if (post.length > 0 && post[0].userId !== userId) {
          await db.insert(forumNotifications).values({
            userId: post[0].userId,
            threadId: post[0].threadId,
            postId: input.postId,
            type: 'like',
            isRead: false,
            createdAt: now,
          });
        }

        return { success: true, liked: true };
      }
    }),

  /**
   * Mark a post as solution
   */
  markAsSolution: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      // Get post and thread
      const post = await db
        .select()
        .from(forumPosts)
        .where(eq(forumPosts.id, input.postId))
        .limit(1);

      if (post.length === 0) {
        throw new Error('Post not found');
      }

      const thread = await db
        .select()
        .from(forumThreads)
        .where(eq(forumThreads.id, post[0].threadId))
        .limit(1);

      if (thread.length === 0) {
        throw new Error('Thread not found');
      }

      // Only thread author can mark solution
      if (thread[0].userId !== userId) {
        throw new Error('Only thread author can mark solution');
      }

      const now = new Date().toISOString();

      // Unmark any existing solutions
      await db
        .update(forumPosts)
        .set({ isSolution: false })
        .where(eq(forumPosts.threadId, post[0].threadId));

      // Mark this post as solution
      await db
        .update(forumPosts)
        .set({ isSolution: true, updatedAt: now })
        .where(eq(forumPosts.id, input.postId));

      // Create notification for post author
      if (post[0].userId !== userId) {
        await db.insert(forumNotifications).values({
          userId: post[0].userId,
          threadId: post[0].threadId,
          postId: input.postId,
          type: 'solution_marked',
          isRead: false,
          createdAt: now,
        });
      }

      return { success: true };
    }),

  /**
   * Get user's notifications
   */
  getNotifications: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      const notifications = await db
        .select({
          notification: forumNotifications,
          thread: forumThreads,
          post: forumPosts,
        })
        .from(forumNotifications)
        .leftJoin(forumThreads, eq(forumNotifications.threadId, forumThreads.id))
        .leftJoin(forumPosts, eq(forumNotifications.postId, forumPosts.id))
        .where(eq(forumNotifications.userId, userId))
        .orderBy(desc(forumNotifications.createdAt))
        .limit(50);

      return notifications.map(n => ({
        ...n.notification,
        thread: n.thread,
        post: n.post,
      }));
    }),

  /**
   * Mark notification as read
   */
  markNotificationRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      await db
        .update(forumNotifications)
        .set({ isRead: true })
        .where(
          and(
            eq(forumNotifications.id, input.notificationId),
            eq(forumNotifications.userId, userId)
          )
        );

      return { success: true };
    }),

  /**
   * Mark all notifications as read
   */
  markAllNotificationsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      await db
        .update(forumNotifications)
        .set({ isRead: true })
        .where(eq(forumNotifications.userId, userId));

      return { success: true };
    }),

  /**
   * Delete a thread (only by author or admin)
   */
  deleteThread: protectedProcedure
    .input(z.object({ threadId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      const userId = ctx.user.id;

      // Check if user owns the thread
      const thread = await db
        .select()
        .from(forumThreads)
        .where(eq(forumThreads.id, input.threadId))
        .limit(1);

      if (thread.length === 0) {
        throw new Error('Thread not found');
      }

      if (thread[0].userId !== userId) {
        throw new Error('Unauthorized');
      }

      // Delete all posts
      await db
        .delete(forumPosts)
        .where(eq(forumPosts.threadId, input.threadId));

      // Delete all notifications
      await db
        .delete(forumNotifications)
        .where(eq(forumNotifications.threadId, input.threadId));

      // Delete thread
      await db
        .delete(forumThreads)
        .where(eq(forumThreads.id, input.threadId));

      return { success: true };
    }),
});
