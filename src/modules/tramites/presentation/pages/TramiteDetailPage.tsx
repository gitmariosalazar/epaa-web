// ============================================================
// PRESENTATION — TramiteDetailPage
// Dynamic detail for ANY tramite — loads by :id from URL.
// SRP: display only. OCP: new tramites need no changes here.
// ============================================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import {
  Droplets,
  DollarSign,
  Clock,
  ClipboardList,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CircleDot
} from 'lucide-react';
import { useTramiteById } from '../context/TramitesContext';
import { RequisitoItem } from '../components/RequisitoItem';
import { SupportContactCard } from '../components/SupportContactCard';
import '../styles/Tramites.css';

import {
  ICONS,
  PASOS_POR_CATEGORIA,
  NOTICE_POR_CATEGORIA
} from '../constants/TramiteUI';

export const TramiteDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { tramite, isLoading } = useTramiteById(id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="tramites-loading">
          <Droplets size={24} />
          <span>Cargando trámite...</span>
        </div>
      </PageLayout>
    );
  }

  if (!tramite) {
    return (
      <PageLayout>
        <div className="tramites-empty">
          <AlertCircle size={48} style={{ opacity: 0.3 }} />
          <p>Trámite no encontrado</p>
          <Button variant="primary" onClick={() => navigate('/tramites')}>
            Volver al Catálogo
          </Button>
        </div>
      </PageLayout>
    );
  }

  const totalCosto = tramite.requisitos
    .filter((r) => r.costo !== undefined)
    .reduce((sum, r) => sum + (r.costo ?? 0), 0);

  const tipoLabel =
    tramite.tipoPersona === 'natural'
      ? 'Persona Natural'
      : tramite.tipoPersona === 'juridica'
        ? 'Persona Jurídica'
        : 'Persona Natural y Jurídica';

  const pasos = PASOS_POR_CATEGORIA[tramite.categoria] ?? [];
  const notice = NOTICE_POR_CATEGORIA[tramite.categoria];

  return (
    <PageLayout>
      <div className="tramite-detail">
        {/* ── Left: Requirements + Steps ── */}
        <div className="tramite-detail__left-col">
          {/* Main requirements card */}
          <div
            className="card tramite-detail__main"
            style={{ '--tramite-color': tramite.color } as React.CSSProperties}
          >
            {/* Header banner */}
            <div
              className="tramite-detail__header"
              style={
                { '--tramite-color': tramite.color } as React.CSSProperties
              }
            >
              <div className="tramite-detail__icon">
                {ICONS[tramite.icono] ?? <Droplets size={32} />}
              </div>
              <div>
                <h1 className="tramite-detail__title">{tramite.nombre}</h1>
                <p className="tramite-detail__subtitle">
                  {tipoLabel} · {tramite.descripcion}
                </p>
              </div>
            </div>

            {/* Requisitos section label */}
            <div className="tramite-detail__req-header">
              <div className="tramite-detail__req-header-inner">
                <ClipboardList size={16} className="tramite-detail__req-icon" />
                <h2 className="tramite-detail__req-title">
                  Requisitos ({tramite.requisitos.length})
                </h2>
                {/* Legend */}
                <div className="tramite-detail__req-legend">
                  {(
                    [
                      { color: '#3b82f6', label: 'Documento' },
                      { color: '#f59e0b', label: 'Pago' },
                      { color: '#8b5cf6', label: 'Formulario' }
                    ] as const
                  ).map((l) => (
                    <span
                      key={l.label}
                      className="tramite-detail__req-legend-item"
                      style={{ color: l.color }}
                    >
                      <span
                        className="tramite-detail__req-legend-dot"
                        style={{ background: l.color }}
                      />
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Requisitos list */}
            <ul className="requisitos-list">
              {tramite.requisitos.map((req, i) => (
                <RequisitoItem key={req.id} requisito={req} index={i} />
              ))}
            </ul>

            {/* Notice */}
            <div className="tramite-detail__notice">
              <AlertCircle size={16} className="tramite-detail__notice-icon" />
              <span>{notice}</span>
            </div>
          </div>

          {/* Process steps card */}
          {pasos.length > 0 && (
            <div className="card tramite-detail__steps-card">
              <div className="tramite-detail__steps-header">
                <CircleDot size={18} className="tramite-detail__steps-icon" />
                <h2 className="tramite-detail__steps-title">
                  Etapas del Proceso
                </h2>
              </div>
              <div className="process-timeline">
                {pasos.map((paso, idx) => (
                  <div key={idx} className="process-step">
                    <div className="process-step__number">{paso.numero}</div>
                    <div className="process-step__content">
                      <h4 className="process-step__title">{paso.titulo}</h4>
                      <p className="process-step__desc">{paso.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Summary Sidebar ── */}
        <div className="tramite-detail__right-col">
          <div className="card tramite-detail__summary">
            <h3 className="tramite-detail__summary-title">
              Resumen del Trámite
            </h3>

            <div className="tramite-detail__summary-list">
              <div className="tramite-detail__summary-item">
                <div className="tramite-detail__summary-icon">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="tramite-detail__summary-label">
                    Tiempo Estimado
                  </span>
                  <div className="tramite-detail__summary-value">
                    {tramite.tiempoEstimadoDias
                      ? `${tramite.tiempoEstimadoDias} días laborables`
                      : 'Variable'}
                  </div>
                </div>
              </div>

              <div className="tramite-detail__summary-item">
                <div
                  className="tramite-detail__summary-icon"
                  style={{
                    color: '#f59e0b',
                    background: 'rgba(245,158,11,0.1)'
                  }}
                >
                  <DollarSign size={16} />
                </div>
                <div>
                  <span className="tramite-detail__summary-label">
                    Costo Inicial (Tasas)
                  </span>
                  <div className="tramite-detail__summary-value">
                    {totalCosto > 0 ? `$${totalCosto.toFixed(2)}` : 'Gratuito'}
                  </div>
                </div>
              </div>

              <div className="tramite-detail__summary-item">
                <div
                  className="tramite-detail__summary-icon"
                  style={{
                    color: '#10b981',
                    background: 'rgba(16,185,129,0.1)'
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <span className="tramite-detail__summary-label">
                    Tipo de Persona
                  </span>
                  <div className="tramite-detail__summary-value">
                    {tipoLabel}
                  </div>
                </div>
              </div>
            </div>

            <div className="tramite-detail__summary-buttons">
              <Button
                variant="primary"
                fullWidth
                size="sm"
                rightIcon={<ArrowRight size={18} />}
                onClick={() => navigate(`/solicitudes/nueva/${tramite.id}`)}
              >
                Iniciar Solicitud
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => navigate('/tramites')}
              >
                Ver otros trámites
              </Button>
            </div>
          </div>

          <SupportContactCard />
        </div>
      </div>
    </PageLayout>
  );
};
