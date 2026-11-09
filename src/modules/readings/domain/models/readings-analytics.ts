export type AnalyticsSystemType = 'modern' | 'legacy';

export interface ExecutiveDashboardAnalytics {
  year?: number;
  month?: string;
  analyzedPeriod?: string;
  totalReadingsTaken: number;
  totalSectorsCovered: number;
  totalActiveConnections: number;
  totalVolumeM3: number;
  averageConsumptionPerAccountM3: number;
  minConsumptionM3: number;
  maxConsumptionM3: number;
  waterBilledUsd: number;
  sewerBilledUsd: number;
  totalBilledUsd: number;
  averageTicketPerAccountUsd: number;
  weightedAverageEffectiveTariffUsdPerM3: number;
  totalReadingsWithNovelty: number;
  operativeNoveltyPercentage: number;
}

export interface SectorPerformanceAnalytics {
  sector: number;
  totalReadings: number;
  consumedVolumeM3: number;
  averageConsumptionM3: number;
  waterBilledUsd: number;
  sewerBilledUsd: number;
  totalBilledUsd: number;
  revenueSharePercentage: number;
  volumeSharePercentage: number;
  averageTariffUsdPerM3: number;
  noveltiesCount: number;
  noveltyPercentage: number;
  revenueRank: number;
  volumeRank: number;
}

export interface MonthlyTrendAnalytics {
  year?: number;
  monthNumber?: number;
  monthName?: string;
  readingMonth?: string;
  totalReadings: number;
  totalVolumeM3: number;
  deltaVolumeM3: number | null;
  growthVolumePercentage: number | null;
  waterBilledUsd: number;
  sewerBilledUsd: number;
  totalBilledUsd: number;
  deltaRevenueUsd: number | null;
  growthRevenuePercentage: number | null;
}

export interface NoveltyEconomicImpactAnalytics {
  novelty: string;
  casesCount: number;
  shareOfTotalReadingsPercentage: number;
  totalVolumeM3: number;
  averageVolumePerCaseM3: number;
  waterBilledUsd: number;
  sewerBilledUsd: number;
  totalBilledUsd: number;
}

export interface TopConsumerAnalytics {
  readingId: string | number;
  sector: number;
  account: number;
  cadastralKey: string;
  connectionId?: string;
  meterNumber: string;
  address: string;
  clientName: string;
  previousReading: number;
  currentReading: number;
  consumedVolumeM3: number;
  waterBilledUsd: number;
  sewerBilledUsd: number;
  totalBilledUsd: number;
  novelty: string;
  readingDate: string;
  gpsCoordinates?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface InterannualComparisonAnalytics {
  sector: number;
  homologousAccountsCount: number;
  readingsBaseYear: number;
  readingsTargetYear: number;
  deltaReadings: number;
  volumeBaseYearM3: number;
  volumeTargetYearM3: number;
  deltaVolumeM3: number;
  varianceVolumePercentage: number;
  billedBaseYearUsd: number;
  billedTargetYearUsd: number;
  deltaBilledUsd: number;
  varianceBilledPercentage: number;
  managementDiagnostic: string;
}

export interface AnalyticsFilterParams {
  year?: number;
  month?: number | string;
  sector?: number;
  sortBy?: 'revenue' | 'volume' | 'readings' | 'sector';
  startMonthNumber?: number;
  endMonthNumber?: number;
  limit?: number;
  minConsumptionM3?: number;
  novelty?: string;
  baseYear?: number;
  targetYear?: number;
  onlyHomologous?: boolean;
}
