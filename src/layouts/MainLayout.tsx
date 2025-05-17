
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background grid-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
