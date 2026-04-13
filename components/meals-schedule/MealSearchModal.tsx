import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, CheckCircle2, Filter, FilterX, Hash, Flame, Zap, ShieldCheck } from "lucide-react";
import { FULL_DISCOVER_DATABASE, FoodItem, FoodCategory } from "../../lib/discover-db";
import { useDebounce } from "../../lib/hooks/useDebounce";

interface MealSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (food: FoodItem) => void;
    selectedIds: string[];
}

interface ActiveFilters {
    nutrition: string[];
    mealType: string[];
    categories: string[];
}

const NUTRITION_MAP: Record<string, string> = {
    "High Protein": "protein",
    "Low Carb": "low carb",
    "Low Fat": "fat",
    "High Fiber": "fiber",
    "Low Sodium": "sodium"
};

const MealSearchModal: React.FC<MealSearchModalProps> = ({ isOpen, onClose, onSelect, selectedIds }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        nutrition: [],
        mealType: [],
        categories: []
    });

    const normalize = useCallback((str: string) => str?.toLowerCase().trim() || "", []);

    const toggleFilter = useCallback((type: keyof ActiveFilters, value: string) => {
        setActiveFilters(prev => {
            const exists = prev[type].includes(value);
            return {
                ...prev,
                [type]: exists
                    ? prev[type].filter(v => v !== value)
                    : [...prev[type], value]
            };
        });
    }, []);

    const clearFilters = useCallback(() => {
        setActiveFilters({ nutrition: [], mealType: [], categories: [] });
        setSearchQuery("");
    }, []);

    const highlightText = useCallback((text: string, query: string) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    part.toLowerCase() === query.toLowerCase() 
                        ? <span key={i} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">{part}</span> 
                        : part
                )}
            </span>
        );
    }, []);

    const filteredFoods = useMemo(() => {
        return FULL_DISCOVER_DATABASE
            .filter(food => normalize(food.name).includes(normalize(debouncedSearch)))
            .filter(food => {
                if (activeFilters.nutrition.length === 0) return true;
                return activeFilters.nutrition.some(filter => {
                    const mapped = normalize(NUTRITION_MAP[filter] || filter);
                    return food.tags?.some(tag => normalize(tag).includes(mapped));
                });
            })
            .filter(food => {
                if (activeFilters.mealType.length === 0) return true;
                return activeFilters.mealType.some(type =>
                    food.mealTypes.some(mt => normalize(mt) === normalize(type))
                );
            })
            .filter(food => {
                if (activeFilters.categories.length === 0) return true;
                return activeFilters.categories.some(selected => {
                    const catMap: Record<string, FoodCategory[]> = {
                        "Foods": ["protein", "carb", "fat", "veggie", "smoothie", "snack"],
                        "Recipes": ["recipe"],
                        "Branded Foods": ["branded", "restaurant"],
                        "Custom Foods": ["custom"]
                    };
                    const mappedCats = catMap[selected] || [selected as FoodCategory];
                    return mappedCats.includes(food.category);
                });
            });
    }, [debouncedSearch, activeFilters, normalize]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-gray-100"
            >
                {/* Search Sidebar (Left) */}
                <div className="flex-[1.5] flex flex-col border-r border-gray-100">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-500 rounded-2xl text-white">
                                <Search size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Food Search</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add recurring items</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                autoFocus
                                placeholder="Search foods or recipes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-base font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
                        <AnimatePresence mode="popLayout">
                            {filteredFoods.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                                        <Search size={24} className="text-gray-300" />
                                    </div>
                                    <p className="font-bold text-gray-900">No foods found</p>
                                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query.</p>
                                </motion.div>
                            ) : (
                                filteredFoods.map(food => (
                                    <motion.div 
                                        layout key={food.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 p-1">
                                                <img src={food.image} className="w-full h-full object-cover rounded-lg" alt={food.name} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 capitalize">{highlightText(food.name, debouncedSearch)}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{food.category}</span>
                                                    {food.nutrition?.calories && <span className="text-[10px] font-bold text-gray-400">{food.nutrition.calories} kcal</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onSelect(food)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                                                selectedIds.includes(food.id) 
                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                                                    : "bg-white text-gray-400 hover:text-indigo-500 border border-gray-100"
                                            }`}
                                        >
                                            {selectedIds.includes(food.id) ? <CheckCircle2 size={20} /> : <Plus size={20} />}
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Filter Sidebar (Right) */}
                <div className="hidden md:flex flex-col w-[320px] bg-gray-50/50 p-8 border-l border-gray-100 overflow-y-auto scrollbar-hide">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] italic">Filters</h3>
                        <button onClick={clearFilters} className="text-[10px] font-bold uppercase text-gray-400 hover:text-indigo-500">Reset</button>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} className="text-blue-500" /> Nutrition Focus
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(NUTRITION_MAP).map(item => (
                                    <button 
                                        key={item} onClick={() => toggleFilter("nutrition", item)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                            activeFilters.nutrition.includes(item)
                                                ? "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-200"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-indigo-500"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Filter size={14} className="text-emerald-500" /> Meal Type
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Breakfast","Lunch","Dinner","Snack"].map(item => (
                                    <button 
                                        key={item} onClick={() => toggleFilter("mealType", item)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                            activeFilters.mealType.includes(item)
                                                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200"
                                                : "bg-white text-gray-500 border-gray-200 hover:border-emerald-500"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MealSearchModal;
