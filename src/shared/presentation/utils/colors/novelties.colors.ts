export const NOVELTY_COLORS: Record<string, string> = {
  NORMAL: '#10b981', // Verde Esmeralda (Éxito / Todo OK)

  // Sub-consumos (Tonos Ámbar/Amarillo)
  CONSUMO_BAJO: '#f59e0b',
  ALERTA_CONSUMO_BAJO: '#d97706',

  // Sobre-consumos (Tonos Naranja a Rojo)
  CONSUMO_ALTO: '#f97316', // Naranja
  ALERTA_CONSUMO_ALTO: '#ea580c', // Naranja intenso
  CONSUMO_EXCESIVO: '#dc2626', // Rojo fuerte (Fuga o daño)

  // Estados del sistema
  LECTURA_INVALIDA: '#be123c', // Carmesí/Rosa oscuro (Claramente un error, sin ser el rojo de consumo)
  LECTURA_INICIAL: '#0ea5e9', // Azul cielo (Informativo, estado nuevo/neutral)
  
  SIN_LECTURA: '#64748b', // Gris Pizarra
  DEFAULT: '#94a3b8'
};

export const getNoveltyColor = (noveltyName: string): string => {
  if (!noveltyName) return NOVELTY_COLORS.DEFAULT;

  const normalizedKey = noveltyName
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');

  return (
    NOVELTY_COLORS[normalizedKey] ||
    NOVELTY_COLORS[noveltyName] ||
    NOVELTY_COLORS.DEFAULT
  );
};
