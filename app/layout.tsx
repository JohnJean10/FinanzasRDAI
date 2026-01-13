import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FinancialProvider } from "@/lib/context/financial-context";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";
import { AlertProvider } from "@/components/features/planning/AlertSystem";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinanzasRD AI - Tu Asistente Financiero",
  description: "Gestión inteligente de tus finanzas personales",
};

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
                <AppShell>
                  {children}
                </AppShell>
                <AddTransactionModal />
              </OnboardingGuard>
            </AlertProvider>
          </FinancialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
