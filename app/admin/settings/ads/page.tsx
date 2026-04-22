"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { AdConfig } from "@/lib/admin/mock-data";
import { ConfigCard, AdminToggle } from "@/components/admin/FormControls";
import { 
    Megaphone, 
    Save, 
    Monitor, 
    Smartphone, 
    Layout, 
    MousePointerClick,
    AlertCircle
} from "lucide-react";

export default function AdsManagementPage() {
    const [ads, setAds] = useState<AdConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        mockApi.getAds().then(val => {
            setAds(val);
            setLoading(false);
        });
    }, []);

    const handleUpdate = async (id: string, updates: Partial<AdConfig>) => {
        setAds(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
        
        // Persist toggles immediately
        if ('enabled' in updates) {
            const ad = ads.find(a => a.id === id);
            if (ad) {
                await mockApi.updateAd(id, { ...ad, ...updates });
            }
        }
    };

    const handleSave = async (id: string) => {
        const ad = ads.find(a => a.id === id);
        if (!ad) return;
        setSaving(id);
        await mockApi.updateAd(id, ad);
        setSaving(null);
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    const getIcon = (id: string) => {
        switch(id) {
            case 'header': return Monitor;
            case 'footer': return Layout;
            case 'sidebar': return Smartphone;
            case 'popup': return MousePointerClick;
            default: return Megaphone;
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Ads Management</h1>
                    <p className="text-slate-500 font-bold mt-2">Configure advertisement placements, codes, and visibility across the platform.</p>
                </div>
            </div>

            <div className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-[2rem] flex items-center gap-4 text-brand-primary">
                <AlertCircle size={24} />
                <p className="text-sm font-black uppercase tracking-tight">Pro Tip: Paid users will automatically have all advertisements stripped from their UI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {ads.map((ad) => {
                    const Icon = getIcon(ad.id);
                    return (
                        <ConfigCard 
                            key={ad.id} 
                            title={ad.name}
                            description={`Placement: ${ad.id.toUpperCase()}`}
                            footer={
                                <button 
                                    onClick={() => handleSave(ad.id)}
                                    disabled={saving === ad.id}
                                    className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {saving === ad.id ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={14} />}
                                    {saving === ad.id ? "Saving..." : "Save Code"}
                                </button>
                            }
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-brand-primary"><Icon size={20} /></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toggle Placement</span>
                                    </div>
                                    <AdminToggle 
                                        enabled={ad.enabled}
                                        onChange={(val) => handleUpdate(ad.id, { enabled: val })}
                                    />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ad HTML/Script Code</label>
                                    <textarea 
                                        value={ad.code}
                                        onChange={(e) => handleUpdate(ad.id, { code: e.target.value })}
                                        className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all resize-none"
                                        placeholder="Paste your ad network code here..."
                                    />
                                </div>
                            </div>
                        </ConfigCard>
                    );
                })}
            </div>
        </div>
    );
}
