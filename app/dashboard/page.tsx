"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/dashboard/Sidebar";
import Header from "../../components/dashboard/Header";
import MealSection from "../../components/dashboard/MealSection";
import NutritionPanel from "../../components/dashboard/NutritionPanel";
import OnboardingModal from "./OnboardingModal";
import EmptyState from "../../components/dashboard/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
    const [hasUserData, setHasUserData] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const storedUser = localStorage.getItem("user");
        const authStatus = localStorage.getItem("isLoggedIn");
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        const mealPlan = localStorage.getItem("mealPlan");

        if (storedUser && authStatus === "true") {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
                setHasUserData(mealPlan === "true");
                setIsNewUser(!hasSeenOnboarding);
                setShowWelcome(true);
                
                // Auto hide welcome message
                const timer = setTimeout(() => {
                    setShowWelcome(false);
                }, 3000);
                
                setLoading(false);
                return () => clearTimeout(timer);
            } catch (e) {
                console.error("Dashboard auth parse error", e);
                setIsLoggedIn(false);
                setLoading(false);
            }
        } else {
            setIsLoggedIn(false);
            setLoading(false);
        }
    }, []);

    const handleCreatePlan = () => {
        setLoading(true);
        // Mock API call delay
        setTimeout(() => {
            localStorage.setItem("mealPlan", "true");
            setHasUserData(true);
            setLoading(false);
        }, 1500);
    };

    // Debug logging
    useEffect(() => {
        if (mounted) {
            console.log("Dashboard State:", { mounted, isLoggedIn, loading, hasUserData });
        }
    }, [mounted, isLoggedIn, loading, hasUserData]);

    // 3. Redirect logic (strictly after loading)
    useEffect(() => {
        if (mounted && !loading && !isLoggedIn) {
            const timer = setTimeout(() => {
                router.push("/auth/login");
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [mounted, loading, isLoggedIn, router]);

    // 4. Initial server-side / hydration safety
    if (!mounted) return null;

    // 5. Loading State handling
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                <span className="sr-only">Loading Dashboard...</span>
            </div>
        );
    }

    // 6. Final safety check (ensure we have a user before rendering the main dashboard)
    if (!isLoggedIn || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <p className="text-slate-500">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
            />

            {/* Mobile Menu Overlay */}
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

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"}`}>
                <Header toggleMobileMenu={() => setMobileMenuOpen(true)} />

                <div className="flex-1 p-4 lg:p-8 overflow-y-auto relative">
                    {/* Welcome Toast */}
                    <AnimatePresence>
                        {showWelcome && hasUserData && (
                            <motion.div 
                                initial={{ opacity: 0, y: -20, x: "-50%" }}
                                animate={{ opacity: 1, y: 10, x: "-50%" }}
                                exit={{ opacity: 0, y: -20, x: "-50%" }}
                                className="fixed top-20 left-1/2 z-[100] px-6 py-3 bg-white rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-3 pointer-events-none"
                            >
                                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                    <span className="text-sm">👋</span>
                                </div>
                                <span className="font-bold text-slate-800">
                                    {isNewUser 
                                        ? "Welcome to CustomDailyDiet 🎉" 
                                        : `Welcome back, ${user.fullName}`}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            {!hasUserData ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <EmptyState onCreatePlan={handleCreatePlan} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col lg:flex-row gap-8"
                                >
                                    {/* Left Column: Meals */}
                                    <div className="flex-[2] space-y-8">
                                        <section>
                                            <MealSection />
                                        </section>
                                    </div>

                                    {/* Right Column: Nutrition */}
                                    <div className="flex-1">
                                        <NutritionPanel />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Modals & Overlays */}
            <OnboardingModal />
        </div>
    );
}
