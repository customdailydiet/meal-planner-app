"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Sidebar */}
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader />
                
                <main className="flex-1 p-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>

                {/* Optional Admin Footer */}
                <footer className="px-8 py-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <div>© 2026 CustomDailyDiet Admin</div>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-brand-primary transition-colors">Support</a>
                        <a href="#" className="hover:text-brand-primary transition-colors">Documentation</a>
                        <span className="text-slate-300 dark:text-slate-700">v1.2.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
