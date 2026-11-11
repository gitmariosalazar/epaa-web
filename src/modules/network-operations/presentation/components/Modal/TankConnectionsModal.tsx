import React, { useState, useMemo } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { GeoJsonFeature } from '../../../domain/models/GeoJsonFeature';
import { Search, MapPin, Home, Layers } from 'lucide-react';

export interface TankConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tankName: string;
  connections: GeoJsonFeature[];
  onSelectConnection: (connection: GeoJsonFeature) => void;
}

export const TankConnectionsModal: React.FC<TankConnectionsModalProps> = ({
  isOpen,
  onClose,
  tankName,
  connections,
  onSelectConnection
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado reactivo en tiempo real por clave catastral, id o tanque abastecedor
  const filteredConnections = useMemo(() => {
    if (!searchTerm.trim()) return connections;
    const query = searchTerm.toLowerCase().trim();

    return connections.filter((conn) => {
      const cadastral = conn.properties?.cadastralKey?.toLowerCase() || '';
      const connId = String(conn.properties?.connectionId || '').toLowerCase();
      const code = conn.properties?.code?.toLowerCase() || '';
      const suppliedBy = conn.properties?.suppliedByTank?.toLowerCase() || '';
      return (
        cadastral.includes(query) ||
        connId.includes(query) ||
        code.includes(query) ||
        suppliedBy.includes(query)
      );
    });
  }, [connections, searchTerm]);

  const handleSelect = (connection: GeoJsonFeature) => {
    onSelectConnection(connection);
    onClose();
  };

  const isAllNetwork = !tankName || tankName.toLowerCase().includes('toda');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="#0ea5e9" />
          <span>
            {isAllNetwork
              ? 'Acometidas de la Red Hidráulica'
              : `Acometidas de ${tankName}`}
          </span>
        </div>
      }
      description={
        isAllNetwork
          ? `Listado general de acometidas domiciliarias de Antonio Ante (${connections.length} registradas)`
          : `Listado de acometidas domiciliarias vinculadas y abastecidas por ${tankName} (${connections.length} registradas)`
      }
      size="lg"
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mostrando {filteredConnections.length} de {connections.length}{' '}
            acometidas
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Barra de búsqueda predictiva */}
        <Input
          placeholder="Buscar por clave catastral, código o tanque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
          size="small"
          width="100%"
        />

        {/* Tabla / Listado scrollable */}
        <div
          style={{
            maxHeight: '420px',
            overflowY: 'auto',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            background: 'var(--surface)'
          }}
        >
          {filteredConnections.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}
            >
              No se encontraron acometidas con el criterio de búsqueda "
              {searchTerm}".
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.85rem',
                textAlign: 'left'
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--background)',
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}
                >
                  <th style={{ padding: '10px 14px', width: '45px' }}>#</th>
                  <th style={{ padding: '10px 14px' }}>Clave Catastral</th>
                  <th style={{ padding: '10px 14px' }}>Tanque Abastecedor</th>
                  <th style={{ padding: '10px 14px' }}>N</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredConnections.map((conn, index) => {
                  const cadastralKey = conn.properties?.cadastralKey || 'N/A';
                  const connectionId = conn.properties?.connectionId || 'N/A';
                  const suppliedByTank =
                    conn.properties?.suppliedByTank || 'Sin asignar';

                  return (
                    <tr
                      key={conn.id || cadastralKey || index}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'var(--background-hover, rgba(14, 165, 233, 0.05))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td
                        style={{
                          padding: '9px 14px',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {index + 1}
                      </td>
                      <td style={{ padding: '9px 14px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Home size={14} color="#0ea5e9" />
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 600,
                              color: 'var(--text-primary)'
                            }}
                          >
                            {cadastralKey}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '9px 14px' }}>
                        <span
                          style={{
                            color: '#8b5cf6',
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          }}
                        >
                          🛢️ {suppliedByTank}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '9px 14px',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {connectionId}
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'right' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<MapPin size={13} />}
                          onClick={() => handleSelect(conn)}
                          title="Ubicar y enfocar esta acometida en el mapa"
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          Ubicar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
};
