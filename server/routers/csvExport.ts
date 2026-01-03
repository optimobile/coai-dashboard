import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { db } from "../db";
import { users, userCohorts, courseEnrollments, courses, userTrainingProgress, userCertificates, trainingModules } from "../../drizzle/schema";
import { eq, and, inArray } from "drizzle-orm";

// ============================================
// CSV EXPORT ROUTER
// ============================================

export const csvExportRouter = router({
  // Export cohort students to CSV
  exportCohortStudents: protectedProcedure
    .input(z.object({
      cohortId: z.number(),
      includeProgress: z.boolean().default(true),
      includeCertificates: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      // Get cohort info
      const [cohort] = await db
        .select()
        .from(userCohorts)
        .where(eq(userCohorts.id, input.cohortId))
        .limit(1);

      if (!cohort) {
        throw new Error('Cohort not found');
      }

      // Get all students in cohort with enrollment data
      const studentEnrollments = await db
        .select({
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          userStatus: users.status,
          enrollmentId: courseEnrollments.id,
          enrollmentStatus: courseEnrollments.status,
          enrolledAt: courseEnrollments.enrolledAt,
          completedAt: courseEnrollments.completedAt,
          courseId: courses.id,
          courseName: courses.name,
        })
        .from(courseEnrollments)
        .innerJoin(users, eq(courseEnrollments.userId, users.id))
        .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .where(eq(courseEnrollments.cohortId, input.cohortId));

      // Get progress data if requested
      let progressData: Map<number, any> = new Map();
      if (input.includeProgress) {
        const userIds = [...new Set(studentEnrollments.map(e => e.userId))];
        const progress = await db
          .select({
            userId: userTrainingProgress.userId,
            moduleId: userTrainingProgress.moduleId,
            moduleName: trainingModules.name,
            status: userTrainingProgress.status,
            progress: userTrainingProgress.progress,
            completedAt: userTrainingProgress.completedAt,
          })
          .from(userTrainingProgress)
          .leftJoin(trainingModules, eq(userTrainingProgress.moduleId, trainingModules.id))
          .where(inArray(userTrainingProgress.userId, userIds));

        // Group by user
        progress.forEach(p => {
          if (!progressData.has(p.userId)) {
            progressData.set(p.userId, []);
          }
          progressData.get(p.userId)!.push(p);
        });
      }

      // Get certificate data if requested
      let certificateData: Map<number, any> = new Map();
      if (input.includeCertificates) {
        const userIds = [...new Set(studentEnrollments.map(e => e.userId))];
        const certificates = await db
          .select()
          .from(userCertificates)
          .where(inArray(userCertificates.userId, userIds));

        // Group by user
        certificates.forEach(cert => {
          if (!certificateData.has(cert.userId)) {
            certificateData.set(cert.userId, []);
          }
          certificateData.get(cert.userId)!.push(cert);
        });
      }

      // Build CSV data
      const csvRows: string[][] = [];
      
      // Header row
      const headers = [
        'User ID',
        'Name',
        'Email',
        'User Status',
        'Enrollment Status',
        'Enrolled At',
        'Completed At',
        'Course Name',
      ];

      if (input.includeProgress) {
        headers.push('Modules Completed', 'Modules In Progress', 'Average Progress %');
      }

      if (input.includeCertificates) {
        headers.push('Certificates Earned', 'Latest Certificate');
      }

      csvRows.push(headers);

      // Data rows - group by user
      const userMap = new Map<number, typeof studentEnrollments>();
      studentEnrollments.forEach(enrollment => {
        if (!userMap.has(enrollment.userId)) {
          userMap.set(enrollment.userId, []);
        }
        userMap.get(enrollment.userId)!.push(enrollment);
      });

      userMap.forEach((enrollments, userId) => {
        const firstEnrollment = enrollments[0];
        const row: string[] = [
          userId.toString(),
          firstEnrollment.userName || '',
          firstEnrollment.userEmail || '',
          firstEnrollment.userStatus || '',
          firstEnrollment.enrollmentStatus || '',
          firstEnrollment.enrolledAt || '',
          firstEnrollment.completedAt || '',
          enrollments.map(e => e.courseName).filter(Boolean).join('; '),
        ];

        if (input.includeProgress) {
          const userProgress = progressData.get(userId) || [];
          const completed = userProgress.filter(p => p.status === 'completed').length;
          const inProgress = userProgress.filter(p => p.status === 'in_progress').length;
          const avgProgress = userProgress.length > 0
            ? (userProgress.reduce((sum, p) => sum + (p.progress || 0), 0) / userProgress.length).toFixed(1)
            : '0';

          row.push(completed.toString(), inProgress.toString(), avgProgress);
        }

        if (input.includeCertificates) {
          const userCerts = certificateData.get(userId) || [];
          const certCount = userCerts.length;
          const latestCert = userCerts.length > 0
            ? userCerts.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0]
            : null;

          row.push(
            certCount.toString(),
            latestCert ? `${latestCert.certificateNumber} (${latestCert.issuedAt})` : ''
          );
        }

        csvRows.push(row);
      });

      // Convert to CSV string
      const csvContent = csvRows
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return {
        filename: `cohort-${cohort.name.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.csv`,
        content: csvContent,
        rowCount: csvRows.length - 1, // Exclude header
      };
    }),

  // Export all students (admin only)
  exportAllStudents: protectedProcedure
    .input(z.object({
      filters: z.object({
        status: z.string().optional(),
        cohortIds: z.array(z.number()).optional(),
        enrolledAfter: z.string().optional(),
        enrolledBefore: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user is admin (you may want to add role check here)
      // For now, we'll allow any authenticated user

      // Build query conditions
      const conditions = [];
      
      if (input.filters?.cohortIds && input.filters.cohortIds.length > 0) {
        conditions.push(inArray(courseEnrollments.cohortId, input.filters.cohortIds));
      }

      // Get all students with enrollment data
      const studentData = await db
        .select({
          userId: users.id,
          userName: users.name,
          userEmail: users.email,
          userStatus: users.status,
          userCreatedAt: users.createdAt,
          userLastLoginAt: users.lastLoginAt,
          cohortId: userCohorts.id,
          cohortName: userCohorts.cohortId,
          enrollmentStatus: courseEnrollments.status,
          enrolledAt: courseEnrollments.enrolledAt,
          completedAt: courseEnrollments.completedAt,
          courseId: courses.id,
          courseName: courses.name,
        })
        .from(users)
        .leftJoin(courseEnrollments, eq(users.id, courseEnrollments.userId))
        .leftJoin(userCohorts, eq(courseEnrollments.cohortId, userCohorts.id))
        .leftJoin(courses, eq(courseEnrollments.courseId, courses.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Build CSV
      const csvRows: string[][] = [];
      
      csvRows.push([
        'User ID',
        'Name',
        'Email',
        'Status',
        'Created At',
        'Last Login',
        'Cohort',
        'Course',
        'Enrollment Status',
        'Enrolled At',
        'Completed At',
      ]);

      studentData.forEach(student => {
        csvRows.push([
          student.userId.toString(),
          student.userName || '',
          student.userEmail || '',
          student.userStatus || '',
          student.userCreatedAt || '',
          student.userLastLoginAt || '',
          student.cohortName || '',
          student.courseName || '',
          student.enrollmentStatus || '',
          student.enrolledAt || '',
          student.completedAt || '',
        ]);
      });

      const csvContent = csvRows
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return {
        filename: `all-students-${new Date().toISOString().split('T')[0]}.csv`,
        content: csvContent,
        rowCount: csvRows.length - 1,
      };
    }),

  // Export student progress report
  exportStudentProgress: protectedProcedure
    .input(z.object({
      userIds: z.array(z.number()).optional(),
      cohortId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      let targetUserIds: number[] = [];

      if (input.userIds && input.userIds.length > 0) {
        targetUserIds = input.userIds;
      } else if (input.cohortId) {
        // Get all users in cohort
        const cohortEnrollments = await db
          .select({ userId: courseEnrollments.userId })
          .from(courseEnrollments)
          .where(eq(courseEnrollments.cohortId, input.cohortId));
        
        targetUserIds = [...new Set(cohortEnrollments.map(e => e.userId))];
      } else {
        throw new Error('Must provide either userIds or cohortId');
      }

      // Get user info
      const usersData = await db
        .select()
        .from(users)
        .where(inArray(users.id, targetUserIds));

      // Get progress data
      const progressData = await db
        .select({
          userId: userTrainingProgress.userId,
          moduleId: userTrainingProgress.moduleId,
          moduleName: trainingModules.name,
          status: userTrainingProgress.status,
          progress: userTrainingProgress.progress,
          timeSpentMinutes: userTrainingProgress.timeSpentMinutes,
          startedAt: userTrainingProgress.startedAt,
          completedAt: userTrainingProgress.completedAt,
        })
        .from(userTrainingProgress)
        .innerJoin(trainingModules, eq(userTrainingProgress.moduleId, trainingModules.id))
        .where(inArray(userTrainingProgress.userId, targetUserIds));

      // Build CSV
      const csvRows: string[][] = [];
      
      csvRows.push([
        'User ID',
        'User Name',
        'User Email',
        'Module Name',
        'Status',
        'Progress %',
        'Time Spent (minutes)',
        'Started At',
        'Completed At',
      ]);

      progressData.forEach(progress => {
        const user = usersData.find(u => u.id === progress.userId);
        csvRows.push([
          progress.userId.toString(),
          user?.name || '',
          user?.email || '',
          progress.moduleName || '',
          progress.status || '',
          (progress.progress || 0).toString(),
          (progress.timeSpentMinutes || 0).toString(),
          progress.startedAt || '',
          progress.completedAt || '',
        ]);
      });

      const csvContent = csvRows
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      return {
        filename: `student-progress-${new Date().toISOString().split('T')[0]}.csv`,
        content: csvContent,
        rowCount: csvRows.length - 1,
      };
    }),
});
