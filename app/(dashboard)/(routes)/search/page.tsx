import { db } from '@/lib/db'
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Categories from './_components/categories'
import SearchInput from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import CoursesList from '@/components/courses-list'

interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string
    }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { userId } = await auth()

    if (!userId) return redirect('/')

    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })
    
    const courses = await getCourses({ userId, ...searchParams})


    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className='px-6 pt-6 md:hidden md:mb-0 block'>
            </div>
            <div className='p-6 space-y-4 bg-slate-50'>
                <Categories items={categories} />
                <CoursesList items={courses}/>
            </div>
        </>
    )
}

export default SearchPage