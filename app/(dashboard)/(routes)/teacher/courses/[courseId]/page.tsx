import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { AlertCircle, CheckCircle, CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import  IconBadge  from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChaptersForm from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import Actions from "./_components/actions";


const CourseIdPage = async ({params}:{
    params: { courseId: string }
}) => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/sign-up");
    }
    const { courseId } = await params;
    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                orderBy: { position: 'asc' },
            },
            attachments: {
                orderBy: { createdAt: 'desc' },
            }
        }    
    });

    if (!course) {
        return redirect("/sign-up");
    }    
    
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' },
    });
    
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length; 

    const completionFields = `(${completedFields}/${totalFields})`;
    const progress = (completedFields / totalFields) * 100;
    const isCompletion = completedFields === totalFields;
    const isComplete = requiredFields.every(Boolean);
    return ( 
        <>
            {!course.isPublished && (
                <Banner 
                    label="Ce cursus n’est pas encore publié. Il ne sera pas visible par les élèves dans la page principale"
                />
            )}
            <div className="p-6 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Mise en place de cursus :  <b>&quot;{course.title}&quot;</b>
                        </h1>
                        <span className="flex flex-col items-start gap-y-2">
                            <span className="text-sm text-slate-700">
                                remplissez tous les champs nécessaires pour publier ce cursus
                            </span>
                        </span>    
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                            {isCompletion ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            )}
                            <span className="text-sm font-medium text-slate-700">Champs complétés {completionFields}</span>
                        </div>
                        <Progress value={progress} className="w-32" />
                        <div className="h-3" />
                        <Actions 
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                        />
                    </div>                
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Personnalisez votre cursus
                            </h2>
                        </div>
                        <TitleForm 
                            initialData={course}
                            courseId={course.id}
                        />
                        {course.title ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}
                        <DescriptionForm 
                            initialData={course}
                            courseId={course.id}
                        />
                        {course.description ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}
                        <ImageForm
                            initialData={course}
                            courseId={course.id}    
                        />
                        {course.imageUrl ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}   
                            options={categories.map((category) => ({
                                name: category.name,
                                id: category.id,
                            }))} 
                        />
                        {course.categoryId ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}                                         
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">
                                    Chapitres et sections
                                </h2> 
                            </div>
                            <div>
                            <ChaptersForm 
                            initialData={course}
                            courseId={course.id}
                            />
                            {course.chapters.some(chapter => chapter.isPublished) ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                            )}
                            </div>
                        </div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">
                                Offrez votre cours
                            </h2>
                        </div>
                        <PriceForm 
                            initialData={course}
                            courseId={course.id}
                        />
                        {course.price ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2 mb-4">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">
                                Ressources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}    
                        />
                        {course.attachments.length ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        )}         

                    </div>
                </div>

            </div>
        </>    
     );
}
 
export default CourseIdPage;