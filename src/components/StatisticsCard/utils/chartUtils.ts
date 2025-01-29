export const createChartGradient = (
  ctx: CanvasRenderingContext2D,
  color: string
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `${color}CC`); // 80% opacity
  gradient.addColorStop(0.15, `${color}99`); // 60% opacity
  gradient.addColorStop(0.3, `${color}00`); // 0% opacity
  return gradient;
};
