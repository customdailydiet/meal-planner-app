"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: Date | { start: Date; end: Date }) => void;
    currentDate: Date;
    viewMode: "day" | "week";
}

export default function CalendarModal({ isOpen, onClose, onSelectDate, currentDate, viewMode }: CalendarModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
    const [range, setRange] = useState<{ start: Date; end: Date | null }>({ start: currentDate, end: null });
    const [monthOffset, setMonthOffset] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setSelectedDate(currentDate);
            setRange({ start: currentDate, end: null });
            setMonthOffset(0);
        }
    }, [isOpen, currentDate]);

    const displayMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const monthName = displayMonth.toLocaleString('default', { month: 'long' });
    const year = displayMonth.getFullYear();

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(year, displayMonth.getMonth(), day);
        
        if (viewMode === "day") {
            setSelectedDate(clickedDate);
            // In day mode, we can auto-apply or wait for 'Apply'
            // Let's wait for 'Apply' to match "Apply button" requirement
        } else {
            if (!range.start || (range.start && range.end)) {
                setRange({ start: clickedDate, end: null });
            } else {
                const start = range.start < clickedDate ? range.start : clickedDate;
                const end = range.start < clickedDate ? clickedDate : range.start;
                setRange({ start, end });
            }
        }
    };

    const handleApply = () => {
        if (viewMode === "day") {
            onSelectDate(selectedDate);
        } else {
            if (range.start && range.end) {
                onSelectDate({ start: range.start, end: range.end });
            } else if (range.start) {
                // If only start is selected, default to 7 days or just that day
                const end = new Date(range.start);
                end.setDate(end.getDate() + 6);
                onSelectDate({ start: range.start, end });
            }
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <CalendarIcon size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest leading-none mb-1">
                                    {viewMode === "day" ? "Select Date" : "Select Range"}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {viewMode === "day" ? "Pick a single day" : "Pick start and end date"}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="flex items-center justify-between mb-6">
                            <button 
                                onClick={() => setMonthOffset(prev => prev - 1)}
                                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest text-xs">
                                {monthName} {year}
                            </span>
                            <button 
                                onClick={() => setMonthOffset(prev => prev + 1)}
                                className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-slate-300 dark:text-slate-600 mb-2 uppercase tracking-widest">{d}</div>
                            ))}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {days.map(day => {
                                const d = new Date(year, displayMonth.getMonth(), day);
                                const dateStr = d.toISOString().split('T')[0];
                                
                                const isSelected = viewMode === "day" 
                                    ? selectedDate.toISOString().split('T')[0] === dateStr
                                    : (range.start.toISOString().split('T')[0] === dateStr || (range.end && range.end.toISOString().split('T')[0] === dateStr));
                                
                                const isInRange = viewMode === "week" && range.start && range.end && d > range.start && d < range.end;

                                return (
                                    <button 
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`group relative h-10 w-full rounded-xl text-xs font-black transition-all ${
                                            isSelected 
                                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none" 
                                                : isInRange 
                                                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
                                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                    >
                                        <span className="relative z-10">{day}</span>
                                        {isSelected && (
                                            <motion.div 
                                                layoutId="activeDay"
                                                className="absolute inset-0 bg-emerald-500 rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {viewMode === "week" && !range.end && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start space-x-3 text-blue-600 dark:text-blue-400">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] font-bold leading-relaxed uppercase tracking-wide">Select the end date to complete your custom planning range.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between sticky bottom-0">
                        <button 
                            onClick={onClose}
                            className="text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 uppercase tracking-widest px-4"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleApply}
                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200 dark:shadow-none transition-all flex items-center space-x-2"
                        >
                            <span>Apply</span>
                            <Check size={14} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
