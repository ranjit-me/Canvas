"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-muted dark:bg-gray-950 min-h-screen">
          <Sidebar />
          <div className="lg:pl-20 h-full flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 bg-white dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
