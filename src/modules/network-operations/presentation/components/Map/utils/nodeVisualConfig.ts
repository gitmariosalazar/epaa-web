import type { GeoJsonFeature } from '../../../../domain/models/GeoJsonFeature';
import { NodeClassifier } from '../../../../domain/services/NodeClassifier';

export type RgbaColor = [number, number, number, number];

export interface NodeVisualConfig {
  fillColor: RgbaColor;
  lineColor: RgbaColor;
  radius: number;
  lineWidth: number;
  labelPrefix: string;
  tooltipCategory: string;
}

/**
 * Open/Closed Principle (OCP) Strategy for SCADA Node visual styling.
 * When a new infrastructure type is added, define its styling here without
 * modifying Deck.gl layer definitions or business logic.
 */
export class NodeVisualConfigProvider {
  static getConfig(feature: GeoJsonFeature): NodeVisualConfig {
    if (feature.geometry?.type !== 'Point') {
      return this.getLineConfig(feature);
    }

    if (NodeClassifier.isPlant(feature)) {
      return {
        fillColor: [16, 185, 129, 255], // Emerald-500
        lineColor: [255, 255, 255, 255],
        radius: 20,
        lineWidth: 3,
        labelPrefix: '🏭',
        tooltipCategory: 'Planta de Tratamiento'
      };
    }

    if (NodeClassifier.isTank(feature)) {
      return {
        fillColor: [71, 85, 105, 255], // Slate-600
        lineColor: [255, 255, 255, 255],
        radius: 18,
        lineWidth: 3,
        labelPrefix: '🛢️',
        tooltipCategory: 'Tanque de Reserva'
      };
    }

    if (NodeClassifier.isPump(feature)) {
      return {
        fillColor: [249, 115, 22, 255], // Orange-500
        lineColor: [255, 255, 255, 255],
        radius: 16,
        lineWidth: 3,
        labelPrefix: '⚡',
        tooltipCategory: 'Estación de Bombeo'
      };
    }

    if (NodeClassifier.isSource(feature)) {
      return {
        fillColor: [5, 150, 105, 255], // Deep Emerald
        lineColor: [255, 255, 255, 255],
        radius: 16,
        lineWidth: 2,
        labelPrefix: '⛰️',
        tooltipCategory: 'Captación / Fuente'
      };
    }

    // Default: Acometida Domiciliaria / Conexión
    return {
      fillColor: [14, 165, 233, 230], // Sky-500
      lineColor: [255, 255, 255, 255],
      radius: 7,
      lineWidth: 1.5,
      labelPrefix: '',
      tooltipCategory: 'Acometida'
    };
  }

  private static getLineConfig(feature: GeoJsonFeature): NodeVisualConfig {
    const nodeType = feature.properties?.nodeType?.toUpperCase() || '';
    const colorMarker = feature.properties?.colorMarker?.toLowerCase() || '';

    if (nodeType === 'TRANSMISSION_LINK' || nodeType === 'PIPELINE') {
      return {
        fillColor: [0, 0, 0, 0],
        lineColor: [249, 115, 22, 255], // Orange-500 impulsión SCADA
        radius: 0,
        lineWidth: 5,
        labelPrefix: '⚡',
        tooltipCategory: 'Línea de Impulsión / Conducción'
      };
    }

    let lineColor: RgbaColor = [71, 85, 105, 255];

    if (colorMarker.includes('orange') || colorMarker === '#f97316') {
      lineColor = [249, 115, 22, 255];
    } else if (colorMarker.includes('green') || colorMarker === '#00ff00') {
      lineColor = [34, 197, 94, 255];
    } else if (colorMarker.includes('red') || colorMarker === '#ff0000') {
      lineColor = [239, 68, 68, 255];
    } else if (colorMarker.includes('blue') || colorMarker === '#0000ff') {
      lineColor = [59, 130, 246, 255];
    } else if (feature.properties?.nodeType === 'VIRTUAL_LINK') {
      lineColor = [168, 85, 247, 255]; // Purple virtual links
    }

    return {
      fillColor: [0, 0, 0, 0],
      lineColor,
      radius: 0,
      lineWidth: feature.properties?.nodeType === 'VIRTUAL_LINK' ? 4 : 2,
      labelPrefix: '',
      tooltipCategory: 'Línea de Red'
    };
  }
}
