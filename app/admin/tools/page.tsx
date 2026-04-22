"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { ToolItem } from "@/lib/admin/mock-data";
import { ConfigCard, AdminToggle } from "@/components/admin/FormControls";
import { 
    Wrench, 
    GripVertical, 
    Link as LinkIcon, 
    Save, 
    Eye, 
    EyeOff,
    CheckCircle2
} from "lucide-react";
import { motion, Reorder } from "framer-motion";

export default function ToolsManagementPage() {
    const [tools, setTools] = useState<ToolItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadTools();
    }, []);

    const loadTools = async () => {
        const data = await mockApi.getTools();
        setTools(data.sort((a, b) => a.order - b.order));
        setLoading(false);
    };

    const handleToggleTool = async (id: string) => {
        const tool = tools.find(t => t.id === id);
        if (!tool) return;
        
        const nextState = !tool.enabled;
        setTools(prev => prev.map(t => t.id === id ? { ...t, enabled: nextState } : t));
        
        // Persist to mock-api immediately
        await mockApi.updateTool(id, { enabled: nextState });
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        await mockApi.reorderTools(tools.map(t => t.id));
        setTools(prev => prev.map((t, i) => ({ ...t, order: i + 1 })));
        setSaving(false);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Platform Tools</h1>
                    <p className="text-slate-500 font-bold mt-2">Enable, disable, and reorder the individual tools available to your users.</p>
                </div>
                <button 
                    onClick={handleSaveOrder}
                    disabled={saving}
                    className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                    {saving ? "Saving Order..." : "Save Tool Order"}
                </button>
            </div>

            <ConfigCard title="Active Tools Library" description="Drag the handles to rearrange tool priority on the frontend.">
                <Reorder.Group 
                    axis="y" 
                    values={tools} 
                    onReorder={setTools}
                    className="space-y-4"
                >
                    {tools.map((tool) => (
                        <Reorder.Item 
                            key={tool.id} 
                            value={tool}
                            className={`p-6 rounded-[2rem] border transition-all flex items-center gap-6 ${
                                tool.enabled 
                                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/20" 
                                    : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 opacity-60"
                            }`}
                        >
                            <div className="cursor-grab active:cursor-grabbing p-2 text-slate-300 dark:text-slate-700 hover:text-brand-primary transition-colors">
                                <GripVertical size={24} />
                            </div>
                            
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-brand-primary group">
                                <Wrench size={24} className="group-hover:rotate-45 transition-transform" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{tool.name}</h4>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">
                                        Order: {tool.order}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                        <LinkIcon size={12} />
                                        <span>/{tool.slug}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                                        {tool.enabled ? <CheckCircle2 size={12} /> : null}
                                        <span>{tool.enabled ? "Active" : "Disabled"}</span>
                                    </div>
                                </div>
                            </div>

                            <AdminToggle 
                                enabled={tool.enabled}
                                onChange={() => handleToggleTool(tool.id)}
                            />
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </ConfigCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-8 bg-brand-primary rounded-[2.5rem] text-white shadow-xl shadow-brand-primary/30">
                    <Eye size={32} className="mb-4" />
                    <h4 className="text-xl font-black uppercase italic tracking-tight">Visibility Tip</h4>
                    <p className="text-sm font-bold text-white/80 mt-2 leading-relaxed">Disabled tools will no longer appear in the sidebar or discovery pages for your users, but their configurations remain saved.</p>
                </div>
                {/* Placeholder for more tool-related stats/info */}
            </div>
        </div>
    );
}
