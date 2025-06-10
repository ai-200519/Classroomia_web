import React from 'react'
import { DataTable } from './_components/data-table'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { columns } from './_components/colomns'
import { Card } from '@/components/ui/card'
import { BookOpen, DollarSign } from 'lucide-react'

const CoursesPage = async () => {
    const { userId } = await auth()

    if (!userId) return redirect('/')

    const courses = await db.course.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            purchases: true
        }
    })

    const totalCourses = courses.length
    const publishedCourses = courses.filter(course => course.isPublished).length
    const totalPrice = courses
        .filter(course => course.isPublished)
        .reduce((acc, course) => acc + (course.price || 0), 0)
    return (
        <div className='p-6 max-w-7xl mx-auto space-y-6 bg-slate-50'>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-x-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="font-medium">Total des Cours</p>
                            <p className="text-2xl font-bold">{totalCourses}</p>
                            <p className="text-sm text-muted-foreground">{publishedCourses} publiés, {totalCourses - publishedCourses} brouillants</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-x-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="font-medium">Totale des prix (publiés) </p>
                            <p className="text-2xl font-bold">{new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD"
                            }).format(totalPrice)}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <DataTable columns={columns} data={courses} />
        </div>
    )
}

export default CoursesPage