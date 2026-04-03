"use client";

import { useState } from "react";

export default function Calculators() {
    const [bmiWeight, setBmiWeight] = useState("");
    const [bmiHeight, setBmiHeight] = useState("");
    const [bmiResult, setBmiResult] = useState<number | null>(null);
    const [bmiError, setBmiError] = useState("");

    const [calWeight, setCalWeight] = useState("");
    const [calHeight, setCalHeight] = useState("");
    const [calAge, setCalAge] = useState("");
    const [calResult, setCalResult] = useState<number | null>(null);
    const [calError, setCalError] = useState("");

    const calculateBMI = () => {
        const w = parseFloat(bmiWeight);
        const h = parseFloat(bmiHeight);

        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            setBmiError("Please enter valid positive numbers for weight and height.");
            setBmiResult(null);
            return;
        }

        setBmiError("");
        const hm = h / 100;
        setBmiResult(w / (hm * hm));
    };

    const calculateCalories = () => {
        const w = parseFloat(calWeight);
        const h = parseFloat(calHeight);
        const a = parseFloat(calAge);

        if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
            setCalError("Please enter valid positive numbers for all fields.");
            setCalResult(null);
            return;
        }

        setCalError("");
        // Basic Mifflin-St Jeor equation (simplified without gender)
        // (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) + 5
        const calories = (10 * w) + (6.25 * h) - (5 * a) + 5;
        setCalResult(calories);
    };

    return (
        <section id="calculators" className="py-16 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Health Calculators</h2>
                    <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                        Figure out your baseline numbers to get started on your diet journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* BMI Calculator */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">BMI Calculator</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    value={bmiWeight}
                                    onChange={(e) => setBmiWeight(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="e.g. 70"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    value={bmiHeight}
                                    onChange={(e) => setBmiHeight(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="e.g. 175"
                                />
                            </div>
                            <button
                                onClick={calculateBMI}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Calculate BMI
                            </button>

                            {bmiError && <p className="text-red-500 text-sm mt-2">{bmiError}</p>}

                            {bmiResult !== null && (
                                <div className="mt-4 p-4 bg-emerald-100 text-emerald-900 rounded-lg text-center">
                                    <p className="text-sm font-medium mb-1">Your BMI is</p>
                                    <p className="text-3xl font-black">{bmiResult.toFixed(1)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calorie Calculator */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">Daily Calories Needed</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={calWeight}
                                        onChange={(e) => setCalWeight(e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="70"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={calHeight}
                                        onChange={(e) => setCalHeight(e.target.value)}
                                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="175"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Age (years)</label>
                                <input
                                    type="number"
                                    value={calAge}
                                    onChange={(e) => setCalAge(e.target.value)}
                                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="30"
                                />
                            </div>
                            <button
                                onClick={calculateCalories}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Estimate Calories
                            </button>

                            {calError && <p className="text-red-500 text-sm mt-2">{calError}</p>}

                            {calResult !== null && (
                                <div className="mt-4 p-4 bg-emerald-100 text-emerald-900 rounded-lg text-center">
                                    <p className="text-sm font-medium mb-1">Estimated Maintenance Calories</p>
                                    <p className="text-3xl font-black">{Math.round(calResult)} <span className="text-xl font-normal">kcal</span></p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
