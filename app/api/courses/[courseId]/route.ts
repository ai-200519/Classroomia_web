import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';

const muxClient = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete all Mux assets and data
    for (const chapter of course.chapters) {
      if (chapter.muxData) {
        try {
          await muxClient.video.assets.delete(chapter.muxData.assetId);
        } catch (error) {
          console.error('[MUX_DELETE_ERROR]', error);
          // Continue with deletion even if Mux deletion fails
        }
      }
    }

    // Delete the course and all related data
    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId
      }
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error('[COURSE_DELETE]', error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

interface ContextProps {
  params: { courseId: string };
}

export async function PATCH(request: Request, { params }: ContextProps) {
  try {
    const { userId } = await auth();
    const values = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSE_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}