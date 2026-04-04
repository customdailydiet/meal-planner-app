"use client";

import { motion } from "framer-motion";
import { PlusCircle, Sparkles, Layout, Zap } from "lucide-react";

interface EmptyStateProps {
    onCreatePlan: () => void;
}

export default function EmptyState({ onCreatePlan }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 lg:p-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>

            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 space-y-8"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-200">
                    <Sparkles size={48} />
                </div>

                <div className="space-y-4 max-w-lg">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Welcome to <span className="text-emerald-600">CustomDailyDiet</span> 🎉
                    </h2>
                    <p className="text-lg text-slate-500 font-medium">
                        Start by setting your goals to generate your first meal plan.
                    </p>
                </div>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
                    <button 
                        onClick={onCreatePlan}
                        className="px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-200 font-bold flex items-center justify-center space-x-3 group"
                    >
                        <Zap size={22} className="group-hover:scale-110 transition-transform" />
                        <span>Generate My Plan</span>
                    </button>
                    
                    <button className="px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all font-bold flex items-center justify-center space-x-3">
                        <Layout size={22} />
                        <span>View Sample Plans</span>
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-8 mt-8 text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-none">
                    <div className="flex items-center space-x-2">
                        <Zap size={14} className="text-emerald-400" />
                        <span>Personalized</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Zap size={14} className="text-emerald-400" />
                        <span>AI Powered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Zap size={14} className="text-emerald-400" />
                        <span>Nutrient Dense</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
