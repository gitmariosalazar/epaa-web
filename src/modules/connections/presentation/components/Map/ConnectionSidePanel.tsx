import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ConnectionCard } from './ConnectionCard';
import type { Connection } from '../../../domain/models/Connection';
import { IoSearch } from 'react-icons/io5';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/presentation/components/Button/Button';

interface ConnectionSidePanelProps {
  connections: Connection[];
  selectedConnection: Connection | null;
  onSelect: (conn: Connection) => void;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

export const ConnectionSidePanel: React.FC<ConnectionSidePanelProps> = ({
  connections,
  selectedConnection,
  onSelect,
  hasMore = false,
  isLoading = false,
  onLoadMore,
  collapsed,
  onToggle
}) => {
  const PAGE_SIZE = 100;

  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [isPagingForward, setIsPagingForward] = useState(false);
  const pendingOffsetRef = useRef<number | null>(null);

  const navigate = useNavigate();

  const handleViewIncidentsOnTable = (connectionId: string) => {
    navigate(`/incidents?connectionId=${encodeURIComponent(connectionId)}`);
  };

  const handleViewIncidentsOnMap = (connectionId: string) => {
    navigate(`/incidents/map?connectionId=${encodeURIComponent(connectionId)}`);
  };

  const normalizedSearch = search.toLowerCase();

  const filteredConnections = useMemo(
    () =>
      connections.filter(
        (conn) =>
          (conn.connectionCadastralKey || '')
            .toLowerCase()
            .includes(normalizedSearch) ||
          (conn.connectionAddress || '')
            .toLowerCase()
            .includes(normalizedSearch)
      ),
    [connections, normalizedSearch]
  );

  useEffect(() => {
    setOffset(0);
    setIsPagingForward(false);
    pendingOffsetRef.current = null;
  }, [search]);

  useEffect(() => {
    if (filteredConnections.length === 0) {
      setOffset(0);
      return;
    }

    if (offset >= filteredConnections.length) {
      const lastPageOffset =
        Math.floor((filteredConnections.length - 1) / PAGE_SIZE) * PAGE_SIZE;
      setOffset(lastPageOffset);
    }
  }, [filteredConnections.length, offset]);

  const visibleConnections = useMemo(() => {
    return filteredConnections.slice(offset, offset + PAGE_SIZE);
  }, [filteredConnections, offset]);

  const hasPrevious = offset > 0;
  const hasNext = offset + PAGE_SIZE < filteredConnections.length || hasMore;

  const from = filteredConnections.length === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, filteredConnections.length);

  const handlePrevious = () => {
    setOffset((prev) => Math.max(prev - PAGE_SIZE, 0));
  };

  const handleNext = () => {
    const nextOffset = offset + PAGE_SIZE;

    if (nextOffset < filteredConnections.length) {
      setOffset(nextOffset);
      return;
    }

    if (hasMore && onLoadMore) {
      setIsPagingForward(true);
      pendingOffsetRef.current = nextOffset;
      onLoadMore();
    }
  };

  useEffect(() => {
    const pending = pendingOffsetRef.current;
    if (pending === null) {
      if (!isLoading) {
        setIsPagingForward(false);
      }
      return;
    }

    if (filteredConnections.length > pending) {
      setOffset(pending);
      pendingOffsetRef.current = null;
      setIsPagingForward(false);
      return;
    }

    if (!hasMore && !isLoading) {
      pendingOffsetRef.current = null;
      setIsPagingForward(false);
    }
  }, [filteredConnections.length, hasMore, isLoading]);

  return (
    <aside className={`map-side-panel ${collapsed ? 'collapsed' : ''}`}>
      <button className="side-panel-toggle" onClick={onToggle}>
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className="side-panel-inner">
        <header className="map-side-panel-header">
          <div className="panel-header-top">
            <h2 className="panel-title">Acometidas</h2>
            <span className="panel-count">
              {filteredConnections.length} REGISTROS
            </span>
          </div>
          <Input
            type="text"
            placeholder="Buscar por clave,dirección..."
            className="premium-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<IoSearch />}
          />
          <div className="side-panel-pagination">
            <Button
              type="button"
              variant="dashed"
              onClick={handlePrevious}
              disabled={!hasPrevious || isPagingForward}
              size="xs"
              leftIcon={<FaChevronLeft />}
            >
              Anterior
            </Button>

            <span className="side-panel-page-info">
              {from}-{to} de {filteredConnections.length}
            </span>

            <Button
              type="button"
              onClick={handleNext}
              disabled={!hasNext || isPagingForward}
              variant="dashed"
              size="xs"
              rightIcon={<FaChevronRight />}
            >
              {isPagingForward ? 'Cargando...' : 'Siguiente'}
            </Button>
          </div>
        </header>

        <main className="map-side-panel-content">
          <div className="panel-list">
            {visibleConnections.map((conn) => (
              <ConnectionCard
                key={conn.connectionId}
                onViewIncidentsOnTable={handleViewIncidentsOnTable}
                onViewIncidentsOnMap={handleViewIncidentsOnMap}
                connection={conn}
                isSelected={
                  selectedConnection?.connectionId === conn.connectionId
                }
                onSelect={onSelect}
              />
            ))}
          </div>
        </main>
      </div>
    </aside>
  );
};
