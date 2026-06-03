/**
 * BeneficioDiscapacidadPage — Módulo: beneficio-discapacidad
 * SCROLL: solo requisitos. STICKY: title+hero (izq) y resumen+soporte (der).
 */
import React, { useEffect, useState } from 'react';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { TramiteRequisitosList } from '@/shared/presentation/components/TramiteRequisitosList';
import { GetBeneficioDiscapacidadRequisitosUseCase } from '../../application/usecases/GetBeneficioDiscapacidadRequisitosUseCase';
import { BeneficioDiscapacidadRepositoryImpl } from '../../infrastructure/repositories/BeneficioDiscapacidadRepositoryImpl';
import type { BeneficioDiscapacidad } from '../../domain/models/BeneficioDiscapacidad';
import { Accessibility, Clock, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { SupportContactCard } from '@/modules/tramites/presentation/components/SupportContactCard';
import '@/shared/presentation/components/TramiteRequisitosList/TramiteProcedurePage.css';

const repo    = new BeneficioDiscapacidadRepositoryImpl();
const useCase = new GetBeneficioDiscapacidadRequisitosUseCase(repo);
const COLOR   = '#8b5cf6';

export const BeneficioDiscapacidadPage: React.FC = () => {
  const [data, setData] = useState<BeneficioDiscapacidad | null>(null);
  useEffect(() => { useCase.execute().then(setData); }, []);

  if (!data) return <PageLayout><div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando...</div></PageLayout>;

  return (
    <PageLayout>
      <div style={{ height: '100%', '--tp-color': COLOR, '--tp-accent-bg': `${COLOR}14` } as React.CSSProperties}>
        <div className="tp-scroll-layout">

          {/* ══ LEFT ══ */}
          <div className="tp-scroll-layout__left">
            <div className="tp-scroll-layout__sticky">
              <div>
                <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>Descuento por Discapacidad</h1>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Beneficio para personas con discapacidad reconocida</span>
              </div>
              <div className="tp-hero" style={{ borderColor: `${COLOR}30`, padding: '0.875rem 1.1rem' }}>
                <div className="tp-hero__icon" style={{ background: `${COLOR}20`, color: COLOR, width: 40, height: 40 }}><Accessibility size={19} /></div>
                <div className="tp-hero__text">
                  <h2 className="tp-hero__title" style={{ fontSize: '0.9rem' }}>{data.nombre}</h2>
                  <p className="tp-hero__desc" style={{ fontSize: '0.75rem' }}>{data.descripcion}</p>
                </div>
                <div className="tp-hero__badges">
                  <span className="tp-badge tp-badge--accent" style={{ fontSize: '0.68rem' }}><Clock size={10} /> {data.tiempoEstimadoDias}d</span>
                  <span className="tp-badge tp-badge--accent" style={{ fontSize: '0.68rem' }}><DollarSign size={10} /> ${data.costoTotal}</span>
                </div>
              </div>
            </div>

            <div className="tp-scroll-layout__body">
              <div className="tp-card">
                <div className="tp-card__header">
                  <div className="tp-card__header-icon" style={{ background: `${COLOR}20`, color: COLOR }}><FileText size={13} /></div>
                  <h3 className="tp-card__title" style={{ fontSize: '0.78rem' }}>Requisitos ({data.requisitos.length})</h3>
                </div>
                <div className="tp-card__body"><TramiteRequisitosList requisitos={data.requisitos} /></div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT ══ */}
          <div className="tp-scroll-layout__right">
            <div className="tp-card">
              <div className="tp-card__header">
                <div className="tp-card__header-icon" style={{ background: `${COLOR}20`, color: COLOR }}><AlertCircle size={13} /></div>
                <h3 className="tp-card__title" style={{ fontSize: '0.78rem' }}>Resumen</h3>
              </div>
              <div className="tp-card__body" style={{ padding: '0.875rem 1rem' }}>
                <div className="tp-info-list">
                  {[
                    { icon: <Clock size={13} />, label: 'Tiempo estimado', value: `${data.tiempoEstimadoDias} días hábiles` },
                    { icon: <DollarSign size={13} />, label: 'Costo del trámite', value: `$${data.costoTotal} USD`, colored: true },
                    { icon: <FileText size={13} />, label: 'Total requisitos', value: `${data.requisitos.length} ítems` },
                  ].map(({ icon, label, value, colored }) => (
                    <div key={label} className="tp-info-item">
                      <div className="tp-info-item__icon" style={{ width: 26, height: 26 }}>{icon}</div>
                      <div className="tp-info-item__body">
                        <span className="tp-info-item__label" style={{ fontSize: '0.65rem' }}>{label}</span>
                        <span className="tp-info-item__value" style={{ fontSize: '0.82rem', ...(colored ? { color: COLOR } : {}) }}>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.875rem', textAlign: 'center', fontStyle: 'italic' }}>
                  Trámite presencial en Ventanillas EPAA-AA
                </p>
              </div>
            </div>
            <div className="tp-support-compact"><SupportContactCard /></div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
};
