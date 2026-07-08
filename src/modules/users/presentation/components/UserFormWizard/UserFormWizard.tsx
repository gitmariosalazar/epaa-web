import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { LocationSelector } from '@/shared/presentation/components/Input/LocationSelector';
import type { UserFormData } from '../../models/UserFormData';
import {
  UserCircle,
  KeyRound,
  Fingerprint,
  Briefcase,
  Phone,
  Loader,
  CreditCard,
  Users,
  Mail,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import '@/shared/presentation/styles/Users.css';
import { usePositionsViewModel } from '@/modules/roles/presentation/hooks/usePositionsViewModel';

interface UserFormWizardProps {
  currentStep: number;
  formData: UserFormData;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any; type?: string } }
  ) => void;
  setFormData?: React.Dispatch<React.SetStateAction<UserFormData>>;
  isEditMode: boolean;
  isCreateMode: boolean;
  onIdCardLookup?: (idCard: string) => void;
  isAutoFilling?: boolean;
  autoFillMessage?: string | null;
}

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label
}) => (
  <div className="user-form-wizard__section-label">
    <span className="user-form-wizard__section-icon">{icon}</span>
    {label}
  </div>
);

/**
 * Wizard de 3 pasos para creación/edición de empleados.
 *
 * Step 1: Ficha del Empleado — Cédula + búsqueda + datos personales + ubicación
 * Step 2: Datos Laborales y Contacto
 * Step 3: Datos de Acceso — contraseñas al final (como en customers)
 *
 * Usa los mismos componentes que CustomerForm:
 * Input, Select, DatePicker, PasswordInput, LocationSelector
 */
