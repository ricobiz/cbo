
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarStore } from "@/store/SidebarStore";

const MainLayout = () => {
  const isMobile = useIsMobile();
  const { isOpen, open, close, toggle } = useSidebarStore();
  
  // Auto-collapse sidebar on mobile devices by default
  useEffect(() => {
    if (isMobile) {
      close();
    } else {
      open();
    }
  }, [isMobile, open, close]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Overlay to close sidebar when clicked (mobile only) */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => close()}
          aria-label="Close sidebar"
        />
      )}
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isMobile ? 'ml-0' : isOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
