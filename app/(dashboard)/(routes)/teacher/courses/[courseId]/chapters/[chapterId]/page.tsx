import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { ArrowLeft, Video, FileText, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import ChapterTitleForm from "./_components/chapter-title-form"

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const { userId } = await auth()
  const { courseId, chapterId } = await params

  if (!userId) {
    redirect("/sign-up")
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
    redirect("/sign-up")
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length
  const completionText = `${completedFields}/${totalFields}`
  const progress = (completedFields / totalFields) * 100
  const isComplete = completedFields === totalFields

  return (
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
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                )}
                <span className="text-sm font-medium text-slate-700">Champs complétés {completionText}</span>
              </div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
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
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
                  <div className="flex items-start gap-2">
                    <p className="text-slate-600 text-sm flex-1">
                      {chapter.description || "Aucune description fournie"}
                    </p>
                    {chapter.description ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    Modifier les détails
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statut de publication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{chapter.isPublished ? "Publié" : "Brouillon"}</p>
                    <p className="text-sm text-slate-600">
                      {chapter.isPublished
                        ? "Ce chapitre est visible par les étudiants"
                        : "Ce chapitre n'est pas encore visible"}
                    </p>
                  </div>
                  <Badge variant={chapter.isPublished ? "default" : "secondary"}>
                    {chapter.isPublished ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <Button
                    variant={chapter.isPublished ? "destructive" : "default"}
                    className="w-full"
                    disabled={!isComplete}
                  >
                    {chapter.isPublished ? "Dépublier" : "Publier"}
                  </Button>
                  {!isComplete && (
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      Complétez tous les champs requis pour publier
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Vidéo du chapitre
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chapter.videoUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Vidéo téléchargée</p>
                        <p className="text-xs text-slate-500">
                          {chapter.muxData ? "Traitement terminé" : "En cours de traitement..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Vidéo configurée</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Remplacer la vidéo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                      <div className="text-center">
                        <Video className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 mb-1">Aucune vidéo téléchargée</p>
                        <p className="text-xs text-slate-500">Ajoutez une vidéo pour ce chapitre</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span className="text-sm text-amber-700">Vidéo requise</span>
                    </div>
                    <Button className="w-full">Télécharger une vidéo</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Prévisualiser le chapitre
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Paramètres d&apos;accès
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Supprimer le chapitre
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage
