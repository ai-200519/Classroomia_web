import Mux from "@mux/mux-node"; 
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(req: Request, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = await auth()

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 })

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })

        if (!chapter) return new NextResponse("Not Found", { status: 404 })

        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (existingMuxData) {
                try {
                    await muxClient.video.assets.delete(existingMuxData.assetId);
                } catch (error) {
                    console.error('[MUX_DELETE_ERROR]', error);
                    // Continue with deletion even if Mux deletion fails
                }
                
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                });
            }
        }

        // Delete the chapter
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        // Check if there are any published chapters left
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            });
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.error('[COURSES_CHAPTER_DELETE]', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
 

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("unauthorized", { status: 401 });
        }

        const { isPublished, ...values } = await req.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return new NextResponse("unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            },
        });

        if (values.videoUrl) {
            const existingVideo = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });
            if (existingVideo) {
                await muxClient.video.assets.update(existingVideo.assetId, {});
                await db.muxData.delete({
                    where: {
                        id: existingVideo.id,
                    },
                });
            }

            const asset = await muxClient.video.assets.create({
                inputs: [{ url: values.videoUrl }],
                playback_policy: ["public"],
                test: false,
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,           
                }
            })
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[COURSES_CHAPTER_ID]", error);
        // Return more detailed error information
        return new NextResponse(
            JSON.stringify({ 
                error: "Internal Server Error", 
                details: error instanceof Error ? error.message : "Unknown error",
                stack: error instanceof Error ? error.stack : undefined
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
