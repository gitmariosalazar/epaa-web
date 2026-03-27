import React from 'react';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import './CustomIcons.css';
import { FaFileInvoice } from 'react-icons/fa';
import { BiDollar } from 'react-icons/bi';

interface CustomIconProps {
  size?: number;
  iconColorMain?: string;
  iconColorSecondary?: string;
  iconColorSecondaryHover?: string;
  iconColorBorder?: string;
  iconColorBorderHover?: string;
  mainIcon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
}

export const CustomIcon = ({
  size = 18,
  iconColorMain = 'currentColor',
  iconColorSecondary = 'var(--error)',
  iconColorSecondaryHover = 'var(--accent)',
  iconColorBorder = 'currentColor',
  iconColorBorderHover = 'var(--accent)',
  mainIcon,
  secondaryIcon
}: CustomIconProps) => {
  const renderMainIcon = mainIcon || <DollarSign size={size} strokeWidth={2} />;

  // Calculo de tamaño para el badge (aprox 55% del principal para tener buena legibilidad)
  const badgeSize = Math.max(11, Math.round(size * 0.55));
  const subIconSize = Math.max(9, badgeSize - 4); // El icono real dejando espacio para el borde

  const renderSecondaryIcon = React.isValidElement(secondaryIcon)
    ? React.cloneElement(secondaryIcon as React.ReactElement<any>, {
        size: subIconSize,
        strokeWidth: 2
      })
    : secondaryIcon || <Clock size={subIconSize} strokeWidth={2} />;

  return (
    <div
      style={
        {
          color: iconColorMain,
          width: size,
          height: size,
          '--icon-border': iconColorBorder,
          '--icon-border-hover': iconColorBorderHover,
          '--icon-secondary-color': iconColorSecondary,
          '--icon-secondary-hover': iconColorSecondaryHover
        } as React.CSSProperties
      }
      className="icon-container__main"
    >
      <div style={{ display: 'flex' }}>{renderMainIcon}</div>

      <div
        className="icon-container__secondary"
        style={{ width: badgeSize, height: badgeSize }}
      >
        {renderSecondaryIcon}
      </div>
    </div>
  );
};

export const IconOverduePayments = ({ size = 18 }: { size?: number }) => (
  <CustomIcon
    size={size}
    secondaryIcon={<Clock />}
    iconColorSecondary="var(--error)"
    iconColorSecondaryHover="var(--accent)"
    iconColorBorder="var(--border-color)"
    iconColorBorderHover="var(--accent)"
  />
);

export const IconPayments = ({ size = 18 }: { size?: number }) => (
  <CustomIcon
    size={size}
    mainIcon={<DollarSign size={size} strokeWidth={2} />}
    secondaryIcon={<CheckCircle size={size} strokeWidth={2} />}
    iconColorSecondary="var(--success)"
    iconColorSecondaryHover="var(--accent)"
    iconColorBorder="var(--border-color)"
    iconColorBorderHover="var(--accent)"
  />
);

// Accounting

export const IconAccounting = ({ size = 18 }: { size?: number }) => (
  <CustomIcon
    size={size}
    mainIcon={<FaFileInvoice size={size} strokeWidth={2} />}
    secondaryIcon={<BiDollar size={size} strokeWidth={2} />}
    iconColorSecondary="var(--success)"
    iconColorSecondaryHover="var(--accent)"
    iconColorBorder="var(--border-color)"
    iconColorBorderHover="var(--accent)"
  />
);
