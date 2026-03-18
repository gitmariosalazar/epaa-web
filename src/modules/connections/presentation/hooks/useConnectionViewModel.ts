import { useState, useEffect } from 'react';
import type { Connection } from '../../domain/models/Connection';
import { useConnectionsContext } from '../context/ConnectionContext';

export const useConnectionViewModel = () => {
  const {
    getConnectionsUseCase,
    getRatesUseCase,
    createConnectionUseCase,
    updateConnectionUseCase,
    deleteConnectionUseCase,
    getCustomerByIdentificationUseCase,
    createCustomerUseCase,
    createCompanyUseCase
  } = useConnectionsContext();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);

  // Wizard State
  const [activeStep, setActiveStep] = useState(0);
  const [foundClient, setFoundClient] = useState<any | null>(null);

  const initialFormState: Omit<Connection, 'connectionId'> = {
    clientId: '',
    connectionRateId: 0,
    connectionRateName: '',
    connectionMeterNumber: '',
    connectionSector: 0,
    connectionAccount: 0,
    connectionCadastralKey: '',
    connectionContractNumber: '',
    connectionSewerage: false,
    connectionStatus: false,
    connectionAddress: '',
    connectionInstallationDate: new Date(),
    connectionPeopleNumber: 0,
    connectionZone: 0,
    longitude: 0,
    latitude: 0,
    connectionCoordinates: '',
    connectionReference: '',
    ConnectionMetaData: {},
    connectionAltitude: 0,
    connectionPrecision: 0,
    connectionGeolocationDate: new Date(),
    connectionGeometricZone: '',
    propertyCadastralKey: '',
    zoneId: 0
  };

  const [formData, setFormData] =
    useState<Omit<Connection, 'connectionId'>>(initialFormState);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const result = await getConnectionsUseCase.execute(limit, offset);
      setConnections(result);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const loadRates = async () => {
    try {
      const result = await getRatesUseCase.execute();
      setRates(result);
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  useEffect(() => {
    loadConnections();
    loadRates();
  }, [page]);

  const handleSave = async () => {
    try {
      setLoading(true);
      // Construct the payload to match the successful schema exactly
      const sanitizedData = {
        ...formData,
        // The backend expects connectionId (Sector-Account format)
        connectionId: formData.propertyCadastralKey,
        ConnectionMetaData: (formData as any).ConnectionMetaData || (formData as any).connectionMetaData || {}
      };

      // Remove fields that should NOT be in the request according to the successful sample
      delete (sanitizedData as any).connectionCoordinates;
      delete (sanitizedData as any).connectionCadastralKey;
      delete (sanitizedData as any).connectionSector;
      delete (sanitizedData as any).connectionAccount;
      delete (sanitizedData as any).connectionMetaData; // Remove secondary case

      if (selectedConnection) {
        await updateConnectionUseCase.execute(
          selectedConnection.connectionId,
          sanitizedData
        );
      } else {
        await createConnectionUseCase.execute(sanitizedData);
      }
      setIsFormOpen(false);
      resetForm();
      loadConnections();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleWizardSave = async () => {
    try {
      setLoading(true);
      // Ensure clientId is set from foundClient if available
      const finalData = {
        ...formData,
        clientId: foundClient ? foundClient.customerId : formData.clientId,
        // The backend expects connectionId
        connectionId: formData.propertyCadastralKey,
        ConnectionMetaData: (formData as any).ConnectionMetaData || (formData as any).connectionMetaData || {}
      };

      // Remove conflicting/unnecessary fields
      delete (finalData as any).connectionCoordinates;
      delete (finalData as any).connectionCadastralKey;
      delete (finalData as any).connectionSector;
      delete (finalData as any).connectionAccount;
      delete (finalData as any).connectionMetaData;

      await createConnectionUseCase.execute(finalData);
      setIsFormOpen(false);
      resetForm();
      loadConnections();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedConnection) return;
    try {
      setLoading(true);
      await deleteConnectionUseCase.execute(selectedConnection.connectionId);
      setIsDeleteOpen(false);
      setSelectedConnection(null);
      loadConnections();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (connection: Connection) => {
    setSelectedConnection(connection);
    setFormData({
      ...connection
    });
    setIsFormOpen(true);
  };

  const openDelete = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsDeleteOpen(true);
  };

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === 'number') finalValue = Number(value);
    if (name === 'connectionSewerage' || name === 'connectionStatus') {
      const checkbox = e.target as HTMLInputElement;
      finalValue = checkbox.checked;
    }

    let updatedData = { ...formData, [name]: finalValue };

    // Special handling for legacy/sync fields when ID changes
    if (name === 'connectionRateId') {
      const selectedRate = rates.find((r) => r.rateId === Number(value));
      if (selectedRate) {
        updatedData = {
          ...updatedData,
          connectionRateName: selectedRate.categoryName
        };
      }
    }

    setFormData(updatedData);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedConnection(null);
    setActiveStep(0);
    setFoundClient(null);
  };

  const searchClient = async (identification: string) => {
    try {
      setLoading(true);
      const client =
        await getCustomerByIdentificationUseCase.execute(identification);
      setFoundClient(client);
      if (client) {
        setFormData((prev) => ({ ...prev, clientId: client.customerId }));
      }
      return client;
    } catch (error) {
      console.error('Error searching client', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filteredConnections = connections.filter(
    (connection) =>
      (connection.connectionMeterNumber?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) || (connection.connectionId || '').includes(searchTerm)
  );

  const createClient = async (clientData: any) => {
    try {
      setLoading(true);
      // Ensure customerId is present (mapped from identification)
      if (!clientData.customerId) {
        throw new Error('Identification is required');
      }

      await createCustomerUseCase.execute(clientData);

      // Auto-select the created client
      const newClient = await getCustomerByIdentificationUseCase.execute(
        clientData.customerId
      );
      if (newClient) {
        setFoundClient(newClient);
        setFormData((prev) => ({ ...prev, clientId: newClient.customerId }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating client', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData: any) => {
    try {
      setLoading(true);
      await createCompanyUseCase.execute(companyData);

      const newCompany = await getCustomerByIdentificationUseCase.execute(
        companyData.companyRuc
      );

      if (newCompany) {
        setFoundClient(newCompany);
        setFormData((prev) => ({ ...prev, clientId: newCompany.customerId }));
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error creating company', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    connections,
    rates,
    loading,
    error,
    page,
    limit,
    hasMore,
    searchTerm,
    isFormOpen,
    isDeleteOpen,
    selectedConnection,
    formData,
    activeStep,
    foundClient,
    loadConnections,
    handleInputChange,
    handleSave,
    handleWizardSave,
    handleDelete,
    openEdit,
    openDelete,
    resetForm,
    searchClient,
    createClient,
    createCompany,
    setActiveStep,
    setFoundClient,
    filteredConnections,
    setConnections,
    setLoading,
    setError,
    setPage,
    setHasMore,
    setSearchTerm,
    setIsFormOpen,
    setIsDeleteOpen,
    setSelectedConnection,
    setFormData
  };
};
