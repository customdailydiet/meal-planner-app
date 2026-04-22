"use client";

import React, { useState } from "react";
import { ConfigCard, AdminToggle } from "@/components/admin/FormControls";
import { 
    Globe, 
    Save, 
    Plus, 
    Trash2, 
    Languages, 
    Type, 
    AlignLeft, 
    AlignRight 
} from "lucide-react";

const INITIAL_LANGS = [
    { code: "en", name: "English", rtl: false, default: true },
    { code: "fr", name: "French", rtl: false, default: false },
    { code: "ar", name: "Arabic", rtl: true, default: false },
    { code: "es", name: "Spanish", rtl: false, default: false },
];

export default function LanguageSettingsPage() {
    const [langs, setLangs] = useState(INITIAL_LANGS);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    const handleSetDefault = (code: string) => {
        setLangs(prev => prev.map(l => ({ ...l, default: l.code === code })));
    };

    const handleToggleRTL = (code: string) => {
        setLangs(prev => prev.map(l => l.code === code ? { ...l, rtl: !l.rtl } : l));
    };

    const handleDelete = (code: string) => {
        if (langs.find(l => l.code === code)?.default) return;
        setLangs(prev => prev.filter(l => l.code !== code));
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Language & RTL</h1>
                    <p className="text-slate-500 font-bold mt-2">Manage supported languages and configure bidirectional text support.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                        <Plus size={20} />
                        Add Language
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                        {saving ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Language Table */}
                <div className="lg:col-span-2">
                    <ConfigCard title="Supported Languages" description="Current active languages in the platform">
                        <div className="space-y-4">
                            {langs.map((lang) => (
                                <div 
                                    key={lang.code}
                                    className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between ${
                                        lang.default 
                                            ? "bg-white dark:bg-slate-900 border-brand-primary/50 shadow-xl shadow-brand-primary/10" 
                                            : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                                    }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black uppercase ${lang.default ? "bg-brand-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                                            {lang.code}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">{lang.name}</h4>
                                                {lang.default && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-black uppercase tracking-widest">Default</span>}
                                            </div>
                                            <div className="flex items-center gap-3 mt-2">
                                                <button 
                                                    onClick={() => !lang.default && handleSetDefault(lang.code)}
                                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${lang.default ? "text-brand-primary" : "text-slate-400 hover:text-brand-primary"}`}
                                                >
                                                    {lang.default ? "Primary Mode" : "Set as Default"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                            {lang.rtl ? <AlignRight size={16} className="text-brand-primary" /> : <AlignLeft size={16} className="text-slate-400" />}
                                            <AdminToggle 
                                                enabled={lang.rtl}
                                                onChange={() => handleToggleRTL(lang.code)}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(lang.code)}
                                            disabled={lang.default}
                                            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all disabled:opacity-20"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ConfigCard>
                </div>

                {/* RTL/Global Sidebar */}
                <div className="lg:col-span-1 space-y-10">
                    <ConfigCard title="Translation Logic" description="Global text processing options">
                        <div className="space-y-8">
                            <AdminToggle 
                                label="Auto RTL Detection"
                                description="Automatically flip layout if text contains Arabic/Hebrew characters."
                                enabled={true}
                                onChange={() => {}}
                            />
                            <AdminToggle 
                                label="Google Translate API"
                                description="Enable lazy translation for unsupported user strings."
                                enabled={false}
                                onChange={() => {}}
                            />
                            
                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white">
                                <Languages size={32} className="text-brand-primary mb-4" />
                                <h4 className="text-lg font-black uppercase italic tracking-tight">Localization Pro</h4>
                                <p className="text-xs font-bold text-slate-300 mt-2 leading-relaxed">
                                    The platform uses i18next patterns. New languages require uploading a JSON locale file to the source repository.
                                </p>
                                <button className="mt-6 w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Export Locale Sample
                                </button>
                            </div>
                        </div>
                    </ConfigCard>
                </div>
            </div>
        </div>
    );
}
