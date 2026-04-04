"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { 
    FileText, 
    Copy, 
    PlusSquare, 
    Trash2 
} from "lucide-react";
import DropdownMenu from "./DropdownMenu";

const DATA = [
    { name: "Protein", value: 30, color: "#a855f7" }, // Purple
    { name: "Carbs", value: 45, color: "#f97316" }, // Orange
    { name: "Fat", value: 25, color: "#0d9488" }, // Teal
];

const StatsItem = ({ emoji, label, value, unit }: { emoji: string; label: string; value: string | number; unit: string }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group cursor-default">
        <div className="flex items-center space-x-3">
            <div className="text-xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                {emoji}
            </div>
            <span className="text-sm font-bold text-slate-700">{label}</span>
        </div>
        <div className="flex items-center space-x-1">
            <span className="text-sm font-extrabold text-slate-900">{value}</span>
            <span className="text-[10px] font-bold text-slate-400 lowercase">{unit}</span>
        </div>
    </div>
);

export default function NutritionPanel() {
    const [mounted, setMounted] = (require("react").useState)(false);

    (require("react").useEffect)(() => {
        setMounted(true);
    }, []);

    const menuItems = [
        { label: "Create Note", onClick: () => console.log("Create Note"), icon: <FileText size={16} /> },
        { label: "Copy Meals", onClick: () => console.log("Copy Meals"), icon: <Copy size={16} /> },
        { label: "Insert Day", onClick: () => console.log("Insert Day"), icon: <PlusSquare size={16} /> },
        { label: "Clear Day", onClick: () => console.log("Clear Day"), icon: <Trash2 size={16} />, variant: "danger" as const },
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-20 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">Nutrition Overview</h3>
                    <p className="text-xs text-slate-500 font-medium">Daily macronutrient balance</p>
                </div>
                <DropdownMenu items={menuItems} />
            </div>

            <div className="h-64 mb-8 relative">
                {mounted ? (
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.01, 1],
                        }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-full h-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                    animationBegin={0}
                                    animationDuration={1500}
                                >
                                    {DATA.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color} 
                                            style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.05))" }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: "12px", 
                                        border: "none", 
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                        fontSize: "12px",
                                        fontWeight: "bold"
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                    </div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-extrabold text-slate-900">1,650</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">KCAL</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-1 text-2xl">
                        🍗
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Protein</p>
                    <p className="text-xs font-extrabold text-slate-900">30%</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center mb-1 text-2xl">
                        🍞
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Carbs</p>
                    <p className="text-xs font-extrabold text-slate-900">45%</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center mb-1 text-2xl">
                        🥑
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Fat</p>
                    <p className="text-xs font-extrabold text-slate-900">25%</p>
                </div>
            </div>

            <div className="space-y-1">
                <StatsItem emoji="🔥" label="Calories" value="1,650" unit="kcal" />
                <StatsItem emoji="🍞" label="Carbs" value="186" unit="g" />
                <StatsItem emoji="🥑" label="Fat" value="46" unit="g" />
                <StatsItem emoji="🍗" label="Protein" value="124" unit="g" />
                <hr className="my-2 border-slate-100" />
                <StatsItem emoji="🌾" label="Fiber" value="28" unit="g" />
                <StatsItem emoji="🧂" label="Sodium" value="1.2" unit="mg" />
                <StatsItem emoji="🧬" label="Cholesterol" value="180" unit="mg" />
            </div>
        </div>
    );
}
