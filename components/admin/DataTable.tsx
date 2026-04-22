"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Column {
    key: string;
    label: string;
    render?: (item: any) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    searchPlaceholder?: string;
    actions?: (item: any) => React.ReactNode;
    title?: string;
    onRowClick?: (item: any) => void;
}

export default function DataTable({ columns, data, searchPlaceholder = "Search...", actions, title, onRowClick }: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter and Sort implementation
    const filteredData = data.filter(item => 
        Object.values(item).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                {title && <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{title}</h2>}
                
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto -mx-8">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/50">
                            {columns.map((col) => (
                                <th 
                                    key={col.key} 
                                    className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 dark:hover:text-slate-200 transition-all group"
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        {col.sortable && <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                </th>
                            ))}
                            {actions && <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                        <AnimatePresence mode="popLayout">
                            {paginatedData.map((item, idx) => (
                                <motion.tr 
                                    key={item.id || idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => onRowClick?.(item)}
                                    className={`group transition-all ${onRowClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950" : ""}`}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-8 py-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {col.render ? col.render(item) : item[col.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            {actions(item)}
                                        </td>
                                    )}
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Showing <span className="text-slate-900 dark:text-white">{(currentPage-1)*itemsPerPage + 1}-{Math.min(currentPage*itemsPerPage, sortedData.length)}</span> of <span className="text-slate-900 dark:text-white">{sortedData.length}</span>
                </p>
                <div className="flex items-center gap-3">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-30 hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-transparent hover:shadow-brand-primary/20"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button 
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-11 h-11 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${
                                    currentPage === i + 1 
                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30" 
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-30 hover:bg-brand-primary hover:text-white transition-all shadow-lg shadow-transparent hover:shadow-brand-primary/20"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
