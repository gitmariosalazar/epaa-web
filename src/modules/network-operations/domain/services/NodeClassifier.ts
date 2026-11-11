import type { GeoJsonFeature } from '../models/GeoJsonFeature';

export type InfrastructureType = 'PLANT' | 'TANK' | 'PUMP' | 'SOURCE' | 'CONNECTION' | 'UNKNOWN';

/**
 * Domain Service for classifying network infrastructure nodes according to
 * EPAA operational business rules and naming conventions.
 */
export class NodeClassifier {
  /**
   * Identifies whether a feature represents a Water Treatment Plant (Planta de Tratamiento).
   */
  static isPlant(feature?: GeoJsonFeature | null): boolean {
    if (!feature) return false;
    const type = feature.properties?.nodeType?.toUpperCase() || '';
    const code = feature.properties?.code?.toUpperCase() || '';
    const name = feature.properties?.name?.toLowerCase() || '';
    return (
      type === 'PLANT' ||
      type === 'PLANTA' ||
      code.startsWith('PTAP') ||
      name.includes('planta') ||
      name.includes('ptap')
    );
  }

  /**
   * Identifies whether a feature represents a Water Storage Tank (Tanque de Reserva).
   */
  static isTank(feature?: GeoJsonFeature | null): boolean {
    if (!feature) return false;
    if (this.isPlant(feature)) return false;
    const type = feature.properties?.nodeType?.toUpperCase() || '';
    const code = feature.properties?.code?.toUpperCase() || '';
    const name = feature.properties?.name?.toLowerCase() || '';
    return (
      type === 'TANK' ||
      type === 'TANQUE' ||
      code.startsWith('T-') ||
      name.includes('tanque')
    );
  }

  /**
   * Identifies whether a feature represents a Pumping Station (Estación de Bombeo).
   */
  static isPump(feature?: GeoJsonFeature | null): boolean {
    if (!feature) return false;
    if (this.isPlant(feature) || this.isTank(feature)) return false;
    const type = feature.properties?.nodeType?.toUpperCase() || '';
    const code = feature.properties?.code?.toUpperCase() || '';
    const name = feature.properties?.name?.toLowerCase() || '';
    return (
      type === 'PUMP' ||
      type === 'BOMBEO' ||
      code.startsWith('EB-') ||
      name.includes('bombeo')
    );
  }

  /**
   * Identifies whether a feature represents a Water Source / Intake (Captación o Fuente).
   */
  static isSource(feature?: GeoJsonFeature | null): boolean {
    if (!feature) return false;
    const type = feature.properties?.nodeType?.toUpperCase() || '';
    const code = feature.properties?.code?.toUpperCase() || '';
    const name = feature.properties?.name?.toLowerCase() || '';
    return (
      type === 'SOURCE' ||
      type === 'CAPTACION' ||
      code.startsWith('CAP') ||
      name.includes('captación') ||
      name.includes('captacion')
    );
  }

  /**
   * Identifies whether a feature represents a household water connection (Acometida).
   */
  static isConnection(feature?: GeoJsonFeature | null): boolean {
    if (!feature) return false;
    return (
      feature.properties?.nodeType === 'CONNECTION' ||
      Boolean(feature.properties?.cadastralKey) ||
      Boolean(feature.properties?.connectionId)
    );
  }

  /**
   * Determines the high-level infrastructure category for any given feature.
   */
  static classify(feature?: GeoJsonFeature | null): InfrastructureType {
    if (!feature) return 'UNKNOWN';
    if (this.isPlant(feature)) return 'PLANT';
    if (this.isTank(feature)) return 'TANK';
    if (this.isPump(feature)) return 'PUMP';
    if (this.isSource(feature)) return 'SOURCE';
    if (this.isConnection(feature)) return 'CONNECTION';
    return 'UNKNOWN';
  }

  /**
   * Returns a friendly Spanish display name for the node type.
   */
  static getDisplayName(feature?: GeoJsonFeature | null): string {
    const type = this.classify(feature);
    switch (type) {
      case 'PLANT':
        return 'Planta de Tratamiento';
      case 'TANK':
        return 'Tanque de Reserva';
      case 'PUMP':
        return 'Estación de Bombeo';
      case 'SOURCE':
        return 'Captación / Fuente';
      case 'CONNECTION':
        return 'Acometida Domiciliaria';
      default:
        return feature?.properties?.nodeType || 'Nodo';
    }
  }

  /**
   * Extracts the supplying tank name from any feature (tank itself or connection/link).
   */
  static getTankAssociation(feature?: GeoJsonFeature | null): string | null {
    if (!feature) return null;
    if (this.isTank(feature)) {
      return feature.properties?.name || null;
    }
    return (
      feature.properties?.suppliedByTank ||
      feature.properties?.source ||
      null
    );
  }
}
