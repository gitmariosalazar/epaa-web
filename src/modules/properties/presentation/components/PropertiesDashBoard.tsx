import React, { useMemo } from 'react';
import type { PropertyByType } from '../../domain/models/Property';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';
import {
  Professional3DPieChart,
  type PieData
} from '@/shared/presentation/components/Charts/Professional3DPieChart';
import {
  Building2,
  Map,
  DollarSign,
  AlertTriangle,
  Home,
  Layout
} from 'lucide-react';
import { CHART_COLORS } from '@/shared/presentation/utils/colors/charts.colors';
import '../styles/PropertiesDashBoard.css';

interface PropTypes {
  data: PropertyByType[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('es-EC', {
    maximumFractionDigits: 2
  }).format(value);
};

export const PropertiesDashBoard: React.FC<PropTypes> = ({ data }) => {
  const totalProperties = useMemo(
    () =>
      data.reduce((acc, item) => acc + Number(item.totalProperties || 0), 0),
    [data]
  );
  const totalPortfolioValue = useMemo(
    () =>
      data.reduce(
        (acc, item) => acc + Number(item.totalPortfolioValue || 0),
        0
      ),
    [data]
  );
  const totalLandArea = useMemo(
    () =>
      data.reduce((acc, item) => acc + Number(item.totalLandAreaM2 || 0), 0),
    [data]
  );
  const totalBuiltArea = useMemo(
    () =>
      data.reduce((acc, item) => acc + Number(item.totalBuiltAreaM2 || 0), 0),
    [data]
  );

  const pieChartData: PieData[] = useMemo(
    () =>
      data.map((item, index) => ({
        name: item.propertyType,
        value: Number(item.totalProperties || 0),
        color: CHART_COLORS[index % CHART_COLORS.length],
        label: item.propertyType,
        fmt: (val) => `${formatNumber(val)} predios`
      })),
    [data]
  );

  const valuePieChartData: PieData[] = useMemo(
    () =>
      data.map((item, index) => ({
        name: `${item.propertyType}`,
        value: Number(item.totalPortfolioValue || 0),
        color: CHART_COLORS[index % CHART_COLORS.length],
        label: `${item.propertyType}`,
        fmt: (val) => formatCurrency(val)
      })),
    [data]
  );

  return (
    <div className="properties-dashboard">
      <div className="properties-dashboard-kpis">
        <KPICard
          label="Total Predios"
          value={formatNumber(totalProperties)}
          icon={<Building2 size={24} />}
          color="gray"
          valueColor="gray"
          description="En todo el sistema"
        />
        <KPICard
          label="Valor de Cartera Total"
          value={formatCurrency(totalPortfolioValue)}
          icon={<DollarSign size={24} />}
          color="green"
          valueColor="green"
          description="Suma del valor comercial"
        />
        <KPICard
          label="Área Terreno Total"
          value={`${formatNumber(totalLandArea)} m²`}
          icon={<Map size={24} />}
          color="amber"
          valueColor="amber"
          description="Suma de áreas de terreno"
        />
        <KPICard
          label="Área Constr. Total"
          value={`${formatNumber(totalBuiltArea)} m²`}
          icon={<Layout size={24} />}
          color="purple"
          valueColor="purple"
          description="Suma de áreas construidas"
        />
      </div>

      <div className="properties-dashboard-grid">
        <div className="properties-dashboard-card chart-card">
          <h3 className="properties-dashboard-card-title">
            Distribución por Tipo de Predio
          </h3>
          <Professional3DPieChart data={pieChartData} showIndicators={false} />
        </div>

        <div className="properties-dashboard-card chart-card">
          <h3 className="properties-dashboard-card-title">
            Valoración de Cartera por Tipo
          </h3>
          <Professional3DPieChart
            data={valuePieChartData}
            showIndicators={false}
          />
        </div>
      </div>

      <div className="properties-dashboard-detailed">
        <h3 className="properties-dashboard-section-title">
          Análisis Detallado por Tipo
        </h3>
        <div className="properties-dashboard-type-grid">
          {data.map((item) => {
            const isUrbano = item.propertyType.toUpperCase() === 'URBANO';
            const missingVal = Number(item.alertsMissingConstructionValue);
            const exceededArea = Number(
              item.propertiesWithBuiltAreaExceedingLand
            );
            return (
              <div
                key={item.tipoPredioId}
                className="properties-dashboard-type-card"
              >
                <div className="type-card-header">
                  <div className="type-card-icon">
                    {isUrbano ? <Building2 size={28} /> : <Home size={28} />}
                  </div>
                  <h4 className="type-card-title">{item.propertyType}</h4>
                </div>

                <div className="type-card-stats">
                  <div className="stat-item">
                    <span className="stat-label">Predios</span>
                    <span className="stat-value">
                      {formatNumber(Number(item.totalProperties))}
                    </span>
                    <span className="stat-sub">
                      ({formatNumber(Number(item.percentageOfTotal))}%)
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Valor Promedio</span>
                    <span className="stat-value text-success">
                      {formatCurrency(Number(item.avgPropertyValue))}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Precio Prom. Terreno</span>
                    <span className="stat-value">
                      {formatCurrency(Number(item.weightedPricePerM2Land))} /m²
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Precio Prom. Constr.</span>
                    <span className="stat-value">
                      {formatCurrency(Number(item.weightedPricePerM2Built))} /m²
                    </span>
                  </div>
                </div>

                {(missingVal > 0 || exceededArea > 0) && (
                  <div className="type-card-alerts">
                    <div className="alert-header">
                      <AlertTriangle size={16} className="alert-icon" />
                      <span>Alertas de Calidad de Datos</span>
                    </div>
                    <ul className="alert-list">
                      {missingVal > 0 && (
                        <li>{missingVal} sin valor de construcción</li>
                      )}
                      {exceededArea > 0 && (
                        <li>{exceededArea} con área const. &gt; terreno</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
