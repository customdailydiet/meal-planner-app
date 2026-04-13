'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Save, ArrowLeft, Users, ChevronRight, Settings2, 
    Calendar, Heart, Plus, Search, CheckCircle2, AlertTriangle,
    CookingPot, Zap, Clock, Info, Loader2
} from 'lucide-react';
import { 
    Meal, MealSize, MealType, MealComplexity, FoodPreference, 
    CookingPreference, TimePreference, MacroFocus, SideDishPreference,
    MealPreferences, MealRecurring, MealAdvanced 
} from '../../types/meals';
import CategoryGrid from './CategoryGrid';
import MealSearchModal from './MealSearchModal';
import { useCollections } from '../../lib/hooks/useCollections';
import { FoodItem } from '../../lib/discover-db';

interface MealConfigurationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (meal: Omit<Meal, 'id' | 'weight' | 'percentage' | 'caloriesTarget' | 'proteinTarget' | 'carbsTarget' | 'fatsTarget'>) => void;
    initialData?: Meal;
    isDuplicateName: (name: string, excludeId?: string) => boolean;
}

type Tab = 'preferences' | 'recurring' | 'advanced';

const DEFAULT_MEAL: Omit<Meal, 'id' | 'weight' | 'percentage' | 'caloriesTarget' | 'proteinTarget' | 'carbsTarget' | 'fatsTarget'> = {
    name: '',
    size: 'normal',
    type: 'snack',
    familyMembers: 0,
    preferences: {
        foodTypes: 'all',
        cooking: 'can-cook',
        time: '< 30 min',
        complexity: 'moderate',
        categories: []
    },
    recurring: {
        onlyRecurring: false,
        applyFilters: true,
        foods: [],
        collections: []
    },
    advanced: {
        skip: false,
        macroFocus: 'no-preference',
        includeSideDish: 'auto'
    }
};

