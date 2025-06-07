import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

interface ContextProps {
  params: {
    courseId: string;
  };
}

export async function PUT(request: NextRequest, { params }: ContextProps) {
  try {
    const { userId } = await auth();
    const { list } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // eslint-disable-next-line prefer-const
    for ( let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }
    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}