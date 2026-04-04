"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    Sparkles, 
    Calendar, 
    Utensils, 
    ArrowRight, 
    ArrowLeft,
    CheckCircle2
} from "lucide-react";

export default function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
        if (!hasSeenOnboarding) {
            setIsOpen(true);
        }
    }, []);

    const steps = [
        {
            title: "Welcome to CustomDailyDiet 🎉",
            description: "Your personalized nutrition journey starts here. Let's show you how to get the most out of your planner.",
            icon: <Sparkles className="text-emerald-500" size={40} />,
            color: "bg-emerald-50"
        },
        {
            title: "How the Planner Works",
            description: "Our AI generates a daily meal plan based on your goals, restrictions, and preferences. You can swap any meal instantly.",
            icon: <Calendar className="text-blue-500" size={40} />,
            color: "bg-blue-50"
        },
        {
            title: "How to Select Meals",
            description: "Check off items as you eat them to track your daily progress. Your shopping list updates automatically!",
            icon: <Utensils className="text-orange-500" size={40} />,
            color: "bg-orange-50"
        }
    ];

    const handleClose = () => {
        localStorage.setItem("hasSeenOnboarding", "true");
        setIsOpen(false);
    };

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            handleClose();
        }
    };

    const prevStep = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={handleClose}
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className={`p-8 ${steps[step].color} transition-colors duration-500 flex justify-center`}>
                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                            {steps[step].icon}
                        </div>
                    </div>

                    <div className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 transition-all duration-300">
                            {steps[step].title}
                        </h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            {steps[step].description}
                        </p>

                        <div className="flex items-center justify-between">
                            <button 
                                onClick={handleClose}
                                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Skip tour
                            </button>

                            <div className="flex space-x-2">
                                {steps.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            step === i ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-200"
                                        }`}
                                    />
                                ))}
                            </div>

                            <div className="flex space-x-3">
                                {step > 0 && (
                                    <button 
                                        onClick={prevStep}
                                        className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                                    >
                                        <ArrowLeft size={18} />
                                    </button>
                                )}
                                <button 
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 font-bold flex items-center space-x-2"
                                >
                                    <span>{step === steps.length - 1 ? "Get Started" : "Next"}</span>
                                    {step === steps.length - 1 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
