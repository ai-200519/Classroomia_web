import React from 'react'
import { DataTable } from './_components/data-table'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { columns } from './_components/colomns'

const CoursesPage = async () => {
    const { userId } = await auth()

    if (!userId) return redirect('/')

    const courses = await db.course.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return (
        <div className='p-6 max-w-7xl mx-auto'>
            <DataTable columns={columns} data={courses} />
        </div>
    )
}

export default CoursesPage