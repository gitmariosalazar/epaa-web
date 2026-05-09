export const NoveltyType = {
  TODAS: 'TODAS',
  NORMAL: 'NORMAL',
  CONSUMO_BAJO: 'CONSUMO BAJO',
  CONSUMO_ALTO: 'CONSUMO ALTO',
  CONSUMO_MUY_BAJO: 'CONSUMO MUY BAJO',
  CONSUMO_EXCESIVO: 'CONSUMO EXCESIVO',
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
  [NoveltyType.CONSUMO_MUY_BAJO]: 'Consumo muy bajo',
  [NoveltyType.CONSUMO_EXCESIVO]: 'Consumo excesivo',
  [NoveltyType.LECTURA_INVALIDA]: 'Lectura inválida',
  [NoveltyType.SIN_LECTURA]: 'Sin lectura',
  [NoveltyType.LECTURA_INICIAL]: 'Lectura inicial'
};
