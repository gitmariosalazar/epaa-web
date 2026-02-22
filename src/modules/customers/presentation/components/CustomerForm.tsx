import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { Customer } from '../../domain/models/Customer';
import '../styles/CustomerForm.css';

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
  return (
    <div className="customer-form__container">
      <div className="customer-form__row-2">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          required
          disabled={isViewOnly}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          required
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label="Identity ID (Cedula)"
          name="customerId"
          value={formData.customerId}
          onChange={onChange}
          required
          disabled={isEditMode || isViewOnly}
        />
        <Input
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth || ''}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <Input
          label="Email"
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
          label="Phone"
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
          label="Address"
          name="address"
          value={formData.address || ''}
          onChange={onChange}
          disabled={isViewOnly}
        />
        <Input
          label="Parish ID"
          name="parishId"
          value={formData.parishId}
          onChange={onChange}
          disabled={isViewOnly}
        />
      </div>

      <div className="customer-form__row-2">
        <div className="customer-form__group">
          <label className="customer-form__label">Sex</label>
          <select
            name="sexId"
            value={formData.sexId}
            onChange={onChange}
            className="customer-form__control"
            disabled={isViewOnly}
          >
            <option value={1}>Male</option>
            <option value={2}>Female</option>
          </select>
        </div>
        <div className="customer-form__group">
          <label className="customer-form__label">Civil Status</label>
          <select
            name="civilStatus"
            value={formData.civilStatus}
            onChange={onChange}
            className="customer-form__control"
            disabled={isViewOnly}
          >
            <option value={1}>Single</option>
            <option value={2}>Married</option>
            <option value={3}>Divorced</option>
            <option value={4}>Widowed</option>
            <option value={5}>Free Union</option>
          </select>
        </div>
      </div>

      <div className="customer-form__row-2">
        <div className="customer-form__group">
          <label className="customer-form__label">Profession ID</label>
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
            Deceased
          </label>
        </div>
      </div>
    </div>
  );
};
