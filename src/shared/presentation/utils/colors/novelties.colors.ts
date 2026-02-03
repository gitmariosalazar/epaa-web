export const NOVELTY_COLORS: Record<string, string> = {
  NORMAL: '#059669', // verde  → éxito / positivo, ligeramente más profundo para mejor contraste
  CONSUMO_BAJO: '#fbbf24', // ámbar → warning leve, mantiene claridad
  CONSUMO_ALTO: '#f97316', // naranja → warning medio, sigue siendo llamativo sin ser agresivo
  CONSUMO_MUY_BAJO: '#3b82f6', // azul → info / bajo, más intenso que el anterior para mejor visibilidad
  CONSUMO_EXCESIVO: '#b91c1c', // rojo → peligro fuerte, más oscuro y profesional que el rojo puro
  LECTURA_INVALIDA: '#7c3aed', // violeta → anomalía técnica, mantiene elegancia
  SIN_LECTURA: '#6b7280', // gris → neutral / ausente, más suave y profesional
  LECTURA_INICIAL: '#4c1d95', // morado oscuro → inicial / pendiente, más elegante y con mejor contraste
  DEFAULT: '#9ca3af' // gris neutro → fallback, ligeramente más claro que el gris anterior
};
