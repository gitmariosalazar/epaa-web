import React from 'react';
import { ColorChip, type ColorChipProps } from './ColorChip';
import { getConnectionStateUIConfig } from '../../utils/connectionStateUIConfig';
import { ConnectionStateResolver } from '../../../domain/models/ConnectionStateMetadata';
import { Tooltip } from '../common/Tooltip/Tooltip';

export interface ConnectionStateChipProps extends Omit<
  ColorChipProps,
  'label' | 'color' | 'icon'
> {
  /** The connection state ID (id_estado) */
  statusId?: number;
  /** The connection state name (nombre) */
  statusName?: string;
  /**
   * If true, displays a tooltip with the state description and business rules
   * (e.g. if it allows billing, requires inspection, etc.)
   */
  showTooltip?: boolean;
}

/**
 * Global shared component for displaying Connection States (Estados de Acometida).
 * Uses Clean Architecture by separating Domain (ConnectionStateMetadata) and UI logic.
 */
export const ConnectionStateChip: React.FC<ConnectionStateChipProps> = ({
  statusId,
  statusName,
  showTooltip = true,
  ...chipProps
}) => {
  // Use statusId first, fallback to statusName
  const identifier = statusId !== undefined ? statusId : statusName;

  if (identifier === undefined || identifier === null) {
    return (
      <ColorChip
        label="Desconocido"
        color="var(--text-muted, #9ca3af)"
        {...chipProps}
      />
    );
  }

  const uiConfig = getConnectionStateUIConfig(identifier);

  const chip = (
    <ColorChip
      label={uiConfig.label}
      color={uiConfig.color}
      icon={uiConfig.icon}
      {...chipProps}
    />
  );

  if (showTooltip) {
    const metadata =
      statusId !== undefined
        ? ConnectionStateResolver.getById(statusId)
        : ConnectionStateResolver.getByName(statusName || '');

    if (metadata) {
      const tooltipText =
        `${metadata.name}\n${metadata.description}\n` +
        `Facturación: ${metadata.allowsBilling ? 'Sí' : 'No'} | ` +
        `Lectura: ${metadata.allowsReading ? 'Sí' : 'No'} | ` +
        `Inspección req.: ${metadata.requiresInspection ? 'Sí' : 'No'}`;

      return (
        <Tooltip content={tooltipText} position="bottom" themeColor="info">
          {chip}
        </Tooltip>
      );
    }
  }

  return chip;
};
