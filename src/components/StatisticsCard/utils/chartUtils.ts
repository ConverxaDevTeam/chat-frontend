const hexToRgba = (hex: string, alpha: number): string => {
  // Remover # si existe
  hex = hex.replace("#", "");

  // Expandir formato corto (#ccc -> #cccccc)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map(char => char + char)
      .join("");
  }

  // Validar que sea un hex válido
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return `rgba(204, 204, 204, ${alpha})`; // Fallback a gris
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createChartGradient = (
  ctx: CanvasRenderingContext2D,
  color: string
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, hexToRgba(color, 0.4)); // 40% opacity
  gradient.addColorStop(0.3, hexToRgba(color, 0.3)); // 30% opacity
  gradient.addColorStop(0.7, hexToRgba(color, 0.2)); // 20% opacity
  gradient.addColorStop(1, hexToRgba(color, 0.1)); // 10% opacity
  return gradient;
};
