"use client";

import React, { useEffect, useState } from "react";
import { mockApi } from "@/lib/admin/mock-api";
import { AdminSettings } from "@/lib/admin/mock-data";
import { ConfigCard, AdminToggle } from "@/components/admin/FormControls";
import { 
    Settings, 
    Save, 
    Layout, 
    Image as ImageIcon, 
    Palette, 
    Code,
    Sparkles,
    Sun,
    Moon
} from "lucide-react";

export default function GeneralSettingsPage() {
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        mockApi.getSettings().then(val => {
            setSettings(val);
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        await mockApi.updateSettings(settings);
        setSaving(false);
    };

    if (loading || !settings) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">General Settings</h1>
                    <p className="text-slate-500 font-bold mt-2">Manage your platform identity, branding, and global layout options.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                    {saving ? "Saving Config..." : "Save All Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Branding Section */}
                <div className="lg:col-span-2 space-y-10">
                    <ConfigCard title="Identity & Branding" description="Configure site name and logo options">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Site Name</label>
                                <input 
                                    type="text" 
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Site Description</label>
                                <input 
                                    type="text" 
                                    value={settings.description}
                                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-10 py-6 border-t border-slate-100 dark:border-slate-800/50 mt-6">
                            <div className="w-48 h-32 bg-slate-100 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 group cursor-pointer hover:border-brand-primary transition-all">
                                <ImageIcon size={32} className="group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-tight mt-2">Update Logo</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">App Logo (Recommended)</h4>
                                <p className="text-xs font-bold text-slate-400">Upload a high-quality SVG or PNG (transparent). Max size: 2MB.</p>
                                <div className="flex items-center gap-3 mt-4">
                                    <button className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20">Upload File</button>
                                    <button className="px-5 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Remove</button>
                                </div>
                            </div>
                        </div>
                    </ConfigCard>

                    <ConfigCard title="Custom Injection" description="Inject global CSS or JS snippets into your platform templates">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Palette size={20} className="text-brand-primary" />
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom CSS</label>
                                </div>
                                <textarea 
                                    value={settings.customCss}
                                    onChange={(e) => setSettings({ ...settings, customCss: e.target.value })}
                                    className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all resize-none"
                                    placeholder="/* Add your custom CSS variables or overrides */"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Code size={20} className="text-emerald-500" />
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Header Script (JS)</label>
                                </div>
                                <textarea 
                                    value={settings.customJs}
                                    onChange={(e) => setSettings({ ...settings, customJs: e.target.value })}
                                    className="w-full h-32 p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all resize-none"
                                    placeholder="// Paste your tracking scripts or analytics snippets"
                                />
                            </div>
                        </div>
                    </ConfigCard>
                </div>

                {/* Appearance Sidebar */}
                <div className="lg:col-span-1 space-y-10">
                    <ConfigCard title="Appearance" description="Default theme for new visitors">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => {
                                        const nextTheme = 'light';
                                        setSettings({ ...settings, theme: nextTheme });
                                        document.documentElement.classList.remove('dark');
                                        localStorage.setItem('theme', nextTheme);
                                    }}
                                    className={`relative p-8 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 ${
                                        settings.theme === 'light' 
                                            ? "bg-white border-brand-primary text-slate-900 shadow-xl shadow-brand-primary/10" 
                                            : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400"
                                    }`}
                                >
                                    <Sun size={32} className={settings.theme === 'light' ? 'text-brand-primary' : ''} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Light</span>
                                    {settings.theme === 'light' && <div className="absolute top-4 right-4 w-2 h-2 bg-brand-primary rounded-full animate-pulse" />}
                                </button>
                                <button 
                                    onClick={() => {
                                        const nextTheme = 'dark';
                                        setSettings({ ...settings, theme: nextTheme });
                                        document.documentElement.classList.add('dark');
                                        localStorage.setItem('theme', nextTheme);
                                    }}
                                    className={`relative p-8 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 ${
                                        settings.theme === 'dark' 
                                            ? "bg-slate-900 border-white text-white shadow-xl shadow-white/5" 
                                            : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400"
                                    }`}
                                >
                                    <Moon size={32} className={settings.theme === 'dark' ? 'text-brand-primary' : ''} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dark</span>
                                    {settings.theme === 'dark' && <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" />}
                                </button>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50">
                                <div className="p-8 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-[2.5rem] text-white overflow-hidden relative group">
                                    <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
                                    <h4 className="text-xl font-black uppercase italic tracking-tight">SEO Engine</h4>
                                    <p className="text-xs font-bold text-white/80 mt-2 leading-relaxed">
                                        Meta metadata and Sitemap indexing are managed dynamically based on your site name and description.
                                    </p>
                                    <button className="mt-6 px-5 py-2.5 bg-white text-brand-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                        Optimize SEO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ConfigCard>
                </div>
            </div>
        </div>
    );
}
