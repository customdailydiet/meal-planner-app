export type MealSize = 'tiny' | 'normal' | 'big';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type MealComplexity = 'simple' | 'moderate' | 'complex';
export type FoodPreference = 'all' | 'veg' | 'non-veg' | 'vegan' | 'keto';
export type CookingPreference = 'can-cook' | 'no-cooking';
export type TimePreference = '< 15 min' | '< 30 min' | '1 hour+';
export type MacroFocus = 'no-preference' | 'no-carbs' | 'no-fat' | 'no-protein' | 'less-carbs' | 'less-fat' | 'less-protein' | 'more-carbs' | 'more-fat' | 'more-protein';
export type SideDishPreference = 'auto' | 'yes' | 'no';

export interface MealPreferences {
    foodTypes: FoodPreference;
    cooking: CookingPreference;
    time: TimePreference;
    complexity: MealComplexity;
    categories: string[];
}

export interface MealRecurring {
    onlyRecurring: boolean;
    applyFilters: boolean;
    foods: string[]; // food IDs
    collections: string[]; // collection IDs
}

export interface MealAdvanced {
    skip: boolean;
    macroFocus: MacroFocus;
    includeSideDish: SideDishPreference;
}

export interface Meal {
    id: string;
    name: string;
    size: MealSize;
    type: MealType;
    familyMembers: number;
    weight: number; 
    percentage: number;
    
    // Calculated targets (Per Person)
    caloriesTarget: number;
    proteinTarget: number;
    carbsTarget: number;
    fatsTarget: number;

    // Config Sections
    preferences: MealPreferences;
    recurring: MealRecurring;
    advanced: MealAdvanced;
}

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface MealSchedule {
    sameScheduleEachDay: boolean;
    firstDayOfWeek: DayOfWeek;
    meals: Meal[];
}

export type RecipeType = 'main_only' | 'main_and_side';

export interface LeftoverPattern {
    id: string;
    name: string;
    cookDay: DayOfWeek | 'as_needed';
    cookMeal: MealType;
    daysToPrepare: number;
    recipeType: RecipeType;
    applyToMeals: MealType[];
    createdAt: number; // For overlap priority
}

export type CellState = 'normal' | 'fresh' | 'leftover';

export interface GridCellData {
    state: CellState;
    patternId?: string;
    sourcePatternId?: string; // If it's a leftover from a different day's cook
    mealName?: string;
    isOverridden?: boolean;
}

export type WeeklyGridData = Record<DayOfWeek, Record<MealType, GridCellData>>;
