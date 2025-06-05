import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

const CoursesPage = () => {
    return (
        <div className="p-6 bg-slate-50">
            <Link href="/teacher/create" >
                <Button>
                    <BookOpenCheck className="h-4 w-4 mr-2" />
                    Nouveau Cursus
                </Button>
            </Link>            
        </div> 
    );    
   
}
 
export default CoursesPage;