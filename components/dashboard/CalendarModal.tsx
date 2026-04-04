"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check } from "lucide-react";

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: Date | { start: Date; end: Date }) => void;
    currentDate: Date;
}

export default function CalendarModal({ isOpen, onClose, onSelectDate, currentDate }: CalendarModalProps) {
    const [selectedType, setSelectedType] = useState<"single" | "range">("single");
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
    const [range, setRange] = useState<{ start: Date; end: Date | null }>({ start: currentDate, end: null });

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const handleDateClick = (day: number) => {
        const d = new Date(currentYear, currentDate.getMonth(), day);
        if (selectedType === "single") {
            setSelectedDate(d);
            onSelectDate(d);
            onClose();
        } else {
            if (!range.start || (range.start && range.end)) {
                setRange({ start: d, end: null });
            } else {
                const start = range.start < d ? range.start : d;
                const end = range.start < d ? d : range.start;
                setRange({ start, end });
                onSelectDate({ start, end });
                onClose();
            }
        }
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
                    className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                                <CalendarIcon size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Select Date</h3>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 bg-slate-50 flex space-x-2">
                        <button 
                            onClick={() => setSelectedType("single")}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                                selectedType === "single" 
                                    ? "bg-white text-emerald-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Single Day
                        </button>
                        <button 
                            onClick={() => setSelectedType("range")}
                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                                selectedType === "range" 
                                    ? "bg-white text-emerald-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Date Range
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button className="p-1 text-slate-400 hover:text-slate-600">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="font-bold text-slate-800 text-sm">
                                {currentMonth} {currentYear}
                            </span>
                            <button className="p-1 text-slate-400 hover:text-slate-600">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-slate-400 mb-2">{d}</div>
                            ))}
                            {days.map(day => {
                                const d = new Date(currentYear, currentDate.getMonth(), day);
                                const isSelected = selectedType === "single" 
                                    ? selectedDate.getDate() === day
                                    : (range.start.getDate() === day || (range.end && range.end.getDate() === day));
                                
                                const isInRange = selectedType === "range" && range.end && d > range.start && d < range.end;

                                return (
                                    <button 
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        className={`h-10 w-full rounded-xl text-sm font-bold transition-all relative ${
                                            isSelected 
                                                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                                                : isInRange 
                                                    ? "bg-emerald-50" 
                                                    : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        {day}
                                        {isSelected && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <button 
                            onClick={onClose}
                            className="text-sm font-bold text-slate-400 hover:text-slate-600"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 flex items-center space-x-2"
                        >
                            <span>Apply</span>
                            <Check size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
