"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { ToolItem } from "@/lib/admin/mock-data";
import { ConfigCard } from "@/components/admin/FormControls";
import { 
    Link, 
    Save, 
    AlertCircle, 
    RefreshCcw,
    CheckCircle2
} from "lucide-react";

export default function ToolSlugsPage() {
    const [tools, setTools] = useState<ToolItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        loadTools();
    }, []);

    const loadTools = async () => {
        const data = await mockApi.getTools();
        setTools(data);
        setLoading(false);
    };

    const handleUpdateSlug = (id: string, slug: string) => {
        setTools(prev => prev.map(t => t.id === id ? { ...t, slug } : t));
    };

    const handleSave = async (id: string) => {
        const tool = tools.find(t => t.id === id);
        if (!tool) return;
        setSaving(id);
        await mockApi.updateTool(id, { slug: tool.slug });
        setSaving(null);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Tool URL Slugs</h1>
                    <p className="text-slate-500 font-bold mt-2">Customize the URL structure for every tool in your platform for better SEO.</p>
                </div>
            </div>

            <div className="p-6 bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-[2rem] flex items-center gap-4 text-rose-600">
                <AlertCircle size={24} />
                <p className="text-sm font-black uppercase tracking-tight">Warning: Changing slugs will break existing user bookmarks and deep-links.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tools.map((tool) => (
                    <ConfigCard 
                        key={tool.id} 
                        title={tool.name}
                        description={`Internal ID: ${tool.id}`}
                        footer={
                            <div className="flex items-center gap-2">
                                <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                                    <RefreshCcw size={16} />
                                </button>
                                <button 
                                    onClick={() => handleSave(tool.id)}
                                    disabled={saving === tool.id}
                                    className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {saving === tool.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={14} />}
                                    {saving === tool.id ? "Saving..." : "Update Slug"}
                                </button>
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Custom URL Slug</label>
                            <div className="flex items-center">
                                <span className="px-5 py-3.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 border-r-0 rounded-l-2xl text-xs font-bold text-slate-400">
                                    yourdomain.com/tools/
                                </span>
                                <input 
                                    type="text" 
                                    value={tool.slug}
                                    onChange={(e) => handleUpdateSlug(tool.id, e.target.value)}
                                    className="flex-1 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-r-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-tight pt-2">
                                <CheckCircle2 size={12} />
                                Slug is valid and available
                            </div>
                        </div>
                    </ConfigCard>
                ))}
            </div>
        </div>
    );
}
