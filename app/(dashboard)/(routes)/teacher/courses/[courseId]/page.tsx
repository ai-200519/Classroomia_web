import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import  IconBadge  from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";


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
    });

    if (!course) {
        return redirect("/sign-up");
    }    

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length; 

    const completionFields = `(${completedFields}/${totalFields})`;
    const progress = (completedFields / totalFields) * 100;

    return ( 
        <div className="p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">
                        Mise en place de cursus :  <b>&quot;{course.title}&quot;</b>
                    </h1>
                    <span className="flex flex-col items-start gap-y-2">
                        <span className="text-sm text-slate-700">
                            remplissez tous les champs nécessaires {completionFields}
                        </span>
                        <Progress value={progress} className="h-2 bg-slate-200" />
                    </span>
                    
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
                    <DescriptionForm 
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm
                        initialData={course}
                        courseId={course.id}    
                    />                    
                </div>
            </div>

        </div>
     );
}
 
export default CourseIdPage;