export const UserFormWizard: React.FC<UserFormWizardProps> = ({
  currentStep,
  formData,
  onChange,
  isEditMode,
  onIdCardLookup,
  isAutoFilling = false,
  autoFillMessage
}) => {
  const { positions } = usePositionsViewModel();
  
  const positionOptions = React.useMemo(() => [
    { value: '', label: 'Seleccionar Cargo...' },
    ...positions.map((pos) => ({
      value: pos.positionId,
      label: pos.name
    }))
  ], [positions]);

  const contractTypeOptions = [
    { value: '', label: 'Seleccionar...' },
    { value: 1, label: 'Nombramiento Permanente' },
    { value: 2, label: 'Servicios Ocasionales' },
    { value: 3, label: 'Código del Trabajo (Indefinido)' },
    { value: 4, label: 'Código del Trabajo (Prueba)' },
    { value: 5, label: 'Nombramiento Provisional' },
    { value: 6, label: 'Libre Nombramiento y Remoción' },
    { value: 7, label: 'Contrato por Inversión' },
    { value: 8, label: 'Contrato Indefinido' },
    { value: 9, label: 'Servicios Profesionales' }
  ];

  switch (currentStep) {
    // ════════════════════════════════════════════════════════════
    // STEP 1: Ficha del Empleado
    // ════════════════════════════════════════════════════════════
    case 0:
      return (
        <div className="user-form-wizard__step">
          {/* ── Datos Personales — cédula + nombres en una sola fila ── */}
          <SectionLabel
            icon={<Fingerprint size={14} />}
            label="Datos Personales"
          />
          <div className="user-form-wizard__row-3">
            <Input
              label="Cédula / ID Card"
              name="idCard"
              value={formData.idCard}
              onChange={onChange}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  const val = e.currentTarget.value.trim();
                  if (val && onIdCardLookup) onIdCardLookup(val);
                }
              }}
              placeholder="Presiona Enter para buscar"
              size="small"
              leftIcon={
                isAutoFilling ? (
                  <Loader size={14} className="user-form-wizard__spinner" />
                ) : (
                  <CreditCard size={14} />
                )
              }
              disabled={isEditMode}
            />
            <Input
              label="Nombres"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              required
              size="small"
              leftIcon={<UserCircle size={14} />}
              placeholder="Ej: Juan Carlos"
            />
            <Input
              label="Apellidos"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              required
              size="small"
              leftIcon={<UserCircle size={14} />}
              placeholder="Ej: Pérez López"
            />
          </div>

          {/* Auto-fill feedback */}
          {autoFillMessage && (
            <div
              className={`user-form-wizard__autofill-message ${autoFillMessage.startsWith('✓')
                  ? 'user-form-wizard__autofill-message--success'
                  : 'user-form-wizard__autofill-message--info'
                }`}
            >
              {autoFillMessage}
            </div>
          )}

          <div className="user-form-wizard__row-3">
            <div className="input-component input--small">
              <label className="input__label">Fecha de Nacimiento</label>
              <DatePicker
                size="small"
                value={formData.dateOfBirth || ''}
                onChange={(date) =>
                  onChange({
                    target: { name: 'dateOfBirth', value: date }
                  } as any)
                }
              />
            </div>
            <Select
              label="Sexo"
              name="sexId"
              value={formData.sexId}
              onChange={onChange}
              size="small"
              leftIcon={<Users size={14} />}
            >
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
            </Select>
            <Input
              label="Citizen ID"
              name="citizenId"
              value={formData.citizenId}
              onChange={onChange}
              size="small"
              placeholder="Referencia ciudadano"
            />
          </div>

          {/* ── Ubicación Domiciliaria — igual que CustomerForm ── */}
          <SectionLabel
            icon={<MapPin size={14} />}
            label="Ubicación Domiciliaria"
          />
          <Input
            label="Dirección"
            name="address"
            value={formData.address || ''}
            onChange={onChange}
            size="small"
            leftIcon={<MapPin size={14} />}
            placeholder="Ej: Av. Principal y Calle 1"
          />
          <div className="user-form-wizard__location-section">
            <LocationSelector
              countryId={formData.countryId || 'ECU'}
              provinceId={formData.provinceId || ''}
              cantonId={formData.cantonId || ''}
              parishId={formData.parishId || ''}
              size="small"
              onLocationChange={(location) => {
                // Disparar onChange para cada campo de ubicación
                Object.entries(location).forEach(([key, value]) => {
                  if ((formData as any)[key] !== value) {
                    onChange({
                      target: { name: key, value, type: 'text' }
                    } as any);
                  }
                });
              }}
            />
          </div>
        </div>
      );

    // ════════════════════════════════════════════════════════════
    // STEP 2: Datos Laborales y Contacto
    // ════════════════════════════════════════════════════════════
    case 1:
      return (
        <div className="user-form-wizard__step">
          <SectionLabel
            icon={<Briefcase size={14} />}
            label="Datos Laborales"
          />
          <div className="user-form-wizard__row-3">
            <Select
              label="Cargo (Position)"
              name="positionId"
              value={formData.positionId || ''}
              onChange={onChange}
              size="small"
              options={positionOptions}
            />
            <Select
              label="Tipo de Contrato"
              name="contractTypeId"
              value={formData.contractTypeId || ''}
              onChange={onChange}
              size="small"
              options={contractTypeOptions}
            />
            <div className="input-component input--small">
              <label className="input__label">Fecha de Contratación</label>
              <DatePicker
                size="small"
                value={formData.hireDate || ''}
                onChange={(date) =>
                  onChange({
                    target: { name: 'hireDate', value: date }
                  } as any)
                }
              />
            </div>
          </div>
          <Input
            label="Salario Base"
            type="number"
            name="baseSalary"
            value={formData.baseSalary}
            onChange={onChange}
            size="small"
            placeholder="Ej: 50000"
          />

          <SectionLabel
            icon={<Phone size={14} />}
            label="Contacto Interno"
          />
          <div className="user-form-wizard__row-2">
            <Input
              label="Teléfono Interno"
              name="internalPhone"
              value={formData.internalPhone}
              onChange={onChange}
              size="small"
              leftIcon={<Phone size={14} />}
              placeholder="123-456-7890"
            />
            <Input
              label="Email Interno"
              type="email"
              name="internalEmail"
              value={formData.internalEmail}
              onChange={onChange}
              size="small"
              leftIcon={<Mail size={14} />}
              placeholder="empleado@epaa.gob.ec"
            />
          </div>
        </div>
      );

    // ════════════════════════════════════════════════════════════
    // STEP 3: Datos de Acceso (contraseñas al final)
    // ════════════════════════════════════════════════════════════
    case 2:
      return (
        <div className="user-form-wizard__step">
          <SectionLabel
            icon={<KeyRound size={14} />}
            label="Datos de Acceso a la Cuenta"
          />
          <div className="user-form-wizard__row-2">
            <Input
              label="Nombre de Usuario"
              name="username"
              value={formData.username}
              onChange={onChange}
              size="small"
              leftIcon={<UserCircle size={14} />}
              placeholder="Cédula o ID"
              readOnly={!!formData.idCard?.trim()}
            />
            <Input
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              size="small"
              leftIcon={<Mail size={14} />}
              placeholder="correo@example.com"
              readOnly={!!formData.internalEmail?.trim()}
            />
          </div>
          <div className="user-form-wizard__row-2">
            <PasswordInput
              label="Contraseña"
              name="password"
              value={formData.password || ''}
              onChange={onChange}
              placeholder={
                isEditMode ? 'Dejar vacío para mantener' : 'Mínimo 8 caracteres'
              }
              showStrength={true}
            />
            <PasswordInput
              label="Confirmar Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={onChange}
              placeholder="Repita la contraseña"
              showStrength={false}
              valueToMatch={formData.password}
            />
          </div>

          {/* Info box — mismo patrón que RegisterPage */}
          <div className="user-form-wizard__info-box">
            <div className="user-form-wizard__info-box-icon">
              <ShieldCheck size={20} />
            </div>
            <div className="user-form-wizard__info-box-content">
              <h4>Información de Seguridad</h4>
              <ul>
                <li>
                  <strong>Usuario:</strong> La cédula del empleado se usa como
                  nombre de usuario.
                </li>
                <li>
                  <strong>Email:</strong> El correo interno se usa como correo
                  de la cuenta.
                </li>
                <li>
                  <strong>Contraseña:</strong> Utilice una contraseña robusta de
                  al menos 8 caracteres.
                </li>
              </ul>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
