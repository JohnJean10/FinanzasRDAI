import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FinancialProvider } from "@/lib/context/financial-context";
import { Sidebar } from "@/components/ui/sidebar";
import { GlobalAddButton } from "@/components/ui/GlobalAddButton";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";

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
      {/* Usamos bg-background y text-foreground que ahora son dinámicos */}
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FinancialProvider>
            <OnboardingGuard>
              <Sidebar />
              {/* Quitamos clases hardcodeadas del main también */}
              <main className="lg:pl-64 min-h-screen transition-all duration-200">
                {children}
              </main>
              {/* Global Components */}
              <GlobalAddButton />
              <AddTransactionModal />
            </OnboardingGuard>
          </FinancialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
