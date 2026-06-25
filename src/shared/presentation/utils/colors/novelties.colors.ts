export const NOVELTY_COLORS: Record<string, string> = {
  NORMAL: '#059669', // Verde Esmeralda (Éxito / Todo OK)

  CONSUMO_BAJO: '#f59e0b', // Ámbar/Amarillo (Precaución leve)
  ALERTA_CONSUMO_BAJO: '#d97706', // Naranja Oscuro (Atención, sub-consumo crítico)

  CONSUMO_ALTO: '#ca8a04', // Amarillo Oscuro / Mostaza
  ALERTA_CONSUMO_ALTO: '#dc2626', // Rojo Vivo (Alerta fuerte)
  CONSUMO_EXCESIVO: '#7f1d1d', // Rojo Oscuro / Vino (Emergencia por fuga)

  LECTURA_INVALIDA: '#7c3aed', // Morado Intenso (Error de lógica/sistema)
  LECTURA_INICIAL: '#db2777', // Rosado Fucsia (Estado administrativo nuevo)

  SIN_LECTURA: '#4b5563', // Gris Oscuro (Neutro, no se pudo medir)
  DEFAULT: '#6b7280' // Gris Medio
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
