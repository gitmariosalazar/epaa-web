import React, { useMemo } from 'react';
import type { NoveltyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { useNoveltyStats } from '@/shared/presentation/hooks/dashboard/useNoveltyStats';
import { InteractiveDonutChart, type DonutChartDataItem } from '@/shared/presentation/components/Charts/InteractiveDonutChart/InteractiveDonutChart';

interface NoveltyStatsProps {
  data: NoveltyStatsReport[];
  loading: boolean;
  onSelectNovelty?: (novelty: string) => void;
}

export const NoveltyStats: React.FC<NoveltyStatsProps> = ({
  data,
  loading,
  onSelectNovelty
}) => {
  const { chartData } = useNoveltyStats({ data });

  const mappedData: DonutChartDataItem[] = useMemo(() => {
    return chartData.map((item) => ({
      id: item.name,
      name: item.name,
      value: item.value,
      color: item.color,
      subtitle: `Avg: ${item.average} m³`
    }));
  }, [chartData]);

  const tooltipFormatter = (value: number, name: string) => {
    const item = chartData.find((d) => d.name === name);
    return [
      `${value} - Avg: ${item?.average || 0} m³`,
      name
    ];
  };

  return (
    <InteractiveDonutChart
      title="Desglose por Novedad"
      data={mappedData}
      loading={loading}
      emptyStateMessage="No Novelties Found"
      emptyStateDescription="There are no reading novelties recorded for this period."
      onItemSelect={(id) => {
        if (onSelectNovelty) {
          onSelectNovelty(String(id));
        }
      }}
      tooltipFormatter={tooltipFormatter}
      legendTooltipText="Click para ver el detalle de las lecturas con novedad {name}"
    />
  );
};
