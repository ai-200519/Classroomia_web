import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className='flex h-full w-full flex-col overflow-y-auto border-r bg-white shadow-sm'>
      <div className="flex justify-center p-2">
        <Logo />
      </div>
      <div className="flex flex-col w-full px-4">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;