import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Target, Activity, Flame, Zap } from 'lucide-react';
import { NutritionTarget, CreateNutritionTargetInput } from '../../types/nutrition';

interface NutritionTargetEditorProps {
    isOpen: boolean;
    onClose: () => void;
    target: NutritionTarget | null;
    onSave: (input: CreateNutritionTargetInput) => void;
}

const NutritionTargetEditor: React.FC<NutritionTargetEditorProps> = ({ 
    isOpen, 
    onClose, 
    target, 
    onSave 
}) => {
    const [formData, setFormData] = useState<CreateNutritionTargetInput>({
        name: 'My Target',
        calories: 2000,
        carbsMin: 40,
        carbsMax: 60,
        fatsMin: 20,
        fatsMax: 35,
        proteinMin: 15,
        proteinMax: 25,
        fiber: 30,
        sodium: 2300,
        cholesterol: 300
    });

    useEffect(() => {
        if (target) {
            const { id, createdAt, ...rest } = target;
            setFormData(rest);
        }
    }, [target]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                            <Target size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Nutrition Targets</h2>
                            <p className="text-sm text-emerald-600 font-medium">Fine-tune your daily goals</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-600 shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
                    {/* General Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-3 outline-none transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Calories</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={formData.calories}
                                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl px-5 py-3 outline-none transition-all font-bold text-emerald-600"
                                />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">kcal</span>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Macros */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={14} className="text-emerald-500" /> Macro Distribution (%)
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-8">
                            {[
                                { label: 'Protein', minKey: 'proteinMin', maxKey: 'proteinMax', color: 'bg-blue-500', icon: '🥩' },
                                { label: 'Carbs', minKey: 'carbsMin', maxKey: 'carbsMax', color: 'bg-emerald-500', icon: '🍝' },
                                { label: 'Fats', minKey: 'fatsMin', maxKey: 'fatsMax', color: 'bg-orange-500', icon: '🥑' },
                            ].map((macro) => (
                                <div key={macro.label} className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{macro.icon}</span>
                                            <span className="font-bold text-gray-700">{macro.label}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-sm font-bold text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">
                                                {formData[macro.minKey as keyof CreateNutritionTargetInput]}% - {formData[macro.maxKey as keyof CreateNutritionTargetInput]}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData[macro.minKey as keyof CreateNutritionTargetInput] as number}
                                            onChange={(e) => setFormData({ ...formData, [macro.minKey]: Number(e.target.value) })}
                                            className="flex-1 accent-emerald-500"
                                        />
                                        <input 
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={formData[macro.maxKey as keyof CreateNutritionTargetInput] as number}
                                            onChange={(e) => setFormData({ ...formData, [macro.maxKey]: Number(e.target.value) })}
                                            className="flex-1 accent-emerald-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Micronutrients */}
                    <div className="space-y-6">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={14} className="text-indigo-500" /> Micronutrients
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400">Fiber (g)</label>
                                <input 
                                    type="number" 
                                    value={formData.fiber}
                                    onChange={(e) => setFormData({ ...formData, fiber: Number(e.target.value) })}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400">Sodium (mg)</label>
                                <input 
                                    type="number" 
                                    value={formData.sodium}
                                    onChange={(e) => setFormData({ ...formData, sodium: Number(e.target.value) })}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-8 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Save size={18} />
                        Save Targets
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NutritionTargetEditor;
