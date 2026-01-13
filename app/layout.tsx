import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FinancialProvider } from "@/lib/context/financial-context";
import { FynixSidebar } from "@/components/features/dashboard/FynixSidebar";
import { AIAssistantPanel } from "@/components/features/dashboard/AIAssistantPanel";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanzasRD AI - Tu Asistente Financiero",
  description: "Gestión inteligente de tus finanzas personales",
};

import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { AlertProvider } from "@/components/features/planning/AlertSystem";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f8faf9] dark:bg-[#0f172a] transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <FinancialProvider>
            <AlertProvider>
              <OnboardingGuard>
                {/* Fynix Layout: Sidebar (64px) + Content + AI Panel (340px) */}
                <div className="min-h-screen flex">
                  {/* Fixed Left Sidebar */}
                  <FynixSidebar />

                  {/* Main Content */}
                  <main className="flex-1 ml-16 mr-[340px] min-h-screen overflow-auto">
                    {children}
                  </main>

                  {/* Fixed Right AI Panel */}
                  <AIAssistantPanel />
                </div>

                {/* Global Modal */}
                <AddTransactionModal />
              </OnboardingGuard>
            </AlertProvider>
          </FinancialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
