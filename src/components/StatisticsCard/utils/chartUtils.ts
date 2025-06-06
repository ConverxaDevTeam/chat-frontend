export const createChartGradient = (
  ctx: CanvasRenderingContext2D,
  color: string
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, `${color}66`); // 40% opacity
  gradient.addColorStop(0.3, `${color}4D`); // 30% opacity
  gradient.addColorStop(0.7, `${color}33`); // 20% opacity
  gradient.addColorStop(1, `${color}1A`); // 10% opacity
  return gradient;
};
