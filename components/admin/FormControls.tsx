"use client";

import React from "react";
import { motion } from "framer-motion";

// --- Toggle Switch ---
export function AdminToggle({ enabled, onChange, label, description }: { enabled: boolean, onChange: (val: boolean) => void, label?: string, description?: string }) {
    return (
        <div className="flex items-center justify-between gap-6 group">
            {(label || description) && (
                <div className="flex flex-col">
                    {label && <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{label}</span>}
                    {description && <span className="text-xs font-bold text-slate-400 group-hover:text-slate-500 transition-colors">{description}</span>}
                </div>
            )}
            <button 
                onClick={() => onChange(!enabled)}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 border-2 ${
                    enabled 
                        ? "bg-brand-primary border-brand-primary-dark shadow-lg shadow-brand-primary/30" 
                        : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                }`}
            >
                <motion.div 
                    initial={false}
                    animate={{ 
                        x: enabled ? 24 : 0,
                    }}
                    className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md z-10 flex items-center justify-center text-[10px]"
                >
                    {enabled ? <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" /> : <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
                </motion.div>
            </button>
        </div>
    );
}

// --- Slider ---
export function AdminSlider({ value, min, max, step = 1, onChange, label, unit = "" }: { value: number, min: number, max: number, step?: number, onChange: (val: number) => void, label?: string, unit?: string }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {label && <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>}
                <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-lg text-xs font-black">
                    {value}{unit}
                </span>
            </div>
            <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
            />
        </div>
    );
}

// --- Card Wrapper ---
export function ConfigCard({ title, children, description, footer }: { title: string, children: React.ReactNode, description?: string, footer?: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{title}</h3>
                {description && <p className="text-xs font-bold text-slate-400 mt-1">{description}</p>}
            </div>
            <div className="flex-1 p-8 space-y-8">
                {children}
            </div>
            {footer && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    {footer}
                </div>
            )}
        </div>
    );
}
