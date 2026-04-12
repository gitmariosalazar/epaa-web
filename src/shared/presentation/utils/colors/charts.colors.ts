export const CHART_COLORS = [
  'blue',
  'amber',
  'purple',
  'red',
  'green',
  'orange',
  'yellow',
  'lime',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'indigo',
  'pink',
  'rose',
  'fuchsia',
  'slate',
  'gray',
  'zinc',
  'neutral'
] as const;

export type ChartColor = typeof CHART_COLORS[number];
