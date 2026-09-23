type UserInput = {
  baseMileage?: number;
  targetMileage?: number;
  weeks: number;
  raceDistance?: number;
  raceUnit: 'mi' | 'km';
  raceTimeInSeconds?: number;
  sessions: number;
};

type Run = {
    runId: string;
    distance: number;
    unit: 'mi' | 'km';
    type: 'easy' | 'threshold' | 'interval' | 'repetition' | 'long';
}

// Day: Day of the week name/index, list of Run objects, total daily distance.
type Day = {
    dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    runList: Run[];
    totalDistance: number;
}

// Week: Week number, total target mileage, list of Day objects.
type Week = {
    weekNumber: number;
    weeklyMileage: number;
    days: Day[];
}

// Schedule: Unique ID, creation date, user inputs used, list of Week objects.
type Schedule = {
    scheduleId: string;
    creationDate: Date;
    inputs: UserInput;
    weeks: Week[];
}