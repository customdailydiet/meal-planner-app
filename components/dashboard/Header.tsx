"use client";

import { useState, useEffect } from "react";
import { 
    ChevronLeft, 
    ChevronRight, 
    Calendar, 
    Sun, 
    Moon, 
    Monitor,
    Menu,
    Search,
    Bell,
    LogOut,
    User as UserIcon,
    Sparkles,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CalendarModal from "./CalendarModal";

interface HeaderProps {
    toggleMobileMenu: () => void;
    viewMode: "day" | "week";
    setViewMode: (mode: "day" | "week") => void;
    selectedDate: Date | { start: Date; end: Date | null };
    onDateChange: (date: Date | { start: Date; end: Date }) => void;
    theme: "light" | "dark" | "system";
    onThemeChange: (theme: "light" | "dark" | "system") => void;
    isProcessing: boolean;
}

export default function Header({ 
    toggleMobileMenu, 
    viewMode, 
    setViewMode, 
    selectedDate, 
    onDateChange,
    theme,
    onThemeChange,
    isProcessing
}: HeaderProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [user, setUser] = useState<{ fullName: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const formatDate = (d: Date | { start: Date; end: Date | null }) => {
        if (!mounted) return "Loading...";
        if (d instanceof Date) {
            return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
            const start = d.start.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
            const end = d.end ? d.end.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "Select End";
            return `${start} - ${end}`;
        }
    };

    const isToday = (d: Date | { start: Date; end: Date | null }) => {
        if (!(d instanceof Date)) return false;
        const today = new Date();
        return d.getDate() === today.getDate() && 
               d.getMonth() === today.getMonth() && 
               d.getFullYear() === today.getFullYear();
    };

    const nextDate = () => {
        if (isProcessing) return;
        const current = selectedDate instanceof Date ? selectedDate : selectedDate.start;
        const next = new Date(current);
        next.setDate(next.getDate() + (viewMode === "day" ? 1 : 7));
        onDateChange(next);
    };

    const prevDate = () => {
        if (isProcessing) return;
        const current = selectedDate instanceof Date ? selectedDate : selectedDate.start;
        const prev = new Date(current);
        prev.setDate(prev.getDate() - (viewMode === "day" ? 1 : 7));
        onDateChange(prev);
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between transition-colors">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={toggleMobileMenu}
                    className="p-2 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                    <Menu size={20} />
                </button>
                
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode("day")}
                        disabled={isProcessing}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                            viewMode === "day" 
                                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50"
                        }`}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => setViewMode("week")}
                        disabled={isProcessing}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                            viewMode === "week" 
                                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 disabled:opacity-50"
                        }`}
                    >
                        Week
                    </button>
                </div>

                <div className="hidden md:flex items-center space-x-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-xl">
                    <button 
                        onClick={prevDate}
                        disabled={isProcessing}
                        className="p-1 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => !isProcessing && setIsCalendarOpen(true)}
                        className="flex items-center space-x-3 px-3 py-1 text-[10px] font-black min-w-[160px] justify-center hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer uppercase tracking-[0.15em] border-x border-slate-100 dark:border-slate-800/50"
                    >
                        {isProcessing ? (
                            <Loader2 size={14} className="animate-spin text-emerald-500" />
                        ) : (
                            <Calendar size={14} className="text-emerald-500" />
                        )}
                        <span>{formatDate(selectedDate)}</span>
                        {mounted && isToday(selectedDate) && (
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        )}
                    </button>
                    <button 
                        onClick={nextDate}
                        disabled={isProcessing}
                        className="p-1 text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors disabled:opacity-50"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                        onClick={() => onThemeChange("light")}
                        className={`p-1.5 rounded-lg transition-all ${
                            theme === "light" 
                                ? "bg-white dark:bg-slate-700 text-yellow-500 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                        <Sun size={18} />
                    </button>
                    <button 
                        onClick={() => onThemeChange("dark")}
                        className={`p-1.5 rounded-lg transition-all ${
                            theme === "dark" 
                                ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                        <Moon size={18} />
                    </button>
                    <button 
                        onClick={() => onThemeChange("system")}
                        className={`p-1.5 rounded-lg transition-all ${
                            theme === "system" 
                                ? "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                    >
                        <Monitor size={18} />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1"></div>

                <AnimatePresence mode="wait">
                    {mounted && user ? (
                        <motion.div 
                            key="user"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="hidden sm:flex flex-col items-end mr-1"
                        >
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Performance Hub</span>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{user.fullName}</span>
                        </motion.div>
                    ) : (
                        <div className="hidden sm:flex flex-col items-end mr-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session</span>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Guest</span>
                        </div>
                    )}
                </AnimatePresence>

                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <Bell size={18} />
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <CalendarModal 
                isOpen={isCalendarOpen} 
                onClose={() => setIsCalendarOpen(false)} 
                currentDate={selectedDate instanceof Date ? selectedDate : selectedDate.start}
                onSelectDate={onDateChange}
                viewMode={viewMode}
            />
        </header>
    );
}
