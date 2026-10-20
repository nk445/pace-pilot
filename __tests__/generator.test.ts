import { calculateWeeklyMileage } from '../src/generator';
import { getWeeks } from '../src/generator';
import { distributeDailyRuns } from '../src/generator';

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
    );
});

describe('distributeDailyRuns', () => {
    test('returns array with correctly placed runs with appropriate distances',
        () => {

            // test with 3 days
            let mileage = 15;
            let sessions = 3;
            let weekOfRuns = distributeDailyRuns(mileage, sessions);
            expect(weekOfRuns).toEqual([4.5, 0, 4.5, 0, 0, 6, 0]);

            // test with 6 days, more mileage
            mileage = 41;
            sessions = 6;
            weekOfRuns = distributeDailyRuns(mileage, sessions);
            expect(weekOfRuns).toEqual([4.8, 8.2, 4.8, 8.2, 4.8, 10.2, 0]);
        }
    );
});