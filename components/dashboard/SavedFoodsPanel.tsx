"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SavedFoodsPanel() {
    const [savedFoods, setSavedFoods] = useState<any[]>([]);

    useEffect(() => {
        const loadFoods = () => {
            const customFoods = JSON.parse(localStorage.getItem("customFoods") || "[]");
            const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            const merged = [...customFoods, ...favorites].filter((item, index, self) => 
                index === self.findIndex((t) => (t.id || t.name) === (item.id || item.name))
            );
            setSavedFoods(merged);
        };
        loadFoods();
        window.addEventListener("storage", loadFoods);
        return () => window.removeEventListener("storage", loadFoods);
    }, []);

    return (
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Saved Foods</h3>
            </div>
            
            {savedFoods.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    <p className="text-[10px] font-bold uppercase tracking-widest">Your saved foods will appear here</p>
                </div>
            ) : (
                <div className="max-h-64 overflow-y-auto p-2 scrollbar-hide space-y-1">
                    {savedFoods.map((food, i) => (
                        <div key={food.id || i} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                            {food.image ? (
                                <div className="w-10 h-10 relative rounded-md overflow-hidden flex-shrink-0">
                                    <Image src={food.image} alt={food.name} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-emerald-500 text-sm font-black">{food.name?.charAt(0) || "?"}</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 truncate uppercase mt-0.5">{food.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{food.calories || 0} kcal{(food.servingSize || food.serving) && ` • ${food.servingSize || food.serving}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
