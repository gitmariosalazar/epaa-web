import React, { useState } from 'react';
import type { User } from '@/modules/users/domain/models/User';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import { User as UserIcon, Mail, Type } from 'lucide-react';
import { Modal } from './Modal';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateUserRequest) => Promise<void>;
  user: User;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user
}) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
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
        Save Changes
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="modal-form">
        {error && <div className="modal-error">{error}</div>}

        <Input
          label="Username"
          name="username"
          value={formData.username || ''}
          onChange={handleChange}
          placeholder="Username"
          leftIcon={<UserIcon size={18} />}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="Email"
          leftIcon={<Mail size={18} />}
        />

        <div className="form-row">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            placeholder="First Name"
            leftIcon={<Type size={18} />}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            placeholder="Last Name"
            leftIcon={<Type size={18} />}
          />
        </div>
      </form>
    </Modal>
  );
};
