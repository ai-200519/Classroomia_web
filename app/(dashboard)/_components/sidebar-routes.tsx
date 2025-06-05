"use client";
import { BarChart3Icon, Compass, Layout, TvMinimalPlay, Users } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dasshboard",
        href: "/",
    },
    {
        icon: Compass,
        label: "Navigateur",
        href: "/search",
    },    
];

const teacherRoutes = [
    {
        icon: TvMinimalPlay,
        label: "Cours",
        href: "/teacher/courses",
    },
    {
        icon: BarChart3Icon,
        label: "Analytics",
        href: "/teacher/analytics",
    }, 
    {
        icon: Users,
        label: "Mes élèves",
        href: "/teacher/students",
    },       
];  

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes:guestRoutes;
    return (
        <div className="flex flex-col w-full space-y-1 p-2"> 
            {routes.map((route) => (
                <SidebarItem
                    key = {route.href}
                    icon= {route.icon}
                    label= {route.label}
                    href= {route.href}
                />
                
            ))}
        </div>
    )
}