import { useState, useEffect, useCallback, useMemo } from 'react';
import { LeftoverPattern, DayOfWeek, MealType, WeeklyGridData, GridCellData } from '../../types/meals';

const STORAGE_KEY = 'leftover_patterns';
const TOGGLE_KEY = 'leftovers_enabled';

const DAYS: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function useLeftovers() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [patterns, setPatterns] = useState<LeftoverPattern[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const storedPatterns = localStorage.getItem(STORAGE_KEY);
            const storedToggle = localStorage.getItem(TOGGLE_KEY);
            
            if (storedPatterns) setPatterns(JSON.parse(storedPatterns));
            if (storedToggle) setIsEnabled(storedToggle === 'true');
        } catch (e) {
            console.error("Failed to load leftovers:", e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const savePatterns = useCallback((newPatterns: LeftoverPattern[]) => {
        setPatterns(newPatterns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newPatterns));
    }, []);

    const toggleSystem = useCallback((val: boolean) => {
        setIsEnabled(val);
        localStorage.setItem(TOGGLE_KEY, String(val));
    }, []);

    const addPattern = useCallback((pattern: Omit<LeftoverPattern, 'id' | 'createdAt'>) => {
        const newPattern: LeftoverPattern = {
            ...pattern,
            id: crypto.randomUUID(),
            createdAt: Date.now()
        };
        const next = [...patterns, newPattern];
        savePatterns(next);
    }, [patterns, savePatterns]);

    const updatePattern = useCallback((id: string, updates: Partial<LeftoverPattern>) => {
        const next = patterns.map(p => p.id === id ? { ...p, ...updates } : p);
        savePatterns(next);
    }, [patterns, savePatterns]);

    const deletePattern = useCallback((id: string) => {
        const next = patterns.filter(p => p.id !== id);
        savePatterns(next);
    }, [patterns, savePatterns]);

    // CORE MAPPING ENGINE
    const gridData = useMemo(() => {
        // Initialize empty grid
        const grid: WeeklyGridData = {} as WeeklyGridData;
        DAYS.forEach(day => {
            grid[day] = {} as Record<MealType, GridCellData>;
            MEAL_TYPES.forEach(meal => {
                grid[day][meal] = { state: 'normal' };
            });
        });

        if (!isEnabled || patterns.length === 0) return grid;

        // Sort patterns by creation time so latest wins
        const sortedPatterns = [...patterns].sort((a, b) => a.createdAt - b.createdAt);

        sortedPatterns.forEach(pattern => {
            const startDayIdx = DAYS.indexOf(pattern.cookDay as DayOfWeek);
            if (startDayIdx === -1) return; // 'as_needed' logic placeholder if not specific day

            // 1. Fresh Cook slot
            const cell = grid[pattern.cookDay as DayOfWeek][pattern.cookMeal];
            if (cell.state !== 'normal') grid[pattern.cookDay as DayOfWeek][pattern.cookMeal].isOverridden = true;
            
            grid[pattern.cookDay as DayOfWeek][pattern.cookMeal] = {
                state: 'fresh',
                patternId: pattern.id,
                mealName: pattern.name,
                isOverridden: cell.state !== 'normal'
            };

            // 2. Leftover slots for Next (N-1) days
            for (let i = 1; i < pattern.daysToPrepare; i++) {
                const dayIdx = startDayIdx + i;
                if (dayIdx >= DAYS.length) break; // Overflow Protection

                const targetDay = DAYS[dayIdx];
                pattern.applyToMeals.forEach(mealType => {
                    const targetCell = grid[targetDay][mealType];
                    
                    // Priority check: Latest pattern wins, but mark if we overrode a Fresh Cook or another Leftover
                    const isOverriding = targetCell.state !== 'normal';
                    
                    grid[targetDay][mealType] = {
                        state: 'leftover',
                        patternId: pattern.id,
                        sourcePatternId: pattern.id,
                        mealName: pattern.name,
                        isOverridden: isOverriding
                    };
                });
            }
        });

        return grid;
    }, [patterns, isEnabled]);

    return {
        isEnabled,
        patterns,
        gridData,
        isLoaded,
        toggleSystem,
        addPattern,
        updatePattern,
        deletePattern
    };
}
