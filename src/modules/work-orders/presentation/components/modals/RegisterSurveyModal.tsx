/**
 * RegisterSurveyModal — Fase 6 (Cierre)
 *
 * SRP: formulario para registrar encuesta de satisfacción del cliente.
 * Command: RegisterSatisfactionSurveyCommand {
 *   workOrderId, rating, createdByUserId, comments?
 * }
 */
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { WoModalShell } from './WoModalShell';

interface RegisterSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  onSubmit: (rating: number, comments: string) => Promise<void>;
  isLoading?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Muy deficiente',
  2: 'Deficiente',
  3: 'Aceptable',
  4: 'Bueno',
  5: 'Excelente',
};

export const RegisterSurveyModal: React.FC<RegisterSurveyModalProps> = ({
  isOpen, onClose, workOrderId, onSubmit, isLoading,
}) => {
  const [rating, setRating]     = useState(5);
  const [hovered, setHovered]   = useState<number | null>(null);
  const [comments, setComments] = useState('');

  const displayRating = hovered ?? rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(rating, comments.trim());
  };

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Encuesta de Satisfacción"
      subtitle={`OT: ${workOrderId}`}
      color="#f59e0b"
    >
      <form onSubmit={handleSubmit} className="wo-modal-form">
        <div className="wo-modal-field">
          <label className="wo-modal-label">Calificación del Servicio <span className="wo-modal-required">*</span></label>
          <div className="wo-modal-stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`wo-star-btn${n <= displayRating ? ' wo-star-btn--active' : ''}`}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setRating(n)}
                aria-label={`${n} estrellas`}
              >
                <Star
                  size={28}
                  fill={n <= displayRating ? '#f59e0b' : 'none'}
                  stroke={n <= displayRating ? '#f59e0b' : 'var(--border)'}
                />
              </button>
            ))}
          </div>
          <div className="wo-modal-rating-label" style={{ color: '#f59e0b' }}>
            {displayRating}/5 — {RATING_LABELS[displayRating]}
          </div>
        </div>
        <div className="wo-modal-field">
          <label className="wo-modal-label">Comentarios del cliente</label>
          <textarea
            id="wo-survey-comments"
            className="wo-modal-textarea"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Opinión del cliente sobre el servicio recibido..."
            rows={3}
          />
        </div>
        <div className="wo-modal-actions">
          <button type="button" className="wo-modal-btn wo-modal-btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            style={{ '--btn-color': '#f59e0b' } as React.CSSProperties}
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrar Encuesta'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
