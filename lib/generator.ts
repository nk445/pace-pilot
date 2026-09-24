import { createCookiesWithMutableAccessCheck } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { resolve } from "path";

// Accepts UserInputs and returns Schedule
function generateSchedule(input: UserInput): Schedule {
    // validate user base and target mileage inputs
    const resolvedInput = resolveInputDefaults(input);
    
    // TODO: calculate progression of mileage across weeks
    const weeklyMileage = calculateWeeklyMileage(resolvedInput.baseMileage,
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