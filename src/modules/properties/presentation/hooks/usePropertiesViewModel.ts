import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProperties } from './useProperties';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { Building2, ChartBarIcon, User } from 'lucide-react';
import React from 'react';

export type PropertiesTab = 'statistics' | 'all' | 'byOwner';

function applySortConfig<T>(
  data: T[],
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null
): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export const usePropertiesViewModel = () => {
  const { t } = useTranslation();

  const PROPERTIES_TABS: TabItem<PropertiesTab>[] = useMemo(
    () => [
      {
        id: 'statistics',
        label: t('properties.tabs.statistics', 'Estadísticas'),
        icon: React.createElement(ChartBarIcon, { size: 16 })
      },
      {
        id: 'all',
        label: t('properties.tabs.all', 'Todas las Propiedades'),
        icon: React.createElement(Building2, { size: 16 })
      },
      {
        id: 'byOwner',
        label: t('properties.tabs.byOwner', 'Por Propietario'),
        icon: React.createElement(User, { size: 16 })
      }
    ],
    [t]
  );

  const {
    properties,
    loading: isLoading,
    error,
    clearError,
    fetchAllProperties,
    fetchPropertiesByOwner,
    clearProperties,
    fetchPropertiesByType,
    propertiesByType
  } = useProperties();

  const [activeTab, setActiveTab] = useState<PropertiesTab>('statistics');
  const [clientId, setClientId] = useState<string>('');

  const [searchBy, setSearchBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limitSize = 50;

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    clearProperties();
    setSortConfig(null);
    clearError();
    setOffset(0);
    setHasMore(true);
    clearProperties();

    if (activeTab === 'statistics') {
      fetchPropertiesByType().then((res) => {
        if (res && res.length < limitSize) setHasMore(false);
      });
    } else if (activeTab === 'all') {
      clearProperties();
      fetchAllProperties(limitSize, 0, false).then((res) => {
        if (res && res.length < limitSize) setHasMore(false);
      });
    } else if (activeTab === 'byOwner') {
      clearProperties();
      if (clientId) {
        fetchPropertiesByOwner(clientId, limitSize, 0, false).then((res) => {
          if (res && res.length < limitSize) setHasMore(false);
        });
      }
    }
  }, [activeTab, clearError, fetchAllProperties, clearProperties]);

  const handleFetch = () => {
    setOffset(0);
    setHasMore(true);
    if (activeTab === 'statistics') {
      fetchPropertiesByType().then((res) => {
        if (res && res.length < limitSize) setHasMore(false);
      });
    } else if (activeTab === 'all') {
      clearProperties();
      fetchAllProperties(limitSize, 0, false).then((res) => {
        if (res && res.length < limitSize) setHasMore(false);
      });
    } else if (activeTab === 'byOwner') {
      clearProperties();
      if (clientId) {
        fetchPropertiesByOwner(clientId, limitSize, 0, false).then((res) => {
          if (res && res.length < limitSize) setHasMore(false);
        });
      }
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading) return;
    const nextOffset = offset + limitSize;
    setOffset(nextOffset);

    if (activeTab === 'statistics') {
      fetchPropertiesByType().then((res) => {
        if (res && res.length < limitSize) setHasMore(false);
      });
    } else if (activeTab === 'all') {
      fetchAllProperties(limitSize, nextOffset, true).then((res) => {
        if (res && res.length < limitSize) setHasMore(false);
      });
    } else if (activeTab === 'byOwner' && clientId) {
      fetchPropertiesByOwner(clientId, limitSize, nextOffset, true).then(
        (res) => {
          if (res && res.length < limitSize) setHasMore(false);
        }
      );
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') =>
    setSortConfig({ key, direction });

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (activeTab === 'statistics') return result;

    if (activeTab === 'all' && searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        if (searchBy === 'all') {
          return (
            String(p.propertyCadastralKey || '')
              .toLowerCase()
              .includes(query) ||
            String(p.propertyClientId || '')
              .toLowerCase()
              .includes(query) ||
            String(p.propertySector || '')
              .toLowerCase()
              .includes(query) ||
            String(p.propertyTypeName || '')
              .toLowerCase()
              .includes(query)
          );
        } else if (searchBy === 'cadastralKey') {
          return String(p.propertyCadastralKey || '')
            .toLowerCase()
            .includes(query);
        } else if (searchBy === 'clientId') {
          return String(p.propertyClientId || '')
            .toLowerCase()
            .includes(query);
        } else if (searchBy === 'sector') {
          return String(p.propertySector || '')
            .toLowerCase()
            .includes(query);
        } else if (searchBy === 'propertyType') {
          return String(p.propertyTypeName || '')
            .toLowerCase()
            .includes(query);
        }
        return true;
      });
    }

    return applySortConfig(result, sortConfig);
  }, [properties, activeTab, clientId, searchBy, searchQuery, sortConfig]);

  const clearFilters = () => {
    setSearchQuery('');
    setSearchBy('all');
  };

  const errorMessage =
    error instanceof Error ? error.message : error ? String(error) : null;

  return {
    t,
    isLoading,
    error: errorMessage,
    translatedTabs: PROPERTIES_TABS,
    activeTab,
    setActiveTab,
    clientId,
    setClientId,
    searchBy,
    setSearchBy,
    searchQuery,
    setSearchQuery,
    clearFilters,
    sortConfig,
    handleSort,
    filteredProperties,
    propertiesByType,
    handleFetch,
    loadMore,
    hasMore
  };
};
