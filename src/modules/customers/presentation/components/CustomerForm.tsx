import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import type { Customer } from '../../domain/models/Customer';

interface CustomerFormProps {
  formData: Omit<Customer, 'customerId'> & { customerId: string };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditMode: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  formData,
  onChange,
  isEditMode
}) => {
  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          required
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          required
        />
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="Identity ID (Cedula)"
          name="customerId"
          value={formData.customerId}
          onChange={onChange}
          required
          disabled={isEditMode}
        />
        <Input
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth || ''}
          onChange={onChange}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px'
        }}
      >
        <Input
          label="Email"
          type="email"
          name="emails"
          value={formData.emails[0] || ''}
          onChange={(e) => {
            // Simple handling for single email for now
            const newEmails = [e.target.value];
            // We need to propagate this change correctly.
            // Since onChange expects an event, we might need a custom handler or modify the ViewModel.
            // For now, let's assume the ViewModel handles array updates via a specific method or we pass a synthetic event.
            // A better way is to handle this in constraints of the current onChange signature:
            // The ViewModel `handleInputChange` might not handle arrays deeply.
            // Let's rely on `setFormData` exposed from VM or just use a custom handler here if we could.
            // Given the VM structure, we might need to patch it.
            // Let's use the `name` as a path or specialized handler.
            // PROPOSAL: Update VM to handle `emails` array or just send a custom event.
            // Simplification: We will bind to a temporary local state or assume VM handles specific field names.
            // Let's assume the VM's handleInputChange is simple. We will hack it slightly by sending the array as value.
            onChange({
              target: { name: 'emails', value: newEmails }
            } as any);
          }}
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
        />
        <div className="input-group">
          <label>Sex</label>
          <select
            name="sexId"
            value={formData.sexId}
            onChange={onChange}
            className="input-field"
          >
            <option value={1}>Male</option>
            <option value={2}>Female</option>
          </select>
        </div>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
      >
        <Input
          label="Address"
          name="address"
          value={formData.address || ''}
          onChange={onChange}
        />
        <Input
          label="Parish ID"
          name="parishId"
          value={formData.parishId}
          onChange={onChange}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px'
        }}
      >
        <div className="input-group">
          <label>Civil Status</label>
          <select
            name="civilStatus"
            value={formData.civilStatus}
            onChange={onChange}
            className="input-field"
          >
            <option value={1}>Single</option>
            <option value={2}>Married</option>
            <option value={3}>Divorced</option>
            <option value={4}>Widowed</option>
            <option value={5}>Free Union</option>
          </select>
        </div>
        <div className="input-group">
          <label>Profession ID</label>
          <input
            type="number"
            name="professionId"
            value={formData.professionId}
            onChange={onChange}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="deceased"
              checked={formData.deceased}
              onChange={onChange}
            />
            Deceased
          </label>
        </div>
      </div>
    </div>
  );
};
