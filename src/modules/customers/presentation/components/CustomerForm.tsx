import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { Customer } from '../../domain/models/Customer';
import '../styles/CustomerForm.css';
import { useTranslation } from 'react-i18next';

interface CustomerFormProps {
  formData: Omit<Customer, 'customerId'> & { customerId: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditMode: boolean;
  isViewOnly?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  onChange,
  isEditMode,
  isViewOnly = false
}) => {
  const { t } = useTranslation();

  return (
    <div className="customer-form__container">
      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.firstName')}
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          required
          disabled={isViewOnly}
        />
        <Input
          label={t('customers.form.lastName')}
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          required
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.identityId')}
          name="customerId"
          value={formData.customerId}
          onChange={onChange}
          required
          disabled={isEditMode || isViewOnly}
        />
        <Input
          label={t('customers.form.dob')}
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth || ''}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.email')}
          type="email"
          name="emails"
          value={formData.emails[0] || ''}
          onChange={(e) => {
            onChange({
              target: { name: 'emails', value: [e.target.value] }
            } as any);
          }}
          disabled={isViewOnly}
        />
        <Input
          label={t('customers.form.phone')}
          name="phoneNumbers"
          value={formData.phoneNumbers[0] || ''}
          onChange={(e) => {
            onChange({
              target: { name: 'phoneNumbers', value: [e.target.value] }
            } as any);
          }}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.address')}
          name="address"
          value={formData.address || ''}
          onChange={onChange}
          disabled={isViewOnly}
        />
        <Input
          label={t('customers.form.parishId')}
          name="parishId"
          value={formData.parishId}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <div className="customer-form__group">
          <label className="customer-form__label">
            {t('customers.form.sex')}
          </label>
          <select
            name="sexId"
            value={formData.sexId}
            onChange={onChange}
            className="customer-form__control"
            disabled={isViewOnly}
          >
            <option value={1}>{t('customers.form.male')}</option>
            <option value={2}>{t('customers.form.female')}</option>
          </select>
        </div>
        <div className="customer-form__group">
          <label className="customer-form__label">
            {t('customers.form.civilStatus')}
          </label>
          <select
            name="civilStatus"
            value={formData.civilStatus}
            onChange={onChange}
            className="customer-form__control"
            disabled={isViewOnly}
          >
            <option value={1}>{t('customers.form.single')}</option>
            <option value={2}>{t('customers.form.married')}</option>
            <option value={3}>{t('customers.form.divorced')}</option>
            <option value={4}>{t('customers.form.widowed')}</option>
            <option value={5}>{t('customers.form.freeUnion')}</option>
          </select>
        </div>
      </div>

      <div className="customer-form__row-2">
        <div className="customer-form__group">
          <label className="customer-form__label">
            {t('customers.form.professionId')}
          </label>
          <input
            type="number"
            name="professionId"
            value={formData.professionId}
            onChange={onChange}
            className="customer-form__control"
            disabled={isViewOnly}
          />
        </div>
        <div className="customer-form__checkbox-wrapper">
          <label className="customer-form__checkbox-label">
            <input
              type="checkbox"
              name="deceased"
              checked={formData.deceased}
              onChange={onChange}
              className="customer-form__checkbox"
              disabled={isViewOnly}
            />
            {t('customers.form.deceased')}
          </label>
        </div>
      </div>
    </div>
  );
};
