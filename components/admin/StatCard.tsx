"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: string;
        positive: boolean;
    };
    icon: LucideIcon;
    color: "brand-primary" | "brand-secondary" | "emerald" | "amber" | "rose";
}

const COLORS = {
    "brand-primary": "bg-brand-primary/10 text-brand-primary-dark dark:text-brand-primary border-brand-primary/20",
    "brand-secondary": "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

const ICON_COLORS = {
    "brand-primary": "bg-brand-primary",
    "brand-secondary": "bg-brand-secondary",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
};

export default function StatCard({ title, value, trend, icon: Icon, color }: StatCardProps) {
    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className={`p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border ${COLORS[color]} shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between h-full group transition-all`}
        >
            <div className="flex items-start justify-between">
                <div className={`p-4 ${ICON_COLORS[color]} rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${trend.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                        {trend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
}
