import React, { useState } from 'react';
import { ConnectionCard } from './ConnectionCard';
import type { Connection } from '../../../domain/models/Connection';
import { IoSearch } from 'react-icons/io5';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';
import { useNavigate } from 'react-router-dom';

interface ConnectionSidePanelProps {
  connections: Connection[];
  selectedConnection: Connection | null;
  onSelect: (conn: Connection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export const ConnectionSidePanel: React.FC<ConnectionSidePanelProps> = ({
  connections,
  selectedConnection,
  onSelect,
  collapsed,
  onToggle,
}) => {
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const handleViewIncidentsOnTable = (connectionId: string) => {
    navigate(`/incidents?connectionId=${encodeURIComponent(connectionId)}`)
  };

  const handleViewIncidentsOnMap = (connectionId: string) => {
    navigate(`/incidents/map?connectionId=${encodeURIComponent(connectionId)}`)
  };

  const filteredConnections = connections.filter(
    (conn) =>
      (conn.connectionCadastralKey || '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (conn.connectionAddress || '')
        .toLowerCase()
        .includes(search.toLowerCase())
  );

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
        </header>

        <main className="map-side-panel-content">
          <div className="panel-list">
            {filteredConnections.map((conn) => (
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
