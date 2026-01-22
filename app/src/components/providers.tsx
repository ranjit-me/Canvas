"use client";

import { QueryProvider } from "@/components/query-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface ProvidersProps {
  children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <LanguageProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </LanguageProvider>
  );
};
