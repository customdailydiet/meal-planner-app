/**
 * CustomDailyDiet Nutrition Logic
 * Implements Mifflin-St Jeor formula for BMR and TDEE calculations.
 */

export interface PhysicalMetrics {
    weight: number; // kg
    height: number; // cm
    age: number;
    gender: "male" | "female";
    activityLevel: 
        | "sedentary" 
        | "lightly_active" 
        | "moderately_active" 
        | "very_active" 
        | "extra_active";
}

export type FitnessGoal = "lose" | "maintain" | "gain";

export interface NutritionProfile {
    tdee: number;
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
}

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor
 */
export function calculateBMR(metrics: PhysicalMetrics): number {
    const { weight, height, age, gender } = metrics;
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    
    if (gender === "male") {
        bmr += 5;
    } else {
        bmr -= 161;
    }
    
    return Math.round(bmr);
}

/**
 * Activity Multipliers
 */
const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: PhysicalMetrics["activityLevel"]): number {
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculate Final Calories and Macros based on Goal
 * Split: 30% Protein, 40% Carbs, 30% Fat
 */
export function calculateNutritionProfile(tdee: number, goal: FitnessGoal): NutritionProfile {
    let calories = tdee;
    
    if (goal === "lose") {
        calories -= 300;
    } else if (goal === "gain") {
        calories += 300;
    }

    // Macros: Protein (4 kcal/g), Carbs (4 kcal/g), Fat (9 kcal/g)
    const protein = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.40) / 4);
    const fat = Math.round((calories * 0.30) / 9);

    return {
        tdee,
        calories: Math.round(calories),
        macros: { protein, carbs, fat }
    };
}
