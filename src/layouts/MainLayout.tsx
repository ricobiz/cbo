
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse sidebar on mobile devices by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Overlay to close sidebar when clicked (mobile only) */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed && isMobile
            ? '-translate-x-full' 
            : isSidebarCollapsed && !isMobile
            ? 'translate-x-0 w-[80px]'
            : 'translate-x-0 w-[240px]'
        }`}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>
      
      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarCollapsed && isMobile
            ? 'ml-0'
            : isSidebarCollapsed && !isMobile
            ? 'ml-[80px]' 
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
