import { createCookiesWithMutableAccessCheck } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { resolve } from "path";

const SESSIONS_TO_ACTIVE_DAYS: Record<number, number[]> = {
    1: [0],                     // Mon
    2: [0, 4],                  // Mon, Fri
    3: [0, 2, 5],               // Mon, Wed, Sat
    4: [0, 1, 4, 5],            // Mon, Tue, Fri, Sat
    5: [0, 1, 2, 4, 5],         // Mon, Tue, Wed, Fri, Sat
    6: [0, 1, 2, 3, 4, 5],      // Mon - Sat
    7: [0, 1, 2, 3, 4, 5, 6]    // every day
}

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
    // get map of session ct to active running days
    const daysActive = SESSIONS_TO_ACTIVE_DAYS[sessions];

    // Mon - Sun
    const dailyMileage = [0, 0, 0, 0, 0, 0, 0];

    // divide mileage evenly for 1 or 2 days
    if (sessions <= 2) {
        daysActive.forEach(dayIndex => {
            dailyMileage[dayIndex] = mileage / sessions;
        });
    }
    // Long run is 40% if 3 days
    else if (sessions === 3) {
        dailyMileage[daysActive[0]] = 
            dailyMileage[daysActive[1]] =
            .3 * mileage;
        dailyMileage[daysActive[2]] = .4 * mileage;
    }
    
    else {
        // distribute mileage across quality sessions first
        let remaining = mileage;
        let easyDays = sessions;
        daysActive.forEach(dayIndex => {
            // long run = 25% if 4+ days
            if (dayIndex === 5) {
                dailyMileage[dayIndex] = .25 * mileage;
                remaining -= dailyMileage[dayIndex];
                --easyDays;
            }

            // quality sessions = 17.5%
            else if (dayIndex === 1 || dayIndex === 3) {
                dailyMileage[dayIndex] = mileage * .2;
                remaining -= dailyMileage[dayIndex];
                --easyDays;
            }
        });

        // then distribute remaining mileage among easy sessions
        const easyMileage = Math.round((remaining / easyDays) * 10) / 10;
        daysActive.forEach((dayIndex, i) => {
            if (dayIndex != 1 &&
                dayIndex != 3 &&
                dayIndex != 5) {
                    // alot leftover mileage to last active day
                    if (i === daysActive.length - 1) {
                        dailyMileage[dayIndex] = remaining;
                    }
                dailyMileage[dayIndex] = easyMileage;
                remaining -= dailyMileage[dayIndex];
            }
        });
    }

    return dailyMileage;
}