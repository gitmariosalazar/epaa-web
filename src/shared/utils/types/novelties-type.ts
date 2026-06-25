export const NoveltyType = {
  TODAS: 'TODAS',
  NORMAL: 'NORMAL',
  CONSUMO_BAJO: 'CONSUMO BAJO',
  CONSUMO_ALTO: 'CONSUMO ALTO',
  CONSUMO_EXCESIVO: 'CONSUMO EXCESIVO',
  ALERTA_CONSUMO_BAJO: 'ALERTA CONSUMO BAJO',
  ALERTA_CONSUMO_ALTO: 'ALERTA CONSUMO ALTO',
  LECTURA_INVALIDA: 'LECTURA INVÁLIDA',
  SIN_LECTURA: 'SIN LECTURA',
  LECTURA_INICIAL: 'LECTURA INICIAL'
} as const;

export type NoveltyType = (typeof NoveltyType)[keyof typeof NoveltyType];

export const NoveltyTypeLabelMap: Record<NoveltyType, string> = {
  [NoveltyType.TODAS]: 'Todas',
  [NoveltyType.NORMAL]: 'Normal',
  [NoveltyType.CONSUMO_BAJO]: 'Consumo bajo',
  [NoveltyType.CONSUMO_ALTO]: 'Consumo alto',
  [NoveltyType.ALERTA_CONSUMO_BAJO]: 'Alerta consumo bajo',
  [NoveltyType.ALERTA_CONSUMO_ALTO]: 'Alerta consumo alto',
  [NoveltyType.CONSUMO_EXCESIVO]: 'Consumo excesivo',
  [NoveltyType.LECTURA_INVALIDA]: 'Lectura inválida',
  [NoveltyType.SIN_LECTURA]: 'Sin lectura',
  [NoveltyType.LECTURA_INICIAL]: 'Lectura inicial'
};
