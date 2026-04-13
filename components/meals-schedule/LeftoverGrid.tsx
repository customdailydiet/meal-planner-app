'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RefreshCw, ChefHat, AlertCircle } from 'lucide-react';
import { DayOfWeek, MealType, WeeklyGridData, GridCellData } from '../../types/meals';

interface LeftoverGridProps {
    data: WeeklyGridData;
    isEnabled: boolean;
}

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const LeftoverGrid: React.FC<LeftoverGridProps> = ({ data, isEnabled }) => {
    return (
        <div className={`space-y-8 transition-all duration-500 ${!isEnabled ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between px-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] italic">Weekly Preview Grid</h3>
                <div className="flex items-center gap-6">
                    <LegendItem icon={<ChefHat size={12} />} label="Fresh Cook" color="bg-emerald-500" />
                    <LegendItem icon={<RefreshCw size={12} />} label="Leftover" color="bg-orange-500" />
                    <LegendItem icon={<AlertCircle size={12} />} label="Conflict" color="bg-indigo-500" />
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-2">
                <div className="flex">
                    {/* Header Columns (Days) */}
                    <div className="w-32 shrink-0 border-r border-gray-50 flex items-center justify-center">
                        <span className="text-[10px] font-black text-gray-300 uppercase rotate-180 [writing-mode:vertical-lr]">MEALS</span>
                    </div>
                    {DAYS.map(day => (
                        <div key={day} className="flex-1 py-6 text-center border-r border-gray-50 last:border-r-0">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{day.slice(0, 3)}</h4>
                        </div>
                    ))}
                </div>

                {MEAL_TYPES.map(meal => (
                    <div key={meal} className="flex border-t border-gray-50 group/row">
                        {/* Row Header */}
                        <div className="w-32 shrink-0 border-r border-gray-50 p-6 flex items-center gap-3 bg-gray-50/30">
                            <span className="text-xl">
                                {meal === 'breakfast' && '🍳'}
                                {meal === 'lunch' && '🥗'}
                                {meal === 'dinner' && '🍲'}
                                {meal === 'snack' && '🍎'}
                            </span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{meal}</span>
                        </div>

                        {/* Grid Cells */}
                        {DAYS.map(day => {
                            const cell = data[day][meal];
                            return (
                                <GridCell 
                                    key={`${day}-${meal}`}
                                    day={day}
                                    meal={meal}
                                    cell={cell}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

const GridCell: React.FC<{ day: DayOfWeek; meal: MealType; cell: GridCellData }> = ({ day, meal, cell }) => {
    const isFresh = cell.state === 'fresh';
    const isLeftover = cell.state === 'leftover';

    return (
        <div className={`flex-1 min-h-[140px] border-r border-gray-50 last:border-r-0 p-3 relative group transition-all ${isFresh ? 'bg-emerald-50/30' : ''} ${isLeftover ? 'bg-orange-50/20' : ''}`}>
            {/* Tooltip on Hover */}
            {(isFresh || isLeftover) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-gray-900 text-white rounded-2xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100">
                    <p className="uppercase tracking-widest text-white/60 mb-1">{isFresh ? 'Initial Cooking' : 'Leftover Consumption'}</p>
                    <p className="italic underline decoration-emerald-500/50 mb-2">"{cell.mealName}"</p>
                    <p className="opacity-80">
                        {isFresh ? `Preparing fresh meals on ${day} ${meal}.` : `Eating leftovers from a previous batch.`}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900" />
                </div>
            )}

            <div className={`h-full rounded-[1.5rem] p-3 flex flex-row items-center justify-center gap-2 border-2 transition-all cursor-default ${
                isFresh ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-100 hover:scale-105' :
                isLeftover ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-100 hover:scale-105' :
                'bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100'
            }`}>
                <div className="flex flex-col items-center gap-1.5 overflow-hidden">
                    {isFresh && <ChefHat size={16} />}
                    {isLeftover && <RefreshCw size={16} className="animate-[spin_4s_linear_infinite]" />}
                    {cell.state === 'normal' && <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />}
                    
                    {(isFresh || isLeftover) && cell.mealName && (
                        <span className="text-[9px] font-black uppercase tracking-tight truncate w-full px-1 text-center">
                            {cell.mealName}
                        </span>
                    )}
                </div>

                {/* Overlap Indicator */}
                {cell.isOverridden && (
                    <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white"
                        title="Pattern Conflict - Modified by latest pattern"
                    >
                        <AlertCircle size={12} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const LegendItem: React.FC<{ icon: React.ReactNode; label: string; color: string }> = ({ icon, label, color }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 ${color} rounded-sm flex items-center justify-center text-white p-0.5`}>
            {icon}
        </div>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
);

export default LeftoverGrid;
