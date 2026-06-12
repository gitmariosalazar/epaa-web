/**
 * ClienteStep — Paso 1 del wizard de creación de OT
 *
 * SRP : única responsabilidad — buscar cliente y mostrar su card.
 * DIP : depende de abstracciones (use cases), no de implementaciones.
 * ISP : solo recibe props estrictamente necesarias.
 */
import React from 'react';
import { User, Mail, Phone, Edit } from 'lucide-react';
import { FaUserCheck } from 'react-icons/fa';
import { SearchCustomer } from '@/modules/processes/solicitudes/presentation/pages/solicitud-nueva/SearchCustomer';
import { GetCustomerByIdentificationUseCase } from '@/modules/customers/application/usecases/GetCustomerByIdentificationUseCase';
import { CustomerRepositoryImpl }             from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { GetCompanyByRucUseCase }             from '@/modules/customers/application/usecases/GetCompanyByRucUseCase';
import { CompanyRepositoryImpl }              from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { MessageToastCustom }                 from '@/shared/presentation/components/toast/CustomMessageToast';
import { Alert }                              from '@/shared/presentation/components/Alert';
import { Button }                             from '@/shared/presentation/components/Button/Button';
import { Modal }                              from '@/shared/presentation/components/Modal/Modal';
import { Input }                              from '@/shared/presentation/components/Input/Input';
import type { WorkOrderForm } from './types';

interface ClienteStepProps {
  form:         WorkOrderForm;
  onFormChange: (fields: Partial<WorkOrderForm>) => void;
  errors?:      Record<string, string>;
}

