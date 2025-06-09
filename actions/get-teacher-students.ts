import { PrismaClient } from "@/app/generated/prisma"

const prisma = new PrismaClient()

export const getTeacherStudents = async (teacherId: string) => {
    try {
        // Get all courses by this teacher
        const courses = await prisma.course.findMany({
            where: {
                userId: teacherId
            },
            include: {
                purchases: {
                    include: {
                        course: true
                    }
                },
                chapters: {
                    include: {
                        userProgress: true
                    }
                }
            }
        })
        const students = new Map()

        for (const course of courses) {
            for (const purchase of course.purchases) {
                if (!students.has(purchase.userId)) {

                    const courseChapters = course.chapters
                    const totalChapters = courseChapters.length
                    const completedChapters = courseChapters.reduce((acc: number, chapter) => {
                        const progress = chapter.userProgress.find((p: { userId: string }) => p.userId === purchase.userId)
                        return acc + (progress?.isCompleted ? 1 : 0)
                    }, 0)

                    const progress = totalChapters > 0 
                        ? Math.round((completedChapters / totalChapters) * 100)
                        : 0

                    students.set(purchase.userId, {
                        userId: purchase.userId,
                        coursesEnrolled: 1,
                        totalProgress: progress,
                        lastActive: purchase.createdAt,
                        courses: [{
                            courseId: course.id,
                            title: course.title,
                            progress: progress
                        }]
                    })
                } else {
                    const student = students.get(purchase.userId)
                    student.coursesEnrolled++
                    
                    const courseChapters = course.chapters
                    const totalChapters = courseChapters.length
                    const completedChapters = courseChapters.reduce((acc: number, chapter) => {
                        const progress = chapter.userProgress.find((p: { userId: string }) => p.userId === purchase.userId)
                        return acc + (progress?.isCompleted ? 1 : 0)
                    }, 0)

                    const progress = totalChapters > 0 
                        ? Math.round((completedChapters / totalChapters) * 100)
                        : 0

                    student.totalProgress = Math.round((student.totalProgress + progress) / student.coursesEnrolled)
                    student.courses.push({
                        courseId: course.id,
                        title: course.title,
                        progress: progress
                    })
                }
            }
        }

        return Array.from(students.values())
    } catch (error) {
        console.error("[GET_TEACHER_STUDENTS]", error)
        return []
    }
} 