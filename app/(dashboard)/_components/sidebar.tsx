import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

const Sidebar = () => {
  return (
    <>
    <div className='flex h-full w-full flex-col overflow-y-auto border-r bg-white shadow-sm'>
      <div className="flex justify-center p-2">
        <Logo />
      </div>
      <div className="flex flex-col w-full px-4">
        <SidebarRoutes />
      </div>
    </div>
    <div className="p-4 border-t bg-white border-r shadow-sm">
      <div className="text-xs text-muted-foreground text-center">
        <p>© 2025 Classroomia</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
  </>    
  );
};

export default Sidebar;