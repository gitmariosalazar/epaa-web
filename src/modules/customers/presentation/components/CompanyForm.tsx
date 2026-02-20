import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';

interface CompanyFormProps {
  formData: CreateCompanyRequest;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  // We need a way to set complex fields (arrays)
  setFormData: React.Dispatch<React.SetStateAction<CreateCompanyRequest>>;
  isEditMode: boolean;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  formData,
  onChange,
  setFormData,
  isEditMode
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
    <div style={{ display: 'grid', gap: '16px' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          required
        />
        <Input
          label="Social Reason"
          name="socialReason"
          value={formData.socialReason}
          onChange={onChange}
        />
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="RUC"
          name="companyRuc"
          value={formData.companyRuc}
          onChange={onChange}
          required
          disabled={isEditMode}
        />
        <Input
          label="Country"
          name="companyCountry"
          value={formData.companyCountry}
          onChange={onChange}
        />
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="Email"
          type="email"
          name="companyEmails"
          value={formData.companyEmails[0] || ''}
          onChange={(e) => handleArrayChange('companyEmails', e.target.value)}
        />
        <Input
          label="Phone"
          name="companyPhones"
          value={formData.companyPhones[0] || ''}
          onChange={(e) => handleArrayChange('companyPhones', e.target.value)}
        />
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="Address"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={onChange}
        />
        <Input
          label="Parish ID"
          name="companyParishId"
          value={formData.companyParishId}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
