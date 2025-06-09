import CoursesList from '@/components/courses-list'
import { auth } from '@clerk/nextjs/server'
import { CheckCircle, Clock, BookOpen } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import InfoCard from './_components/info-card'
import { getDashboardCourses } from '@/actions/get-dashboard-courses'

const Dashboard = async () => {
    const { userId } = await auth()

    if (!userId) return redirect('/')

    const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)
    const totalCourses = completedCourses.length + coursesInProgress.length

    return (
        <div className='p-6 space-y-4'>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoCard 
                    icon={BookOpen} 
                    label={'Total des Cours'} 
                    numberOfItems={totalCourses} 
                    variant='default'
                />
                <InfoCard 
                    icon={Clock} 
                    label={'En Progress'} 
                    numberOfItems={coursesInProgress.length} 
                />
                <InfoCard 
                    icon={CheckCircle} 
                    label={'Terminé'} 
                    numberOfItems={completedCourses.length} 
                    variant='success'
                />
            </div>
            

            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    )
}

export default Dashboard