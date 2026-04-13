'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, Layers, Calendar, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { useLeftovers } from '../../../../lib/hooks/useLeftovers';
import CreatePatternModal from '../../../../components/meals-schedule/CreatePatternModal';
import PatternList from '../../../../components/meals-schedule/PatternList';
import LeftoverGrid from '../../../../components/meals-schedule/LeftoverGrid';
import { LeftoverPattern } from '../../../../types/meals';

export default function LeftoversPage() {
    const { 
        isEnabled, 
        patterns, 
        gridData, 
        isLoaded, 
        toggleSystem, 
        addPattern, 
        updatePattern, 
        deletePattern 
    } = useLeftovers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPattern, setEditingPattern] = useState<LeftoverPattern | undefined>();

    const handleOpenCreate = () => {
        setEditingPattern(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (pattern: LeftoverPattern) => {
        setEditingPattern(pattern);
        setIsModalOpen(true);
    };

    const handleSavePattern = (data: Omit<LeftoverPattern, 'id' | 'createdAt'>) => {
        if (editingPattern) {
            updatePattern(editingPattern.id, data);
        } else {
            addPattern(data);
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="p-6 lg:p-10 space-y-10">
            {/* Header Control Panel */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700 opacity-50" />
                
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 bg-orange-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-orange-100">
                        <RefreshCw size={36} className="animate-[spin_6s_linear_infinite]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Leftover Patterns</h2>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                {isEnabled ? 'Active' : 'Disabled'}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest italic opacity-80">Automated Reuse & Batch Cooking System</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-3xl border border-gray-100">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-tight">System Status</label>
                        <button 
                            onClick={() => toggleSystem(!isEnabled)}
                            className={`relative w-14 h-8 rounded-full transition-all duration-300 ${isEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-gray-300'}`}
                        >
                            <motion.div 
                                animate={{ x: isEnabled ? 28 : 4 }}
                                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>

                    <button 
                        onClick={handleOpenCreate}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-3xl font-bold shadow-2xl shadow-gray-200 hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                        New Pattern
                    </button>
                </div>
            </div>

            {/* Empty State vs Pattern List */}
            <AnimatePresence mode="wait">
                {!isEnabled ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-100/50 rounded-[4rem] border-4 border-dashed border-gray-200 p-20 text-center space-y-6"
                    >
                         <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200 shadow-sm">
                            <AlertCircle size={48} />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">System Deactivated</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Enable the Leftover Patterns system from the top toggle to start automating your meal reuse plan.
                            </p>
                        </div>
                    </motion.div>
                ) : patterns.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-[4rem] border-4 border-dashed border-gray-100 p-20 text-center space-y-6"
                    >
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-300 shadow-inner">
                            <Layers size={48} />
                        </div>
                        <div className="max-w-md mx-auto space-y-2">
                            <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">No Configured Patterns</h3>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                You haven't configured any leftovers. Create a pattern to automatically map batch-cooked meals across your week.
                            </p>
                        </div>
                        <button 
                            onClick={handleOpenCreate}
                            className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 hover:scale-105 active:scale-95"
                        >
                            Add Your First Pattern
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        <PatternList 
                            patterns={patterns}
                            onEdit={handleOpenEdit}
                            onDelete={deletePattern}
                        />

                        <LeftoverGrid 
                            data={gridData}
                            isEnabled={isEnabled}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info Section */}
            {isEnabled && patterns.length > 0 && (
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start gap-6">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                            <Info size={28} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-gray-900 uppercase italic tracking-tight mb-2">Weekly Distribution Logic</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed opacity-80">
                                The grid reflects Sunday to Saturday meal slots. Fresh cooking events are marked in Emerald, while reused leftovers are highlighted in Orange. Overlapping patterns are resolved by "Latest Wins" priority.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CreatePatternModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePattern}
                initialData={editingPattern}
            />
        </div>
    );
}
