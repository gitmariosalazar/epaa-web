import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '@/shared/presentation/styles/Card.css';

export interface CardAccordionOptions {
  /** Estado inicial abierto/cerrado en modo no controlado. Por defecto: false */
  defaultOpen?: boolean;
  /** Estado abierto/cerrado controlado */
  isOpen?: boolean;
  /** Callback al abrir o cerrar el acordeón */
  onToggle?: (isOpen: boolean) => void;
  /** Icono opcional a la izquierda del título */
  icon?: React.ReactNode;
  /** Contenido extra a la derecha antes de la flecha */
  extra?: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;

  /**
   * Habilita el comportamiento de acordeón desplegable como en AdditionalInfoAccordion.
   * Puede ser boolean (`true` / `false`) o un objeto `CardAccordionOptions`.
   */
  accordion?: boolean | CardAccordionOptions;

  /** Estado inicial abierto cuando se usa accordion (por defecto false) */
  defaultOpen?: boolean;

  /** Estado controlado de apertura del acordeón */
  isOpen?: boolean;

  /** Callback al alternar la apertura */
  onToggle?: (isOpen: boolean) => void;

  /** Icono para la cabecera (se envuelve en un contenedor circular similar a AdditionalInfoAccordion) */
  icon?: React.ReactNode;

  /** Contenido adicional a la derecha de la cabecera */
  extra?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  footer,
  style,
  accordion,
  defaultOpen: defaultOpenProp,
  isOpen: isOpenProp,
  onToggle: onToggleProp,
  icon: iconProp,
  extra: extraProp,
}) => {
  const isAccordion = Boolean(accordion);
  const accordionConfig: CardAccordionOptions =
    typeof accordion === 'object' && accordion !== null ? accordion : {};

  const defaultOpen = accordionConfig.defaultOpen ?? defaultOpenProp ?? false;
  const isControlled = accordionConfig.isOpen !== undefined || isOpenProp !== undefined;
  const controlledOpen = accordionConfig.isOpen ?? isOpenProp;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(controlledOpen) : internalOpen;

  const icon = accordionConfig.icon ?? iconProp;
  const extra = accordionConfig.extra ?? extraProp;
  const onToggle = accordionConfig.onToggle ?? onToggleProp;

  const handleToggle = () => {
    if (!isAccordion) return;
    const nextOpen = !isOpen;
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onToggle?.(nextOpen);
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAccordion) return;
    const target = e.target as HTMLElement;
    // Evita alternar el acordeón si se hace click en elementos interactivos dentro del header
    if (target.closest('button, a, input, select, textarea, [data-prevent-accordion]')) {
      return;
    }
    handleToggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isAccordion) return;
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, select, textarea, [data-prevent-accordion]')) {
        return;
      }
      e.preventDefault();
      handleToggle();
    }
  };

  const hasHeader = Boolean(title || icon || isAccordion);
  const isHeaderFlex = Boolean(isAccordion || icon || extra);

  const cardClassName = [
    'card',
    isAccordion ? 'card--accordion' : '',
    isAccordion ? (isOpen ? 'card--expanded' : 'card--collapsed') : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const headerClassName = [
    'card__header',
    isHeaderFlex ? 'card__header--flex' : '',
    isAccordion ? 'card__header--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClassName} style={style}>
      {hasHeader && (
        <div
          className={headerClassName}
          onClick={isAccordion ? handleHeaderClick : undefined}
          onKeyDown={isAccordion ? handleKeyDown : undefined}
          role={isAccordion ? 'button' : undefined}
          tabIndex={isAccordion ? 0 : undefined}
          aria-expanded={isAccordion ? isOpen : undefined}
        >
          {/* Si no es acordeón y no tiene icono ni extra, mantiene exactamente el markup original */}
          {!isAccordion && !icon && !extra ? (
            <h3 className="card__title">{title}</h3>
          ) : (
            <>
              <div className="card__header-left">
                {icon && <span className="card__header-icon-wrap">{icon}</span>}
                {typeof title === 'string' ? (
                  <h3 className="card__title">{title}</h3>
                ) : (
                  title
                )}
              </div>

              {(extra || isAccordion) && (
                <div className="card__header-right">
                  {extra}
                  {isAccordion && (
                    <span className="card__chevron" aria-hidden="true">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Si no es acordeón o si está abierto, renderiza body y footer */}
      {(!isAccordion || isOpen) && (
        <>
          <div className="card__body">{children}</div>
          {footer && <div className="card__footer">{footer}</div>}
        </>
      )}
    </div>
  );
};

