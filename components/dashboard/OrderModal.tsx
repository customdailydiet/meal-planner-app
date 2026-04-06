"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShoppingBag, Truck, Store, MapPin } from "lucide-react";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: string[];
}

const OrderService = ({ 
    name, 
    icon: Icon, 
    color, 
    description, 
    onClick 
}: { 
    name: string; 
    icon: any; 
    color: string; 
    description: string;
    onClick: () => void;
}) => (
    <button 
        onClick={onClick}
        className="group relative flex items-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 text-left w-full"
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-transform group-hover:scale-110 ${color}`}>
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight text-sm flex items-center">
                {name} <ExternalLink size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{description}</p>
        </div>
    </button>
)

export default function OrderModal({ isOpen, onClose, selectedItems }: OrderModalProps) {
    const handleOrder = (service: string) => {
        if (selectedItems.length === 0) return;
        
        const query = encodeURIComponent(selectedItems.join(", "));
        let url = "";

        switch (service) {
            case "Amazon Fresh":
                url = `https://www.amazon.com/s?k=${query}&i=amazonfresh`;
                break;
            case "Instacart":
                url = `https://www.instacart.com/store/search?q=${query}`;
                break;
            case "Walmart":
                url = `https://www.walmart.com/search?q=${query}`;
                break;
            case "Whole Foods":
                url = `https://www.wholefoodsmarket.com/search?text=${query}`;
                break;
        }

        if (url) window.open(url, "_blank");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#f8fafc] dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
                    >
                        {/* Header */}
                        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 italic uppercase flex items-center">
                                    Order Selection <ShoppingBag size={20} className="ml-2 text-emerald-500 fill-emerald-500" />
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    Deliver {selectedItems.length} items to your door
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-3">
                            <OrderService 
                                name="Amazon Fresh" 
                                icon={Truck} 
                                color="bg-orange-50 text-orange-500" 
                                description="Fast grocery delivery"
                                onClick={() => handleOrder("Amazon Fresh")}
                            />
                            <OrderService 
                                name="Instacart" 
                                icon={ShoppingBag} 
                                color="bg-emerald-50 text-emerald-500" 
                                description="Shop from local stores"
                                onClick={() => handleOrder("Instacart")}
                            />
                            <OrderService 
                                name="Walmart Grocery" 
                                icon={Store} 
                                color="bg-blue-50 text-blue-500" 
                                description="Value & convenience"
                                onClick={() => handleOrder("Walmart")}
                            />
                            <OrderService 
                                name="Whole Foods" 
                                icon={MapPin} 
                                color="bg-green-50 text-green-600" 
                                description="Organic & Specialty"
                                onClick={() => handleOrder("Whole Foods")}
                            />
                        </div>

                        {/* Selection Summary */}
                        <div className="p-6 pt-0">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cart Contents</p>
                                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 line-clamp-2">
                                    {selectedItems.join(", ")}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
                            <button 
                                onClick={onClose}
                                className="px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-black italic uppercase tracking-widest hover:bg-slate-700 dark:hover:bg-slate-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
