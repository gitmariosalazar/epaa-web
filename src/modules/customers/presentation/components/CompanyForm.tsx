import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';
import '../styles/CustomerForm.css';

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
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          required
          disabled={isViewOnly}
        />
        <Input
          label="Social Reason"
          name="socialReason"
          value={formData.socialReason}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label="RUC"
          name="companyRuc"
          value={formData.companyRuc}
          onChange={onChange}
          required
          disabled={isEditMode || isViewOnly}
        />
        <Input
          label="Country"
          name="companyCountry"
          value={formData.companyCountry}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label="Email"
          type="email"
          name="companyEmails"
          value={formData.companyEmails[0] || ''}
          onChange={(e) => handleArrayChange('companyEmails', e.target.value)}
          disabled={isViewOnly}
        />
        <Input
          label="Phone"
          name="companyPhones"
          value={formData.companyPhones[0] || ''}
          onChange={(e) => handleArrayChange('companyPhones', e.target.value)}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label="Address"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={onChange}
          disabled={isViewOnly}
        />
        <Input
          label="Parish ID"
          name="companyParishId"
          value={formData.companyParishId}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>
    </div>
  );
};
