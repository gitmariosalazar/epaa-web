import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';
import '../styles/CustomerForm.css';
import { useTranslation } from 'react-i18next';

interface CompanyFormProps {
  formData: CreateCompanyRequest;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  // We need a way to set complex fields (arrays)
  setFormData: React.Dispatch<React.SetStateAction<CreateCompanyRequest>>;
  isEditMode: boolean;
  isViewOnly?: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  onChange,
  setFormData,
  isEditMode,
  isViewOnly = false
}) => {
  const { t } = useTranslation();

  const handleArrayChange = (
    field: 'companyEmails' | 'companyPhones',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [value]
    }));
  };

  return (
    <div className="customer-form__container">
      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.companyName')}
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          required
          disabled={isViewOnly}
        />
        <Input
          label={t('customers.form.socialReason')}
          name="socialReason"
          value={formData.socialReason}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.ruc')}
          name="companyRuc"
          value={formData.companyRuc}
          onChange={onChange}
          required
          disabled={isEditMode || isViewOnly}
        />
        <Input
          label={t('customers.form.country')}
          name="companyCountry"
          value={formData.companyCountry}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.email')}
          type="email"
          name="companyEmails"
          value={formData.companyEmails[0] || ''}
          onChange={(e) => handleArrayChange('companyEmails', e.target.value)}
          disabled={isViewOnly}
        />
        <Input
          label={t('customers.form.phone')}
          name="companyPhones"
          value={formData.companyPhones[0] || ''}
          onChange={(e) => handleArrayChange('companyPhones', e.target.value)}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.address')}
          name="companyAddress"
          value={formData.companyAddress}
          onChange={onChange}
          disabled={isViewOnly}
        />
        <Input
          label={t('customers.form.parishId')}
          name="companyParishId"
          value={formData.companyParishId}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>
    </div>
  );
};
