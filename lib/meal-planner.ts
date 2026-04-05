import { FoodItem, FOOD_DATABASE, MealType } from "./food-db";
import { NutritionProfile } from "./nutrition";

export interface UserPreferences {
    selectedCategories: string[];
    favoriteFoodIds: string[];
    excludedFoodIds: string[];
    customFoods: FoodItem[];
    mealSlots: string[]; // e.g., ["Breakfast", "Lunch", "Dinner", "Snack"]
    intelligentGeneration: boolean;
}

export interface GeneratedMeal {
    slot: string;
    items: {
        food: FoodItem;
        amount: number; // multiplier for the base serving
    }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
}

/**
 * Shuffle utility for randomness
 */
function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Scoring System for Food Items
 */
function scoreFood(food: FoodItem, prefs: UserPreferences): number {
    let score = 0;
    score += 10; // Base

    if (prefs.selectedCategories.includes(food.category)) score += 50;
    if (prefs.favoriteFoodIds.includes(food.id)) score += 100;
    if (prefs.excludedFoodIds.includes(food.id)) score = -1000;

    return score;
}

/**
 * Meal Planner Engine
 */
export function generateMealPlan(
    profile: NutritionProfile,
    preferences: UserPreferences
): GeneratedMeal[] {
    const { mealSlots, intelligentGeneration } = preferences;
    const { calories, macros } = profile;

    // Handle Generation OFF
    if (!intelligentGeneration) {
        return mealSlots.map(slot => ({
            slot,
            items: [],
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0
        }));
    }

    const slotSplits: Record<string, number> = {
        "Breakfast": 0.25,
        "Lunch": 0.35,
        "Dinner": 0.30,
        "Snack": 0.10
    };

    const fullDb = [...FOOD_DATABASE, ...preferences.customFoods];
    const usedIds: Record<string, number> = {}; // Track repeats per day

    const plan: GeneratedMeal[] = [];

    mealSlots.forEach(slot => {
        const split = slotSplits[slot] || (1 / mealSlots.length);
        const targetCals = calories * split;

        // Filter by Meal Type (normalized)
        const normalizedSlot = slot.toLowerCase() as MealType;
        const candidates = fullDb.filter(f => f.mealTypes.includes(normalizedSlot));

        // Score and Shuffle
        const scored = shuffle(candidates)
            .map(f => ({ food: f, score: scoreFood(f, preferences) }))
            .filter(f => f.score > 0 && (usedIds[f.food.id] || 0) < 2) // Max 2 repeats
            .sort((a, b) => b.score - a.score);

        // Balanced Composition: 1 Protein, 1 Carb, 1 Fat
        const proteins = scored.filter(f => f.food.category === "protein" || f.food.category === "smoothie");
        const carbs = scored.filter(f => f.food.category === "carb");
        const fats = scored.filter(f => f.food.category === "fat" || f.food.category === "snack");

        if (proteins.length === 0 || carbs.length === 0 || fats.length === 0) {
            // Fallback to any scored if limited
            return;
        }

        const protein = proteins[0].food;
        const carb = carbs[0].food;
        const fat = fats[0].food;

        // Tracking
        [protein, carb, fat].forEach(f => usedIds[f.id] = (usedIds[f.id] || 0) + 1);

        // Scaling logic (±5% accuracy target)
        const pScale = (targetCals * 0.45) / protein.calories;
        const cScale = (targetCals * 0.35) / carb.calories;
        const fScale = (targetCals * 0.20) / fat.calories;

        const items = [
            { food: protein, amount: Number(pScale.toFixed(2)) },
            { food: carb, amount: Number(cScale.toFixed(2)) },
            { food: fat, amount: Number(fScale.toFixed(2)) }
        ];

        const mealCals = items.reduce((acc, i) => acc + i.food.calories * i.amount, 0);
        const mealProtein = items.reduce((acc, i) => acc + i.food.protein * i.amount, 0);
        const mealCarbs = items.reduce((acc, i) => acc + i.food.carbs * i.amount, 0);
        const mealFat = items.reduce((acc, i) => acc + i.food.fat * i.amount, 0);

        plan.push({
            slot,
            items,
            totalCalories: Math.round(mealCals),
            totalProtein: Math.round(mealProtein),
            totalCarbs: Math.round(mealCarbs),
            totalFat: Math.round(mealFat)
        });
    });

    return plan;
}
