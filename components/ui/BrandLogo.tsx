"use client";

import { useState, useMemo } from "react";

interface BrandLogoProps {
    description: string;
    category?: string;
    categoryIcon?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
}

// Dominican local business domain exceptions
const DOMAIN_EXCEPTIONS: Record<string, string> = {
    pedidosya: "pedidosya.com.do",
    sirena: "sirena.do",
    jumbo: "jumbo.com.do",
    nacional: "supermercadosnacional.com",
    bravo: "supermercadosbravo.com.do",
    banreservas: "banreservas.com",
    popular: "popularenlinea.com",
    bhd: "bhdleon.com.do",
    scotiabank: "scotiabank.com",
    apap: "apap.com.do",
    netflix: "netflix.com",
    spotify: "spotify.com",
    amazon: "amazon.com",
    uber: "uber.com",
    shell: "shell.com",
    texaco: "texaco.com",
    claro: "claro.com.do",
    altice: "altice.com.do",
    edenorte: "edenorte.com.do",
    edesur: "edesur.com.do",
    edeeste: "edeeste.com.do",
    aaavs: "aaavs.gob.do",
    dgii: "dgii.gov.do",
    adobe: "adobe.com",
    apple: "apple.com",
    google: "google.com",
    microsoft: "microsoft.com",
    paypal: "paypal.com",
    walmart: "walmart.com",
    costco: "costco.com",
    mcdonalds: "mcdonalds.com",
    wendys: "wendys.com",
    burgerking: "burgerking.com",
    dominos: "dominos.com",
    pizzahut: "pizzahut.com",
    starbucks: "starbucks.com",
};

// Words to clean from descriptions
const CLEAN_WORDS = [
    "pago", "compra", "cargo", "transferencia", "deposito", "retiro",
    "debito", "credito", "tarjeta", "banco", "factura", "recibo",
    "combustible", "gasolina", "super", "supermercado", "tienda",
    "restaurante", "comida", "servicio", "pago de", "a", "en", "de", "la", "el"
];

// Category icons fallback
const CATEGORY_ICONS: Record<string, { icon: string; bgColor: string; textColor: string }> = {
    alimentacion: { icon: "🍔", bgColor: "bg-orange-50 dark:bg-orange-900/30", textColor: "text-orange-600 dark:text-orange-400" },
    transporte: { icon: "🚗", bgColor: "bg-blue-50 dark:bg-blue-900/30", textColor: "text-blue-600 dark:text-blue-400" },
    combustible: { icon: "⛽", bgColor: "bg-amber-50 dark:bg-amber-900/30", textColor: "text-amber-600 dark:text-amber-400" },
    entretenimiento: { icon: "🎬", bgColor: "bg-purple-50 dark:bg-purple-900/30", textColor: "text-purple-600 dark:text-purple-400" },
    salud: { icon: "💊", bgColor: "bg-red-50 dark:bg-red-900/30", textColor: "text-red-600 dark:text-red-400" },
    educacion: { icon: "📚", bgColor: "bg-indigo-50 dark:bg-indigo-900/30", textColor: "text-indigo-600 dark:text-indigo-400" },
    servicios: { icon: "💡", bgColor: "bg-yellow-50 dark:bg-yellow-900/30", textColor: "text-yellow-600 dark:text-yellow-400" },
    compras: { icon: "🛒", bgColor: "bg-pink-50 dark:bg-pink-900/30", textColor: "text-pink-600 dark:text-pink-400" },
    hogar: { icon: "🏠", bgColor: "bg-teal-50 dark:bg-teal-900/30", textColor: "text-teal-600 dark:text-teal-400" },
    suscripciones: { icon: "📱", bgColor: "bg-violet-50 dark:bg-violet-900/30", textColor: "text-violet-600 dark:text-violet-400" },
    default: { icon: "💰", bgColor: "bg-slate-100 dark:bg-slate-800", textColor: "text-slate-600 dark:text-slate-400" },
};

function cleanDescription(description: string): string {
    // Remove numbers and convert to lowercase
    let cleaned = description.toLowerCase().replace(/[0-9]/g, "").trim();

    // Remove common words
    CLEAN_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        cleaned = cleaned.replace(regex, "");
    });

    // Clean up extra spaces and special characters
    cleaned = cleaned.replace(/[^a-záéíóúñ\s]/gi, "").trim();
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    // Get the first meaningful word (likely the brand name)
    const words = cleaned.split(" ").filter(w => w.length > 2);
    return words[0] || cleaned.split(" ")[0] || "";
}

function getDomain(brandName: string): string {
    const normalized = brandName.toLowerCase().replace(/\s+/g, "");

    // Check local exceptions first
    if (DOMAIN_EXCEPTIONS[normalized]) {
        return DOMAIN_EXCEPTIONS[normalized];
    }

    // Check partial matches
    for (const [key, domain] of Object.entries(DOMAIN_EXCEPTIONS)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return domain;
        }
    }

    // Fallback: assume .com domain
    return `${normalized}.com`;
}

const SIZE_CLASSES = {
    sm: "w-8 h-8 rounded-xl text-sm",
    md: "w-12 h-12 rounded-2xl text-lg",
    lg: "w-16 h-16 rounded-2xl text-2xl",
};

export function BrandLogo({
    description,
    category,
    categoryIcon,
    size = "md",
    className = "",
}: BrandLogoProps) {
    const [useFallback, setUseFallback] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { brandName, domain, fallbackStyle } = useMemo(() => {
        const name = cleanDescription(description);
        const dom = getDomain(name);
        const cat = category?.toLowerCase() || "default";
        const style = CATEGORY_ICONS[cat] || CATEGORY_ICONS.default;
        return { brandName: name, domain: dom, fallbackStyle: style };
    }, [description, category]);

    const sizeClass = SIZE_CLASSES[size];
    const displayIcon = categoryIcon || fallbackStyle.icon;

    if (useFallback || !brandName) {
        return (
            <div
                className={`${sizeClass} ${fallbackStyle.bgColor} ${fallbackStyle.textColor} flex items-center justify-center font-semibold ${className}`}
            >
                {displayIcon}
            </div>
        );
    }

    return (
        <div className={`${sizeClass} relative overflow-hidden ${className}`}>
            {!imageLoaded && (
                <div
                    className={`absolute inset-0 ${fallbackStyle.bgColor} ${fallbackStyle.textColor} flex items-center justify-center font-semibold animate-pulse`}
                >
                    {displayIcon}
                </div>
            )}
            <img
                src={`https://logo.clearbit.com/${domain}`}
                alt={brandName}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setUseFallback(true)}
            />
        </div>
    );
}
