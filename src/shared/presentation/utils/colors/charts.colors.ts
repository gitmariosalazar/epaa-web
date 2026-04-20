import { chartColorService, type SemanticColor } from './ChartColorManager';

export const CHART_COLORS: SemanticColor[] = [
  'blue',
  'amber',
  'orange',
  'red',
  'indigo',
  'pink',
  'purple',
  'teal',
  'sky',
  'cyan',
  'lime',
  'fuchsia',
  'rose',
  'slate',
  'emerald',
  'green',
  'yellow',
  'violet'
];

export type { SemanticColor as ChartColor };

/**
 * Global accessor for chart colors to maintain SOLID principles
 */
export const getChartColor = (nameOrIndex: string | number): string => {
  if (typeof nameOrIndex === 'number') {
    return chartColorService.getColorByIndex(nameOrIndex);
  }
  return chartColorService.getColorByName(nameOrIndex);
};

export const DEFAULT_PALETTE = CHART_COLORS.map((c) => chartColorService.getColorByName(c));
