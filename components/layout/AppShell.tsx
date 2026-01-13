"use client";

import { usePathname } from "next/navigation";
import { useFinancial } from "@/lib/context/financial-context";
import { FynixSidebar } from "@/components/features/dashboard/FynixSidebar";
import { AIAssistantPanel } from "@/components/features/dashboard/AIAssistantPanel";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useFinancial();

    // Hide sidebar/AI panel during onboarding or if user hasn't completed onboarding
    const isOnboarding = pathname === "/onboarding" || !user.hasCompletedOnboarding;

    // Full-screen layout for onboarding
    if (isOnboarding) {
        return (
            <main className="min-h-screen">
                {children}
            </main>
        );
    }

    // Fynix Layout: Sidebar (64px) + Content + AI Panel (340px)
    return (
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
    );
}
