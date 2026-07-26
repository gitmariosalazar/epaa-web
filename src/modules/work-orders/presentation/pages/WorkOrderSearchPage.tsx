import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Search, X } from 'lucide-react';
import '../styles/WorkOrdersProcessPage.css';
import { WorkOrdersProcessPage } from './WorkOrdersProcessPage';

export const WorkOrderSearchPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const codeParam = searchParams.get('code');

  // Keep the input in sync with the URL
  useEffect(() => {
    if (codeParam) {
      setSearchInput(codeParam);
    } else {
      setSearchInput('');
    }
  }, [codeParam]);

  const handleSearch = () => {
    const code = searchInput.trim().toUpperCase();
    if (!code) return;
    navigate(`/work-orders/search?code=${encodeURIComponent(code)}`);
  };

  const handleClear = () => {
    setSearchInput('');
    navigate(`/work-orders/search`);
  };

  return (
    <PageLayout
      header={
        <div className="wo-process-header">
          <div className="wo-process-header__info">
            <h2 className="wo-process-header__title">Buscar Orden de Trabajo</h2>
            <p className="wo-process-header__subtitle">Encuentra una OT por código para procesarla</p>
          </div>
          <div className="wo-process-search">
            <Input
              id="wo-process-search-input"
              width={'350px'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Código OT — Ej: OT-2026-0000001"
              autoComplete="off"
              leftIcon={<Search size={14} />}
              size="compact"
            />
            <Button
              id="wo-process-search-btn"
              onClick={handleSearch}
              variant="primary"
              leftIcon={<Search size={14} />}
              disabled={!searchInput.trim()}
              size="compact"
            >
              Buscar
            </Button>
            {codeParam && (
              <Button
                variant="dashed"
                color='warning'
                size="compact"
                leftIcon={<X size={14} />}
                onClick={handleClear}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      }
    >
      {!codeParam ? (
        <div className="wo-process-empty">
          <EmptyState
            icon={<div className="wo-process-empty__icon"><Search size={48} opacity={0.3} /></div>}
            message="Ingresa un código de OT para procesarla"
            description="Escribe el código de la orden (Ej: OT-2026-0000001) y presiona Buscar para iniciar el proceso"
          />
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <WorkOrdersProcessPage isEmbedded={true} />
        </div>
      )}
    </PageLayout>
  );
};
