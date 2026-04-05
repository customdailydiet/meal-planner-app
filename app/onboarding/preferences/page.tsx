"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Check, 
    Plus, 
    ArrowRight, 
    ArrowLeft, 
    Sparkles, 
    Star,
    ChefHat,
    X,
    Save,
    AlertCircle
} from "lucide-react";

const CATEGORIES = [
    { id: "protein", name: "Proteins", icon: "🍗" },
    { id: "carb", name: "Carbohydrates", icon: "🍚" },
    { id: "fat", name: "Healthy Fats", icon: "🥑" },
    { id: "veggie", name: "Vegetables", icon: "🥦" },
    { id: "smoothie", name: "Smoothies", icon: "🥤" },
    { id: "snack", name: "Snacks", icon: "🥜" }
];

export default function PreferencesPage() {
    const [meals, setMeals] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [preferences, setPreferences] = useState<Record<string, { categories: string[], generate: boolean, customFoods: any[] }>>({});
    const [isMounted, setIsMounted] = useState(false);
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    
    // Custom Food Form State
    const [customFood, setCustomFood] = useState({
        name: "", calories: 0, protein: 0, carbs: 0, fat: 0, category: "protein" as any
    });
    const [formError, setFormError] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const storedMeals = localStorage.getItem("onboarding_meals");
        const storedPrefs = localStorage.getItem("onboarding_preferences");

        if (storedMeals) {
            const parsed = JSON.parse(storedMeals);
            setMeals(parsed);
            
            if (storedPrefs) {
                setPreferences(JSON.parse(storedPrefs));
            } else {
                const initialPrefs: any = {};
                parsed.forEach((m: any) => {
                    initialPrefs[m.id] = { categories: [], generate: true, customFoods: [] };
                });
                setPreferences(initialPrefs);
            }
        } else {
            router.push("/onboarding/meals");
        }
    }, [router]);

    const toggleCategory = (mealId: string, categoryId: string) => {
        const current = preferences[mealId];
        const newCats = current.categories.includes(categoryId)
            ? current.categories.filter(c => c !== categoryId)
            : [...current.categories, categoryId];
        
        const updated = {
            ...preferences,
            [mealId]: { ...current, categories: newCats }
        };
        setPreferences(updated);
        localStorage.setItem("onboarding_preferences", JSON.stringify(updated));
    };

    const toggleGenerate = (mealId: string) => {
        const current = preferences[mealId];
        const updated = {
            ...preferences,
            [mealId]: { ...current, generate: !current.generate }
        };
        setPreferences(updated);
        localStorage.setItem("onboarding_preferences", JSON.stringify(updated));
    };

    const handleAddCustomFood = () => {
        if (!customFood.name || customFood.calories <= 0) {
            setFormError("Basic info (Name & Calories) is required.");
            return;
        }

        const mealId = meals[currentIndex].id;
        const current = preferences[mealId];
        
        const newFood = {
            ...customFood,
            id: `custom-${Date.now()}`,
            serving: "1 unit",
            tags: ["custom"],
            mealTypes: [meals[currentIndex].name.toLowerCase()]
        };

        const updated = {
            ...preferences,
            [mealId]: { ...current, customFoods: [...current.customFoods, newFood] }
        };
        
        setPreferences(updated);
        localStorage.setItem("onboarding_preferences", JSON.stringify(updated));
        
        // Reset form
        setCustomFood({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0, category: "protein" });
        setIsCustomModalOpen(false);
        setFormError(null);
    };

    const handleNext = () => {
        if (currentIndex < meals.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.push("/onboarding/about");
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            router.push("/onboarding/meals");
        }
    };

    if (!isMounted || meals.length === 0) return null;

    const currentMeal = meals[currentIndex];
    const currentPrefs = preferences[currentMeal.id] || { categories: [], generate: true, customFoods: [] };

    return (
        <div className="space-y-8 min-h-[500px] flex flex-col relative focus-within:outline-none">
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentMeal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                >
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                            {currentMeal.name} Preferences
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">Preferences for {currentMeal.name}</h1>
                    </div>

                    {/* Intelligent toggle */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                <Sparkles className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <p className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-100 mb-0.5">Automated Selection</p>
                                <p className="text-[10px] font-bold text-slate-400">Let the AI engine curate this meal for you</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleGenerate(currentMeal.id)}
                            className={`w-14 h-8 rounded-full transition-all relative ${currentPrefs.generate ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}
                        >
                            <motion.div 
                                animate={{ x: currentPrefs.generate ? 26 : 4 }}
                                className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm"
                            />
                        </button>
                    </div>

                    {/* Sections conditional visibility */}
                    <AnimatePresence>
                        {currentPrefs.generate ? (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 overflow-hidden pt-2"
                            >
                                <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                                    <ChefHat size={14} />
                                    <span>Included Categories</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(currentMeal.id, cat.id)}
                                            className={`relative flex items-center p-4 rounded-3xl border-2 transition-all group ${
                                                currentPrefs.categories.includes(cat.id)
                                                    ? "bg-white dark:bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-100 dark:shadow-none"
                                                    : "bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100"
                                            }`}
                                        >
                                            <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">{cat.icon}</span>
                                            <span className="font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200">{cat.name}</span>
                                            {currentPrefs.categories.includes(cat.id) && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 bg-slate-50 dark:bg-slate-800/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[22px] flex items-center justify-center text-3xl shadow-sm">🍽️</div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none">Manual Selection Mode</h3>
                                    <p className="text-[10px] font-bold text-slate-400 max-w-[200px]">You will pick items for this slot manually during generation.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Custom Foods List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                            <span>Your Custom Foods</span>
                            <button 
                                onClick={() => setIsCustomModalOpen(true)}
                                className="text-emerald-500 hover:text-emerald-600 flex items-center"
                            >
                                <Plus size={14} className="mr-1" /> Add New
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentPrefs.customFoods.length === 0 ? (
                                <p className="text-[10px] font-bold text-slate-400 italic px-2">No custom foods added yet.</p>
                            ) : (
                                currentPrefs.customFoods.map((food: any) => (
                                    <div key={food.id} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center space-x-2 shadow-sm">
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">{food.name}</span>
                                        <span className="text-[10px] font-bold text-emerald-500">{food.calories} kcal</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center space-x-4 pt-8 mt-auto">
                <button 
                    onClick={handleBack}
                    className="h-16 px-8 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center"
                >
                    <ArrowLeft className="mr-2" size={20} />
                    Back
                </button>
                <button 
                    onClick={handleNext}
                    className="flex-1 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center justify-center group"
                >
                    {currentIndex < meals.length - 1 ? "Next Meal" : "Continue"}
                    <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Custom Food Modal */}
            <AnimatePresence>
                {isCustomModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsCustomModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 italic uppercase">Add Custom Food</h3>
                                <button onClick={() => setIsCustomModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <X size={24} />
                                </button>
                            </div>

                            {formError && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-xl text-xs font-bold flex items-center">
                                    <AlertCircle size={14} className="mr-2" /> {formError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Food Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. My Secret Omelette"
                                        value={customFood.name}
                                        onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                                        className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Calories (kcal)</label>
                                        <input 
                                            type="number" 
                                            value={customFood.calories || ""}
                                            onChange={(e) => setCustomFood({ ...customFood, calories: Number(e.target.value) })}
                                            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Protein (g)</label>
                                        <input 
                                            type="number" 
                                            value={customFood.protein || ""}
                                            onChange={(e) => setCustomFood({ ...customFood, protein: Number(e.target.value) })}
                                            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Carbs (g)</label>
                                        <input 
                                            type="number" 
                                            value={customFood.carbs || ""}
                                            onChange={(e) => setCustomFood({ ...customFood, carbs: Number(e.target.value) })}
                                            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Fat (g)</label>
                                        <input 
                                            type="number" 
                                            value={customFood.fat || ""}
                                            onChange={(e) => setCustomFood({ ...customFood, fat: Number(e.target.value) })}
                                            className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-slate-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddCustomFood}
                                className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center shadow-xl shadow-emerald-200 dark:shadow-none transition-all"
                            >
                                <Save className="mr-2" size={18} /> Save Food Item
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
