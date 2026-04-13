import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2, Users, Settings2, Zap, MoreVertical, Edit2 } from 'lucide-react';
import { Meal, MealSize } from '../../types/meals';

interface MealCardProps {
    meal: Meal;
    onUpdate: (updates: Partial<Meal>) => void;
    onDelete: () => void;
    onEditConfig?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onUpdate, onDelete, onEditConfig }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const sizes: { label: string; value: MealSize; color: string }[] = [
        { label: 'Tiny', value: 'tiny', color: 'bg-blue-100 text-blue-700' },
        { label: 'Normal', value: 'normal', color: 'bg-emerald-100 text-emerald-700' },
        { label: 'Big', value: 'big', color: 'bg-orange-100 text-orange-700' },
    ];

    const hasFamily = meal.familyMembers > 0;
    const multiplier = 1 + (meal.familyMembers || 0);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-[2.5rem] border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-emerald-500 shadow-xl' : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'}`}
        >
            {/* Header / Summary */}
            <div 
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner">
                        {meal.type === 'breakfast' && '🍳'}
                        {meal.type === 'lunch' && '🥗'}
                        {meal.type === 'dinner' && '🍲'}
                        {meal.type === 'snack' && '🍎'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase italic tracking-tight">{meal.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                             <p className="text-sm font-bold text-emerald-600">{meal.caloriesTarget} kcal</p>
                             <div className="w-1 h-1 bg-gray-300 rounded-full" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{meal.percentage.toFixed(0)}% SHARE</p>
                             {hasFamily && (
                                <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                                    <Users size={10} />
                                    <span className="text-[9px] font-black uppercase tracking-tight">Family of {multiplier}</span>
                                </div>
                             )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${sizes.find(s => s.value === meal.size)?.color}`}>
                            {meal.size}
                        </span>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-gray-300 w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-gray-50/30"
                    >
                        <div className="p-8 space-y-8">
                            {/* Macro Targets with scaling display */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Protein', val: meal.proteinTarget, color: 'blue', icon: '🥩' },
                                    { label: 'Carbs', val: meal.carbsTarget, color: 'emerald', icon: '🍝' },
                                    { label: 'Fats', val: meal.fatsTarget, color: 'orange', icon: '🥑' },
                                ].map(macro => (
                                    <div key={macro.label} className={`bg-${macro.color}-50/50 p-6 rounded-[2rem] border border-${macro.color}-100 flex flex-col items-center text-center`}>
                                        <span className="text-2xl mb-2">{macro.icon}</span>
                                        <p className={`text-[10px] font-black text-${macro.color}-500 uppercase tracking-[0.2em] mb-1`}>{macro.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <p className={`text-2xl font-black text-${macro.color}-700`}>{macro.val}g</p>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase italic">TOTAL</span>
                                        </div>
                                        {hasFamily && (
                                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase italic tracking-widest">
                                                ~{Math.round(macro.val / multiplier)}g PER PERSON
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-2xl border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <Settings2 size={12} />
                                        {meal.preferences.complexity}
                                    </div>
                                    <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-2xl border border-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        <Zap size={12} />
                                        {meal.preferences.time}
                                    </div>
                                    {meal.preferences.categories.length > 0 && (
                                        <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                            {meal.preferences.categories.length} Categories
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditConfig?.();
                                        }}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-[1.2rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:scale-[1.05] transition-all active:scale-95"
                                    >
                                        <Edit2 size={14} />
                                        Config Flow
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete();
                                        }}
                                        className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-[1.2rem] transition-all border border-transparent hover:border-red-100"
                                        title="Delete Meal"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MealCard;
