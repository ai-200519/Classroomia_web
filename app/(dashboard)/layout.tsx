import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50 shadow-sm items-center justify-between px-4">
        <Navbar />
      </div>
      <div className="fixed z-50 hidden h-full w-56 md:flex flex-col inset-y-0">
        <Sidebar/>
      </div>
      <main className = "md:pl-56 pt-[80px] h-full bg-slate-50">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;