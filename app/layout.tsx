import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FinancialProvider } from "@/lib/context/financial-context";
import { Sidebar } from "@/components/ui/sidebar";
import { GlobalAddButton } from "@/components/ui/GlobalAddButton";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { GlobalCoachWidget } from "@/components/features/coach/GlobalCoachWidget";

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
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <FinancialProvider>
            <AlertProvider>
              <OnboardingGuard>
                <Sidebar />
                <main className="lg:pl-64 min-h-screen transition-all duration-200">
                  {children}
                </main>
                {/* Global Components */}
                <GlobalAddButton />
                <GlobalCoachWidget />
                <AddTransactionModal />
              </OnboardingGuard>
            </AlertProvider>
          </FinancialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



