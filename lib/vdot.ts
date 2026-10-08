function calculateVdot(distance: number,
    timeInSeconds: number): number {
    
    const timeInMinutes = timeInSeconds / 60;
    const velocity = distance / timeInMinutes;

    let o2_cost = (-4.60 + 0.182258 * V + 0.000104 × V²);
    let percent_max_effort = (0.8 + 0.1894393 * e −0.012778×T + 0.2989558 × e−0.1932605×T);
    let vdot = o2_cost / percent_max_effort;
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