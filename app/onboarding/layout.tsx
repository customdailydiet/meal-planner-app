"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const STEPS = [
    { name: "Start", path: "/onboarding/start" },
    { name: "Meals", path: "/onboarding/meals" },
    { name: "Preferences", path: "/onboarding/preferences" },
    { name: "About", path: "/onboarding/about" },
    { name: "Goals", path: "/onboarding/goals" },
    { name: "Summary", path: "/onboarding/summary" },
    { name: "Complete", path: "/onboarding/complete" }
];

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentStepIndex = STEPS.findIndex(step => pathname.includes(step.path));
    const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans transition-colors">
            {/* Header / Progress Bar */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">C</div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 hidden sm:block">CustomDailyDiet Onboarding</span>
                    </div>
                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Step {currentStepIndex + 1} of {STEPS.length}
                    </div>
                </div>
                {/* Progress Indicator */}
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-[120px] pointer-events-none" />

                <motion.div 
                    key={pathname}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 lg:p-12 z-10"
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-slate-400 dark:text-slate-600 text-xs font-medium">
                © 2026 CustomDailyDiet • Your Health, Personalized
            </footer>
        </div>
    );
}
