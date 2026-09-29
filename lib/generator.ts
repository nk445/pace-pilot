import { createCookiesWithMutableAccessCheck } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { resolve } from "path";

// map number of sessions to a default distribution
// first 3 days are quality sessions
const SESSIONS_TO_DAYS: Record<number, number[]> = {
    1: [0],
    2: [1, 5],
    3: [1, 5, 3],
    4: [0, 4, 2, 5],
    5: [0, 3, 5, 4, 1],
    6: [0, 2, 5, 4, 1, 6],
    7: [0, 2, 5, 3, 1, 4, 6]
}

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

// Accepts UserInputs and returns Schedule
function generateSchedule(input: UserInput): Schedule {
    // validate user base and target mileage inputs
    const resolvedInput = resolveInputDefaults(input);
    
    // TODO: calculate progression of mileage across weeks
    const perWeekMileage = calculateWeeklyMileage(resolvedInput.baseMileage,
        resolvedInput.targetMileage,
        resolvedInput.weeks,
        resolvedInput.sessions);

    // TODO: Distribute the weekly miles into days
    

    // TODO: Construct final schedule
}

function resolveInputDefaults(input: UserInput): ResolvedUserInput {
    let base = input.baseMileage;
    let target = input.targetMileage;
    // check if user input base mileage, default to 5
    if (base === undefined) {
        base = 5;
    }

    // check if user input target mileage
    // default to 5 mile increase every 3 weeks up to 10 weeks
    if (target === undefined) {
        // number of weeks dedicated to base build
        const baseBuildWeeks = (Math.min(input.weeks, 10));

        // increase mileage every 4th week
        const numofIncreases = Math.floor( baseBuildWeeks / 4);

        // increase mileage by # sessions per week
        target = base + (input.sessions * numofIncreases);
    }

    const resolvedInput: ResolvedUserInput = {
        baseMileage: base,
        targetMileage: target,
        weeks: input.weeks,
        raceDistance: input.raceDistance,
        raceUnit: input.raceUnit,
        raceTimeInSeconds: input.raceTimeInSeconds,
        sessions: input.sessions
    };

    return resolvedInput;
}

function calculateWeeklyMileage(base: number,
    target: number,
    numOfWeeks: number,
    weeklySessions: number): number[]
{
    const weeklyMileage: number[] = new Array(numOfWeeks).fill(0);
    
    // create weeks with mileage applied
    for (let i = 0; i < numOfWeeks; ++i) {
        // mileage increase every 4th week until target mileage
        const mileageIncreases = Math.floor(i / 4);

        // increase by # weekly sessions
        const currMileage = Math.min(base +
            (weeklySessions * mileageIncreases),target);
        weeklyMileage[i] = currMileage;
    }

    return weeklyMileage;
}

function distributeDailyRuns (mileage: number, sessions: number) {
    const perSessionMileage = calculateMileagePerSession(mileage, sessions);
    const daysActive = SESSIONS_TO_DAYS[sessions];
    const dailyMileage = [0, 0, 0, 0, 0, 0, 0];

    daysActive.forEach((dayIndex, i) => {
        dailyMileage[dayIndex] = perSessionMileage[i];
    });

    return dailyMileage;
}

function calculateMileagePerSession (mileage: number, sessions: number): number[] {
    // create array of mileage per day
    const perSessionMileage: number[] = new Array(sessions).fill(0);

    // Run distances are weighted: long (2.25), quality (1.75), easy (1)
    let totalWeight = (sessions === 1) ? 2.25 : (sessions + 2);
    let remaining = mileage;
    
    for (let i = 0; i < sessions; ++i) {
        if (i === 0) {
            perSessionMileage[i] = Math.floor((2.25 / totalWeight) * mileage);
        }
        else if (i === 1) {
            perSessionMileage[i] = Math.round((1.75 / totalWeight) * mileage);
        }
        else if (i === sessions - 1) {
            perSessionMileage[i] = remaining;
        }
        else {
            perSessionMileage[i] = Math.round((1 / totalWeight) * mileage);
        }
        remaining -= perSessionMileage[i];
    }
    
    perSessionMileage.sort((a, b) => b - a);

    return perSessionMileage;
}