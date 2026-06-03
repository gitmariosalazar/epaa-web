import React from 'react';
import { Mail, MessageCircle, Send, Phone, Info } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import './SupportContactCard.css';

/**
 * SRP: Responsable únicamente de mostrar las opciones de contacto y soporte técnico.
 * OCP: Fácil de extender añadiendo nuevos canales de comunicación.
 */
export const SupportContactCard: React.FC = () => {
  const contactOptions = [
    {
      icon: <MessageCircle size={18} />,
      label: 'WhatsApp Support',
      value: '+593 99 999 9999',
      color: '#25D366',
      link: 'https://wa.me/593999999999'
    },
    {
      icon: <Send size={18} />,
      label: 'Telegram Channel',
      value: '@EpaaSupportBot',
      color: '#0088cc',
      link: 'https://t.me/EpaaSupportBot'
    },
    {
      icon: <Mail size={18} />,
      label: 'Correo Electrónico',
      value: 'soporte@sigepaa.com',
      color: '#ea4335',
      link: 'mailto:soporte@sigepaa.com'
    },
    {
      icon: <Phone size={18} />,
      label: 'Línea Directa',
      value: '(06) 290-0000',
      color: '#3b82f6',
      link: 'tel:+59362900000'
    }
  ];

  return (
    <div className="card support-contact">
      <div className="support-contact__header">
        <div className="support-contact__badge">
          <Info size={14} />
          <span>Soporte Técnico</span>
        </div>
        <h3 className="support-contact__title">¿Necesitas ayuda con este trámite?</h3>
        <p className="support-contact__description">
          Nuestro equipo está disponible para asesorarte en cada paso del proceso.
        </p>
      </div>

      <div className="support-contact__list">
        {contactOptions.map((opt) => (
          <a
            key={opt.label}
            href={opt.link}
            target="_blank"
            rel="noreferrer"
            className="support-contact__item"
            style={{ '--hover-color': opt.color } as React.CSSProperties}
          >
            <div className="support-contact__item-icon" style={{ color: opt.color }}>
              {opt.icon}
            </div>
            <div className="support-contact__item-info">
              <span className="support-contact__item-label">{opt.label}</span>
              <span className="support-contact__item-value">{opt.value}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="support-contact__footer">
        <Button 
          variant="ghost" 
          size="sm" 
          fullWidth 
          onClick={() => window.open('https://docs.sigepaa.com', '_blank')}
        >
          Ver Guía de Usuario
        </Button>
      </div>
    </div>
  );
};
