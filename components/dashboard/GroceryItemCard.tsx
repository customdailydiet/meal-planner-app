"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    Check,
    ChevronDown,
    Utensils, 
    Wheat, 
    Droplets, 
    Leaf, 
    Coffee, 
    Cookie, 
    Milk, 
    Flame as Spice, 
    Container, 
    Beef, 
    Cherry, 
    Shell, 
    GlassWater as Bottle, 
    IceCream,
    ChefHat
} from "lucide-react";

export interface GroceryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    unit: string;
    image?: string;
}

interface GroceryItemCardProps {
    item: GroceryItem;
    selected: boolean;
    onToggle: (id: string) => void;
    onUpdate: (id: string, updates: Partial<GroceryItem>) => void;
}

// Image Mapping System - High Quality Placeholders
const IMAGE_MAP: Record<string, string> = {
    // --- Proteins & Meats ---
    "chicken breast": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=200&h=200",
    "grilled salmon": "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=200&h=200",
    "ground beef": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=200&h=200",
    "sausage": "https://images.unsplash.com/photo-1547050605-2f125021ed20?auto=format&fit=crop&w=200&h=200",
    
    // --- Dairy ---
    "milk": "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=200&h=200",
    "greek yogurt": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=200&h=200",
    "cheese": "https://images.unsplash.com/photo-1486297678162-ad2a19b05840?auto=format&fit=crop&w=200&h=200",
    "eggs": "https://images.unsplash.com/photo-1582722872445-44ad5f7844dd?auto=format&fit=crop&w=200&h=200",
    
    // --- Produce ---
    "avocado": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=200&h=200",
    "broccoli": "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=200&h=200",
    "banana": "https://images.unsplash.com/photo-1603833665858-e81b1c7e6ddb?auto=format&fit=crop&w=200&h=200",
    "spinach": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=200&h=200",
    "onion": "https://images.unsplash.com/photo-1518977822534-7049a6ecf73e?auto=format&fit=crop&w=200&h=200",
    "garlic": "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=200&h=200",
    "berries": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&h=200",
    
    // --- Pantry & Others ---
    "oatmeal": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=200&h=200",
    "olive oil": "https://images.unsplash.com/photo-1474979266404-7eaacbacf82a?auto=format&fit=crop&w=200&h=200",
    "almonds": "https://images.unsplash.com/photo-1508815121350-f2da6e140de4?auto=format&fit=crop&w=200&h=200",
    "chocolate": "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=200&h=200",
};

const CATEGORY_ICONS: Record<string, any> = {
    "Dairy Products": Milk,
    "Spices and Herbs": Spice,
    "Fats and Oils": Droplets,
    "Soups, Sauces, and Gravies": Container,
    "Sausages and Meats": Spice, // Using Spice icon as a visual stand-in for savory meats
    "Fruits": Cherry,
    "Vegetables": Leaf,
    "Nuts and Seeds": Shell,
    "Beef Products": Beef,
    "Beverages": Bottle,
    "Sweets": IceCream,
    "Proteins": Utensils,
    "Pantry": ChefHat,
    "Snacks": Cookie,
};

const GroceryItemCard = React.memo(({ item, selected, onToggle, onUpdate }: GroceryItemCardProps) => {
    const [imgError, setImgError] = useState(false);
    const Icon = CATEGORY_ICONS[item.category] || Utensils;
    const imageUrl = IMAGE_MAP[item.name.toLowerCase()] || "";

    const units = [
        "g", "kg", "oz", "lb", "cup", "tbsp", "tsp", "piece", "serving", "ml", "L"
    ];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative flex items-center p-4 bg-white dark:bg-slate-900 rounded-[24px] border transition-all duration-300 ${
                selected 
                    ? "border-emerald-500 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5 bg-emerald-50/5" 
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-500/5 hover:-translate-y-0.5"
            }`}
        >
            {/* Checkbox */}
            <button 
                onClick={() => onToggle(item.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    selected 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                }`}
            >
                {selected && <Check size={14} strokeWidth={3} />}
            </button>

            {/* Product Image */}
            <div className="mx-4 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-800">
                {!imgError && imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={item.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                ) : (
                    <Icon size={20} className="text-slate-400" />
                )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0 mr-4">
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 truncate uppercase mt-0.5 leading-none">
                    {item.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5" />
                    {item.category}
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
                <div className="relative">
                    <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => onUpdate(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-black text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
                
                <div className="relative group/unit">
                    <select 
                        value={item.unit}
                        onChange={(e) => onUpdate(item.id, { unit: e.target.value })}
                        className="appearance-none bg-slate-50 dark:bg-slate-800 px-3 pr-8 py-1.5 rounded-xl text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 border-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
                    >
                        {units.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform group-hover/unit:-translate-y-0.5" />
                </div>
            </div>
        </motion.div>
    );
});

GroceryItemCard.displayName = "GroceryItemCard";

export default GroceryItemCard;
