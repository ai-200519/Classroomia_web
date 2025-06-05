import { Menu } from "lucide-react";
import { Sheet, SheetTitle, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from "./sidebar";


export const MobileSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition-all">
                <Menu />        
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <SheetTitle className="flex items-center justify-between p-4 border-b">
                    <span className="text-lg font-semibold">Menu</span>
                </SheetTitle>    
                <Sidebar />
            </SheetContent>
        </Sheet>

    )

}