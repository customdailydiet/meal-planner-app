"use client";

import React, { useState } from "react";
import { ConfigCard } from "@/components/admin/FormControls";
import { 
    Mail, 
    Save, 
    Send, 
    Server, 
    Terminal, 
    CheckCircle2, 
    AlertCircle,
    Layout
} from "lucide-react";

export default function EmailConfigPage() {
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    const handleTest = () => {
        setTesting(true);
        setTimeout(() => setTesting(false), 1200);
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Email System</h1>
                    <p className="text-slate-500 font-bold mt-2">Configure SMTP settings, delivery providers, and transactional email templates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleTest}
                        disabled={testing}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                        {testing ? <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
                        {testing ? "Sending..." : "Test Connection"}
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-5 bg-brand-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-brand-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                        {saving ? "Saving..." : "Save Config"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ConfigCard title="SMTP Configuration" description="Manage outbound mail server settings">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">SMTP Host</label>
                                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                    <Server size={18} className="text-slate-400" />
                                    <input type="text" defaultValue="smtp.resend.com" className="bg-transparent border-none outline-none text-sm font-black text-slate-900 dark:text-white w-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">SMTP Port</label>
                                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                    <Terminal size={18} className="text-slate-400" />
                                    <input type="text" defaultValue="587" className="bg-transparent border-none outline-none text-sm font-black text-slate-900 dark:text-white w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Username / API Key</label>
                            <input type="password" defaultValue="re_xxxxxxxxxxxxxxxxxxx" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all" />
                        </div>

                        <div className="p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/10 flex items-center gap-4 text-emerald-600">
                            <CheckCircle2 size={24} />
                            <p className="text-xs font-bold uppercase tracking-tight">Connected: Outbound email services are active and healthy.</p>
                        </div>
                    </div>
                </ConfigCard>

                <ConfigCard title="Email Branding" description="Transactional email styling">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">From Name</label>
                            <input type="text" defaultValue="CustomDailyDiet Support" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all" />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Primary Brand Color</label>
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/20"></div>
                                <input type="text" defaultValue="#388A23" className="flex-1 px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-mono font-black text-slate-900 dark:text-white outline-none" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="w-full flex items-center justify-center gap-3 p-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                                <Layout size={18} />
                                Customize HTML Templates
                            </button>
                        </div>
                    </div>
                </ConfigCard>
            </div>

            <div className="flex flex-col items-center text-center p-12 space-y-4">
                <AlertCircle className="text-slate-300" size={32} />
                <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Email Proxy Notice</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1 max-w-lg">All outgoing platform emails are proxied through your SMTP server to ensure high deliverability and whitelabeling.</p>
                </div>
            </div>
        </div>
    );
}
