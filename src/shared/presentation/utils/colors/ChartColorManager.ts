/**
 * Clean Architecture & SOLID Color Management System for Charts
 */

export type SemanticColor =
  | 'blue'
  | 'green'
  | 'red'
  | 'amber'
  | 'purple'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'pink'
  | 'rose'
  | 'fuchsia'
  | 'slate'
  | 'violet';

export interface ColorDefinition {
  base: string;
  light: string;
  dark: string;
  gradient: [string, string];
}

export interface IChartColorService {
  getColorByIndex(index: number): string;
  getColorByName(name: SemanticColor | string): string;
  getDefinition(name: SemanticColor | string): ColorDefinition;
  getShadedColor(color: string, percent: number): string;
}

/**
 * Implementation of a professional categorical palette
 */
/**
 * Master Palette Definition
 * A synchronized list of names and HEX values to ensure 100% consistency
 */
const MASTER_PALETTE_DATA: { name: SemanticColor; hex: string }[] = [
  { name: 'blue', hex: '#3b82f6' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'orange', hex: '#f97316' },
  { name: 'red', hex: '#ef4444' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'purple', hex: '#8b5cf6' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'sky', hex: '#0ea5e9' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'lime', hex: '#84cc16' },
  { name: 'fuchsia', hex: '#d946ef' },
  { name: 'rose', hex: '#f43f5e' },
  { name: 'slate', hex: '#64748b' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'green', hex: '#22c55e' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'violet', hex: '#7c3aed' }
];

const PROFESSIONAL_HEX_PALETTE = MASTER_PALETTE_DATA.map(p => p.hex);
const SEMANTIC_ORDERED_NAMES = MASTER_PALETTE_DATA.map(p => p.name);


const SEMANTIC_MAP: Record<string, string> = {
  blue: '#3b82f6',
  amber: '#f59e0b',
  orange: '#f97316',
  red: '#ef4444',
  indigo: '#6366f1',
  pink: '#ec4899',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  sky: '#0ea5e9',
  cyan: '#06b6d4',
  lime: '#84cc16',
  fuchsia: '#d946ef',
  rose: '#f43f5e',
  slate: '#64748b',
  emerald: '#10b981',
  green: '#22c55e',
  yellow: '#eab308',
  violet: '#7c3aed'
};

export class ChartColorService implements IChartColorService {
  private static instance: ChartColorService;

  private constructor() {}

  public static getInstance(): ChartColorService {
    if (!ChartColorService.instance) {
      ChartColorService.instance = new ChartColorService();
    }
    return ChartColorService.instance;
  }

  public getColorByIndex(index: number): string {
    return PROFESSIONAL_HEX_PALETTE[index % PROFESSIONAL_HEX_PALETTE.length];
  }

  public getColorByName(name: string): string {
    if (SEMANTIC_MAP[name.toLowerCase()]) {
      return SEMANTIC_MAP[name.toLowerCase()];
    }
    return name; // Return as is if it's already a HEX/RGB or unknown
  }

  public getDefinition(name: string): ColorDefinition {
    const base = this.getColorByName(name);
    return {
      base,
      light: `color-mix(in srgb, ${base}, white 20%)`,
      dark: `color-mix(in srgb, ${base}, black 20%)`,
      gradient: [
        `color-mix(in srgb, ${base}, white 10%)`,
        `color-mix(in srgb, ${base}, black 15%)`
      ]
    };
  }

  /**
   * Applies shading logic using CSS color-mix for maximum fidelity
   */
  public getShadedColor(color: string, percent: number): string {
    if (percent > 0) {
      return `color-mix(in srgb, ${color}, white ${percent}%)`;
    } else if (percent < 0) {
      return `color-mix(in srgb, ${color}, black ${Math.abs(percent)}%)`;
    }
    return color;
  }
}

export const DEFAULT_PALETTE_COLOR_NAMES: string[] = SEMANTIC_ORDERED_NAMES;

export const chartColorService = ChartColorService.getInstance();
