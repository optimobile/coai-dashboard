import { Router } from 'express';
import { getDb } from '../db';
import { courses, courseBundles } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const db = await getDb();
    const allCourses = await db.select().from(courses).where(eq(courses.active, 1));
    res.json(allCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const db = await getDb();
    const courseId = parseInt(req.params.id);
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get all course bundles
router.get('/course-bundles', async (req, res) => {
  try {
    const db = await getDb();
    const allBundles = await db.select().from(courseBundles).where(eq(courseBundles.active, 1));
    res.json(allBundles);
  } catch (error) {
    console.error('Error fetching bundles:', error);
    res.status(500).json({ error: 'Failed to fetch bundles' });
  }
});

// Get bundle by ID
router.get('/course-bundles/:id', async (req, res) => {
  try {
    const db = await getDb();
    const bundleId = parseInt(req.params.id);
    const [bundle] = await db.select().from(courseBundles).where(eq(courseBundles.id, bundleId));
    
    if (!bundle) {
      return res.status(404).json({ error: 'Bundle not found' });
    }
    
    res.json(bundle);
  } catch (error) {
    console.error('Error fetching bundle:', error);
    res.status(500).json({ error: 'Failed to fetch bundle' });
  }
});

export default router;
