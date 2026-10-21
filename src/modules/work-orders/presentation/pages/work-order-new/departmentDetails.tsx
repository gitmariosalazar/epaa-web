import React from 'react';
import {
  Droplets,
  Wrench,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  Gauge,
  Network,
  Waves
} from 'lucide-react';
import { IconSize } from '@/shared/utils/sizes/size-icon';

export interface DepartmentDetails {
  icon: React.ReactNode;
  iconLg: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Helper to get department-specific colors and icons.
 * Mirrors the exact visual design system from CreateIncidentPage.
 */
export const getDepartmentDetails = (departmentName: string): DepartmentDetails => {
  const name = (departmentName || '').toLowerCase();
  const iconSizeSmall = IconSize.xs; // 12
  const iconSizeLarge = IconSize.md; // 20

  if (
    name.includes('fuga') ||
    name.includes('agua') ||
    name.includes('potable') ||
    name.includes('distribucion') ||
    name.includes('distribución')
  ) {
    return {
      icon: <Droplets size={iconSizeSmall} />,
      iconLg: <Droplets size={iconSizeLarge} />,
      color: 'var(--accent, #3b82f6)',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      borderColor: 'rgba(59, 130, 246, 0.15)'
    };
  }

  if (
    name.includes('infraestructura') ||
    name.includes('mantenimiento') ||
    name.includes('taller') ||
    name.includes('obra')
  ) {
    return {
      icon: <Wrench size={iconSizeSmall} />,
      iconLg: <Wrench size={iconSizeLarge} />,
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.08)',
      borderColor: 'rgba(249, 115, 22, 0.15)'
    };
  }

  if (
    name.includes('daño') ||
    name.includes('dano') ||
    name.includes('perdida') ||
    name.includes('pérdida') ||
    name.includes('robo') ||
    name.includes('emergencia') ||
    name.includes('cliente') ||
    name.includes('comercial') ||
    name.includes('atencion') ||
    name.includes('atención')
  ) {
    return {
      icon: <ShieldAlert size={iconSizeSmall} />,
      iconLg: <ShieldAlert size={iconSizeLarge} />,
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.08)',
      borderColor: 'rgba(239, 68, 68, 0.15)'
    };
  }

  if (
    name.includes('fraude') ||
    name.includes('irregular') ||
    name.includes('corte') ||
    name.includes('suspension') ||
    name.includes('suspensión')
  ) {
    return {
      icon: <AlertTriangle size={iconSizeSmall} />,
      iconLg: <AlertTriangle size={iconSizeLarge} />,
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.08)',
      borderColor: 'rgba(234, 179, 8, 0.15)'
    };
  }

  if (
    name.includes('consumo') ||
    name.includes('anomalia') ||
    name.includes('anomalía') ||
    name.includes('medicion') ||
    name.includes('medición') ||
    name.includes('medidor')
  ) {
    return {
      icon: <Gauge size={iconSizeSmall} />,
      iconLg: <Gauge size={iconSizeLarge} />,
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.08)',
      borderColor: 'rgba(6, 182, 212, 0.15)'
    };
  }

  if (
    name.includes('red_matriz') ||
    name.includes('red matriz') ||
    name.includes('red') ||
    name.includes('redes') ||
    name.includes('via') ||
    name.includes('vía') ||
    name.includes('pública') ||
    name.includes('publica')
  ) {
    return {
      icon: <Network size={iconSizeSmall} />,
      iconLg: <Network size={iconSizeLarge} />,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.15)'
    };
  }

  if (
    name.includes('alcantarillado') ||
    name.includes('saneamiento') ||
    name.includes('desague') ||
    name.includes('desagüe')
  ) {
    return {
      icon: <Waves size={iconSizeSmall} />,
      iconLg: <Waves size={iconSizeLarge} />,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      borderColor: 'rgba(139, 92, 246, 0.15)'
    };
  }

  return {
    icon: <HelpCircle size={iconSizeSmall} />,
    iconLg: <HelpCircle size={iconSizeLarge} />,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'rgba(168, 85, 247, 0.15)'
  };
};
