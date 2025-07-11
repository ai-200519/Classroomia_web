import { Banner } from '@/components/banner';
import { redirect } from 'next/navigation';
import React from 'react'
import { Preview } from '@/components/preview';
import { File } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import VideoPlayer from './_components/video-player';
import CourseProgressButton from './_components/course-progress-button';
import CourseEnrollButton from './_components/course-enroll-button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { getChapter } from '@/actions/get-chapter';

const ChapterIdPage = async ({ params }: { params: { courseId: string, chapterId: string } }) => {

  const { userId } = await auth();

  if (!userId) return redirect('/')

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapter({ userId, chapterId: params.chapterId, courseId: params.courseId })

  if (!chapter || !course) return redirect('/')

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted


  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label='Vous avez déjà terminé ce chapitre' />
      )}
      {isLocked && (
        <Banner variant="warning" label="L'achat de ce cours est nécessaire pour accéder à ce chapitre" />
      )}
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className='p-4'>
                {attachments.map((attachment) => (
                  <a href={attachment.url} key={attachment.id} target='_blank' className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline'>
                    <File />
                    <p className='line-clamp-1'>{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage