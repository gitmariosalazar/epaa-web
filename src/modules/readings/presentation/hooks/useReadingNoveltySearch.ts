import { useState, useMemo } from 'react';
import type { ReadingNovelty } from '../../domain/models/ReadingNovelty';
import { NoveltyType } from '@/shared/utils/types/novelties-type';

export const useReadingNoveltySearch = (data: ReadingNovelty[], baseNovelty: string) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [noveltySearchTerm, setNoveltySearchTerm] = useState<string>(NoveltyType.TODAS);

  const filteredData = useMemo(() => {
    let result = data;

    // 1. Search by searchTerm (cardId, clientName, cadastralKey, sector)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      result = result.filter((item) => {
        const matchCardId = item.cardId?.toLowerCase().includes(lowerSearch);
        const matchClientName = item.clientName?.toLowerCase().includes(lowerSearch);
        const matchCadastralKey = item.cadastralKey?.toLowerCase().includes(lowerSearch);
        const matchSector = item.sector?.toString() === lowerSearch;

        return matchCardId || matchClientName || matchCadastralKey || matchSector;
      });
    }

    // 2. Filter by noveltySearchTerm ONLY if baseNovelty is TODAS
    if (baseNovelty === NoveltyType.TODAS && noveltySearchTerm !== NoveltyType.TODAS) {
      result = result.filter((item) => {
        return item.novelty === noveltySearchTerm;
      });
    }

    return result;
  }, [data, searchTerm, noveltySearchTerm, baseNovelty]);

  return {
    searchTerm,
    setSearchTerm,
    noveltySearchTerm,
    setNoveltySearchTerm,
    filteredData
  };
};
