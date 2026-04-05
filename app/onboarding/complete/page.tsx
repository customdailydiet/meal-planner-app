"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, PartyPopper, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function CompletePage() {
    const [generating, setGenerating] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleDashboard = () => {
        setGenerating(true);
        // Simulate "AI Generation" processing delay
        setTimeout(() => {
            router.push("/dashboard");
        }, 2500);
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-col items-center text-center space-y-12 py-10">
            {!generating ? (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="relative"
                >
                    <div className="w-40 h-40 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-7xl shadow-2xl shadow-emerald-200 dark:shadow-none">
                        🎉
                    </div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center text-emerald-500"
                    >
                        <CheckCircle2 size={24} strokeWidth={3} />
                    </motion.div>
                </motion.div>
            ) : (
                <div className="w-40 h-40 flex items-center justify-center relative">
                    < Loader2 className="w-24 h-24 text-emerald-500 animate-spin" strokeWidth={3} />
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Sparkles className="text-emerald-300 dark:text-emerald-700 w-32 h-32" />
                    </motion.div>
                </div>
            )}

            <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                    {generating ? "Crafting Your Blueprint..." : "You're All Set!"}
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                    {generating 
                        ? "Our intelligence engine is analyzing your metrics to generate the perfect meal plan." 
                        : "Your personalized nutrition profile has been established. Ready to see your custom meal plan?"}
                </p>
            </div>

            {!generating && (
                <button 
                    onClick={handleDashboard}
                    className="w-full max-w-sm h-20 bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white rounded-[32px] font-black text-xl transition-all shadow-2xl shadow-emerald-200 dark:shadow-none flex items-center justify-center group"
                >
                    Go to Dashboard
                    <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                </button>
            )}

            {!generating && (
                <div className="flex items-center space-x-2 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <PartyPopper size={14} />
                    <span>Onboarding Successfully Completed</span>
                </div>
            )}
        </div>
    );
}
