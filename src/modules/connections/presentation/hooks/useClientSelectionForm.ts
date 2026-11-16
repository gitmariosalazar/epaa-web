import { useState, useEffect } from 'react';
import type { Customer } from '@/modules/customers/domain/models/Customer';
import type { Company } from '@/modules/customers/domain/models/Company';
import { CustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CustomerRepositoryImpl';
import { CompanyRepositoryImpl } from '@/modules/customers/infrastructure/repositories/CompanyRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

const customerRepo = new CustomerRepositoryImpl();
const companyRepo = new CompanyRepositoryImpl();

const sanitizeArray = (arr: any[] | undefined | null): string[] => {
  if (!arr || arr.length === 0) return [''];
  return arr.map((item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      return item.email || item.correo || item.numero || item.telefono || '';
    }
    return '';
  });
};

export interface PersonFormState {
  customerId: string;
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  emails: string[];
  address: string;
  dateOfBirth: string; // Used for input[type="date"]
  sexId: number;
  civilStatus: number;
  parishId: string;
  cantonId: string;
  provinceId: string;
  countryId: string;
  originCountry: string;
  deceased: boolean;
  identificationType: string;
  professionId?: number;
}

export interface CompanyFormState {
  companyRuc: string;
  companyName: string;
  socialReason: string;
  companyAddress: string;
  companyEmails: string[];
  companyPhones: string[];
  companyParishId: string;
  companyCantonId: string;
  companyProvinceId: string;
  companyCountryId: string;
  companyCountry: string;
  identificationType: string;
}

interface UseClientSelectionFormProps {
  onConfirm: (
    data: PersonFormState | CompanyFormState,
    isExisting: boolean,
    type: 'person' | 'company'
  ) => void;
  initialData?: PersonFormState | CompanyFormState | null;
  initialType?: 'person' | 'company' | null;
  isExistingInitial?: boolean;
}

