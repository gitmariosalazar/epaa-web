export interface ScadaTelemetryMetric {
  value: number;
  unit: string;
  timestamp: string;
  percentage?: number;
}

export interface ScadaTelemetryResponse {
  tankId: number;
  tankName: string;
  facilityType: string;
  systemStatus: string;
  maxCapacity: number | null;
  maxLevelM: number | null;
  levelTelemetry: ScadaTelemetryMetric | null;
  flowTelemetry: ScadaTelemetryMetric | null;
  pressureTelemetry: ScadaTelemetryMetric | null;
}
