import { CourseProgress } from '@/components/course-progress';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation';
import React from 'react'
import CourseSidebarItem from './course-sidebar-item';

interface CourseSidebarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[];
        })[]
    }
    progressCount: number
}

const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
    const { userId } = await auth();

    if (!userId) return redirect('/')

    const purchase = await db.purchase.findFirst({
        where: {
                userId,
                courseId: course.id
            }
    })
    return (
        <div className='h-full border-r flex flex-col overflow-y-auto shadow-sm'>
            <div className='p-[27.5px] flex flex-col border-b'>
                <h1 className='font-semibold'>{course.title}</h1>
                {purchase && (
                    <div className='mt-10'>
                        <CourseProgress variant="success" value={progressCount} />
                    </div>
                )}
            </div>
            <div className='flex flex-col w-full'>
                {course.chapters.map((chapter) => (
                    <CourseSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    )
}

export default CourseSidebar