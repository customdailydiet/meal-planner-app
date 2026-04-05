"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, Reorder } from "framer-motion";
import { 
    Plus, 
    Trash2, 
    GripVertical, 
    Utensils, 
    Clock, 
    ArrowRight, 
    ArrowLeft 
} from "lucide-react";

const INITIAL_MEALS = [
    { id: "1", name: "Breakfast", icon: "🍳" },
    { id: "2", name: "Lunch", icon: "🍱" },
    { id: "3", name: "Dinner", icon: "🍲" },
    { id: "4", name: "Snack", icon: "🍎" }
];

export default function MealsPage() {
    const [meals, setMeals] = useState(INITIAL_MEALS);
    const [newMealName, setNewMealName] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const stored = localStorage.getItem("onboarding_meals");
        if (stored) setMeals(JSON.parse(stored));
    }, []);

    const addMeal = () => {
        if (!newMealName.trim()) return;
        const newMeal = {
            id: Date.now().toString(),
            name: newMealName,
            icon: "🍽️"
        };
        setMeals([...meals, newMeal]);
        setNewMealName("");
    };

    const removeMeal = (id: string) => {
        setMeals(meals.filter(m => m.id !== id));
    };

    const handleContinue = () => {
        localStorage.setItem("onboarding_meals", JSON.stringify(meals));
        router.push("/onboarding/preferences");
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8 min-h-[500px] flex flex-col">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Your Daily Structure</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Which meals do you eat each day? Drag to reorder.</p>
            </div>

            <div className="flex-1 space-y-4">
                <Reorder.Group axis="y" values={meals} onReorder={setMeals} className="space-y-3">
                    {meals.map((meal) => (
                        <Reorder.Item 
                            key={meal.id} 
                            value={meal}
                            className="group"
                        >
                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing">
                                <GripVertical className="text-slate-300 dark:text-slate-600 mr-4" />
                                <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-xl shadow-sm mr-4">
                                    {meal.icon}
                                </div>
                                <span className="flex-1 font-bold text-slate-700 dark:text-slate-200">{meal.name}</span>
                                <button 
                                    onClick={() => removeMeal(meal.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {/* Add Custom Meal */}
                <div className="flex items-center space-x-2 pt-4">
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            placeholder="Add custom meal (e.g., Pre-workout)" 
                            value={newMealName}
                            onChange={(e) => setNewMealName(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addMeal()}
                            className="w-full h-14 pl-12 pr-4 bg-slate-100 dark:bg-slate-800/80 dark:text-white rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                        />
                        <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                    </div>
                    <button 
                        onClick={addMeal}
                        className="h-14 w-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-4 pt-6">
                <button 
                    onClick={() => router.back()}
                    className="h-16 px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                </button>
                <button 
                    onClick={handleContinue}
                    disabled={meals.length === 0}
                    className="flex-1 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center group disabled:opacity-50 disabled:grayscale transition-all"
                >
                    Continue
                    <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
