import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import '../styles/CustomerForm.css';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  Activity,
  CreditCard
} from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { LocationSelector } from '@/shared/presentation/components/Input/LocationSelector';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';

interface CustomerFormProps {
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

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  onChange,
  setFormData,
  isEditMode,
  isViewOnly = false
}) => {
  const { t } = useTranslation();

  const handleArrayChange = (
    field: 'emails' | 'phoneNumbers',
    index: number,
    value: string
  ) => {
    setFormData((prev: any) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const handleAddField = (field: 'emails' | 'phoneNumbers') => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleRemoveField = (
    field: 'emails' | 'phoneNumbers',
    index: number
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  console.log(formData);

  return (
    <div className="customer-form__container">
      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.firstName')}
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          required
          size="small"
          disabled={isViewOnly}
          leftIcon={<User size={14} />}
        />
        <Input
          label={t('customers.form.lastName')}
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          required
          size="small"
          disabled={isViewOnly}
          leftIcon={<User size={14} />}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label={t('customers.form.identityId')}
          name="customerId"
          value={formData.customerId === 0 ? '' : formData.customerId}
          onChange={onChange}
          required
          type="number"
          size="small"
          disabled={isEditMode || isViewOnly}
          leftIcon={<CreditCard size={14} />}
        />
        <Select
          label={t('customers.form.identificationType')}
          name="identificationType"
          value={formData.identificationType}
          onChange={onChange}
          size="small"
          disabled={isEditMode || isViewOnly}
          leftIcon={<Users size={14} />}
        >
          <option value="CED">{t('customers.form.idTypeCED')}</option>
          <option value="RUC">{t('customers.form.idTypeRUC')}</option>
          <option value="PAS">{t('customers.form.idTypePAS')}</option>
        </Select>
      </div>

      <div className="customer-form__row-2">
        <div className="customer-form__dynamic-section">
          <label className="customer-form__label">
            {t('customers.form.emails')}
          </label>
          {formData.emails.map((email: any, index: any) => (
            <div key={`email-${index}`} className="customer-form__dynamic-row">
              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  handleArrayChange('emails', index, e.target.value)
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
                  onClick={() => handleRemoveField('emails', index)}
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
              onClick={() => handleAddField('emails')}
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
          {formData.phoneNumbers.map((phone: any, index: any) => (
            <div key={`phone-${index}`} className="customer-form__dynamic-row">
              <Input
                value={phone}
                onChange={(e) =>
                  handleArrayChange('phoneNumbers', index, e.target.value)
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
                  onClick={() => handleRemoveField('phoneNumbers', index)}
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
              onClick={() => handleAddField('phoneNumbers')}
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
          name="address"
          value={formData.address || ''}
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
            <span style={{ color: 'var(--blue)' }}>📍</span>{' '}
            {t('customers.form.location', 'Location (Parish)')}
          </div>
        </label>
        <LocationSelector
          countryId={formData.countryId || 'ECU'}
          provinceId={formData.provinceId || '10'}
          cantonId={formData.cantonId || '1001'}
          parishId={formData.parishId || ''}
          size="small"
          onLocationChange={(location) => {
            Object.entries(location).forEach(([key, value]) => {
              // Ensure we don't dispatch unnecessary events if value hasn't changed
              if (formData[key] !== value) {
                onChange({
                  target: { name: key, value, type: 'text' }
                } as any);
              }
            });
          }}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-3">
        <div className="input-component input--small">
          <label className="input__label">{t('customers.form.dateOfBirth')}</label>
          <DatePicker
            size="small"
            value={
              formData.dateOfBirth
                ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
                : ''
            }
            onChange={(date) => onChange({ target: { name: 'dateOfBirth', value: date } } as any)}
          />
        </div>
        <Select
          label={t('customers.form.sex')}
          name="sexId"
          value={formData.sexId}
          onChange={onChange}
          size="small"
          disabled={isViewOnly}
          leftIcon={<Users size={14} />}
        >
          <option value={1}>{t('customers.form.male')}</option>
          <option value={2}>{t('customers.form.female')}</option>
        </Select>
        <Select
          label={t('customers.form.civilStatus')}
          name="civilStatus"
          value={formData.civilStatus}
          onChange={onChange}
          size="small"
          disabled={isViewOnly}
          leftIcon={<Activity size={14} />}
        >
          <option value={1}>{t('customers.form.single')}</option>
          <option value={2}>{t('customers.form.married')}</option>
          <option value={3}>{t('customers.form.divorced')}</option>
          <option value={4}>{t('customers.form.widowed')}</option>
          <option value={5}>{t('customers.form.freeUnion')}</option>
        </Select>
      </div>

      <div className="customer-form__row-2" style={{ alignItems: 'flex-end' }}>
        <Input
          label={t('customers.form.professionId')}
          type="number"
          name="professionId"
          value={formData.professionId}
          onChange={onChange}
          size="small"
          disabled={isViewOnly}
          leftIcon={<Briefcase size={14} />}
        />
        <div
          className="customer-form__checkbox-wrapper"
          style={{ paddingBottom: '12px' }}
        >
          <label
            className="customer-form__checkbox-label"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              color: 'var(--text-main)'
            }}
          >
            <input
              type="checkbox"
              name="deceased"
              checked={formData.deceased}
              onChange={onChange}
              className="customer-form__checkbox"
              disabled={isViewOnly}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            {t('customers.form.deceased')}
          </label>
        </div>
      </div>
    </div>
  );
};
