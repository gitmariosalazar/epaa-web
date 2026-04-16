import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSignInAlt, FaArrowLeft } from 'react-icons/fa';
import { Button } from '../Button/Button';
import { IconUnauthorized } from '../icons/custom-icons';
import './UnAuthorizedPage.css';
import { Tooltip } from '../common/Tooltip/Tooltip';

/**
 * UnAuthorizedPage - Presentación de error de acceso denegado (401/403).
 * Diseño profesional con enfoque en experiencia de usuario y estética premium.
 */
const UnAuthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-icon-section">
          <div className="unauthorized-pulse-ring"></div>
          <div className="unauthorized-icon-bg">
            <IconUnauthorized size={100} />
          </div>
        </div>

        <span className="unauthorized-code">Error 403</span>

        <h1 className="unauthorized-title">
          {t('common.errors.unauthorizedTitle', 'Acceso Restringido')}
        </h1>

        <p className="unauthorized-description">
          {t(
            'common.errors.unauthorizedDesc',
            'Lo sentimos, pero no tienes los permisos necesarios para ver esta página. Si crees que esto es un error, contacta al soporte técnico.'
          )}
        </p>

        <div className="unauthorized-actions">
          <Tooltip content={t('common.goToBack')} position="top">
            <Button
              leftIcon={<FaArrowLeft />}
              variant="dashed"
              color="primary"
              className="unauthorized-btn"
              onClick={() => navigate(-1)}
            >
              {t('common.goToBack')}
            </Button>
          </Tooltip>

          <Tooltip content={t('common.login')} position="top">
            <Button
              leftIcon={<FaSignInAlt />}
              variant="dashed"
              color="purple"
              className="unauthorized-btn"
              onClick={() => navigate('/login')}
            >
              {t('common.login')}
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorizedPage;
