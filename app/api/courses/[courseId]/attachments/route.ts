import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface ContextProps {
  params: {
    courseId: string;
  };
}

export async function POST(req: Request, { params }: ContextProps) {
  try {
    const { userId } = await auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop() || 'Attachment',
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[COURSE_ATTACHMENT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 