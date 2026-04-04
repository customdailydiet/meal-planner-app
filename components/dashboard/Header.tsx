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
    User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CalendarModal from "./CalendarModal";

export default function Header({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
    const [view, setView] = useState<"day" | "week">("day");
    const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
    const [date, setDate] = useState<Date | { start: Date; end: Date }>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [user, setUser] = useState<{ fullName: string } | null>(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system";
        if (storedTheme) setTheme(storedTheme);

        const storedDate = localStorage.getItem("selectedDate");
        if (storedDate) {
            try {
                const parsed = JSON.parse(storedDate);
                if (parsed.start && parsed.end) {
                    setDate({ start: new Date(parsed.start), end: new Date(parsed.end) });
                } else {
                    setDate(new Date(parsed));
                }
            } catch (e) {
                console.error("Failed to parse stored date:", e);
                setDate(new Date());
            }
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
        localStorage.removeItem("mealPlan");
        window.location.href = "/";
    };

    const handleDateSelect = (newDate: Date | { start: Date; end: Date }) => {
        setDate(newDate);
        localStorage.setItem("selectedDate", JSON.stringify(newDate));
    };

    const toggleTheme = (newTheme: "light" | "dark" | "system") => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const formatDate = (d: Date | { start: Date; end: Date }) => {
        if (d instanceof Date) {
            return d.toLocaleDateString("en-US", { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
            });
        } else {
            return `${d.start.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} - ${d.end.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}`;
        }
    };

    const isToday = (d: Date | { start: Date; end: Date }) => {
        if (!(d instanceof Date)) return false;
        const today = new Date();
        return d.getDate() === today.getDate() && 
               d.getMonth() === today.getMonth() && 
               d.getFullYear() === today.getFullYear();
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button 
                    onClick={toggleMobileMenu}
                    className="p-2 lg:hidden rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <Menu size={20} />
                </button>
                
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setView("day")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                            view === "day" 
                                ? "bg-white text-emerald-600 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => setView("week")}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                            view === "week" 
                                ? "bg-white text-emerald-600 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        Week
                    </button>
                </div>

                <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600">
                    <button className="p-1 hover:text-emerald-500 transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => setIsCalendarOpen(true)}
                        className="flex items-center space-x-2 px-2 text-xs font-bold min-w-[140px] justify-center hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                        <Calendar size={14} className="text-emerald-500" />
                        <span>{formatDate(date)}</span>
                        {isToday(date) && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] ml-2">TODAY</span>}
                    </button>
                    <button className="p-1 hover:text-emerald-500 transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => toggleTheme("light")}
                        className={`p-1.5 rounded-lg transition-all ${
                            theme === "light" 
                                ? "bg-white text-yellow-500 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Sun size={18} />
                    </button>
                    <button 
                        onClick={() => toggleTheme("dark")}
                        className={`p-1.5 rounded-lg transition-all ${
                            theme === "dark" 
                                ? "bg-white text-purple-600 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Moon size={18} />
                    </button>
                    <button 
                        onClick={() => toggleTheme("system")}
                        className={`p-1.5 rounded-lg transition-all ${
                            theme === "system" 
                                ? "bg-white text-slate-600 shadow-sm" 
                                : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                        <Monitor size={18} />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1"></div>

                <div className="hidden sm:flex flex-col items-end mr-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Active User</span>
                    <span className="text-xs font-black text-slate-800 leading-none">{user?.fullName || "Guest"}</span>
                </div>

                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
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
                currentDate={date instanceof Date ? date : date.start}
                onSelectDate={handleDateSelect}
            />
        </header>
    );
}
