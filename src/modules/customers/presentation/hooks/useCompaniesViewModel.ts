import { useState, useEffect } from 'react';
import type { Company } from '../../domain/models/Company';
import type { CreateCompanyRequest } from '../../domain/repositories/CompanyRepository';
import { useCustomersContext } from '../context/CustomersContext';

export const useCompaniesViewModel = () => {
  const {
    getCompaniesUseCase,
    createCompanyUseCase,
    updateCompanyUseCase,
    deleteCompanyUseCase
  } = useCustomersContext();

  // State
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Form Data
  const initialFormState: CreateCompanyRequest = {
    companyName: '',
    socialReason: '',
    companyRuc: '',
    companyAddress: '',
    companyParishId: '',
    companyCountry: 'ECUADOR',
    companyEmails: [],
    companyPhones: [],
    identificationType: 'RUC'
  };
  const [formData, setFormData] =
    useState<CreateCompanyRequest>(initialFormState);

  // Load Data
  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getCompaniesUseCase.execute(limit, offset);
      setCompanies(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load companies', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [page]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedCompany(null);
  };

  const handleCreate = async () => {
    try {
      await createCompanyUseCase.execute(formData);
      setIsFormOpen(false);
      resetForm();
      loadCompanies();
    } catch (error) {
      console.error('Create failed', error);
      alert('Failed to create company');
    }
  };

  const handleUpdate = async () => {
    if (!selectedCompany) return;
    try {
      await updateCompanyUseCase.execute(selectedCompany.companyId, formData);
      setIsFormOpen(false);
      resetForm();
      loadCompanies();
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update company');
    }
  };

  const handleDelete = async () => {
    if (!selectedCompany) return;
    try {
      await deleteCompanyUseCase.execute(selectedCompany.companyId);
      setIsDeleteOpen(false);
      resetForm();
      loadCompanies();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete company');
    }
  };

  const openEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      companyName: company.companyName || '',
      socialReason: company.socialReason || '',
      companyRuc: company.companyRuc,
      companyAddress: company.companyAddress || '',
      companyParishId: company.companyParishId,
      companyCountry: company.companyCountry || 'ECUADOR',
      companyEmails: company.companyEmails.map((e) => e.correo), // Map complex object to string array
      companyPhones: company.companyPhones.map((p) => p.numero), // Map complex object to string array
      identificationType: company.identificationType
    });
    setIsFormOpen(true);
  };

  // Filter
  const filteredCompanies = companies.filter(
    (company) =>
      (company.companyName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (company.socialReason?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) ||
      (company.companyRuc || '').includes(searchTerm)
  );

  return {
    companies,
    filteredCompanies,
    isLoading,
    page,
    setPage,
    hasMore,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    setIsFormOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedCompany,
    setSelectedCompany,
    formData,
    handleInputChange,
    handleCreate,
    handleUpdate,
    handleDelete,
    openEdit,
    resetForm,
    setFormData // Exposed for direct array manipulation (emails/phones)
  };
};
