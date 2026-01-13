"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { es, Translations } from "./es";
import { en } from "./en";

type Language = "es" | "en";

interface I18nContextType {
    t: Translations;
    language: Language;
    setLanguage: (lang: Language) => void;
    languages: { code: Language; name: string }[];
}

const translations: Record<Language, Translations> = { es, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("es");

    useEffect(() => {
        const stored = localStorage.getItem("finanzasrd_language");
        if (stored === "es" || stored === "en") {
            setLanguage(stored);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("finanzasrd_language", language);
    }, [language]);

    const languages = [
        { code: "es" as Language, name: "Español" },
        { code: "en" as Language, name: "English" },
    ];

    const contextValue: I18nContextType = {
        t: translations[language],
        language,
        setLanguage,
        languages,
    };

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}

export function interpolate(str: string, params: Record<string, string>): string {
    return str.replace(/\{(\w+)\}/g, (_, key) => params[key] || `{${key}}`);
}
