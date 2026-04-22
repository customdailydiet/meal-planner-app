"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { SaaSConfig, INITIAL_TOOLS } from "@/lib/admin/mock-data";
import { ConfigCard, AdminToggle } from "@/components/admin/FormControls";
import { 
    CreditCard, 
    Save, 
    Lock, 
    DollarSign, 
    Calendar, 
    Zap, 
    CheckSquare,
    Square
} from "lucide-react";

export default function SaaSManagementPage() {
    const [config, setConfig] = useState<SaaSConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        mockApi.getSaaSConfig().then(val => {
            setConfig(val);
            setLoading(false);
        });
    }, []);

    const handleTogglePremiumTool = (toolSlug: string) => {
        if (!config) return;
        const current = config.premiumTools;
        const next = current.includes(toolSlug)
            ? current.filter(s => s !== toolSlug)
            : [...current, toolSlug];
        setConfig({ ...config, premiumTools: next });
    };

    const handleSave = async () => {
        if (!config) return;
        setSaving(true);
        await mockApi.updateSaaSConfig(config);
        setSaving(false);
    };

    if (loading || !config) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">SaaS & Subscriptions</h1>
                    <p className="text-slate-500 font-bold mt-2">Manage pricing, subscription status, and premium feature locking.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                    {saving ? "Saving Config..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pricing Config */}
                <div className="space-y-8">
                    <ConfigCard title="Pricing & Logic" description="Global subscription toggle and pricing points">
                        <div className="space-y-8">
                            <AdminToggle 
                                label="Enable Subscriptions"
                                description="When disabled, all users get full access for free."
                                enabled={config.subscriptionEnabled}
                                onChange={async (val) => {
                                    const next = { ...config, subscriptionEnabled: val };
                                    setConfig(next);
                                    await mockApi.updateSaaSConfig(next);
                                }}
                            />

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Monthly Price ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="number" 
                                            value={config.monthlyPrice}
                                            onChange={(e) => setConfig({ ...config, monthlyPrice: Number(e.target.value) })}
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Yearly Price ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="number" 
                                            value={config.yearlyPrice}
                                            onChange={(e) => setConfig({ ...config, yearlyPrice: Number(e.target.value) })}
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-amber-50 dark:bg-amber-500/5 rounded-[2rem] border border-amber-100 dark:border-amber-500/10 flex items-start gap-4">
                                <Zap className="text-amber-500 mt-1 shrink-0" size={24} />
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-500 leading-relaxed uppercase tracking-tight">
                                    Note: Stripe or PayPal integration targets can be defined in the .env file. The admin UI handles logic overrides.
                                </p>
                            </div>
                        </div>
                    </ConfigCard>
                </div>

                {/* Feature Locking */}
                <div className="space-y-8">
                    <ConfigCard title="Feature Locking" description="Select which tools require a 'Paid' plan">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Premium Tool Selection</label>
                            <div className="grid grid-cols-1 gap-3">
                                {INITIAL_TOOLS.map((tool) => {
                                    const isLocked = config.premiumTools.includes(tool.slug);
                                    return (
                                        <button 
                                            key={tool.id}
                                            onClick={() => handleTogglePremiumTool(tool.slug)}
                                            className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                                                isLocked 
                                                    ? "bg-brand-primary border-brand-primary-dark text-white shadow-lg shadow-brand-primary/20" 
                                                    : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-brand-primary/50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {isLocked ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-300 dark:text-slate-700" />}
                                                <span className="text-sm font-black uppercase italic tracking-tight">{tool.name}</span>
                                            </div>
                                            <div className={`p-2 rounded-lg transition-all ${isLocked ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-900 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"}`}>
                                                <Lock size={16} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </ConfigCard>
                </div>
            </div>
        </div>
    );
}
