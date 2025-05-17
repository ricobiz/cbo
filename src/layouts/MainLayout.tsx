
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useState } from "react";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed 
            ? '-translate-x-full md:translate-x-0 md:w-[80px]' 
            : 'translate-x-0 w-[240px]'
        }`}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed 
            ? 'ml-0 md:ml-[80px]' 
            : 'ml-0 md:ml-[240px]'
        }`}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
