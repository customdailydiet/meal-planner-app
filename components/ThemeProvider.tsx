"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Utility to apply theme directly to the DOM <html> element
const applyTheme = (t: Theme) => {
    console.log(`[ThemeSystem] applyTheme executing for: ${t}`);
    const root = window.document.documentElement;
    let isDark = false;
    
    // Step 1: Detect final state
    if (t === "system") {
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
        isDark = t === "dark";
    }

    // Step 2: Remove existing class to reset
    root.classList.remove("dark");

    // Step 3: Add if dark
    if (isDark) {
        root.classList.add("dark");
        console.log("[ThemeSystem] Added 'dark' class to <html>");
    } else {
        console.log("[ThemeSystem] Removed 'dark' class from <html>");
    }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");

    // Initial load from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme) {
            console.log(`[ThemeSystem] Initial load theme from storage: ${savedTheme}`);
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme("system");
        }

        // Handle system preference changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const currentTheme = localStorage.getItem("theme") as Theme || "system";
            if (currentTheme === "system") {
                applyTheme("system");
            }
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Force re-run applyTheme on state changes
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = (t: Theme) => {
        console.log(`[ThemeSystem] setTheme hook called for: ${t}`);
        setThemeState(t);
        localStorage.setItem("theme", t);
        // Step 3: Button handler must call applyTheme
        applyTheme(t);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
