import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import '../styles/CustomerForm.css';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Hash,
  Activity,
  UserCheck
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { LocationSelector } from '@/shared/presentation/components/Input/LocationSelector';

interface CompanyFormProps {
  formData: any;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { name: string; value: any }
      | any
  ) => void;
  // We need a way to set complex fields (arrays)
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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
    index: number,
    value: string
  ) => {
    setFormData((prev: any) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleAddField = (field: 'companyEmails' | 'companyPhones') => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveField = (
    field: 'companyEmails' | 'companyPhones',
    index: number
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
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
          size="small"
          disabled={isViewOnly}
          leftIcon={<Building2 size={14} />}
        />
        <Input
          label={t('customers.form.socialReason')}
          name="socialReason"
          value={formData.socialReason}
          onChange={onChange}
          size="small"
          disabled={isViewOnly}
          leftIcon={<Activity size={14} />}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.ruc')}
          name="companyRuc"
          value={formData.companyRuc}
          onChange={onChange}
          required
          size="small"
          disabled={isEditMode || isViewOnly}
          leftIcon={<Hash size={14} />}
        />
        <Select
          label={t('customers.form.identificationType')}
          name="identificationType"
          value={formData.identificationType}
          onChange={onChange}
          size="small"
          disabled={isEditMode || isViewOnly}
          leftIcon={<UserCheck size={14} />}
        >
          <option value="RUC">{t('customers.form.idTypeRUC')}</option>
          <option value="CED">{t('customers.form.idTypeCED')}</option>
          <option value="PAS">{t('customers.form.idTypePAS')}</option>
        </Select>
      </div>

      <div className="customer-form__row-2">
        <div className="customer-form__dynamic-section">
          <label className="customer-form__label">
            {t('customers.form.emails')}
          </label>
          {formData.companyEmails.map((email: any, index: any) => (
            <div key={`email-${index}`} className="customer-form__dynamic-row">
              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  handleArrayChange('companyEmails', index, e.target.value)
                }
                size="small"
                disabled={isViewOnly}
                leftIcon={<Mail size={14} />}
                className="customer-form__dynamic-input"
              />
              {!isViewOnly && (
                <Button
                  size="sm"
                  variant="action"
                  onClick={() => handleRemoveField('companyEmails', index)}
                  circle
                  className="customer-form__remove-btn"
                >
                  <Trash2 size={14} color="var(--error)" />
                </Button>
              )}
            </div>
          ))}
          {!isViewOnly && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddField('companyEmails')}
              className="customer-form__add-btn"
              leftIcon={<Plus size={14} />}
            >
              {t('common.add', 'Add')}
            </Button>
          )}
        </div>

        <div className="customer-form__dynamic-section">
          <label className="customer-form__label">
            {t('customers.form.phones')}
          </label>
          {formData.companyPhones.map((phone: any, index: any) => (
            <div key={`phone-${index}`} className="customer-form__dynamic-row">
              <Input
                value={phone}
                onChange={(e) =>
                  handleArrayChange('companyPhones', index, e.target.value)
                }
                size="small"
                disabled={isViewOnly}
                leftIcon={<Phone size={14} />}
                className="customer-form__dynamic-input"
              />
              {!isViewOnly && (
                <Button
                  size="sm"
                  variant="action"
                  onClick={() => handleRemoveField('companyPhones', index)}
                  circle
                  className="customer-form__remove-btn"
                >
                  <Trash2 size={14} color="var(--error)" />
                </Button>
              )}
            </div>
          ))}
          {!isViewOnly && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddField('companyPhones')}
              className="customer-form__add-btn"
              leftIcon={<Plus size={14} />}
            >
              {t('common.add', 'Add')}
            </Button>
          )}
        </div>
      </div>

      <div
        className="customer-form__row-2"
        style={{ gridTemplateColumns: '1fr' }}
      >
        <Input
          label={t('customers.form.address')}
          name="companyAddress"
          value={formData.companyAddress}
          onChange={onChange}
          size="small"
          disabled={isViewOnly}
          leftIcon={<MapPin size={14} />}
        />
      </div>

      <div className="customer-form__location-section">
        <label
          className="customer-form__label"
          style={{
            marginBottom: '8px',
            display: 'block',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--blue)' }}>🏢</span>{' '}
            {t('customers.form.location', 'Ubicación (Parroquia)')}
          </div>
        </label>
        <LocationSelector
          countryId={formData.companyCountryId || 'ECU'}
          provinceId={formData.companyProvinceId || '10'}
          cantonId={formData.companyCantonId || '1001'}
          parishId={formData.companyParishId || ''}
          size="small"
          onLocationChange={(location) => {
            const keyMap: Record<string, string> = {
              countryId: 'companyCountryId',
              provinceId: 'companyProvinceId',
              cantonId: 'companyCantonId',
              parishId: 'companyParishId'
            };

            Object.entries(location).forEach(([key, value]) => {
              const mappedKey = keyMap[key] || key;
              if (formData[mappedKey] !== value) {
                onChange({
                  target: { name: mappedKey, value, type: 'text' }
                } as any);
              }
            });
          }}
          disabled={isViewOnly}
        />
      </div>
    </div>
  );
};
