import React, { useState } from 'react';
import { ConnectionCard } from './ConnectionCard';
import type { Connection } from '../../../domain/models/Connection';
import { IoSearch } from 'react-icons/io5';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Input } from '@/shared/presentation/components/Input/Input';

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
  onToggle
}) => {
  const [search, setSearch] = useState('');

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
            <h2 className="panel-title">Connections</h2>
            <span className="panel-count">
              {filteredConnections.length} RECORDS
            </span>
          </div>
          <Input
            type="text"
            placeholder="Search by key, address..."
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
