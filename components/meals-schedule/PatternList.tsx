'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Calendar, Clock, Layers, ChevronRight } from 'lucide-react';
import { LeftoverPattern } from '../../types/meals';

interface PatternListProps {
    patterns: LeftoverPattern[];
    onEdit: (pattern: LeftoverPattern) => void;
    onDelete: (id: string) => void;
}

const PatternList: React.FC<PatternListProps> = ({ patterns, onEdit, onDelete }) => {
    if (patterns.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] italic">Active Patterns</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{patterns.length} Configured</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {patterns.map((pattern) => (
                        <motion.div 
                            layout
                            key={pattern.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-[2rem] border border-gray-100 p-6 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h4 className="font-black text-gray-900 leading-tight italic uppercase tracking-tight">{pattern.name}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Calendar size={10} className="text-orange-500" />
                                        {pattern.cookDay}
                                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                        <Clock size={10} className="text-orange-500" />
                                        {pattern.cookMeal}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onEdit(pattern)}
                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(pattern.id)}
                                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {pattern.applyToMeals.map(meal => (
                                            <div key={meal} className="w-7 h-7 bg-gray-50 rounded-lg border-2 border-white flex items-center justify-center text-xs shadow-sm">
                                                {meal === 'breakfast' && '🍳'}
                                                {meal === 'lunch' && '🥗'}
                                                {meal === 'dinner' && '🍲'}
                                                {meal === 'snack' && '🍎'}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">+ {pattern.daysToPrepare} Day Reuse</p>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-orange-100">
                                        {pattern.recipeType.replace('_', ' ')}
                                    </div>
                                    <ChevronRight size={14} className="text-gray-200 group-hover:text-orange-300 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PatternList;
