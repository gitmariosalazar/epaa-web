import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Droplets,
  Building2
} from 'lucide-react';
import { MdAssignmentAdd } from 'react-icons/md';
import { TiThList } from 'react-icons/ti';
import type { NavItem } from '@/shared/domain/models/Navigation';

export const generateTramiteMenu = (
  icon: React.JSX.Element,
  label: string,
  categoriaSlug: string,
  requisitosRoutes?: { natural?: string; juridica?: string; general?: string },
  comingSoon = false
): NavItem => {
  const reqSubItems = [];
  if (requisitosRoutes?.natural) {
    reqSubItems.push({
      icon: <Droplets size={18} />,
      label: 'Persona Natural',
      to: requisitosRoutes.natural
    });
  }
  if (requisitosRoutes?.juridica) {
    reqSubItems.push({
      icon: <Building2 size={18} />,
      label: 'Persona Jurídica',
      to: requisitosRoutes.juridica
    });
  }
  if (requisitosRoutes?.general) {
    reqSubItems.push({
      icon: <FileText size={18} />,
      label: 'Ver Requisitos',
      to: requisitosRoutes.general
    });
  }

  const requisitosNode =
    reqSubItems.length > 0
      ? [
          {
            icon: <FileText size={18} />,
            label: 'Requisitos',
            subItems: reqSubItems
          }
        ]
      : [];

  // comingSoon = true → only show Requisitos (placeholder), hide operational links
  const operationalItems = comingSoon
    ? []
    : [
        {
          icon: <MdAssignmentAdd size={18} />,
          label: 'Nueva Solicitud',
          to: `/requests/${categoriaSlug}/new`
        },
        {
          icon: <Activity size={18} />,
          label: 'Seguimiento',
          to: `/requests/${categoriaSlug}/tracking`
        },
        {
          icon: <TiThList size={18} />,
          label: 'Mis Solicitudes',
          to: `/requests/${categoriaSlug}/list`
        },
        {
          icon: <Clock size={18} />,
          label: 'En Proceso',
          to: `/requests/${categoriaSlug}/pending`
        },
        {
          icon: <CheckCircle size={18} />,
          label: 'Aprobadas',
          to: `/requests/${categoriaSlug}/approved`
        },
        {
          icon: <XCircle size={18} />,
          label: 'Rechazadas',
          to: `/requests/${categoriaSlug}/rejected`
        }
      ];

  return {
    icon,
    label,
    subItems: [...requisitosNode, ...operationalItems]
  };
};
