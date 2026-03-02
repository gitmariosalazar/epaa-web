import React from 'react';
import { CheckCircle, Building, Phone, MapPin } from 'lucide-react';
import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';
import '../styles/UserDetails.css';
import { useTranslation } from 'react-i18next';

interface CompanyDetailsProps {
  company: CreateCompanyRequest;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company }) => {
  const { t } = useTranslation();
  const initial = company.companyName ? company.companyName.charAt(0) : 'C';

  const email = company.companyEmails?.[0] || 'N/A';
  const phone = company.companyPhones?.[0] || 'N/A';

  return (
    <div className="user-details">
      <div className="user-details__header">
        <div className="user-details__avatar user-details__avatar--company">
          {initial}
        </div>
        <div className="user-details__status user-details__status--active">
          <CheckCircle size={18} />
          {t('customers.details.activeCompany')}
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <Building size={16} />
          {t('customers.details.companyInfo')}
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.companyName')}
            </span>
            <span className="user-details__value">{company.companyName}</span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.ruc')}
            </span>
            <span className="user-details__value">{company.companyRuc}</span>
          </div>
          <div className="user-details__field" style={{ gridColumn: 'span 2' }}>
            <span className="user-details__label">
              {t('customers.form.socialReason')}
            </span>
            <span className="user-details__value">
              {company.socialReason || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <Phone size={16} />
          {t('customers.details.contactInfo')}
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.email')}
            </span>
            <span className="user-details__value">
              {typeof email === 'object' ? (email as any).correo : email}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.phone')}
            </span>
            <span className="user-details__value">
              {typeof phone === 'object' ? (phone as any).numero : phone}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <MapPin size={16} />
          {t('customers.details.locationDetails')}
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field" style={{ gridColumn: 'span 2' }}>
            <span className="user-details__label">
              {t('customers.form.address')}
            </span>
            <span className="user-details__value">
              {company.companyAddress || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.parishId')}
            </span>
            <span className="user-details__value">
              {company.companyParishId || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.country')}
            </span>
            <span className="user-details__value">
              {company.companyCountry || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
