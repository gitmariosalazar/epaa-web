import React from 'react';
import { Droplets, Mail, Phone, User, Edit } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';
import { LocationSelector } from '@/shared/presentation/components/Input/LocationSelector';
import { DynamicFormResolver } from '../../components/forms/DynamicFormResolver';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import type { SolicitudForm } from './types';
import { isLocationTramite } from './helpers';
import { SearchCustomer } from './SearchCustomer';
import { GetCustomerByIdentificationUseCase } from '@/modules/customers/application/usecases/GetCustomerByIdentificationUseCase';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { GetCompanyByRucUseCase } from '@/modules/customers/application/usecases/GetCompanyByRucUseCase';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Alert } from '@/shared/presentation/components/Alert';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Select } from '@/shared/presentation/components/Input/Select';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { NaturalPersonEditForm } from './NaturalPersonEditForm';
import { LegalPersonEditForm } from './LegalPersonEditForm';

interface PersonalDataStepProps {
  form: SolicitudForm;
  tramite?: Tramite | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDetallesChange: (detalles: Record<string, any>) => void;
  onFormChange: (updatedFields: Partial<SolicitudForm>) => void;
  errors?: Record<string, string>;
}

export const PersonalDataStep: React.FC<PersonalDataStepProps> = ({
  form,
  tramite,
  onDetallesChange,
  onFormChange,
  errors
}) => {
  const customerUseCase = React.useMemo(
    () => new GetCustomerByIdentificationUseCase(new CustomerRepositoryImpl()),
    []
  );

  const companyUseCase = React.useMemo(
    () => new GetCompanyByRucUseCase(new CompanyRepositoryImpl()),
    []
  );

  const handleSearch = async (identification: string, type: string) => {
    if (!identification.trim()) {
      MessageToastCustom(
        'warning',
        'Por favor ingrese una identificación para buscar',
        'Búsqueda de Cliente'
      );
      return;
    }

    try {
      if (type === 'RUC') {
        const company = await companyUseCase.execute(identification);
        if (company) {
          onFormChange({
            cedula: company.companyRuc,
            nombres: company.socialReason || company.companyName || '',
            apellidos: '',
            email: company.companyEmails?.[0]?.correo || '',
            telefono: company.companyPhones?.[0]?.numero || '',
            tipo_persona: 'JURIDICA'
          });
          MessageToastCustom(
            'success',
            `Empresa encontrada: ${company.socialReason || company.companyName}`,
            'Búsqueda Exitosa'
          );
        } else {
          MessageToastCustom(
            'error',
            'No se encontró ninguna empresa con el RUC ingresado',
            'No Encontrado'
          );
        }
      } else {
        // CED o PAS (Cédula o Pasaporte)
        const customer = await customerUseCase.execute(identification);
        console.log(customer?.address);
        if (customer) {
          onFormChange({
            cedula: customer.customerId,
            nombres: customer.firstName,
            apellidos: customer.lastName,
            email: customer.emails?.[0] || '',
            telefono: customer.phoneNumbers?.[0] || '',
            tipo_persona: 'NATURAL'
          });
          MessageToastCustom(
            'success',
            `Cliente encontrado: ${customer.firstName} ${customer.lastName}`,
            'Búsqueda Exitosa'
          );
        } else {
          MessageToastCustom(
            'error',
            'No se encontró ningún cliente con la identificación ingresada',
            'No Encontrado'
          );
        }
      }
    } catch (error: any) {
      console.error('Error al buscar cliente:', error);
      if (error.status === 404) {
        MessageToastCustom(
          'error',
          'No se encontró ningún cliente con la identificación ingresada',
          'No Encontrado'
        );
      } else {
        MessageToastCustom(
          'error',
          'Hubo un error al realizar la búsqueda',
          'Error de Búsqueda'
        );
      }
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    tipo_persona: 'NATURAL' as 'NATURAL' | 'JURIDICA'
  });

  const openEditModal = () => {
    setEditForm({
      cedula: form.cedula || '',
      nombres: form.nombres || '',
      apellidos: form.apellidos || '',
      email: form.email || '',
      telefono: form.telefono || '',
      tipo_persona: form.tipo_persona || 'NATURAL'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveNatural = (data: {
    cedula: string;
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
  }) => {
    onFormChange({
      ...data,
      tipo_persona: 'NATURAL'
    });
    setIsEditModalOpen(false);
    MessageToastCustom(
      'success',
      'Información del titular actualizada',
      'Datos Actualizados'
    );
  };

  const handleSaveLegal = (data: {
    cedula: string;
    nombres: string;
    email: string;
    telefono: string;
  }) => {
    onFormChange({
      ...data,
      apellidos: '', // Clean surnames for legal person
      tipo_persona: 'JURIDICA'
    });
    setIsEditModalOpen(false);
    MessageToastCustom(
      'success',
      'Información del titular actualizada',
      'Datos Actualizados'
    );
  };

  return (
    <div className="solicitud-form-section">
      <div className="solicitud-form-section__header solicitud-form-section__header--with-search">
        <div className="request-section-header-left">
          <User size={20} />
          <h3>Datos del Titular</h3>
        </div>
        <div className="request-section-header-right">
          <SearchCustomer
            form={form}
            onClickSearch={(
              cardIdOrRuc: string,
              identificationType: string
            ) => {
              handleSearch(cardIdOrRuc, identificationType);
            }}
            onCardIdOrRucChange={(cardIdOrRuc: string) => {
              onFormChange({
                cedula: cardIdOrRuc
              });
            }}
          />
        </div>
      </div>

      <div className="solicitud-titular-card">
        <div className="solicitud-titular-card__header">
          <div className="solicitud-titular-card__badge">
            <span className="solicitud-titular-card__badge-dot"></span>
            Titular de la Solicitud
          </div>
          <div className="btn-update">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit size={14} />}
              onClick={openEditModal}
              className="btn-update-action"
              type="button"
            >
              Actualizar Datos
            </Button>
          </div>
        </div>

        <div className="solicitud-titular-card__avatar">
          <div className="solicitur-titular-card__avatar-inner">
            {form.nombres.charAt(0) || <User />}
            {form.apellidos.charAt(0) || ''}
          </div>
          <div>
            <h4 className="solicitud-titular-card__name">
              {form.nombres.trim() === ''
                ? 'No registrado'
                : form.nombres.trim()}{' '}
              {form.apellidos.trim() === '' ? '' : form.apellidos.trim()}
            </h4>
            <p className="solicitud-titular-card__role">
              Cliente Registrado en la EPAA-AA
            </p>
          </div>
        </div>

        <div className="solicitud-titular-card__grid">
          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper">
              <User size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Cédula de Identidad
              </span>
              <strong className="solicitud-titular-card__value">
                {form.cedula.trim() === ''
                  ? 'Sin identificación registrada'
                  : form.cedula.trim()}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--phone">
              <Phone size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Teléfono de Contacto
              </span>
              <strong className="solicitud-titular-card__value">
                {form.telefono.trim() === ''
                  ? 'Sin teléfono registrado'
                  : form.telefono.trim()}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email">
              <Mail size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Correo Electrónico
              </span>
              <strong className="solicitud-titular-card__value">
                {form.email.trim() === ''
                  ? 'Sin correo registrado'
                  : form.email.trim()}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email">
              <FaUserCheck size={16} />
            </div>
            <div>
              <span className="solicitud-titular-card__label">
                Tipo de Persona
              </span>
              <strong className="solicitud-titular-card__value">
                {form.tipo_persona === 'JURIDICA'
                  ? 'Persona Jurídica'
                  : 'Persona Natural'}
              </strong>
            </div>
          </div>
          <div className="solicitud-titular-card__item--full">
            <Alert
              type="info"
              title="Importante"
              dismissible={false}
              message="Si existe información incompleta, por favor complete o actualice los datos. Si no existe información, por favor complete los datos."
            />
          </div>
        </div>
      </div>

      <div
        className="solicitud-form-section__header"
        style={{ marginTop: 'var(--spacing-lg)' }}
      >
        <Droplets size={20} />
        <h3>Detalles Generales</h3>
      </div>

      {isLocationTramite(tramite?.categoria) && (
        <>
          <div
            className="solicitud-form-section__header"
            style={{ marginTop: 'var(--spacing-lg)' }}
          >
            <h3>Ubicación del Predio</h3>
          </div>
          <div className="solicitud-location-wrapper">
            <LocationSelector
              countryId={form.detalles?.countryId || 'ECU'}
              provinceId={form.detalles?.provinceId || ''}
              cantonId={form.detalles?.cantonId || ''}
              parishId={form.detalles?.parishId || ''}
              onLocationChange={(location) =>
                onDetallesChange({
                  ...form.detalles,
                  countryId: location.countryId,
                  provinceId: location.provinceId,
                  cantonId: location.cantonId,
                  parishId: location.parishId
                })
              }
            />
            {(errors?.provinceId || errors?.cantonId || errors?.parishId) && (
              <span
                className="input__error"
                style={{ display: 'block', marginTop: '4px' }}
              >
                {errors.provinceId || errors.cantonId || errors.parishId}
              </span>
            )}
          </div>
        </>
      )}

      {tramite && (
        <DynamicFormResolver
          categoria={tramite.categoria}
          data={form.detalles}
          onChange={(newDetalles) => onDetallesChange(newDetalles)}
          errors={errors}
        />
      )}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Actualizar Datos del Titular"
        size="md"
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <Select
            label="Tipo de Persona"
            name="tipo_persona"
            value={editForm.tipo_persona}
            onChange={(e) => {
              const newType = e.target.value as 'NATURAL' | 'JURIDICA';
              setEditForm((prev) => ({
                ...prev,
                tipo_persona: newType,
                apellidos: newType === 'JURIDICA' ? '' : prev.apellidos
              }));
            }}
            required
          >
            <option value="NATURAL">Persona Natural</option>
            <option value="JURIDICA">Persona Jurídica</option>
          </Select>

          {editForm.tipo_persona === 'NATURAL' ? (
            <NaturalPersonEditForm
              initialData={{
                cedula: editForm.cedula,
                nombres: editForm.nombres,
                apellidos: editForm.apellidos,
                email: editForm.email,
                telefono: editForm.telefono
              }}
              onSave={handleSaveNatural}
              onCancel={() => setIsEditModalOpen(false)}
            />
          ) : (
            <LegalPersonEditForm
              initialData={{
                cedula: editForm.cedula,
                nombres: editForm.nombres,
                email: editForm.email,
                telefono: editForm.telefono
              }}
              onSave={handleSaveLegal}
              onCancel={() => setIsEditModalOpen(false)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
