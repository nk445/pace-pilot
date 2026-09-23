// Accepts UserInputs and returns Schedule
function generateSchedule(input: UserInput): Schedule {
    // validate user base and target mileage inputs
    const resolvedInput = resolveInputDefaults(input);
    
    // TODO: calculate progression of mileage across weeks


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

        //increase mileage every 3 weeks
        const numofIncreases = Math.ceil( baseBuildWeeks / 3);

        target = base + (5 * numofIncreases);
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