"use client";

import { useEffect, ReactNode } from "react";
import { useFinancial } from "@/lib/context/financial-context";
import { useRouter, usePathname } from "next/navigation";

export function OnboardingGuard({ children }: { children: ReactNode }) {
    const { user } = useFinancial();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If user hasn't completed onboarding and is not on the onboarding page
        if (!user.hasCompletedOnboarding && pathname !== "/onboarding") {
            router.push("/onboarding");
        }

        // If user HAS completed onboarding and tries to go back to onboarding, redirect to dashboard
        if (user.hasCompletedOnboarding && pathname === "/onboarding") {
            router.push("/dashboard");
        }
    }, [user.hasCompletedOnboarding, pathname, router]);

    // Optional: Show loading state or splash screen while checking
    // if (!user.hasCompletedOnboarding && pathname !== "/onboarding") return null;

    return <>{children}</>;
}
