import { useState, useEffect } from 'react';
import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';
import { useCustomersContext } from '../context/CustomersContext';

export const useGeneralCustomersViewModel = () => {
  const { getGeneralCustomersUseCase } = useCustomersContext();

  // State
  const [generalCustomers, setGeneralCustomers] = useState<GeneralCustomer[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGeneralCustomer, setSelectedGeneralCustomer] =
    useState<GeneralCustomer | null>(null);

  // Form Data
  const initialFormState: Omit<GeneralCustomer, 'customerId'> & {
    customerId: string;
  } = {
    customerId: '', // Identity Type ID (Cedula)
    identificationType: '',
    customerName: '',
    emails: [],
    phoneNumbers: [],
    customerAddress: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Load Data
  const loadGeneralCustomers = async () => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;
      const data = await getGeneralCustomersUseCase.execute(limit, offset);
      setGeneralCustomers(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to load general customers', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGeneralCustomers();
  }, [page]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === 'number') finalValue = Number(value);
    if (name === 'deceased') finalValue = value === 'true';

    setFormData({ ...formData, [name]: finalValue });
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedGeneralCustomer(null);
  };

  // Filter
  const filteredGeneralCustomers = generalCustomers.filter(
    (generalCustomer) =>
      (generalCustomer.customerName?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) || (generalCustomer.customerId || '').includes(searchTerm)
  );

  return {
    generalCustomers,
    filteredGeneralCustomers,
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
    selectedGeneralCustomer,
    setSelectedGeneralCustomer,
    formData,
    handleInputChange,
    resetForm,
    setFormData
  };
};
