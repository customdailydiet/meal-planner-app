"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import MealSection from "../../components/dashboard/MealSection";
import NutritionPanel from "../../components/dashboard/NutritionPanel";
import OnboardingModal from "./OnboardingModal";
import { motion, AnimatePresence } from "framer-motion";
import { GeneratedMeal } from "../../lib/meal-planner";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    
    // --- Dashboard State ---
    const [viewMode, setViewMode] = useState<"day" | "week">("day");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date | null }>({ start: new Date(), end: null });
    const [isProcessing, setIsProcessing] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

    const router = useRouter();

    const applyTheme = useCallback((t: "light" | "dark" | "system") => {
        const root = window.document.documentElement;
        if (t === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.remove("light", "dark");
            root.classList.add(systemTheme);
        } else {
            root.classList.remove("light", "dark");
            root.classList.add(t);
        }
    }, []);

    // Effect to handle system preference changes in "system" mode
    useEffect(() => {
        if (theme !== "system") return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => applyTheme("system");
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme, applyTheme]);

    useEffect(() => {
        setMounted(true);

        const storedUser = localStorage.getItem("user");
        const authStatus = localStorage.getItem("isLoggedIn");
        const onboardingComplete = localStorage.getItem("onboardingComplete");
        
        // Restore Dashboard State
        const savedView = localStorage.getItem("dashboard_viewMode") as "day" | "week";
        if (savedView) setViewMode(savedView);

        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system";
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme("system");
        }

        const savedDate = localStorage.getItem("dashboard_selectedDate");
        if (savedDate) {
            try {
                const parsed = JSON.parse(savedDate);
                if (parsed.start) {
                    setDateRange({ start: new Date(parsed.start), end: parsed.end ? new Date(parsed.end) : null });
                    setSelectedDate(new Date(parsed.start));
                } else {
                    setSelectedDate(new Date(parsed));
                }
            } catch (e) {
                console.error("Failed to restore date", e);
            }
        }

        if (storedUser && authStatus === "true") {
            if (!onboardingComplete) {
                router.push("/onboarding/start");
                return;
            }
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
            setShowWelcome(true);
            setTimeout(() => setShowWelcome(false), 3000);
            setLoading(false);
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, [router, applyTheme]);

    const handleViewModeChange = (mode: "day" | "week") => {
        setViewMode(mode);
        localStorage.setItem("dashboard_viewMode", mode);
    };

    const handleDateChange = (date: Date | { start: Date; end: Date }) => {
        if (date instanceof Date) {
            setSelectedDate(date);
            setDateRange({ start: date, end: null });
            localStorage.setItem("dashboard_selectedDate", JSON.stringify(date));
        } else {
            setSelectedDate(date.start);
            setDateRange(date);
            localStorage.setItem("dashboard_selectedDate", JSON.stringify(date));
        }
    };

    const handleThemeChange = (t: "light" | "dark" | "system") => {
        setTheme(t);
        localStorage.setItem("theme", t);
        applyTheme(t);
    };

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!isLoggedIn || !user) {
        router.push("/auth/login");
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors overflow-hidden">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 h-screen ${collapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"}`}>
                <Header 
                    toggleMobileMenu={() => setMobileMenuOpen(true)}
                    viewMode={viewMode}
                    setViewMode={handleViewModeChange}
                    selectedDate={viewMode === "day" ? selectedDate : dateRange}
                    onDateChange={handleDateChange}
                    theme={theme}
                    onThemeChange={handleThemeChange}
                    isProcessing={isProcessing}
                />

                <div className="flex-1 p-4 lg:p-8 overflow-y-auto relative scrollbar-hide">
                    <AnimatePresence>
                        {showWelcome && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20, x: "-50%" }}
                                animate={{ opacity: 1, y: 10, x: "-50%" }}
                                exit={{ opacity: 0, y: -20, x: "-50%" }}
                                className="fixed top-20 left-1/2 z-[100] px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900 flex items-center space-x-3 pointer-events-none"
                            >
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"><span>👋</span></div>
                                <span className="font-bold text-slate-800 dark:text-slate-100">Welcome back, {user.fullName}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="max-w-7xl mx-auto pb-20">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-[2] space-y-8 min-w-0">
                                <MealSection 
                                    viewMode={viewMode}
                                    selectedDate={selectedDate}
                                    dateRange={dateRange}
                                    setIsProcessing={setIsProcessing}
                                    isProcessing={isProcessing}
                                />
                            </div>

                            <div className="flex-1 lg:max-w-md">
                                <NutritionPanel 
                                    isProcessing={isProcessing} 
                                    selectedDate={selectedDate}
                                    viewMode={viewMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <OnboardingModal />
        </div>
    );
}