export const useClientSelectionForm = ({
  onConfirm,
  initialData,
  initialType,
  isExistingInitial
}: UseClientSelectionFormProps) => {
  const [activeType, setActiveType] = useState<'person' | 'company'>(
    initialType || 'person'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [foundClient, setFoundClient] = useState<Customer | Company | null>(
    null
  );
  const [isExisting, setIsExisting] = useState(isExistingInitial || false);

  const initialPersonState: PersonFormState = {
    customerId: '',
    firstName: '',
    lastName: '',
    phoneNumbers: [''],
    emails: [''],
    address: '',
    dateOfBirth: new Date().toISOString().split('T')[0],
    sexId: 1,
    civilStatus: 1,
    parishId: '',
    cantonId: '',
    provinceId: '',
    countryId: 'ECU', // Ecuador
    originCountry: 'Ecuador',
    deceased: false,
    identificationType: 'CED',
    professionId: 1
  };

  const initialCompanyState: CompanyFormState = {
    companyRuc: '',
    companyName: '',
    socialReason: '',
    companyAddress: '',
    companyEmails: [''],
    companyPhones: [''],
    companyParishId: '',
    companyCantonId: '',
    companyProvinceId: '',
    companyCountryId: 'ECU', // Ecuador
    companyCountry: 'Ecuador',
    identificationType: 'RUC'
  };

  const [personForm, setPersonForm] = useState<PersonFormState>(
    initialType === 'person' && initialData
      ? {
          ...(initialData as PersonFormState),
          emails: sanitizeArray((initialData as any).emails),
          phoneNumbers: sanitizeArray((initialData as any).phoneNumbers)
        }
      : initialPersonState
  );
  const [companyForm, setCompanyForm] = useState<CompanyFormState>(
    initialType === 'company' && initialData
      ? {
          ...(initialData as CompanyFormState),
          companyEmails: sanitizeArray((initialData as any).companyEmails),
          companyPhones: sanitizeArray((initialData as any).companyPhones)
        }
      : initialCompanyState
  );

  // Sync state if props change (though usually wizard Steps are unmounted/mounted)
  useEffect(() => {
    if (initialData) {
      if (initialType === 'person') {
        const data = initialData as PersonFormState;
        setPersonForm({
          ...data,
          emails: sanitizeArray(data.emails),
          phoneNumbers: sanitizeArray(data.phoneNumbers)
        });
        setActiveType('person');
      } else if (initialType === 'company') {
        const data = initialData as CompanyFormState;
        setCompanyForm({
          ...data,
          companyEmails: sanitizeArray(data.companyEmails),
          companyPhones: sanitizeArray(data.companyPhones)
        });
        setActiveType('company');
      }
      setIsExisting(isExistingInitial || false);
    }
  }, [initialData, initialType, isExistingInitial]);

  const handleReset = () => {
    setPersonForm(initialPersonState);
    setCompanyForm(initialCompanyState);
    setFoundClient(null);
    setIsExisting(false);
    setError(null);
    setSuccessMsg(null);
  };

  const handleIdBlur = async () => {
    if (!personForm.customerId) return;
    setLoading(true);
    setError(null);
    try {
      const customer = await customerRepo.getById(personForm.customerId);
      if (customer) {
        setFoundClient(customer);
        setIsExisting(true);
        setPersonForm({
          ...personForm,
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          emails:
            customer.emails && customer.emails.length > 0
              ? (customer.emails as any[]).map((e) =>
                  typeof e === 'string' ? e : e.email || e.correo || ''
                )
              : [''],
          phoneNumbers:
            customer.phoneNumbers && customer.phoneNumbers.length > 0
              ? (customer.phoneNumbers as any[]).map((p_item) =>
                  typeof p_item === 'string'
                    ? p_item
                    : p_item.numero || p_item.telefono || ''
                )
              : [''],
          address: customer.address || '',
          dateOfBirth: customer.dateOfBirth
            ? new Date(customer.dateOfBirth).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          sexId: customer.sexId || 1,
          civilStatus: customer.civilStatus || 1,
          parishId: customer.parishId || '1',
          originCountry: customer.originCountry || 'Ecuador',
          deceased: customer.deceased || false
        });
        const clientName =
          `${customer.firstName || ''} ${customer.lastName || ''}`.trim();
        setSuccessMsg(
          `Cliente encontrado: ${clientName || customer.customerId}`
        );
        MessageToastCustom(
          'info',
          `Cliente registrado encontrado: ${clientName || customer.customerId}`,
          'Cliente Encontrado',
          {
            position: 'top-right'
          }
        );
      } else {
        setFoundClient(null);
        setIsExisting(false);
        setSuccessMsg(null);
        MessageToastCustom(
          'info',
          'Cédula no registrada. Ingrese los datos para registrar un nuevo cliente.',
          'Nuevo Cliente',
          {
            position: 'top-right'
          }
        );
      }
    } catch (err: any) {
      setFoundClient(null);
      setIsExisting(false);
      MessageToastCustom(
        'error',
        err?.message || 'Error al consultar la identificación del cliente.',
        'Búsqueda de Cliente',
        {
          position: 'top-right'
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRucBlur = async () => {
    if (!companyForm.companyRuc) return;
    setLoading(true);
    setError(null);
    try {
      const company = await companyRepo.getByRuc(companyForm.companyRuc);
      if (company) {
        setFoundClient(company);
        setIsExisting(true);
        setCompanyForm({
          ...companyForm,
          companyName: company.companyName || '',
          socialReason: company.socialReason || '',
          companyAddress: company.companyAddress || '',
          companyEmails:
            company.companyEmails && company.companyEmails.length > 0
              ? (company.companyEmails as any[]).map((e) =>
                  typeof e === 'string' ? e : e.email || e.correo || ''
                )
              : [''],
          companyPhones:
            company.companyPhones && company.companyPhones.length > 0
              ? (company.companyPhones as any[]).map((p_item) =>
                  typeof p_item === 'string'
                    ? p_item
                    : p_item.numero || p_item.telefono || ''
                )
              : [''],
          companyParishId: company.companyParishId || '1',
          companyCountry: company.companyCountry || 'Ecuador'
        });
        const compName =
          company.companyName || company.socialReason || company.companyRuc;
        setSuccessMsg(`Empresa encontrada: ${compName}`);
        MessageToastCustom(
          'info',
          `Empresa registrada encontrada: ${compName}`,
          'Empresa Encontrada',
          {
            position: 'top-right'
          }
        );
      } else {
        setFoundClient(null);
        setIsExisting(false);
        setSuccessMsg(null);
        MessageToastCustom(
          'info',
          'RUC no registrado. Ingrese los datos para registrar la nueva empresa.',
          'Nueva Empresa',
          {
            position: 'top-right'
          }
        );
      }
    } catch (err: any) {
      setFoundClient(null);
      setIsExisting(false);
      MessageToastCustom(
        'error',
        err?.message || 'Error al consultar el RUC de la empresa.',
        'Búsqueda de Empresa',
        {
          position: 'top-right'
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...personForm,
      emails: personForm.emails.filter((e_item) => e_item.trim() !== ''),
      phoneNumbers: personForm.phoneNumbers.filter((p) => p.trim() !== '')
    };
    MessageToastCustom(
      'success',
      isExisting
        ? 'Cliente confirmado. Continuando a detalles básicos...'
        : 'Nuevo cliente preparado. Continuando a detalles básicos...',
      'Cliente Confirmado',
      {
        position: 'top-right'
      }
    );
    onConfirm(cleanedData, isExisting, 'person');
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...companyForm,
      companyEmails: companyForm.companyEmails.filter(
        (e_item) => e_item.trim() !== ''
      ),
      companyPhones: companyForm.companyPhones.filter((p) => p.trim() !== '')
    };
    MessageToastCustom(
      'success',
      isExisting
        ? 'Empresa confirmada. Continuando a detalles básicos...'
        : 'Nueva empresa preparada. Continuando a detalles básicos...',
      'Empresa Confirmada',
      {
        position: 'top-right'
      }
    );
    onConfirm(cleanedData, isExisting, 'company');
  };

  return {
    activeType,
    setActiveType,
    loading,
    error,
    successMsg,
    foundClient,
    isExisting,
    personForm,
    setPersonForm,
    companyForm,
    setCompanyForm,
    handleIdBlur,
    handleRucBlur,
    handleCreatePerson,
    handleCreateCompany,
    handleReset
  };
};
