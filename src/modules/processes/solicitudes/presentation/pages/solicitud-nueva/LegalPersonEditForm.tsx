import React, { useState } from 'react';
import { Building2, Mail, Phone, Save } from 'lucide-react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';

interface LegalPersonEditFormProps {
  initialData: {
    cedula: string;
    nombres: string;
    email: string;
    telefono: string;
  };
  onSave: (data: {
    cedula: string;
    nombres: string;
    email: string;
    telefono: string;
  }) => void;
  onCancel: () => void;
}

export const LegalPersonEditForm: React.FC<LegalPersonEditFormProps> = ({
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
          label="RUC"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          required
          leftIcon={<Building2 size={16} />}
        />
        <Input
          label="Razón Social"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          required
        />
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
