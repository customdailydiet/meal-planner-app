"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { AIConfig } from "@/lib/admin/mock-data";
import { ConfigCard, AdminToggle, AdminSlider } from "@/components/admin/FormControls";
import { Cpu, Save, Terminal, RotateCcw, AlertTriangle } from "lucide-react";

export default function AIConfigPage() {
    const [configs, setConfigs] = useState<AIConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        loadConfigs();
    }, []);

    const loadConfigs = async () => {
        const data = await mockApi.getAIConfigs();
        setConfigs(data);
        setLoading(false);
    };

    const handleUpdate = async (id: string, updates: Partial<AIConfig>) => {
        setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        
        // If it's a toggle update, persist immediately for UX consistency
        if ('enabled' in updates) {
            const config = configs.find(c => c.id === id);
            if (config) {
                await mockApi.updateAIConfig(id, { ...config, ...updates });
            }
        }
    };

    const handleSave = async (id: string) => {
        const config = configs.find(c => c.id === id);
        if (!config) return;
        setSaving(id);
        await mockApi.updateAIConfig(id, config);
        setSaving(null);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">AI Engine Configuration</h1>
                    <p className="text-slate-500 font-bold mt-2">Fine-tune the behavior, prompts, and model parameters for every AI feature.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-amber-600">
                        <AlertTriangle size={18} />
                        <span className="text-xs font-black uppercase tracking-tight">Changes affect all users immediately</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {configs.map((config) => (
                    <ConfigCard 
                        key={config.id} 
                        title={config.feature}
                        description={`System ID: ${config.id}`}
                        footer={
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                    <RotateCcw size={14} />
                                    Reset to Default
                                </button>
                                <button 
                                    onClick={() => handleSave(config.id)}
                                    disabled={saving === config.id}
                                    className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {saving === config.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={14} />}
                                    {saving === config.id ? "Saving..." : "Save Config"}
                                </button>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Prompt Engineering */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Terminal size={18} className="text-brand-primary" />
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">System Prompt Template</label>
                                    </div>
                                    <AdminToggle 
                                        enabled={config.enabled}
                                        onChange={(val) => handleUpdate(config.id, { enabled: val })}
                                    />
                                </div>
                                <textarea 
                                    value={config.prompt}
                                    onChange={(e) => handleUpdate(config.id, { prompt: e.target.value })}
                                    className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all resize-none leading-relaxed"
                                    placeholder="Enter system instructions..."
                                />
                                <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 text-[10px] font-bold text-brand-primary leading-relaxed uppercase tracking-tight">
                                    TIP: Use variables like {"{goal}"}, {"{age}"}, or {"{preferences}"} to inject user data dynamically during synthesis.
                                </div>
                            </div>

                            {/* Model Parameters */}
                            <div className="space-y-10 py-2">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Model Selection</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['gpt-4o', 'gpt-4o-mini', 'llama-3.3-70b', 'claude-3-5-sonnet'].map(model => (
                                            <button 
                                                key={model}
                                                onClick={() => handleUpdate(config.id, { model })}
                                                className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                                                    config.model === model 
                                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl" 
                                                        : "bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-brand-primary"
                                                }`}
                                            >
                                                {model}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <AdminSlider 
                                    label="Creativity (Temperature)"
                                    min={0}
                                    max={1.5}
                                    step={0.1}
                                    value={config.temperature}
                                    onChange={(val) => handleUpdate(config.id, { temperature: val })}
                                    unit=""
                                />

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Model Capabilities</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['JSON Output', 'Streaming', 'Vision', 'Function Calling'].map(cap => (
                                            <span key={cap} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight border border-slate-200/50 dark:border-slate-700/50">
                                                {cap}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ConfigCard>
                ))}
            </div>
        </div>
    );
}
