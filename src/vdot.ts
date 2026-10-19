function calculateVdot(distance: number,
    timeInSeconds: number): number {
    
    const timeInMinutes = timeInSeconds / 60;
    const velocity = distance / timeInMinutes;

    // VO2 max = oxygen cost / % VO2 Max effort

    let o2_cost = (-4.60 + (0.182258 * velocity) +
        (0.000104 * (velocity ** 2))
    );

    let percent_max_effort = (0.8 +
        (0.1894393 * Math.exp(-0.012778 * timeInMinutes)) +
        (0.2989558 * Math.exp(-0.1932605 * timeInMinutes))
    );

    // vdot value rounded to 1 decimal place
    const vdot = Math.round((o2_cost / percent_max_effort) * 10) / 10;
    
    return vdot;
}

function getTrainingPaces(vdot: number) {
  
}
















function calculateVdot2(distanceMeters: number, timeSeconds: number): number {
  const timeMinutes = timeSeconds / 60;
  const velocity = distanceMeters / timeMinutes; // meters/minute

  // Oxygen cost
  const vo2 = -4.60 + (0.182258 * velocity) + (0.000104 * (velocity ** 2));

  // Percent max effort based on duration
  const percentMax = 0.8 +
    (0.1894393 * Math.exp(-0.012778 * timeMinutes)) +
    (0.2989558 * Math.exp(-0.1932605 * timeMinutes));

  // Final VDOT score
  return Number((vo2 / percentMax).toFixed(1));
}