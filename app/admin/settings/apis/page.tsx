"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { APIProvider } from "@/lib/admin/mock-data";
import { ConfigCard, AdminToggle } from "@/components/admin/FormControls";
import { 
    ShieldCheck, 
    Plus, 
    GripVertical, 
    Key, 
    Trash2, 
    Eye, 
    EyeOff,
    Cpu,
    Zap,
    Terminal,
    Bot
} from "lucide-react";
import { motion, Reorder } from "framer-motion";

export default function APIManagementPage() {
    const [apis, setApis] = useState<APIProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showKey, setShowKey] = useState<string | null>(null);

    useEffect(() => {
        mockApi.getAPIs().then(val => {
            setApis(val.sort((a, b) => a.priority - b.priority));
            setLoading(false);
        });
    }, []);

    const handleToggleAPI = async (id: string) => {
        const api = apis.find(a => a.id === id);
        if (!api) return;
        
        const nextState = !api.enabled;
        setApis(prev => prev.map(a => a.id === id ? { ...a, enabled: nextState } : a));
        
        // Persist immediately
        await mockApi.updateAPI(id, { enabled: nextState });
    };

    const handleSaveOrder = async () => {
        setSaving(true);
        const reordered = await mockApi.reorderAPIs(apis);
        setApis(reordered);
        setSaving(false);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">API Management</h1>
                    <p className="text-slate-500 font-bold mt-2">Manage your AI providers, keys, and model fallback priorities.</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={20} />
                    Add Provider
                </button>
            </div>

            <ConfigCard 
                title="Active Providers" 
                description="Drag to set priority. The system will use providers in this exact order for fallback logic."
                footer={
                    <button 
                        onClick={handleSaveOrder}
                        disabled={saving}
                        className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                        {saving ? "Saving Changes..." : "Save Configuration"}
                    </button>
                }
            >
                <Reorder.Group axis="y" values={apis} onReorder={setApis} className="space-y-6">
                    {apis.map((api) => (
                        <Reorder.Item 
                            key={api.id} 
                            value={api}
                            className={`p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row md:items-center gap-8 ${
                                api.enabled 
                                    ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40" 
                                    : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-900 opacity-60"
                            }`}
                        >
                            <div className="flex items-center gap-6 flex-1">
                                <div className="cursor-grab active:cursor-grabbing p-2 text-slate-300 dark:text-slate-700 hover:text-brand-primary">
                                    <GripVertical size={24} />
                                </div>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                                    api.name.toLowerCase().includes('openai') ? "bg-emerald-600" :
                                    api.name.toLowerCase().includes('anthropic') ? "bg-amber-600" :
                                    api.name.toLowerCase().includes('groq') ? "bg-brand-secondary" : "bg-slate-900"
                                }`}>
                                    {api.name.toLowerCase().includes('openai') ? <Zap size={24} /> :
                                     api.name.toLowerCase().includes('anthropic') ? <Cpu size={24} /> :
                                     api.name.toLowerCase().includes('groq') ? <Terminal size={24} /> : <Bot size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{api.name}</h4>
                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority {api.priority}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tight">Default Model: <span className="text-slate-900 dark:text-white">{api.model}</span></p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="relative group min-w-[300px]">
                                    <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl w-full">
                                        <Key size={18} className="text-slate-300" />
                                        <input 
                                            type={showKey === api.id ? "text" : "password"} 
                                            value={api.key} 
                                            readOnly 
                                            className="bg-transparent border-none outline-none text-sm font-black text-slate-700 dark:text-slate-300 w-full"
                                        />
                                        <button 
                                            onClick={() => setShowKey(showKey === api.id ? null : api.id)}
                                            className="text-slate-300 hover:text-brand-primary transition-colors"
                                        >
                                            {showKey === api.id ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
                                        <Trash2 size={20} />
                                    </button>
                                    <AdminToggle 
                                        enabled={api.enabled}
                                        onChange={() => handleToggleAPI(api.id)}
                                    />
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </ConfigCard>

            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                    <ShieldCheck size={40} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Security Protocol</h3>
                    <p className="text-slate-500 font-bold mt-2 max-w-xl mx-auto leading-relaxed">
                        API keys are stored using industry-standard AES-256 encryption. They are never exposed to the frontend in a production environment and are decrypted only at the edge during LLM synthesis.
                    </p>
                </div>
            </div>
        </div>
    );
}
