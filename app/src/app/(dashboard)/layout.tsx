"use client";

import { HorizontalNav } from "./horizontal-nav";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/theme-context";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="bg-muted dark:bg-gray-950 min-h-screen flex flex-col">
          <HorizontalNav />
          <main className="flex-1 bg-white dark:bg-gray-900">
            {children}
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
