import { useState, useMemo } from 'react';
import type { NoveltyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { getNoveltyColor } from '../../utils/colors/novelties.colors';

interface UseNoveltyStatsProps {
  data: NoveltyStatsReport[];
}

export const useNoveltyStats = ({ data }: UseNoveltyStatsProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const chartData = useMemo(() => {
    return data.map((item) => {
      const noveltyName = item.novelty || 'Unknown';
      const color = getNoveltyColor(noveltyName);

      return {
        name: noveltyName,
        value: item.count,
        color: color,
        average: Number(item.averageConsumption).toFixed(1)
      };
    });
  }, [data]);

  const total = useMemo(
    () => chartData.reduce((acc, cur) => acc + cur.value, 0),
    [chartData]
  );

  const activeItem = activeIndex >= 0 ? chartData[activeIndex] : null;

  return {
    activeIndex,
    setActiveIndex,
    onPieEnter,
    onPieLeave,
    chartData,
    total,
    activeItem
  };
};
