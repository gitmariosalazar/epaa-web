import React, { useState, useCallback } from 'react';
import { Modal, type ModalProps } from '../Modal/Modal';

export interface PopoverModalProps extends Omit<ModalProps, 'isOpen' | 'onClose' | 'anchorElement' | 'children'> {
  /**
   * El elemento que, al hacer clic, abrirá el popover (ej. un botón).
   */
  trigger?: React.ReactElement<any>;
  /**
   * El contenido del popover. Puede ser un nodo de React o una función que recibe
   * un callback para cerrar el popover de forma programática.
   */
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  /**
   * Si se pasa un trigger propio que no se debe clonar (o si se maneja el estado externamente),
   * se puede omitir el trigger y usar el modo controlado proporcionando isOpen, onClose y anchorElement.
   */
  isOpen?: boolean;
  onClose?: () => void;
  anchorElement?: HTMLElement | null;
}

/**
 * PopoverModal
 * 
 * Un componente altamente reutilizable basado en el patrón "Compound Component" o "Render Props".
 * Envuelve el componente `Modal` estándar pero abstrae la lógica de manejo del estado de apertura
 * y la referencia (anchorElement) para que se posicione siempre como un Popover (igual que los filtros de tabla).
 * 
 * Principios aplicados:
 * - SRP (Single Responsibility Principle): Maneja únicamente el ciclo de vida del anclaje y visibilidad.
 * - OCP (Open-Closed Principle): Permite inyectar cualquier contenido o elemento trigger sin modificar su código.
 */
export const PopoverModal: React.FC<PopoverModalProps> = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  anchorElement: controlledAnchorElement,
  ...modalProps
}) => {
  const isControlled = controlledIsOpen !== undefined;
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalAnchorElement, setInternalAnchorElement] = useState<HTMLElement | null>(null);

  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const anchorElement = isControlled ? controlledAnchorElement : internalAnchorElement;

  const handleOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!isControlled) {
      setInternalAnchorElement(e.currentTarget);
      setInternalIsOpen(true);
    }
    
    // Ejecuta la función onClick original del trigger si existía
    if (trigger && trigger.props.onClick) {
      trigger.props.onClick(e);
    }
  }, [isControlled, trigger]);

  const handleClose = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
      // Retrasamos la limpieza del ancla para permitir que la animación de cierre del Modal funcione
      setTimeout(() => {
        setInternalAnchorElement(null);
      }, 300);
    }
  }, [isControlled, controlledOnClose]);

  // Clonar el trigger para inyectarle el evento onClick
  const clonedTrigger = trigger 
    ? React.cloneElement(trigger, { onClick: handleOpen }) 
    : null;

  return (
    <>
      {clonedTrigger}
      <Modal
        {...modalProps}
        isOpen={isOpen}
        onClose={handleClose}
        anchorElement={anchorElement}
      >
        {typeof children === 'function' ? children({ close: handleClose }) : children}
      </Modal>
    </>
  );
};
