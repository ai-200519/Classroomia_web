import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { ArrowLeft, Video, FileText, CheckCircle, AlertCircle, Eye } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ChapterTitleForm from "./_components/chapter-title-form"
import ChapterDescriptionForm from "./_components/chapter-description-form"
import ChapterAccessForm from "./_components/chapter-access-form"
import ChapterVideoForm from "./_components/chapter-video-form"
import IconBadge from "@/components/icon-badge"
import { Banner } from "@/components/banner"
import ChaptersActions from "./_components/chapter-actions"

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const { userId } = await auth()
  const { courseId, chapterId } = await params

  if (!userId) {
    redirect("/")
  }

  const chapter = await db.chapter.findFirst({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  })

  if (!chapter) {
    redirect("/")
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`
  const progress = (completedFields / totalFields) * 100
  const isCompleted = completedFields === totalFields
  const isComplete = requiredFields.every(Boolean);

  return (
    <> 
      {!chapter.isPublished && (<Banner variant='warning' label='Ce chapitre n’est pas encore publié. Il ne sera pas visible par les apprenants dans le cours' />)}
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <Link
              href={`/teacher/courses/${(await params).courseId}`}
              className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 transition-colors mb-6 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour à mise en place de cursus
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Configuration du chapitre</h1>
                <p className="text-slate-600">Complétez tous les champs requis pour publier ce chapitre</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  )}
                  <span className="text-sm font-medium text-slate-700">Champs complétés {completionText}</span>
                </div>
                <Progress value={progress} className="w-32" />
                <div className="h-3" />
                <ChaptersActions 
                  disabled={!isComplete}
                  courseId={(await params).courseId}
                  chapterId={(await params).chapterId}
                  isPublished={chapter.isPublished}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    < IconBadge icon={FileText} />
                    Détails du chapitre
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <ChapterTitleForm 
                      initialData= {chapter}
                      courseId={(await params).courseId} 
                      chapterId={(await params).chapterId}  
                    />
                    {chapter.title ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    )}
                  <div className="mt-8 pt-1 border-t"/>
                    <ChapterDescriptionForm
                      initialData={chapter}
                      courseId={(await params).courseId}
                      chapterId={(await params).chapterId}
                    />
                    {chapter.description ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    )}
                  </div>

                  <div className="pt-4 border-t">
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <IconBadge icon={Eye} />
                    Paramètres d&apos;accès
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <ChapterAccessForm
                        initialData={chapter}
                        courseId={(await params).courseId}
                        chapterId={(await params).chapterId}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconBadge icon={Video} />
                    Vidéo du chapitre
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      <ChapterVideoForm
                        initialData={chapter}
                        courseId={(await params).courseId}
                        chapterId={(await params).chapterId}
                      />
                    <div className="flex items-center gap-2">
                      {chapter.videoUrl ? (
                      <CheckCircle className="h-7 w-7 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-7 w-7 text-amber-600 mt-0.5" />
                    )}
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChapterIdPage
