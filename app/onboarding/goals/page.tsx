"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    Target, 
    TrendingDown, 
    Activity, 
    TrendingUp, 
    ArrowRight, 
    ArrowLeft 
} from "lucide-react";
import { motion } from "framer-motion";

const GOALS = [
    { 
        id: "lose", 
        name: "Lose Weight", 
        desc: "Burn fat and get leaner", 
        icon: <TrendingDown size={32} />, 
        color: "rose",
        emoji: "🔥"
    },
    { 
        id: "maintain", 
        name: "Maintain", 
        desc: "Stay consistent and healthy", 
        icon: <Activity size={32} />, 
        color: "emerald",
        emoji: "⚖️"
    },
    { 
        id: "gain", 
        name: "Gain Muscle", 
        desc: "Build strength and size", 
        icon: <TrendingUp size={32} />, 
        color: "blue",
        emoji: "💪"
    }
];

export default function GoalsPage() {
    const [goal, setGoal] = useState("maintain");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("onboarding_goal");
        if (stored) setGoal(stored);
    }, []);

    const handleContinue = () => {
        localStorage.setItem("onboarding_goal", goal);
        router.push("/onboarding/summary");
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8 min-h-[500px] flex flex-col">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight italic uppercase tracking-widest">Select Your Target</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">What is your primary fitness goal?</p>
            </div>

            <div className="flex-1 space-y-4 pt-4">
                {GOALS.map((g) => (
                    <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`w-full relative flex items-center p-6 rounded-[32px] border-2 transition-all duration-300 group overflow-hidden ${
                            goal === g.id 
                                ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-2xl shadow-emerald-100 dark:shadow-none translate-y-[-4px]" 
                                : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900"
                        }`}
                    >
                        {/* Background Accent */}
                        {goal === g.id && (
                            <motion.div 
                                layoutId="goal-bg"
                                className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                            />
                        )}

                        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-4xl mr-6 transition-transform group-hover:scale-110 ${goal === g.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none" : "bg-white dark:bg-slate-700 text-slate-400 shadow-sm"}`}>
                            {g.id === "lose" ? "🔥" : g.id === "maintain" ? "⚖️" : "💪"}
                        </div>
                        
                        <div className="text-left flex-1">
                            <p className={`text-lg font-black uppercase tracking-tight mb-0.5 ${goal === g.id ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}>
                                {g.name}
                            </p>
                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">{g.desc}</p>
                        </div>

                        {goal === g.id && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"
                            >
                                <Target size={18} strokeWidth={3} />
                            </motion.div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-center space-x-4 pt-10 mt-auto">
                <button 
                    onClick={() => router.back()}
                    className="h-16 px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                </button>
                <button 
                    onClick={handleContinue}
                    className="flex-1 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center group"
                >
                    Calculate Results
                    <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
