'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Settings2, Calendar, ChevronRight } from 'lucide-react';
import { useMealSchedule } from '../../../../lib/hooks/useMealSchedule';
import { useNutritionTargets } from '../../../../lib/hooks/useNutritionTargets';
import MealCard from '../../../../components/meals-schedule/MealCard';
import NutritionTargetEditor from '../../../../components/meals-schedule/NutritionTargetEditor';
import MealConfigurationModal from '../../../../components/meals-schedule/MealConfigurationModal';
import { DayOfWeek, Meal } from '../../../../types/meals';

export default function MealSettingsPage() {
    const { 
        schedule, 
        addMeal, 
        updateMeal, 
        deleteMeal, 
        toggleSameSchedule, 
        setFirstDayOfWeek,
        findDuplicateName
    } = useMealSchedule();

    const { activeTarget, updateTarget } = useNutritionTargets();
    const [isTargetEditorOpen, setIsTargetEditorOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [editingMealId, setEditingMealId] = useState<string | null>(null);

    const editingMeal = schedule.meals.find(m => m.id === editingMealId);

    const handleOpenCreate = () => {
        setEditingMealId(null);
        setIsConfigModalOpen(true);
    };

    const handleOpenEdit = (id: string) => {
        setEditingMealId(id);
        setIsConfigModalOpen(true);
    };

    const handleSaveMealConfig = (mealData: any) => {
        if (editingMealId) {
            updateMeal(editingMealId, mealData);
        } else {
            addMeal(mealData);
        }
        setIsConfigModalOpen(false);
    };

    const weekDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="p-6 lg:p-10 space-y-10">
            {/* Page Header */}
            <div className="px-4">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Meal Settings</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Configure your daily targets & meal structure</p>
            </div>

            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-gray-700">Same schedule each day</label>
                        <button 
                            onClick={() => toggleSameSchedule(!schedule.sameScheduleEachDay)}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${schedule.sameScheduleEachDay ? 'bg-emerald-500' : 'bg-gray-200'}`}
                        >
                            <motion.div 
                                animate={{ x: schedule.sameScheduleEachDay ? 24 : 2 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>
                    
                    <div className="h-8 w-[1px] bg-gray-100 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-gray-700">First day</label>
                        <select 
                            value={schedule.firstDayOfWeek}
                            onChange={(e) => setFirstDayOfWeek(e.target.value as DayOfWeek)}
                            className="bg-gray-50 border-none rounded-xl px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                        >
                            {weekDays.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => setIsTargetEditorOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95"
                    >
                        <Target size={18} className="text-emerald-400" />
                        Edit Targets
                    </button>
                    <button 
                        onClick={handleOpenCreate}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Add Meal
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Meal Cards - Left Side */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            Daily Meals <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{schedule.meals.length} SLOTS</span>
                        </h2>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-emerald-100 shadow-sm">
                            Schedule Balanced: 100%
                        </span>
                    </div>

                    <div className="space-y-6">
                        {schedule.meals.length > 0 ? (
                            schedule.meals.map((meal) => (
                                <MealCard 
                                    key={meal.id} 
                                    meal={meal} 
                                    onUpdate={(updates) => updateMeal(meal.id, updates)}
                                    onDelete={() => deleteMeal(meal.id)}
                                    onEditConfig={() => handleOpenEdit(meal.id)}
                                />
                            ))
                        ) : (
                            <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center space-y-6">
                                <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200 shadow-inner">
                                    <Plus size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">No meals scheduled</h3>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Start your journey by adding your first meal slot</p>
                                </div>
                                <button 
                                    onClick={handleOpenCreate}
                                    className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 hover:scale-105 active:scale-95"
                                >
                                    Add Your First Meal
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Nutrition Summary - Right Side */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 sticky top-32">
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight mb-8">Daily Macros</h3>
                        
                        {activeTarget ? (
                            <div className="space-y-10">
                                <div className="p-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                                    <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-2">Total Daily Target</p>
                                    <div className="flex items-end gap-2">
                                        <h4 className="text-5xl font-black tracking-tighter">{activeTarget.calories}</h4>
                                        <span className="text-sm font-black pb-2 opacity-60 uppercase">kcal</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Carbs', val: `${activeTarget.carbsMin}-${activeTarget.carbsMax}%`, color: 'bg-emerald-500', icon: '🍝' },
                                        { label: 'Protein', val: `${activeTarget.proteinMin}-${activeTarget.proteinMax}%`, color: 'bg-blue-500', icon: '🥩' },
                                        { label: 'Fats', val: `${activeTarget.fatsMin}-${activeTarget.fatsMax}%`, color: 'bg-orange-500', icon: '🥑' },
                                    ].map((macro) => (
                                        <div key={macro.label} className="space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-gray-400 flex items-center gap-2">
                                                    <span>{macro.icon}</span> {macro.label}
                                                </span>
                                                <span className="text-gray-900">{macro.val}</span>
                                            </div>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${macro.color} rounded-full transition-all duration-1000`} style={{ width: macro.val.split('-')[1].replace('%','') + '%' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 space-y-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Settings2 size={12} /> Fiber
                                        </span>
                                        <span className="text-sm font-black text-gray-900">{activeTarget.fiber}g</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} /> Sodium
                                        </span>
                                        <span className="text-sm font-black text-gray-900">{activeTarget.sodium}mg</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setIsTargetEditorOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                                >
                                    Modify Macro Goals
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No active nutrition target found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NutritionTargetEditor 
                isOpen={isTargetEditorOpen}
                onClose={() => setIsTargetEditorOpen(false)}
                target={activeTarget}
                onSave={(input) => {
                    if (activeTarget) {
                        updateTarget(activeTarget.id, input);
                    }
                }}
            />

            <MealConfigurationModal 
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onSave={handleSaveMealConfig}
                initialData={editingMeal}
                isDuplicateName={findDuplicateName}
            />
        </div>
    );
}
