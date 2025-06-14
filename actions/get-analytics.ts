import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};
  
  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const courses = await db.course.findMany({
      where: {
        userId: userId,
        isPublished: true
      },
      include: {
        chapters: {
          include: {
            userProgress: true,
          }
        },
        purchases: true,
      }
    });

    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId,
          isPublished: true
        }
      },
      include: {
        course: true,
      }
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    // Calculate course completion rates and progress
    const courseProgress = courses.map(course => {
      const totalChapters = course.chapters.length;
      const totalStudents = course.purchases.length;
      
      const studentProgress = course.purchases.map(purchase => {
        const completedChapters = course.chapters.reduce((acc, chapter) => {
          const progress = chapter.userProgress.find(p => p.userId === purchase.userId);
          return acc + (progress?.isCompleted ? 1 : 0);
        }, 0);
        return (completedChapters / totalChapters) * 100;
      });

      const completedStudents = studentProgress.filter(progress => progress === 100).length;
      const notStartedStudents = studentProgress.filter(progress => progress === 0).length;      
      const inProgressStudents = studentProgress.filter(progress => progress > 0 && progress < 100).length;
      const averageCompletionRate = studentProgress.reduce((acc, curr) => acc + curr, 0) / (totalStudents || 1);

      return {
        course: course.title,
        totalStudents,
        completed: completedStudents,
        inProgress: inProgressStudents,
        notStarted: notStartedStudents,
        completionRate: Math.round(averageCompletionRate),
        revenue: course.price! * totalStudents,
        enrollments: totalStudents,
      };
    });

    const topPerformingCourses = [...courseProgress]
      .sort((a, b) => (b.enrollments * b.completionRate) - (a.enrollments * a.completionRate))
      .slice(0, 4);

    const overallCompletionRate = courseProgress.reduce((acc, course) => acc + course.completionRate, 0) / (courseProgress.length || 1);

    return {
      data,
      totalRevenue,
      totalSales,
      courseProgress,
      topPerformingCourses,
      overallCompletionRate: Math.round(overallCompletionRate),
    }
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
      courseProgress: [],
      topPerformingCourses: [],
      overallCompletionRate: 0,
    }
  }
}