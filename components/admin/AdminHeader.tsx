"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, User, ChevronRight, Home } from "lucide-react";

export default function AdminHeader() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    return (
        <header className="h-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-slate-500">
                    <Home size={16} />
                </div>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    return (
                        <React.Fragment key={segment}>
                            <ChevronRight size={14} className="text-slate-300 dark:text-slate-700" />
                            <span className={`text-sm font-bold capitalize ${isLast ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-600"}`}>
                                {segment.replace(/-/g, " ")}
                            </span>
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-2xl w-64 border border-transparent focus-within:border-brand-primary/50 transition-all">
                    <Search size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 dark:text-slate-300 w-full placeholder:text-slate-400 font-sans"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-500 rounded-2xl hover:bg-brand-primary hover:text-white transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                    </button>
                    
                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

                    <button className="flex items-center gap-3 p-1.5 pr-4 bg-slate-100 dark:bg-slate-900 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all group">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-brand-primary/20">
                            AD
                        </div>
                        <div className="text-left hidden lg:block">
                            <p className="text-xs font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">Admin User</p>
                            <p className="text-[10px] font-bold text-slate-500 leading-tight">Super Admin</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
