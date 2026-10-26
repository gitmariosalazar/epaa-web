import React from 'react';
import {
  Droplets,        // Agua Potable
  Waves,           // Alcantarillado
  BadgePercent,    // Comercialización (ventas / atención / cortes)
  Map,             // Planificación GIS (catastro / mapas)
  Building2,       // Administración (gestión / RRHH)
  HardHat,         // Dirección Técnica (ingeniería / fiscalización)
  HelpCircle,      // Desconocido
  type LucideIcon,
} from 'lucide-react';

export interface DepartmentInfo {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isActive: boolean;
}

export const DEPARTMENTS: Record<number, DepartmentInfo> = {
  1: {
    id: 1,
    name: 'AGUA POTABLE',
    description: 'Mantenimiento y operación de la red de agua potable',
    icon: Droplets,
    color: '#0284c7', // Sky / azul
    isActive: true,
  },
  2: {
    id: 2,
    name: 'ALCANTARILLADO',
    description: 'Mantenimiento de la red de alcantarillado y plantas de tratamiento',
    icon: Waves,
    color: '#8b5cf6', // Violeta / púrpura
    isActive: true,
  },
  3: {
    id: 3,
    name: 'COMERCIALIZACIÓN',
    description: 'Atención al cliente, medidores y cortes de servicio',
    icon: BadgePercent,
    color: '#10b981', // Verde esmeralda
    isActive: true,
  },
  4: {
    id: 4,
    name: 'PLANIFICACIÓN GIS',
    description: 'Topografía, catastro y sistemas de información geográfica',
    icon: Map,
    color: '#06b6d4', // Cyan
    isActive: false,
  },
  5: {
    id: 5,
    name: 'ADMINISTRACIÓN',
    description: 'Gestión interna, activos y recursos humanos',
    icon: Building2,
    color: '#6366f1', // Índigo
    isActive: true,
  },
  6: {
    id: 6,
    name: 'DIRECCIÓN TÉCNICA',
    description: 'Supervisión de proyectos, fiscalización de obras y control de calidad técnica',
    icon: HardHat,
    color: '#f97316', // Naranja
    isActive: true,
  },
} as const;

export const DEFAULT_DEPARTMENT: DepartmentInfo = {
  id: 0,
  name: 'DESCONOCIDO',
  description: 'Sin descripción disponible',
  icon: HelpCircle,
  color: '#64748b', // Slate / gris
  isActive: false,
};

export class DepartmentHelper {
  /**
   * Retorna toda la metadata del departamento por ID o por nombre.
   */
  static getDepartment(id?: number | null, name?: string | null): DepartmentInfo {
    if (id !== undefined && id !== null && DEPARTMENTS[id]) {
      return DEPARTMENTS[id];
    }
    if (name) {
      const normalized = name.trim().toUpperCase();
      const found = Object.values(DEPARTMENTS).find(
        (d) => d.name === normalized || normalized.includes(d.name)
      );
      if (found) return found;
    }
    return DEFAULT_DEPARTMENT;
  }

  /**
   * Retorna el nombre corto / estandarizado
   */
  static getDepartmentText(id?: number | null, name?: string | null): string {
    const dept = this.getDepartment(id, name);
    return name && name.trim() ? name : dept.name;
  }

  /**
   * Retorna la descripción oficial
   */
  static getDepartmentDescription(id?: number | null, name?: string | null): string {
    return this.getDepartment(id, name).description;
  }

  /**
   * Retorna el color asignado al departamento
   */
  static getDepartmentColor(id?: number | null, name?: string | null): string {
    return this.getDepartment(id, name).color;
  }

  /**
   * Retorna el componente de ícono de Lucide (sin instanciar)
   */
  static getDepartmentIconComponent(id?: number | null, name?: string | null): LucideIcon {
    return this.getDepartment(id, name).icon;
  }

  /**
   * Retorna el ícono de Lucide como ReactNode ya instanciado, listo para props como icon={...}
   */
  static getDepartmentIcon(id?: number | null, size: number = 12, name?: string | null): React.ReactNode {
    const IconComponent = this.getDepartmentIconComponent(id, name);
    return <IconComponent size={size} />;
  }
}

export default DepartmentHelper;
