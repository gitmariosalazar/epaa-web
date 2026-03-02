import { useState } from 'react';
import type { Customer } from '@/modules/customers/domain/models/Customer';

interface UseClientSelectionFormParams {
  foundClient: Customer | null;
  searchClient: (identification: string) => Promise<Customer | null>;
  createClient: (clientData: any) => Promise<boolean>;
  createCompany: (companyData: any) => Promise<boolean>;
  nextStep: () => void;
}

export const useClientSelectionForm = ({
  foundClient,
  searchClient,
  createClient,
  createCompany,
  nextStep
}: UseClientSelectionFormParams) => {
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');
  const [entityType, setEntityType] = useState<'person' | 'company'>('person');

  const [identification, setIdentification] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [personForm, setPersonForm] = useState({
    firstName: '',
    lastName: '',
    customerId: '', // Identification
    email: '',
    phone: '',
    address: '',
    identificationType: 'CEDULA',
    status: true
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    socialReason: '',
    companyRuc: '',
    companyAddress: '',
    companyParishId: '1',
    companyCountry: 'Ecuador',
    companyEmails: [''],
    companyPhones: [''],
    identificationType: 'RUC'
  });

  const handleSearch = async () => {
    if (!identification) return;
    setError(null);
    const client = await searchClient(identification);
    if (!client) {
      setError(
        'Client not found. Please check the identification or create a new client.'
      );
    }
  };

  const handleIdBlur = async () => {
    if (!personForm.customerId) return;
    try {
      const client = await searchClient(personForm.customerId);
      if (client) {
        setPersonForm((prev) => ({
          ...prev,
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          email: client.emails?.[0] || '',
          phone: client.phoneNumbers?.[0] || '',
          address: client.address || ''
        }));
        setSuccessMsg('Client found! Details loaded automatically.');
        setError(null);
      }
    } catch (e) {
      // ignore error on blur
    }
  };

  const handleRucBlur = async () => {
    if (!companyForm.companyRuc) return;
    try {
      const client = await searchClient(companyForm.companyRuc);
      const rawData = client as any;

      if (client) {
        setCompanyForm((prev) => ({
          ...prev,
          companyName: rawData.companyName || client.firstName || '',
          socialReason: rawData.socialReason || client.lastName || '',
          companyAddress: rawData.companyAddress || client.address || '',
          companyEmails: [
            rawData.companyEmails?.[0]?.correo || client.emails?.[0] || ''
          ],
          companyPhones: [
            rawData.companyPhones?.[0]?.numero || client.phoneNumbers?.[0] || ''
          ]
        }));
        setSuccessMsg('Company found! Details loaded automatically.');
        setError(null);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (foundClient && foundClient.customerId === personForm.customerId) {
      nextStep();
      return;
    }

    const newPerson = {
      ...personForm,
      emails: [personForm.email],
      phoneNumbers: [personForm.phone],
      parishId: '1'
    };

    const success = await createClient(newPerson);
    if (success) {
      nextStep();
    } else {
      setError('Failed to create person. User might already exist.');
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (
      foundClient &&
      (foundClient as any).companyRuc === companyForm.companyRuc
    ) {
      nextStep();
      return;
    }

    const success = await createCompany(companyForm);
    if (success) {
      nextStep();
    } else {
      setError('Failed to create company. It might already exist.');
    }
  };

  return {
    activeTab,
    setActiveTab,
    entityType,
    setEntityType,
    identification,
    setIdentification,
    error,
    successMsg,
    personForm,
    setPersonForm,
    companyForm,
    setCompanyForm,
    handleSearch,
    handleIdBlur,
    handleRucBlur,
    handleCreatePerson,
    handleCreateCompany
  };
};
