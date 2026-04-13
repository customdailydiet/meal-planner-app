'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Save, ArrowLeft, Calendar, Clock, 
    Layers, CheckCircle2, AlertTriangle, 
    ChefHat, Utensils, Info, Loader2 
} from 'lucide-react';
import { LeftoverPattern, DayOfWeek, MealType, RecipeType } from '../../types/meals';

interface CreatePatternModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (pattern: Omit<LeftoverPattern, 'id' | 'createdAt'>) => void;
    initialData?: LeftoverPattern;
}

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const CreatePatternModal: React.FC<CreatePatternModalProps> = ({ 
    isOpen, onClose, onSave, initialData 
}) => {
    const [formData, setFormData] = useState<Omit<LeftoverPattern, 'id' | 'createdAt'>>({
        name: '',
        cookDay: 'Sunday',
        cookMeal: 'dinner',
        daysToPrepare: 2,
        recipeType: 'main_only',
        applyToMeals: ['lunch', 'dinner']
    });

    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; applyToMeals?: string }>({});

    useEffect(() => {
        if (initialData) {
            const { id, createdAt, ...rest } = initialData;
            setFormData(rest);
        } else {
            setFormData({
                name: '',
                cookDay: 'Sunday',
                cookMeal: 'dinner',
                daysToPrepare: 2,
                recipeType: 'main_only',
                applyToMeals: ['lunch', 'dinner']
            });
        }
    }, [initialData, isOpen]);

    const handleSave = async () => {
        const newErrors: { name?: string; applyToMeals?: string } = {};
        if (!formData.name.trim()) newErrors.name = "Pattern name is required";
        if (formData.applyToMeals.length === 0) newErrors.applyToMeals = "Select at least one meal for leftovers";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 600)); // Premium feel
        onSave(formData);
        setIsSaving(false);
        onClose();
    };

    const toggleMealApplication = (meal: MealType) => {
        setFormData(prev => ({
            ...prev,
            applyToMeals: prev.applyToMeals.includes(meal)
                ? prev.applyToMeals.filter(m => m !== meal)
                : [...prev.applyToMeals, meal]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full h-full max-w-5xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
                                {initialData ? 'Edit Pattern' : 'Create Leftover Pattern'}
                            </h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Optimization Logic Engine</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500">Cancel</button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-3 px-10 py-4 bg-orange-500 text-white rounded-[1.5rem] font-bold shadow-xl shadow-orange-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {initialData ? 'Update Pattern' : 'Save Pattern'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
                    {/* Basic Settings */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pattern Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Sunday Batch Cooking"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold outline-none transition-all ${errors.name ? 'border-red-500' : 'border-transparent focus:border-orange-500 focus:bg-white'}`}
                            />
                            {errors.name && <p className="text-xs font-bold text-red-500 px-2 italic">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cooking Day */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} className="text-orange-500" /> When do you cook?
                                </label>
                                <select 
                                    value={formData.cookDay}
                                    onChange={(e) => setFormData({ ...formData, cookDay: e.target.value as DayOfWeek })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl px-6 py-4 font-bold outline-none appearance-none cursor-pointer"
                                >
                                    {DAYS.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Cooking Meal */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={14} className="text-orange-500" /> Which meal is fresh?
                                </label>
                                <select 
                                    value={formData.cookMeal}
                                    onChange={(e) => setFormData({ ...formData, cookMeal: e.target.value as MealType })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-2xl px-6 py-4 font-bold outline-none appearance-none cursor-pointer"
                                >
                                    {MEAL_TYPES.map(type => (
                                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Leftover Logic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Days to Prepare */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} className="text-orange-500" /> How many days should it last?
                            </label>
                            <div className="bg-gray-50 p-2 rounded-2xl flex gap-1">
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => setFormData({ ...formData, daysToPrepare: num })}
                                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${formData.daysToPrepare === num ? 'bg-white shadow-md text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {num === 1 ? 'Just today' : `${num} Days`}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 italic px-2">
                                {formData.daysToPrepare > 1 
                                    ? `This will create leftovers for the next ${formData.daysToPrepare - 1} days.`
                                    : "No leftovers will be generated."}
                            </p>
                        </div>

                        {/* Recipe Type */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ChefHat size={14} className="text-orange-500" /> Recipe Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {(['main_only', 'main_and_side'] as RecipeType[]).map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setFormData({ ...formData, recipeType: type })}
                                        className={`p-4 border-2 rounded-2xl transition-all flex flex-col items-center text-center gap-2 ${formData.recipeType === type ? 'border-orange-500 bg-orange-50' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${formData.recipeType === type ? 'bg-orange-500 text-white' : 'bg-white text-gray-400'}`}>
                                            {type === 'main_only' ? <Utensils size={18} /> : <Layers size={18} />}
                                        </div>
                                        <span className={`text-xs font-black uppercase tracking-tight ${formData.recipeType === type ? 'text-orange-900' : 'text-gray-500'}`}>
                                            {type === 'main_only' ? 'Main Dish Only' : 'Main + Side Dish'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-orange-500" /> Reuse leftovers for
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {MEAL_TYPES.map(type => {
                                const isSelected = formData.applyToMeals.includes(type);
                                return (
                                    <button 
                                        key={type}
                                        onClick={() => toggleMealApplication(type)}
                                        className={`p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${isSelected ? 'border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100' : 'border-gray-50 bg-gray-50 hover:bg-white'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isSelected ? 'bg-orange-500 text-white' : 'bg-white text-gray-300'}`}>
                                            {type === 'breakfast' && '🍳'}
                                            {type === 'lunch' && '🥗'}
                                            {type === 'dinner' && '🍲'}
                                            {type === 'snack' && '🍎'}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-orange-900' : 'text-gray-500'}`}>
                                            {type}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {errors.applyToMeals && <p className="text-xs font-bold text-red-500 italic">{errors.applyToMeals}</p>}
                    </div>

                    <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 border-dashed flex items-start gap-4">
                        <Info size={24} className="text-orange-500 shrink-0" />
                        <div>
                            <h5 className="text-sm font-black text-orange-900 uppercase italic tracking-tight mb-1">Mapping Logic Info</h5>
                            <p className="text-xs font-bold text-orange-700 opacity-80 leading-relaxed">
                                Leftover patterns strictly follow the "Consumption Window" rule. Only future meals after the initial fresh cook will be marked as leftovers. 
                                The mapping will automatically stop at Saturday to prevent week-overflow desync.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CreatePatternModal;
