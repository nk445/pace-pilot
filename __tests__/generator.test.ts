import { calculateWeeklyMileage } from '../src/generator';

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
    )
})