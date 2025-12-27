import { getDb } from '../server/db.ts';
import { courses } from '../drizzle/schema.ts';
import { eq, sql } from 'drizzle-orm';

async function cleanCourses() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  console.log('🧹 Starting course cleanup...\n');

  // Get all courses
  const allCourses = await db.select().from(courses);
  console.log(`Total courses: ${allCourses.length}`);

  // Find duplicates by title
  const titleMap = new Map();
  const duplicates = [];
  const coursesWithoutModules = [];

  allCourses.forEach(course => {
    if (!course.modules || (Array.isArray(course.modules) && course.modules.length === 0)) {
      coursesWithoutModules.push(course);
    }

    if (!titleMap.has(course.title)) {
      titleMap.set(course.title, []);
    }
    titleMap.get(course.title).push(course);
  });

  titleMap.forEach((courseList, title) => {
    if (courseList.length > 1) {
      duplicates.push({ title, count: courseList.length, courses: courseList });
    }
  });

  console.log(`\n📋 Courses without modules: ${coursesWithoutModules.length}`);
  coursesWithoutModules.forEach(c => {
    console.log(`  - ID ${c.id}: ${c.title}`);
  });

  console.log(`\n🔄 Duplicate courses found: ${duplicates.length}`);
  duplicates.forEach(dup => {
    console.log(`\n  "${dup.title}" (${dup.count} copies):`);
    dup.courses.forEach(c => {
      console.log(`    - ID ${c.id}: ${c.durationHours}h, ${c.level}, modules: ${c.modules?.length || 0}`);
    });
  });

  console.log('\n✅ Analysis complete!');
}

cleanCourses().catch(console.error);
