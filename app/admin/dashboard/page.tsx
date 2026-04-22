"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import { mockApi } from "@/lib/admin/mock-api";
import { AdminUser } from "@/lib/admin/mock-data";
import { 
    Users, 
    Activity, 
    DollarSign, 
    Zap, 
    UserPlus, 
    ShieldCheck, 
    Clock
} from "lucide-react";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";

const MOCK_CHART_DATA = [
    { name: "Mon", users: 400, requests: 2400 },
    { name: "Tue", users: 520, requests: 3100 },
    { name: "Wed", users: 480, requests: 2900 },
    { name: "Thu", users: 610, requests: 3800 },
    { name: "Fri", users: 750, requests: 4200 },
    { name: "Sat", users: 900, requests: 5100 },
    { name: "Sun", users: 850, requests: 4800 },
];

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        mockApi.getUsers().then(val => {
            setUsers(val);
            setLoading(false);
        });
    }, []);

    const stats = [
        { title: "Total Users", value: users.length, icon: Users, color: "brand-primary", trend: { value: "12%", positive: true } },
        { title: "Active Users", value: users.filter(u => u.status === 'Active').length, icon: Activity, color: "emerald", trend: { value: "5%", positive: true } },
        { title: "Paid Users", value: users.filter(u => u.plan === 'Paid').length, icon: DollarSign, color: "amber", trend: { value: "8%", positive: true } },
        { title: "API Requests", value: "24.5k", icon: Zap, color: "brand-secondary", trend: { value: "24%", positive: true } },
    ] as const;

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 font-bold mt-2">Welcome back. Here is what's happening with your platform today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                        <Clock size={18} className="text-brand-primary" />
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Last 24 Hours</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">User Growth</h3>
                        <div className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-black">Weekly</div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontWeight: 'bold' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="var(--color-brand-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Tool Usage</h3>
                        <div className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-lg text-xs font-black">Performance</div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_CHART_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', color: '#fff', fontWeight: 'bold' }}
                                    cursor={{ fill: '#f1f5f9' }}
                                />
                                <Bar dataKey="requests" fill="var(--color-brand-secondary)" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <DataTable 
                title="Recent User Activity"
                columns={[
                    { key: 'name', label: 'User', render: (u) => (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xs font-black">{u.name[0]}</div>
                            <span>{u.name}</span>
                        </div>
                    )},
                    { key: 'email', label: 'Email' },
                    { key: 'plan', label: 'Plan', render: (u) => (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.plan === 'Paid' ? "bg-amber-500/10 text-amber-500" : "bg-slate-500/10 text-slate-500"}`}>
                            {u.plan}
                        </span>
                    )},
                    { key: 'status', label: 'Status', render: (u) => (
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${u.status === 'Active' ? "bg-emerald-500" : "bg-rose-500"}`}></div>
                            <span className="text-xs font-bold">{u.status}</span>
                        </div>
                    )},
                    { key: 'createdAt', label: 'Joined' }
                ]}
                data={users.slice(0, 5)}
                searchPlaceholder="Filter recent activity..."
            />
        </div>
    );
}
