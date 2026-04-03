"use client";

import { useState } from "react";

const DIETS = ["Anything", "Keto", "Mediterranean", "Paleo", "Vegan", "Vegetarian"];

const MEAL_DATABASE = [
    { name: "Scrambled Eggs with Avocado", cal: 350, type: "Breakfast" },
    { name: "Oatmeal with Berries", cal: 300, type: "Breakfast" },
    { name: "Greek Yogurt Parfait", cal: 250, type: "Breakfast" },
    { name: "Chicken Salad Wrap", cal: 450, type: "Lunch" },
    { name: "Quinoa Bowl with Tofu", cal: 500, type: "Lunch" },
    { name: "Turkey and Cheese Sandwich", cal: 400, type: "Lunch" },
    { name: "Grilled Salmon with Asparagus", cal: 600, type: "Dinner" },
    { name: "Steak with Sweet Potato", cal: 700, type: "Dinner" },
    { name: "Lentil Soup with Bread", cal: 450, type: "Dinner" },
    { name: "Almonds and Apple", cal: 200, type: "Snack" },
    { name: "Protein Shake", cal: 150, type: "Snack" },
    { name: "Cottage Cheese", cal: 180, type: "Snack" }
];

export default function MealGenerator() {
    const [diet, setDiet] = useState("Anything");
    const [calories, setCalories] = useState<number | "">(1800);
    const [mealsCount, setMealsCount] = useState(3);
    const [generatedMeals, setGeneratedMeals] = useState<typeof MEAL_DATABASE>([]);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState("");

    const handleGenerate = () => {
        // Generate a list of randomized meals based on mealsCount
        const shuffled = [...MEAL_DATABASE].sort(() => 0.5 - Math.random());
        setGeneratedMeals(shuffled.slice(0, mealsCount));

        // reset email states when new meals are generated
        setEmailSuccess("");
        setEmailError("");
    };

    const handleSendToEmail = () => {
        setEmailError("");
        setEmailSuccess("");

        if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        if (generatedMeals.length === 0) {
            setEmailError("Please generate a meal plan first");
            return;
        }

        // Log the data capturing for demo purposes
        console.log("Mock Email Data Capture:", {
            email,
            diet,
            calories,
            mealsCount,
            generatedMeals
        });

        setEmailSuccess("Meal plan sent successfully (demo)");
        setEmail("");
    };

    return (
        <section id="generator" className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Demo Meal Generator</h2>
                    <p className="text-xl text-slate-500">Test drive our meal planning algorithm instantly. No signup required.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 transition-shadow hover:shadow-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Diet Preference</label>
                                <div className="flex flex-wrap gap-2.5">
                                    {DIETS.map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setDiet(d)}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${diet === d
                                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-200 transform scale-105"
                                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-emerald-200"
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Calories</label>
                                    <input
                                        type="number"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Meals</label>
                                    <select
                                        value={mealsCount}
                                        onChange={(e) => setMealsCount(Number(e.target.value))}
                                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-sm appearance-none"
                                    >
                                        {[2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n} meals</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-emerald-50/80 p-5 rounded-2xl text-sm text-emerald-800 border border-emerald-100">
                                <p className="font-bold mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Estimated Macros:
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-white/60 p-2 rounded-lg text-center font-medium">
                                        <span className="block text-emerald-600/80 text-xs uppercase">Carbs</span>
                                        {Math.floor((Number(calories) || 1800) * 0.4 / 4)}g
                                    </div>
                                    <div className="bg-white/60 p-2 rounded-lg text-center font-medium">
                                        <span className="block text-emerald-600/80 text-xs uppercase">Fat</span>
                                        {Math.floor((Number(calories) || 1800) * 0.3 / 9)}g
                                    </div>
                                    <div className="bg-white/60 p-2 rounded-lg text-center font-medium">
                                        <span className="block text-emerald-600/80 text-xs uppercase">Protein</span>
                                        {Math.floor((Number(calories) || 1800) * 0.3 / 4)}g
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    Generate Meals
                                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </button>
                        </div>

                        <div className="bg-slate-50/50 rounded-2xl pt-6 px-6 pb-8 border border-slate-100 flex flex-col h-full">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                                Your Meal Plan
                                {generatedMeals.length > 0 && <span className="ml-3 text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">{generatedMeals.length} Meals</span>}
                            </h3>

                            {generatedMeals.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-white p-8">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-10 h-10 opacity-40 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-slate-500">Configure your plan on the left</p>
                                    <p className="text-sm mt-1">Click generate to see your results</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col space-y-6">
                                    <div className="space-y-4 flex-1">
                                        {generatedMeals.map((meal, index) => (
                                            <div key={index} className="bg-white p-5 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 hover:border-emerald-200 transition-colors flex items-start justify-between group">
                                                <div>
                                                    <div className="text-xs font-bold tracking-wider text-emerald-500 uppercase mb-1.5 flex items-center">
                                                        Meal {index + 1}
                                                        <span className="mx-2 w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-slate-400 font-medium">{meal.type}</span>
                                                    </div>
                                                    <div className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors text-lg">{meal.name}</div>
                                                </div>
                                                <div className="text-sm font-semibold bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100">
                                                    {meal.cal} <span className="text-slate-400 font-normal">cal</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Email Capture Section */}
                                    <div className="pt-6 border-t border-slate-200">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Save this plan</label>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email to receive this plan"
                                                className={`flex-1 border rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all ${emailError ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-white'
                                                    }`}
                                            />
                                            <button
                                                onClick={handleSendToEmail}
                                                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 whitespace-nowrap"
                                            >
                                                Send to Email
                                            </button>
                                        </div>

                                        {/* Feedback Messages */}
                                        {emailError && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center font-medium">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {emailError}
                                            </p>
                                        )}
                                        {emailSuccess && (
                                            <p className="text-emerald-600 text-sm mt-2 flex items-center font-medium">
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {emailSuccess}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
