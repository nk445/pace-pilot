import { calculateWeeklyMileage } from '../src/generator';
import { getWeeks } from '../src/generator';

describe('calculateWeeklyMileage', () => {
    test('returns array with appropriate mileage progression from user inputs',
        () => {
            const base = 10;
            const target = 20;
            const numWeeks = 12;
            const numWeeklySessions = 4;

            const perWeekMileage = calculateWeeklyMileage(base,
                target, numWeeks, numWeeklySessions);

            expect(perWeekMileage).toEqual([
                10, 10, 10, 10, 14,
                14, 14, 14, 18, 18,
                18, 18
            ]); 
        }
    );
});

describe('getWeeks', () => {
    test('returns array with Week objects from weekly progression',
        () => {
            const base = 10;
            const target = 16;
            const numWeeks = 5;
            const numWeeklySessions = 6;

            const perWeekMileage = getWeeks(base,
                target, numWeeks, numWeeklySessions);

            expect(perWeekMileage).toEqual([
                { weekNumber: 0, weeklyMileage: 10, days: [] },
                { weekNumber: 1, weeklyMileage: 10, days: [] },
                { weekNumber: 2, weeklyMileage: 10, days: [] },
                { weekNumber: 3, weeklyMileage: 10, days: [] },
                { weekNumber: 4, weeklyMileage: 16, days: [] }
            ]); 
        }
    )
})