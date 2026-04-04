"use client";

import { useState } from "react";
import DropdownMenu from "./DropdownMenu";
import { 
    Plus, 
    MoreVertical, 
    CheckCircle2, 
    Circle, 
    Flame,
    ChevronDown,
    RefreshCw,
    Edit3,
    Layout,
    Mail,
    Save,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Meal {
    id: string;
    type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
    name: string;
    calories: number;
    items: { name: string; amount: string; checked: boolean; icon: string }[];
    image?: string;
}

const MealCard = ({ meal }: { meal: Meal }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [items, setItems] = useState(meal.items);

    const toggleItem = (index: number) => {
        const newItems = [...items];
        newItems[index].checked = !newItems[index].checked;
        setItems(newItems);
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all mb-4 group/card"
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover/card:scale-110 transition-transform">
                        <Flame size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">{meal.type}</h3>
                        <p className="text-xs text-slate-500 font-medium">{meal.calories} kcal • {items.length} items</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <RefreshCw size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                        <Edit3 size={18} />
                    </button>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-2 text-slate-400 hover:text-emerald-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                        <ChevronDown size={18} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">{meal.name}</h4>
                            <div className="space-y-3">
                                {items.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center justify-between group p-2 rounded-xl hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <button 
                                                onClick={() => toggleItem(idx)}
                                                className={`transition-colors ${item.checked ? "text-emerald-500" : "text-slate-300"}`}
                                            >
                                                {item.checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                                            </button>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg leading-none">{item.icon}</span>
                                                <span className={`text-sm font-bold ${item.checked ? "text-slate-400 line-through font-medium" : "text-slate-700"}`}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                                {item.amount}
                                            </span>
                                            <div className="relative group/select">
                                                <select className="appearance-none bg-transparent text-[10px] font-bold text-emerald-600 cursor-pointer focus:outline-none pr-4">
                                                    <option>1x</option>
                                                    <option>2x</option>
                                                    <option>0.5x</option>
                                                </select>
                                                <ChevronDown size={10} className="absolute right-0 top-1 text-emerald-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button className="mt-6 w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-sm font-bold flex items-center justify-center space-x-2">
                                <Plus size={16} />
                                <span>Add alternative food</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function MealSection() {
    const sectionMenuItems = [
        { label: "Edit Meal Layout", onClick: () => console.log("Edit Layout"), icon: <Layout size={16} /> },
        { label: "Email or Print PDF", onClick: () => console.log("Email/Print"), icon: <Mail size={16} /> },
        { label: "Save Meal Plan", onClick: () => console.log("Save Plan"), icon: <Save size={16} /> },
        { label: "Load Saved Plan", onClick: () => console.log("Load Plan"), icon: <Download size={16} /> },
    ];

    const mockMeals: Meal[] = [
        {
            id: "1",
            type: "Breakfast",
            name: "Classic Avocado Toast & Poached Egg",
            calories: 450,
            items: [
                { name: "Sourdough Bread", amount: "2 slices", checked: true, icon: "🍞" },
                { name: "Avocado", amount: "1 medium", checked: true, icon: "🥑" },
                { name: "Poached Eggs", amount: "2 large", checked: false, icon: "🥚" },
                { name: "Red Pepper Flakes", amount: "1 tsp", checked: false, icon: "🌶️" },
            ]
        },
        {
            id: "2",
            type: "Lunch",
            name: "Mediterranean Quinoa Bowl",
            calories: 620,
            items: [
                { name: "Quinoa", amount: "1 cup", checked: false, icon: "🥣" },
                { name: "Grilled Chicken", amount: "150g", checked: false, icon: "🍗" },
                { name: "Cherry Tomatoes", amount: "1/2 cup", checked: false, icon: "🍅" },
                { name: "Feta Cheese", amount: "30g", checked: false, icon: "🧀" },
                { name: "Cucumber", amount: "1/4", checked: false, icon: "🥒" },
            ]
        },
        {
            id: "3",
            type: "Dinner",
            name: "Pan-Seared Salmon with Asparagus",
            calories: 580,
            items: [
                { name: "Fresh Salmon", amount: "200g", checked: false, icon: "🐟" },
                { name: "Asparagus", amount: "1 bunch", checked: false, icon: "🥦" },
                { name: "Sweet Potato", amount: "1 medium", checked: false, icon: "🍠" },
                { name: "Olive Oil", amount: "1 tbsp", checked: false, icon: "🫒" },
            ]
        }
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Your Daily Meals</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                        Total: <span className="text-emerald-600">1,650 / 2,100 kcal</span>
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all">
                        <Plus size={14} />
                        <span>Generator Settings</span>
                    </button>
                    <DropdownMenu items={sectionMenuItems} />
                </div>
            </div>
            
            <div className="space-y-2">
                {mockMeals.map(meal => (
                    <MealCard key={meal.id} meal={meal} />
                ))}
            </div>

            <button className="mt-8 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50 transition-all text-sm font-bold flex items-center justify-center space-x-3 group">
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                <span>Add custom meal or snack</span>
            </button>
        </div>
    );
}
