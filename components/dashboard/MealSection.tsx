"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { 
    Plus, 
    RefreshCcw, 
    ChevronDown, 
    Loader2, 
    Flame,
    MoreVertical,
    Send,
    FileJson,
    Mail,
    Sparkles,
    Zap,
    AlertCircle,
    CalendarDays,
    ArrowRight,
    Share2,
    Download,
    Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateMealPlan, GeneratedMeal, UserPreferences } from "../../lib/meal-planner";
import { FOOD_DATABASE } from "../../lib/food-db";
import DropdownMenu from "./DropdownMenu";

interface MealSectionProps {
    viewMode: "day" | "week";
    selectedDate: Date;
    dateRange: { start: Date; end: Date | null };
    setIsProcessing: (val: boolean) => void;
    isProcessing: boolean;
}

const MealCard = ({ meal }: { meal: GeneratedMeal }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all mb-4 group/card"
        >
            <div className="p-5 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Flame size={20} />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{meal.slot}</h3>
                            <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">{meal.totalCalories} kcal</span>
                        </div>
                        <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-none mt-1">
                            {meal.items.length > 0 ? meal.items.map(i => i.food.name).join(" + ") : "Awaiting Selection"}
                        </h4>
                    </div>
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`p-2 text-slate-300 hover:text-emerald-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                >
                    <ChevronDown size={18} />
                </button>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 bg-slate-50/30 dark:bg-slate-800/20 space-y-3">
                            {meal.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.01]">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-lg">
                                            {item.food.category === "protein" ? "🍗" : item.food.category === "carb" ? "🍚" : "🥑"}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none">{item.food.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.food.serving} × {item.amount}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">{Math.round(item.food.calories * item.amount)} <small className="text-[10px]">kcal</small></span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function MealSection({ 
    viewMode, 
    selectedDate, 
    dateRange, 
    setIsProcessing,
    isProcessing 
}: MealSectionProps) {
    const [mealsMap, setMealsMap] = useState<Record<string, GeneratedMeal[]>>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getDateKey = (date: Date) => date.toISOString().split('T')[0];

    const loadMeals = useCallback(() => {
        setErrorMessage(null);
        setIsProcessing(true);

        const profileRaw = localStorage.getItem("nutritionProfile");
        const prefsRaw = localStorage.getItem("onboarding_preferences");
        const mealsRaw = localStorage.getItem("onboarding_meals");
        const cacheRaw = localStorage.getItem("meals_cache");

        if (!profileRaw || !prefsRaw || !mealsRaw) {
            setErrorMessage("Configuration incomplete. Please complete profile setup.");
            setIsProcessing(false);
            return;
        }

        const profile = JSON.parse(profileRaw);
        const prefs = JSON.parse(prefsRaw);
        const slots = JSON.parse(mealsRaw);
        let cache = cacheRaw ? JSON.parse(cacheRaw) : {};

        const anyGenOn = Object.values(prefs).some((p: any) => p.generate);
        const preferences: UserPreferences = {
            selectedCategories: Object.values(prefs).flatMap((p: any) => p.categories),
            favoriteFoodIds: [],
            excludedFoodIds: [],
            customFoods: Object.values(prefs).flatMap((p: any) => p.customFoods || []),
            mealSlots: slots.map((m: any) => m.name),
            intelligentGeneration: anyGenOn
        };

        const targetDates: string[] = [];
        if (viewMode === "day") {
            targetDates.push(getDateKey(selectedDate));
        } else {
            const start = new Date(dateRange.start);
            const end = dateRange.end ? new Date(dateRange.end) : new Date(start);
            if (!dateRange.end) end.setDate(end.getDate() + 6);

            const curr = new Date(start);
            while (curr <= end) {
                targetDates.push(getDateKey(curr));
                curr.setDate(curr.getDate() + 1);
            }
        }

        let updated = false;
        targetDates.forEach(dateStr => {
            if (!cache[dateStr]) {
                cache[dateStr] = generateMealPlan(profile, preferences);
                updated = true;
            }
        });

        if (updated) {
            localStorage.setItem("meals_cache", JSON.stringify(cache));
        }

        setTimeout(() => {
            setMealsMap(cache);
            setIsProcessing(false);
            window.dispatchEvent(new Event("storage"));
        }, 800);

    }, [viewMode, selectedDate, dateRange, setIsProcessing]);

    useEffect(() => {
        loadMeals();
    }, [loadMeals]);

    const handleRegenerate = () => {
        if (window.confirm("Regenerate all meals for this period?")) {
            localStorage.removeItem("meals_cache");
            loadMeals();
        }
    };

    const targetDates = useMemo(() => {
        const dates: Date[] = [];
        if (viewMode === "day") {
            dates.push(selectedDate);
        } else {
            const start = new Date(dateRange.start);
            const end = dateRange.end ? new Date(dateRange.end) : new Date(start);
            if (!dateRange.end) end.setDate(end.getDate() + 6);

            const curr = new Date(start);
            while (curr <= end) {
                dates.push(new Date(curr));
                curr.setDate(curr.getDate() + 1);
            }
        }
        return dates;
    }, [viewMode, selectedDate, dateRange]);

    const generateFormattedPlan = useCallback(() => {
        let content = "My CustomDailyDiet Meal Plan\n\n";
        targetDates.forEach(date => {
            const dateStr = getDateKey(date);
            const dayMeals = mealsMap[dateStr];
            if (dayMeals) {
                content += `📅 ${date.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}\n`;
                dayMeals.forEach(meal => {
                    content += `${meal.slot}: ${meal.items.map(i => i.food.name).join(" + ")} (${meal.totalCalories} kcal)\n`;
                });
                content += "\n";
            }
        });
        return content;
    }, [targetDates, mealsMap]);

    const handleWhatsAppShare = () => {
        const content = generateFormattedPlan();
        window.open(`https://wa.me/?text=${encodeURIComponent(content)}`, "_blank");
    };

    const handleEmailShare = () => {
        const content = generateFormattedPlan();
        window.location.href = `mailto:?subject=My Meal Plan&body=${encodeURIComponent(content)}`;
    };

    const handleDownloadPlan = () => {
        const content = generateFormattedPlan();
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const shareItems = [
        { label: "Download Plan", onClick: handleDownloadPlan, icon: <Download size={16} /> },
        { label: "Send via WhatsApp", onClick: handleWhatsAppShare, icon: <Phone size={16} className="text-emerald-500" /> },
        { label: "Send via Email", onClick: handleEmailShare, icon: <Mail size={16} className="text-blue-500" /> },
        { label: "Regenerate All", onClick: handleRegenerate, icon: <RefreshCcw size={16} />, variant: "danger" as const },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 italic uppercase flex items-center">
                        Daily Planner <Zap size={24} className="ml-2 text-emerald-500 fill-emerald-500 shadow-sm" />
                    </h2>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                        {viewMode === "day" ? "Single Day Performance" : "Weekly Performance Roadmap"}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <DropdownMenu items={shareItems} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/40 rounded-[32px] flex flex-col items-center text-center space-y-4"
                    >
                        <AlertCircle size={32} className="text-red-500" />
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 italic uppercase">System Error</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold max-w-xs">{errorMessage}</p>
                        <button onClick={loadMeals} className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Retry Sync</button>
                    </motion.div>
                )}

                {!errorMessage && targetDates.map((date, idx) => {
                    const dateKey = getDateKey(date);
                    const dayMeals = mealsMap[dateKey];

                    return (
                        <div key={dateKey} className="space-y-4">
                            <div className="flex items-center space-x-4 px-2">
                                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-emerald-500">
                                    <CalendarDays size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">
                                        {idx === 0 && viewMode === "day" ? "Today's Target" : `Day ${idx + 1}`}
                                    </p>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                        {date.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </h4>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {isProcessing && !dayMeals ? (
                                    <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        {[1, 2, 3].map(s => (
                                            <div key={s} className="h-28 bg-slate-50/50 dark:bg-slate-900/50 rounded-[28px] border border-dashed border-slate-200 dark:border-slate-800 animate-pulse" />
                                        ))}
                                    </motion.div>
                                ) : dayMeals ? (
                                    <div className="space-y-4">
                                        {dayMeals.map((meal, mIdx) => (
                                            <MealCard key={`${dateKey}-${mIdx}`} meal={meal} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No Meals Cached</p>
                                    </div>
                                )}
                            </AnimatePresence>

                            {viewMode === "week" && idx < targetDates.length - 1 && (
                                <div className="py-4 flex justify-center">
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
