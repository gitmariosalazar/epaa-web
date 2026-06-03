import React, { useState } from 'react';
import { User, Mail, Phone, Save } from 'lucide-react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';

interface NaturalPersonEditFormProps {
  initialData: {
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
  };
  onSave: (data: {
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
  }) => void;
  onCancel: () => void;
}

export const NaturalPersonEditForm: React.FC<NaturalPersonEditFormProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({ ...initialData });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-edit-form">
      <div className="modal-edit-grid">
        <Input
          label="Cédula / Pasaporte"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          required
          leftIcon={<User size={16} />}
        />
        <div className="form-row-2">
          <Input
            label="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
          <Input
            label="Apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row-2">
          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            leftIcon={<Mail size={16} />}
          />
          <Input
            label="Teléfono de Contacto"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            leftIcon={<Phone size={16} />}
          />
        </div>
      </div>
      <div
        className="modal-edit-actions"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          marginTop: '1.5rem'
        }}
      >
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};
