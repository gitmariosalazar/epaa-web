import React from 'react';
import { CheckCircle, XCircle, User, Shield, Phone } from 'lucide-react';
import type { CreateCustomerRequest } from '../../domain/repositories/CustomerRepository';
import '../styles/UserDetails.css';
import { useTranslation } from 'react-i18next';

interface CustomerDetailsProps {
  customer: CreateCustomerRequest;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer
}) => {
  const { t } = useTranslation();
  const isDeceased = customer.deceased;
  const initial = customer.firstName ? customer.firstName.charAt(0) : 'U';

  const civilStatusMap: Record<number, string> = {
    1: t('customers.form.single'),
    2: t('customers.form.married'),
    3: t('customers.form.divorced'),
    4: t('customers.form.widowed'),
    5: t('customers.form.freeUnion')
  };

  return (
    <div className="user-details">
      <div className="user-details__header">
        <div className="user-details__avatar">{initial}</div>
        <div
          className={`user-details__status ${isDeceased ? 'user-details__status--inactive' : 'user-details__status--active'}`}
        >
          {isDeceased ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {isDeceased
            ? t('customers.details.deceasedStatus')
            : t('customers.details.activeAccount')}
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <User size={16} />
          {t('customers.details.generalInfo')}
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.firstName')}
            </span>
            <span className="user-details__value">
              {customer.firstName || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.lastName')}
            </span>
            <span className="user-details__value">
              {customer.lastName || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.identityId')}
            </span>
            <span className="user-details__value">
              {customer.customerId || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.dob')}
            </span>
            <span className="user-details__value">
              {customer.dateOfBirth instanceof Date
                ? customer.dateOfBirth.toISOString().split('T')[0]
                : 'N/A'}
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
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {customer.emails.length > 0 ? (
                customer.emails.map((email, i) => (
                  <span key={i} className="user-details__value">
                    {email}
                  </span>
                ))
              ) : (
                <span className="user-details__value">N/A</span>
              )}
            </div>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.phone')}
            </span>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {customer.phoneNumbers.length > 0 ? (
                customer.phoneNumbers.map((phone, i) => (
                  <span key={i} className="user-details__value">
                    {phone}
                  </span>
                ))
              ) : (
                <span className="user-details__value">N/A</span>
              )}
            </div>
          </div>
          <div className="user-details__field" style={{ gridColumn: 'span 2' }}>
            <span className="user-details__label">
              {t('customers.form.address')}
            </span>
            <span className="user-details__value">
              {customer.address || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <Shield size={16} />
          {t('customers.details.additionalDetails')}
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.sex')}
            </span>
            <span className="user-details__value">
              <span className="user-details__badge">
                {customer.sexId === 1
                  ? t('customers.form.male')
                  : customer.sexId === 2
                    ? t('customers.form.female')
                    : t('customers.details.unknown')}
              </span>
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.civilStatus')}
            </span>
            <span className="user-details__value">
              <span className="user-details__badge">
                {civilStatusMap[customer.civilStatus as number] ||
                  t('customers.details.unknown')}
              </span>
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.form.parishId')}
            </span>
            <span className="user-details__value">
              {customer.parishId || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">
              {t('customers.details.originCountry')}
            </span>
            <span className="user-details__value">
              {customer.originCountry || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
