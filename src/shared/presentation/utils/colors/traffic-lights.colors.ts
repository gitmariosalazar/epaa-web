/**
 * Versión con interpolación lineal entre 10 colores clave
 * Más fluida y detallada que con solo 5 stops
 */
export const getTrafficLightColor = (value: number): string => {
  const v = Math.max(0, Math.min(100, value));

  // Puntos clave extendidos para mayor diferenciación
  const stops = [
    { pos: 0, color: '#991b1b' }, // rojo muy oscuro     (crítico extremo)
    { pos: 10, color: '#b91c1c' }, // rojo oscuro
    { pos: 20, color: '#dc2626' }, // rojo vivo
    { pos: 30, color: '#f97316' }, // naranja fuerte
    { pos: 40, color: '#fb923c' }, // naranja claro
    { pos: 50, color: '#eab308' }, // amarillo equilibrado
    { pos: 60, color: '#a3e635' }, // amarillo-verde
    { pos: 70, color: '#84cc16' }, // verde lima
    { pos: 80, color: '#06b6d4' }, // cyan (muy bueno)
    { pos: 90, color: '#3b82f6' }, // azul (excelente)
    { pos: 100, color: '#22c55e' } // verde (máximo/óptimo)
  ];

  // Encontramos el segmento actual
  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const curr = stops[i];

    if (v <= curr.pos) {
      const t = (v - prev.pos) / (curr.pos - prev.pos);
      return interpolateColor(prev.color, curr.color, t);
    }
  }

  // Si es exactamente 100 o mayor (por clamping)
  return stops[stops.length - 1].color;
};

/**
 * Función auxiliar para interpolar entre dos colores HEX
 * (mantiene el formato #RRGGBB en mayúsculas)
 */
function interpolateColor(colorA: string, colorB: string, t: number): string {
  const hexToRgb = (hex: string) =>
    hex
      .replace('#', '')
      .match(/.{1,2}/g)!
      .map((x) => parseInt(x, 16));

  const rgbA = hexToRgb(colorA);
  const rgbB = hexToRgb(colorB);

  const r = Math.round(rgbA[0] + t * (rgbB[0] - rgbA[0]));
  const g = Math.round(rgbA[1] + t * (rgbB[1] - rgbA[1]));
  const b = Math.round(rgbA[2] + t * (rgbB[2] - rgbA[2]));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .padStart(6, '0')
    .toUpperCase()}`;
}

export const DEFAULT_PALETTE = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#eab308', // yellow-500
  '#a855f7', // purple-500
  '#f43f5e', // rose-500
  '#0ea5e9', // sky-500
  '#22c55e', // green-500
  '#d946ef', // fuchsia-500
  '#64748b', // slate-500
  '#0284c7', // light blue-600
  '#4f46e5' // indigo-600
];
