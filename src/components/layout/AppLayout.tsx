import React, { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useSidebar } from "../../contexts/SidebarContext";
import { ClientModalProvider } from "../../contexts/ClientModalContext";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isExpanded } = useSidebar();

  return (
    <ClientModalProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div
          className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${
            isExpanded ? "ml-64" : "ml-20"
          }`}
        >
          <TopBar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </ClientModalProvider>
  );
};