export const ClienteStep: React.FC<ClienteStepProps> = ({
  form,
  onFormChange,
  errors,
}) => {
  // ── DIP: inject use cases via useMemo (not instantiated inline) ────────
  const customerUseCase = React.useMemo(
    () => new GetCustomerByIdentificationUseCase(new CustomerRepositoryImpl()),
    []
  );
  const companyUseCase = React.useMemo(
    () => new GetCompanyByRucUseCase(new CompanyRepositoryImpl()),
    []
  );

  // ── Edit modal state ───────────────────────────────────────────────────
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({
    clientName:  '',
    clientEmail: '',
    clientPhone: '',
  });

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleSearch = async (identification: string, type: string) => {
    if (!identification.trim()) {
      MessageToastCustom('warning', 'Ingresa una identificación para buscar', 'Búsqueda');
      return;
    }
    try {
      if (type === 'RUC') {
        const company = await companyUseCase.execute(identification);
        if (company) {
          onFormChange({
            clientId:    company.companyRuc,
            clientName:  company.socialReason || company.companyName || '',
            clientEmail: company.companyEmails?.[0]?.correo || '',
            clientPhone: company.companyPhones?.[0]?.numero  || '',
            tipoPersona: 'JURIDICA',
          });
          MessageToastCustom('success', `Empresa: ${company.socialReason || company.companyName}`, 'Encontrada');
        } else {
          MessageToastCustom('error', 'No se encontró empresa con ese RUC.', 'No encontrado');
        }
      } else {
        const customer = await customerUseCase.execute(identification);
        if (customer) {
          onFormChange({
            clientId:    customer.customerId,
            clientName:  `${customer.firstName} ${customer.lastName}`,
            clientEmail: customer.emails?.[0]       || '',
            clientPhone: customer.phoneNumbers?.[0]  || '',
            tipoPersona: 'NATURAL',
          });
          MessageToastCustom('success', `Cliente: ${customer.firstName} ${customer.lastName}`, 'Encontrado');
        } else {
          MessageToastCustom('error', 'No se encontró cliente con esa identificación.', 'No encontrado');
        }
      }
    } catch {
      MessageToastCustom('error', 'Error al buscar en el servidor.', 'Error');
    }
  };

  const openEdit = () => {
    setEditData({
      clientName:  form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    onFormChange(editData);
    setIsEditOpen(false);
    MessageToastCustom('success', 'Datos del cliente actualizados.', 'Actualizado');
  };

  const clienteEncontrado = !!form.clientName.trim();

  return (
    <div className="solicitud-form-section">
      {/* ── Search header ──────────────────────────────────────────── */}
      <div className="solicitud-form-section__header solicitud-form-section__header--with-search">
        <div className="request-section-header-left">
          <User size={20} />
          <h3>Datos del Cliente</h3>
        </div>
        <div className="request-section-header-right">
          <SearchCustomer
            form={{ cedula: form.clientId, nombres: form.clientName, apellidos: '', email: form.clientEmail, telefono: form.clientPhone, tipo_persona: form.tipoPersona, detalles: {} }}
            onCardIdOrRucChange={(val) => onFormChange({ clientId: val, clientName: '', clientEmail: '', clientPhone: '' })}
            onClickSearch={handleSearch}
          />
        </div>
      </div>

      {/* ── Validation error ───────────────────────────────────────── */}
      {errors?.clientId && (
        <p className="input__error" style={{ marginBottom: '0.75rem' }}>{errors.clientId}</p>
      )}
      {errors?.clientName && !errors?.clientId && (
        <p className="input__error" style={{ marginBottom: '0.75rem' }}>{errors.clientName}</p>
      )}

      {/* ── Titular card ───────────────────────────────────────────── */}
      <div className="solicitud-titular-card">
        <div className="solicitud-titular-card__header">
          <div className="solicitud-titular-card__badge">
            <span className="solicitud-titular-card__badge-dot" />
            Titular de la Orden
          </div>
          {clienteEncontrado && (
            <div className="btn-update">
              <Button variant="outline" size="sm" leftIcon={<Edit size={14} />}
                onClick={openEdit} type="button" className="btn-update-action">
                Actualizar Datos
              </Button>
            </div>
          )}
        </div>

        <div className="solicitud-titular-card__avatar">
          <div className="solicitur-titular-card__avatar-inner">
            {form.clientName.charAt(0) || <User />}
          </div>
          <div>
            <h4 className="solicitud-titular-card__name">
              {form.clientName.trim() || 'No registrado'}
            </h4>
            <p className="solicitud-titular-card__role">
              {clienteEncontrado ? 'Cliente encontrado en el sistema' : 'Busca al cliente por cédula o RUC'}
            </p>
          </div>
        </div>

        <div className="solicitud-titular-card__grid">
          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper"><User size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Cédula / RUC</span>
              <strong className="solicitud-titular-card__value">
                {form.clientId.trim() || 'Sin identificación'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--phone"><Phone size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Teléfono</span>
              <strong className="solicitud-titular-card__value">
                {form.clientPhone.trim() || 'Sin teléfono'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email"><Mail size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Correo Electrónico</span>
              <strong className="solicitud-titular-card__value">
                {form.clientEmail.trim() || 'Sin correo'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item">
            <div className="solicitud-titular-card__icon-wrapper solicitud-titular-card__icon-wrapper--email"><FaUserCheck size={16} /></div>
            <div>
              <span className="solicitud-titular-card__label">Tipo de Persona</span>
              <strong className="solicitud-titular-card__value">
                {form.tipoPersona === 'JURIDICA' ? 'Persona Jurídica' : 'Persona Natural'}
              </strong>
            </div>
          </div>

          <div className="solicitud-titular-card__item--full">
            <Alert type="info" title="Tip" dismissible={false}
              message="Busca al cliente por Cédula, RUC o Pasaporte. Los datos se rellenarán automáticamente. Si hay información incompleta, usa 'Actualizar Datos'." />
          </div>
        </div>
      </div>

      {/* ── Edit modal ─────────────────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}
        title="Actualizar Datos del Cliente" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Nombre completo *" name="clientName" value={editData.clientName}
            onChange={e => setEditData(p => ({ ...p, clientName: e.target.value }))} required />
          <Input label="Correo electrónico" name="clientEmail" type="email" value={editData.clientEmail}
            onChange={e => setEditData(p => ({ ...p, clientEmail: e.target.value }))} />
          <Input label="Teléfono" name="clientPhone" value={editData.clientPhone}
            onChange={e => setEditData(p => ({ ...p, clientPhone: e.target.value }))} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveEdit}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
