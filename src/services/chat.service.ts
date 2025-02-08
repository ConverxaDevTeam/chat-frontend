export const hexToRgb = (hex: string) => {
  // Remove the hash if present
  const sanitizedHex = hex.replace(/^#/, "");

  // Handle both 3-digit and 6-digit hex
  const fullHex =
    sanitizedHex.length === 3
      ? sanitizedHex
          .split("")
          .map(char => char + char)
          .join("")
      : sanitizedHex;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return { r, g, b };
};

export const getContrastingTextColor = (backgroundColor: string): string => {
  const { r, g, b } = hexToRgb(backgroundColor);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? "#000000" : "#FFFFFF";
};
