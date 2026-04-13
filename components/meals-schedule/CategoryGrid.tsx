import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, X } from 'lucide-react';

const CATEGORIES = [
  "Salads", "Roasted Vegetables", "Omelets", "Meat dishes", "Smoothies", "Snacks",
  "Pasta", "Soups", "Grain Bowls", "Sandwiches", "Stir-fries", "Casseroles",
  "Tacos & Wraps", "Baked Goods", "Seafood", "Burgers", "Pizzas", "Curries",
  "Stew", "Grilled Items", "Raw Foods", "Fermented"
];

interface CategoryGridProps {
    selected: string[];
    onChange: (categories: string[]) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ selected, onChange }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = useMemo(() => {
        return CATEGORIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery]);

    const toggleCategory = (cat: string) => {
        if (selected.includes(cat)) {
            onChange(selected.filter(s => s !== cat));
        } else {
            onChange([...selected, cat]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Food Categories</label>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                        {selected.length} Selected
                    </span>
                </div>
                <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto p-1 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {filteredCategories.map((cat) => {
                        const isSelected = selected.includes(cat);
                        return (
                            <motion.button
                                layout
                                key={cat}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleCategory(cat);
                                }}
                                className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                                    isSelected 
                                        ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                                        : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 hover:bg-white'
                                }`}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className={`text-xs font-bold transition-colors ${isSelected ? 'text-emerald-700' : 'text-gray-600'}`}>
                                        {cat}
                                    </span>
                                    {isSelected && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-emerald-500"
                                        >
                                            <CheckCircle2 size={12} />
                                        </motion.div>
                                    )}
                                </div>
                                
                                {/* Micro-animation overlay */}
                                {isSelected && (
                                    <motion.div 
                                        layoutId="category-selection-marker"
                                        className="absolute inset-0 rounded-2xl border-2 border-emerald-500 pointer-events-none"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
                
                {filteredCategories.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-400 text-sm italic">
                        No categories found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryGrid;
