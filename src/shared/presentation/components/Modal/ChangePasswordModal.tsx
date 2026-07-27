import React, { useState } from 'react';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import { Modal } from './Modal';
import { PasswordInput } from '../Input/PasswordInput';
import { Button } from '../Button/Button';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ChangePasswordRequest) => Promise<void>;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const footer = (
    <div className="modal-actions">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        isLoading={loading}
        onClick={handleSubmit}
      >
        Change Password
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        {error && <div className="modal-error">{error}</div>}

        <PasswordInput
          label="Current Password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />

        <PasswordInput
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          showStrength={true}
        />

        <PasswordInput
          label="Confirm New Password"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          valueToMatch={formData.newPassword}
          onChange={handleChange}
          required
        />
      </form>
    </Modal>
  );
};
