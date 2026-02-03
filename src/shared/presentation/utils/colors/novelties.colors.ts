export const NOVELTY_COLORS: Record<string, string> = {
  NORMAL: '#059669',
  CONSUMO_BAJO: '#d97706',
  CONSUMO_ALTO: '#c2410c',
  CONSUMO_MUY_BAJO: '#1d4ed8',
  CONSUMO_EXCESIVO: '#b91c1c',
  LECTURA_INVALIDA: '#6d28d9',
  SIN_LECTURA: '#4b5563',
  LECTURA_INICIAL: '#5b21b6',
  DEFAULT: '#6b7280'
};

export const getNoveltyColor = (noveltyName: string): string => {
  if (!noveltyName) return NOVELTY_COLORS.DEFAULT;

  const normalizedKey = noveltyName.toUpperCase().replace(/\s+/g, '_');

  return (
    NOVELTY_COLORS[normalizedKey] ||
    NOVELTY_COLORS[noveltyName] ||
    NOVELTY_COLORS.DEFAULT
  );
};
