import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar"; 

export const Navbar = () => {
    return (
        <div className="p-4 border-a h-full flex items-center overflow-y-auto justify-between bg-slate-50">
            <MobileSidebar />
            <NavbarRoutes />
        </div>

    )

}