const MealConfigurationModal: React.FC<MealConfigurationModalProps> = ({ 
    isOpen, onClose, onSave, initialData, isDuplicateName 
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('preferences');
    const [formData, setFormData] = useState(DEFAULT_MEAL);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [errors, setErrors] = useState<{ name?: string }>({});

    const { collections } = useCollections();

    // Check for unsaved changes
    const hasChanges = useMemo(() => {
        const base = initialData ? { ...initialData } : DEFAULT_MEAL;
        return JSON.stringify(formData) !== JSON.stringify(base);
    }, [formData, initialData]);

    useEffect(() => {
        if (initialData) {
            const { id, weight, percentage, caloriesTarget, proteinTarget, carbsTarget, fatsTarget, ...rest } = initialData;
            setFormData(rest);
        } else {
            setFormData(DEFAULT_MEAL);
        }
    }, [initialData, isOpen]);

    const handleBackClick = () => {
        if (hasChanges) setShowUnsavedWarning(true);
        else onClose();
    };

    const validate = () => {
        const newErrors: { name?: string } = {};
        if (!formData.name.trim()) newErrors.name = "Meal title is required";
        else if (isDuplicateName(formData.name, initialData?.id)) newErrors.name = "A meal with this name already exists";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        
        setIsSaving(true);
        // Simulate loading for premium feel
        await new Promise(resolve => setTimeout(resolve, 800));
        onSave(formData);
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl"
            />

            <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.98 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Modal Header */}
                <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleBackClick}
                            className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:text-gray-600"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">
                                {initialData ? 'Edit Meal Setting' : 'Create Meal Setting'}
                            </h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Advanced Scheduler Engine</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleBackClick}
                            className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-3 px-10 py-4 bg-emerald-500 text-white rounded-[1.5rem] font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {initialData ? 'Update Meal' : 'Save Meal Setting'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left Sidebar: Main Fields */}
                    <div className="w-[380px] border-r border-gray-100 p-10 space-y-10 overflow-y-auto scrollbar-hide">
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Meal Title</label>
                            <div className="space-y-2">
                                <input 
                                    type="text" 
                                    placeholder="e.g. Protein Breakfast"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full bg-gray-50 border-2 rounded-[1.2rem] px-6 py-4 text-lg font-bold outline-none transition-all ${errors.name ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-emerald-500 focus:bg-white'}`}
                                />
                                {errors.name && <p className="text-xs font-bold text-red-500 px-2 italic">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Meal Size</label>
                                <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1.5 rounded-2xl">
                                    {(['tiny', 'normal', 'big'] as const).map(size => (
                                        <button 
                                            key={size}
                                            onClick={() => setFormData({ ...formData, size })}
                                            className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.size === size ? 'bg-white shadow-md text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Additional Family Members</label>
                                <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-[1.2rem]">
                                    <Users size={20} className="text-gray-400" />
                                    <input 
                                        type="number" 
                                        min="0"
                                        value={formData.familyMembers}
                                        onChange={(e) => setFormData({ ...formData, familyMembers: Math.max(0, parseInt(e.target.value) || 0) })}
                                        className="flex-1 bg-transparent border-none outline-none font-bold text-lg"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 italic px-2">Total portions: {formData.familyMembers + 1}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Tab System */}
                    <div className="flex-1 flex flex-col bg-gray-50/30">
                        {/* Tabs Navigation */}
                        <div className="px-10 pt-8 flex gap-10 border-b border-gray-100 bg-white">
                            {(['preferences', 'recurring', 'advanced'] as Tab[]).map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div 
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                            <AnimatePresence mode="wait">
                                {activeTab === 'preferences' && (
                                    <motion.div 
                                        key="preferences" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Preferred food types</label>
                                                <select 
                                                    value={formData.preferences.foodTypes}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, foodTypes: e.target.value as FoodPreference }})}
                                                    className="w-full bg-white border-2 border-gray-100 rounded-[1.2rem] px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                                >
                                                    <option value="all">Everywhere (All Types)</option>
                                                    <option value="veg">Vegetarian Focus</option>
                                                    <option value="non-veg">Non-Veg Focus</option>
                                                    <option value="vegan">Vegan Only</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Do you want to cook?</label>
                                                <select 
                                                    value={formData.preferences.cooking}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, cooking: e.target.value as CookingPreference }})}
                                                    className="w-full bg-white border-2 border-gray-100 rounded-[1.2rem] px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                                >
                                                    <option value="can-cook">Can cook</option>
                                                    <option value="no-cooking">No cooking (Raw/Prepared)</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Available time</label>
                                                <select 
                                                    value={formData.preferences.time}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, time: e.target.value as TimePreference }})}
                                                    className="w-full bg-white border-2 border-gray-100 rounded-[1.2rem] px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                                >
                                                    <option value="< 15 min">&lt; 15 min</option>
                                                    <option value="< 30 min">&lt; 30 min</option>
                                                    <option value="1 hour+">1 hour+</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Complexity</label>
                                                <select 
                                                    value={formData.preferences.complexity}
                                                    onChange={(e) => setFormData({ ...formData, preferences: { ...formData.preferences, complexity: e.target.value as MealComplexity }})}
                                                    className="w-full bg-white border-2 border-gray-100 rounded-[1.2rem] px-6 py-4 font-bold outline-none focus:border-emerald-500 transition-all appearance-none"
                                                >
                                                    <option value="simple">Simple</option>
                                                    <option value="moderate">Moderate</option>
                                                    <option value="complex">Complex</option>
                                                </select>
                                            </div>
                                        </div>

                                        <CategoryGrid 
                                            selected={formData.preferences.categories}
                                            onChange={(cats) => setFormData({ ...formData, preferences: { ...formData.preferences, categories: cats }})}
                                        />
                                    </motion.div>
                                )}

                                {activeTab === 'recurring' && (
                                    <motion.div 
                                        key="recurring" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-black text-sm uppercase tracking-tight">Only use recurring</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase italic">Restrict generation to selections</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setFormData({ ...formData, recurring: { ...formData.recurring, onlyRecurring: !formData.recurring.onlyRecurring }})}
                                                        className={`w-14 h-8 rounded-full transition-all relative ${formData.recurring.onlyRecurring ? 'bg-indigo-500 shadow-lg shadow-indigo-100' : 'bg-gray-200'}`}
                                                    >
                                                        <motion.div animate={{ x: formData.recurring.onlyRecurring ? 28 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
                                                    </button>
                                                </div>
                                                <hr className="border-gray-50" />
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-black text-sm uppercase tracking-tight">Apply meal filters</h4>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase italic">Run global rules on recurring</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => setFormData({ ...formData, recurring: { ...formData.recurring, applyFilters: !formData.recurring.applyFilters }})}
                                                        className={`w-14 h-8 rounded-full transition-all relative ${formData.recurring.applyFilters ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-gray-200'}`}
                                                    >
                                                        <motion.div animate={{ x: formData.recurring.applyFilters ? 28 : 4 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <button 
                                                    onClick={() => setIsSearchOpen(true)}
                                                    className="w-full group flex items-center justify-between p-8 bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] transition-all hover:bg-white hover:shadow-xl hover:shadow-indigo-100"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-all">
                                                            <Search size={28} />
                                                        </div>
                                                        <div className="text-left">
                                                            <h5 className="font-black text-indigo-900 leading-tight">Search Food</h5>
                                                            <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mt-1">{formData.recurring.foods.length} items added</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="text-indigo-200 group-hover:text-indigo-500 transition-all" size={24} />
                                                </button>

                                                <button 
                                                    className="w-full group flex items-center justify-between p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] transition-all hover:bg-white hover:shadow-xl hover:shadow-emerald-100"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:-rotate-6 transition-all">
                                                            <Plus size={28} />
                                                        </div>
                                                        <div className="text-left">
                                                            <h5 className="font-black text-emerald-900 leading-tight">Add Collection</h5>
                                                            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mt-1">{formData.recurring.collections.length} selected</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="text-emerald-200 group-hover:text-emerald-500 transition-all" size={24} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Recurring Foods List (Preview) */}
                                        {formData.recurring.foods.length > 0 && (
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Added Recurring Foods</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.recurring.foods.map(id => (
                                                        <div key={id} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold shadow-sm">
                                                            <span className="text-gray-900 flex-1 truncate max-w-[150px] italic">#{id.slice(0,5)}...</span>
                                                            <button 
                                                                onClick={() => setFormData({ ...formData, recurring: { ...formData.recurring, foods: formData.recurring.foods.filter(f => f !== id) }})}
                                                                className="text-red-400 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'advanced' && (
                                    <motion.div 
                                        key="advanced" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500">
                                                        <Clock size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-lg uppercase tracking-tight">Skip Generating</h4>
                                                        <p className="text-[11px] font-bold text-gray-400 uppercase italic tracking-widest mt-0.5">Keep this space empty in planner</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => setFormData({ ...formData, advanced: { ...formData.advanced, skip: !formData.advanced.skip }})}
                                                    className={`w-16 h-9 rounded-full transition-all relative ${formData.advanced.skip ? 'bg-gray-900 shadow-lg shadow-gray-200' : 'bg-gray-100'}`}
                                                >
                                                    <motion.div animate={{ x: formData.advanced.skip ? 32 : 4 }} className="absolute top-1 w-7 h-7 bg-white rounded-full shadow-sm" />
                                                </button>
                                            </div>

                                            <hr className="border-gray-50" />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Target size={14} className="text-emerald-500" /> Macronutrient Focus
                                                    </label>
                                                    <select 
                                                        value={formData.advanced.macroFocus}
                                                        onChange={(e) => setFormData({ ...formData, advanced: { ...formData.advanced, macroFocus: e.target.value as MacroFocus }})}
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl px-8 py-5 font-bold outline-none transition-all appearance-none text-gray-900"
                                                    >
                                                        <option value="no-preference">No preference (Balanced)</option>
                                                        <option value="more-protein">High Protein (Gain Muscle)</option>
                                                        <option value="less-carbs">Low Carb (Ketogenic Focus)</option>
                                                        <option value="less-fat">Low Fat (Classic Diet)</option>
                                                        <option value="no-carbs">Zero Carb (Carnivore/High Ketosis)</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Zap size={14} className="text-amber-500" /> Include a side dish
                                                    </label>
                                                    <select 
                                                        value={formData.advanced.includeSideDish}
                                                        onChange={(e) => setFormData({ ...formData, advanced: { ...formData.advanced, includeSideDish: e.target.value as SideDishPreference }})}
                                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-3xl px-8 py-5 font-bold outline-none transition-all appearance-none text-gray-900"
                                                    >
                                                        <option value="auto">Auto (System Decision)</option>
                                                        <option value="yes">Always Include Side</option>
                                                        <option value="no">Main Dish Only</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 border-dashed flex items-start gap-6">
                                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200">
                                                <Info size={24} />
                                            </div>
                                            <div>
                                                <h5 className="font-black text-emerald-900 uppercase italic tracking-tight mb-2">Architectural Logic</h5>
                                                <p className="text-xs font-bold text-emerald-700 leading-relaxed opacity-80">
                                                    Advanced settings override generic profile preferences for this specific meal slot. 
                                                    Macro focus will adjust the generator probability scores when picking recipes from the database.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Search Modal Overlay */}
                <MealSearchModal 
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    selectedIds={formData.recurring.foods}
                    onSelect={(food) => {
                        const foods = formData.recurring.foods.includes(food.id)
                            ? formData.recurring.foods.filter(f => f !== food.id)
                            : [...formData.recurring.foods, food.id];
                        setFormData({ ...formData, recurring: { ...formData.recurring, foods }});
                    }}
                />

                {/* Unsaved Changes Confirmation Modal */}
                <AnimatePresence>
                    {showUnsavedWarning && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center shadow-2xl overflow-hidden relative"
                            >
                                <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-amber-600">
                                    <AlertTriangle size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-4 underline decoration-amber-500 decoration-4 underline-offset-8">Discard changes?</h3>
                                <p className="text-sm font-bold text-gray-500 leading-relaxed mb-8">You have unsaved modifications in this meal setting. Are you sure you want to discard everything?</p>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => setShowUnsavedWarning(false)}
                                        className="w-full py-4 px-6 bg-gray-900 text-white rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                                    >
                                        Keep Editing
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowUnsavedWarning(false);
                                            onClose();
                                        }}
                                        className="w-full py-4 px-6 text-sm font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all"
                                    >
                                        Discard
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Success Overlay */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 z-[150] bg-emerald-500 flex flex-col items-center justify-center text-white p-10 text-center"
                        >
                            <motion.div 
                                animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                                transition={{ duration: 0.5 }}
                                className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center text-emerald-500 mb-8 shadow-2xl"
                            >
                                <CheckCircle2 size={64} />
                            </motion.div>
                            <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Meal Saved!</h3>
                            <p className="text-lg font-bold opacity-80 uppercase tracking-widest">Configuration Applied Successfully</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default MealConfigurationModal;
