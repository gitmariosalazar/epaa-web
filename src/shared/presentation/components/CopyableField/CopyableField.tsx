import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './CopyableField.css';

export interface CopyableFieldProps {
  value: string;
  label?: string;
  labelIcon?: React.ReactNode;
  className?: string;
}

export const CopyableField: React.FC<CopyableFieldProps> = ({
  value,
  label,
  labelIcon,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      // Position out of screen
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Fallback copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    // Use modern API if available and context is secure
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Modern Clipboard API failed, using fallback:', err);
          fallbackCopy(value);
        });
    } else {
      fallbackCopy(value);
    }
  };

  return (
    <div className={`copyable-field ${className}`}>
      {label && (
        <label className="copyable-field__label">
          {labelIcon && <span className="copyable-field__label-icon">{labelIcon}</span>}
          {label}
        </label>
      )}
      <div 
        className="copyable-field__input-group" 
        onClick={handleCopy}
        style={{ cursor: 'pointer' }}
      >
        <span className="copyable-field__input-text" title={value}>
          {value}
        </span>
        <button
          type="button"
          className={`copyable-field__copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title={copied ? 'Copiado al portapapeles' : 'Copiar al portapapeles'}
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
