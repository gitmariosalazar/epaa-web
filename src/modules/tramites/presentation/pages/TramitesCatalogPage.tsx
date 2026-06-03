// ============================================================
// PRESENTATION — TramitesCatalogPage
// Displays all available tramite types grouped by category.
// OCP: Adding a new category only requires a new CATEGORY_META
//      entry — no logic changes needed.
// SRP: Only responsible for catalog display and navigation.
// ============================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Search, Droplets } from 'lucide-react';
import { useTramites } from '../context/TramitesContext';
import { TramiteCard } from '../components/TramiteCard';
import type { Tramite, CategoriaTramite } from '../../domain/models/Tramite';
import '../styles/Tramites.css';

import { CATEGORY_META, CATEGORY_ORDER } from '../constants/TramiteUI';

export const TramitesCatalogPage: React.FC = () => {
  const { tramites, isLoading } = useTramites();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return tramites;
    const q = search.toLowerCase();
    return tramites.filter(
      (t) =>
        t.nombre.toLowerCase().includes(q) ||
        t.descripcion.toLowerCase().includes(q) ||
        CATEGORY_META[t.categoria]?.label.toLowerCase().includes(q)
    );
  }, [tramites, search]);

  /** Group tramites by category, preserving CATEGORY_ORDER */
  const grouped = useMemo(() => {
    const map = new Map<CategoriaTramite, Tramite[]>();
    CATEGORY_ORDER.forEach((cat) => map.set(cat, []));
    filtered.forEach((t) => {
      const list = map.get(t.categoria) ?? [];
      list.push(t);
      map.set(t.categoria, list);
    });
    return map;
  }, [filtered]);

  const handleSelect = (tramite: Tramite) => {
    navigate(`/tramites/${tramite.id}`);
  };

  return (
    <PageLayout
      header={
        <div className="tramites-catalog-header">
          <div className="tramites-catalog-header__text">
            <h2 className="tramites-catalog-header__title">
              Trámites y Requisitos
            </h2>
            <p className="tramites-catalog-header__subtitle">
              Selecciona el trámite que deseas iniciar para ver sus requisitos detallados
            </p>
          </div>
          {/* Stats summary */}
          <div className="tramites-catalog-header__stats">
            {[
              { label: 'Trámites disponibles', value: tramites.filter(t => t.activo).length, color: '#3b82f6' },
              { label: 'Categorías', value: CATEGORY_ORDER.filter(c => (grouped.get(c)?.length ?? 0) > 0).length, color: '#8b5cf6' }
            ].map((stat) => (
              <div key={stat.label} className="tramites-catalog-stat" style={{ '--stat-color': stat.color } as React.CSSProperties}>
                <div className="tramites-catalog-stat__value">{stat.value}</div>
                <div className="tramites-catalog-stat__label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      }
      filters={
        <div className="tramites-catalog-search-wrapper">
          <Search
            size={18}
            className="tramites-catalog-search-icon"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="tramites-catalog-search-input"
          />
        </div>
      }
    >
      {isLoading ? (
        <div className="tramites-loading">
          <Droplets size={24} style={{ animation: 'pulse 1.5s infinite' }} />
          <span>Cargando trámites...</span>
        </div>
      ) : (
        <div className="tramites-catalog-content">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped.get(cat) ?? [];
            if (items.length === 0) return null;
            const meta = CATEGORY_META[cat];

            return (
              <div key={cat} className="tramites-catalog-section">
                <div className="tramites-catalog-section-header" style={{ '--section-color': meta.color } as React.CSSProperties}>
                  <div className="tramites-catalog-section-icon">
                    {meta.icon}
                  </div>
                  <div className="tramites-catalog-section-text">
                    <h3 className="tramites-catalog-section-title">
                      {meta.label}
                    </h3>
                    <p className="tramites-catalog-section-desc">
                      {meta.descripcion}
                    </p>
                  </div>
                  <span className="tramites-catalog-section-count">
                    {items.length} {items.length === 1 ? 'trámite' : 'trámites'}
                  </span>
                </div>

                <div className="tramites-catalog-grid">
                  {items.map((tramite) => (
                    <TramiteCard
                      key={tramite.id}
                      tramite={tramite}
                      onClick={handleSelect}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="tramites-empty">
              <Search size={48} style={{ opacity: 0.25 }} />
              <p>No se encontraron trámites para "<strong>{search}</strong>"</p>
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};
