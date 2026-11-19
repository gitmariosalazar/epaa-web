import React from 'react';
import {
  Code2,
  Terminal,
  GitBranch,
  Cpu,
  Layers,
  Boxes,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import './UnderDevelopment.css';

export interface UnderDevelopmentProps {
  title?: string;
  message?: string;
  estimatedDate?: string;
  showProgress?: boolean;
  progressValue?: number; // 0-100
  moduleName?: string;
}

export const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({
  title = 'Módulo en desarrollo',
  message = 'Esta sección se encuentra actualmente en desarrollo. Pronto estará disponible...',
  estimatedDate = 'Próximamente',
  showProgress = true,
  progressValue = 72,
  moduleName
}) => {
  const fileName = moduleName
    ? `${moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.tsx`
    : 'feature-module.tsx';

  return (
    <div className="ud-wrapper">
      {/* Fondo ambiental */}
      <div className="ud-bg">
        <div className="ud-gradient"></div>
        <div className="ud-particles">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{ '--i': i } as React.CSSProperties}
            ></span>
          ))}
        </div>
      </div>

      <div className="ud-content">
        {/* Hero Visual: Terminal de Código y Chips de Desarrollo */}
        <div className="ud-dev-hero">
          {/* Anillos de energía de fondo */}
          <div className="pulse-ring ring-1"></div>
          <div className="pulse-ring ring-2"></div>

          {/* Ventana de Código IDE */}
          <div className="ud-code-window">
            {/* Barra superior de ventana */}
            <div className="ud-window-header">
              <div className="ud-window-controls">
                <span className="window-dot dot-red"></span>
                <span className="window-dot dot-yellow"></span>
                <span className="window-dot dot-green"></span>
              </div>
              <div className="ud-window-title">
                <Terminal size={11} className="window-title-icon" />
                <span>{fileName}</span>
              </div>
            </div>

            {/* Cuerpo del código */}
            <div className="ud-window-body">
              <div className="ud-code-lines">
                <div className="code-line line-1">
                  <span className="syntax-keyword">const</span>{' '}
                  <span className="syntax-variable">Feature</span> ={' '}
                  <span className="syntax-keyword">async</span> () =&gt; &#123;
                </div>
                <div className="code-line line-2">
                  &nbsp;&nbsp;<span className="syntax-keyword">await</span>{' '}
                  <span className="syntax-function">build</span>(
                  <span className="syntax-string">'clean-arch'</span>);
                </div>
                <div className="code-line line-3">
                  &nbsp;&nbsp;<span className="syntax-keyword">return</span>{' '}
                  <span className="syntax-component">&lt;Ready /&gt;</span>;
                </div>
                <div className="code-line line-4">
                  &#125;;<span className="typing-cursor"></span>
                </div>
              </div>

              {/* Núcleo de Código Central */}
              <div className="ud-dev-core">
                <Code2 size={26} className="ud-core-code-icon" />
              </div>
            </div>
          </div>

          {/* Satélites flotantes de desarrollo */}
          <div className="ud-satellites">
            <div className="ud-satellite sat-top-left">
              <GitBranch size={13} className="sat-icon sat-git" />
            </div>
            <div className="ud-satellite sat-top-right">
              <Cpu size={13} className="sat-icon sat-cpu" />
            </div>
            <div className="ud-satellite sat-bottom-left">
              <Layers size={13} className="sat-icon sat-layers" />
            </div>
            <div className="ud-satellite sat-bottom-right">
              <Boxes size={13} className="sat-icon sat-boxes" />
            </div>
          </div>
        </div>

        {/* Tipografía Principal */}
        <h1 className="ud-title">{title}</h1>
        <p className="ud-message">{message}</p>

        {/* Badge de estado con icono de terminal */}
        <div className="ud-badge">
          <span className="badge-dot"></span>
          <Terminal size={13} className="badge-terminal-icon" />
          <span>En desarrollo activo · {estimatedDate}</span>
        </div>

        {/* Barra de progreso */}
        {showProgress && (
          <div className="ud-progress-section">
            <div className="progress-header">
              <span className="progress-label">
                <Workflow size={14} className="progress-icon" />
                Progreso del Sprint
              </span>
              <span className="progress-value">{progressValue}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Características Técnicas / Highlights Profesionales */}
        <div className="ud-features">
          <div className="feature">
            <Code2 size={16} className="feature-icon feature-icon-code" />
          </div>
          <div className="feature">
            <Layers size={16} className="feature-icon feature-icon-arch" />
          </div>
          <div className="feature">
            <Cpu size={16} className="feature-icon feature-icon-perf" />
          </div>
          <div className="feature">
            <ShieldCheck size={16} className="feature-icon feature-icon-sec" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
