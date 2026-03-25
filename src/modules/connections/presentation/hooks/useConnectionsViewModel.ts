import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Connection } from '../../domain/models/Connection';
import { useConnectionsContext } from '../context/ConnectionContext';
import type { UpdateCustomerRequest } from '@/modules/customers/domain/repositories/CustomerRepository';
import type { UpdateCompanyRequest } from '@/modules/customers/domain/repositories/CompanyRepository';

// ── Tab type (Open/Closed: add tabs here without touching logic) ─────────────
export type ConnectionTab = 'all' | 'sector' | 'client';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LIMIT_SIZE = 50;

// ── Generic helpers ───────────────────────────────────────────────────────────
function applySortConfig<T>(data: T[], sortConfig: SortConfig | null): T[] {
  if (!sortConfig) return data;
  return [...data].sort((a: any, b: any) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function applyLocalFilters(
  data: Connection[],
  searchQuery: string,
  searchField: string,
  selectedStatus: string,
  selectedSewerage: string,
  sortConfig: SortConfig | null
): Connection[] {
  let result = data;

  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();

    if (searchField === 'all') {
      result = result.filter((item) => {
        // Campos de búsqueda parcial (includes)
        const partialMatches =
          (item.connectionId ?? '').toLowerCase().includes(q) ||
          (item.connectionMeterNumber ?? '').toLowerCase().includes(q) ||
          (item.connectionCadastralKey ?? '').toLowerCase().includes(q) ||
          (item.connectionAddress ?? '').toLowerCase().includes(q) ||
          (item.connectionContractNumber ?? '').toLowerCase().includes(q) ||
          (item.clientId ?? '').toLowerCase().includes(q) ||
          (item.connectionRateName ?? '').toLowerCase().includes(q) ||
          (item.connectionReference ?? '').toLowerCase().includes(q);

        // Campos de búsqueda exacta (===)
        const exactMatches =
          (item.connectionSector?.toString() ?? '').toLowerCase().trim() ===
            q ||
          (item.connectionAccount?.toString() ?? '').toLowerCase().trim() === q;

        return partialMatches || exactMatches;
      });
    } else {
      result = result.filter((item) => {
        const value =
          (item as any)[searchField]?.toString().toLowerCase().trim() ?? '';

        // Si el usuario eligió específicamente el campo 'connectionSector', forzamos igualdad exacta
        if (
          searchField === 'connectionSector' ||
          searchField === 'connectionAccount'
        ) {
          return value === q;
        }

        return value.includes(q);
      });
    }
  }

  // Filtro de Estatus
  if (selectedStatus !== '') {
    const activeFilter = selectedStatus === 'active';
    result = result.filter((item) => item.connectionStatus === activeFilter);
  }

  // Filtro de Alcantarillado
  if (selectedSewerage !== '') {
    const sewerageFilter = selectedSewerage === 'yes';
    result = result.filter(
      (item) => item.connectionSewerage === sewerageFilter
    );
  }

  return applySortConfig(result, sortConfig);
}

// ── ViewModel Hook ────────────────────────────────────────────────────────────
export const useConnectionsViewModel = () => {
  const {
    getConnectionsUseCase,
    findConnectionsBySectorUseCase,
    findAllConnectionsByClientIdUseCase,
    findConnectionWithPropertyByCadastralKeyUseCase,
    getRatesUseCase,
    createConnectionUseCase,
    updateConnectionUseCase,
    deleteConnectionUseCase,
    getCustomerByIdentificationUseCase,
    createCustomerUseCase,
    updateCustomerUseCase,
    createCompanyUseCase,
    updateCompanyUseCase
  } = useConnectionsContext();

  // ── 1. LIST STATE ──
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ConnectionTab>('all');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Search/Filter inputs for fetching
  const [sectorInput, setSectorInput] = useState('');
  const [clientIdInput, setClientIdInput] = useState('');

  // Local-only search + dropdowns
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSewerage, setSelectedSewerage] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // ── 2. CRUD / WIZARD STATE ──
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [rates, setRates] = useState<any[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Client selection info
  const [foundClient, setFoundClient] = useState<any | null>(null);
  const [pendingClientData, setPendingClientData] = useState<any | null>(null);
  const [isClientExisting, setIsClientExisting] = useState(false);
  const [clientType, setClientType] = useState<'person' | 'company'>('person');

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

  // ── 3. CORE FETCH LOGIC (Pagination / Tabs) ───────────────────────────────
  const fetchConnections = useCallback(
    async (currentOffset: number, append = false) => {
      setIsLoading(true);
      setError(null);
      try {
        let result: Connection[] = [];

        if (activeTab === 'all') {
          result = await getConnectionsUseCase.execute(
            LIMIT_SIZE,
            currentOffset
          );
        } else if (activeTab === 'sector') {
          result = await findConnectionsBySectorUseCase.execute(
            sectorInput.trim(),
            LIMIT_SIZE,
            currentOffset
          );
        } else if (activeTab === 'client') {
          result = await findAllConnectionsByClientIdUseCase.execute(
            clientIdInput.trim(),
            LIMIT_SIZE,
            currentOffset
          );
        }

        setConnections((prev) => (append ? [...prev, ...result] : result));
        setHasMore(result.length >= LIMIT_SIZE);
        return result;
      } catch (err: any) {
        setError(err?.message ?? 'Error al cargar las conexiones');
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeTab,
      sectorInput,
      clientIdInput,
      getConnectionsUseCase,
      findConnectionsBySectorUseCase,
      findAllConnectionsByClientIdUseCase
    ]
  );

  const handleFetch = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    fetchConnections(0, false);
  }, [fetchConnections]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    const nextOffset = offset + LIMIT_SIZE;
    setOffset(nextOffset);
    fetchConnections(nextOffset, true);
  }, [hasMore, isLoading, offset, fetchConnections]);

  // ── 4. CRUD ACTIONS ────────────────────────────────────────────────────────
  const loadRates = useCallback(async () => {
    try {
      const result = await getRatesUseCase.execute();
      setRates(result);
    } catch (err) {
      console.error('Error loading rates:', err);
    }
  }, [getRatesUseCase]);

  const openEdit = async (connection: Connection) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch full data (including client and property)
      const fullData =
        await findConnectionWithPropertyByCadastralKeyUseCase.execute(
          connection.connectionCadastralKey
        );

      if (!fullData) {
        throw new Error('No se pudo encontrar la información detallada');
      }

      // 2. Map Client Data
      if (fullData.person) {
        const p = fullData.person;
        const clientData = {
          customerId: p.personId,
          firstName: p.firstName,
          lastName: p.lastName,
          emails:
            p.emails?.map((e: any) =>
              typeof e === 'string' ? e : e.email || e.correo || ''
            ) || [],
          phoneNumbers:
            p.phones?.map((p_item: any) =>
              typeof p_item === 'string'
                ? p_item
                : p_item.numero || p_item.telefono || ''
            ) || [],
          dateOfBirth: p.birthDate,
          sexId: p.genderId,
          civilStatus: p.civilStatusId,
          address: p.address,
          originCountry: p.country,
          parishId: p.parishId,
          professionId: p.professionId || 1,
          deceased: p.isDeceased
        };
        setFoundClient(clientData);
        setPendingClientData(clientData);
        setClientType('person');
      } else if (fullData.company) {
        const c = fullData.company;
        const companyData = {
          companyRuc: c.ruc,
          companyName: c.businessName,
          socialReason: c.commercialName,
          companyAddress: c.address,
          companyParishId: c.parishId,
          companyCountry: c.country,
          companyEmails:
            c.emails?.map((e: any) =>
              typeof e === 'string' ? e : e.email || e.correo || ''
            ) || [],
          companyPhones:
            c.phones?.map((p_item: any) =>
              typeof p_item === 'string'
                ? p_item
                : p_item.numero || p_item.telefono || ''
            ) || [],
          identificationType: 'RUC'
        };
        setFoundClient(companyData);
        setPendingClientData(companyData);
        setClientType('company');
      }

      setIsClientExisting(true);

      // 3. Map Connection Data
      // Prefer fullData values, fallback to connection properties
      const mappedFormData: Omit<Connection, 'connectionId'> = {
        clientId: fullData.clientId,
        connectionRateId: Number(fullData.connectionRateId),
        connectionRateName: fullData.connectionRateName,
        connectionMeterNumber: fullData.connectionMeterNumber ?? '',
        connectionSector: Number(fullData.connectionSector ?? 0),
        connectionAccount: Number(fullData.connectionAccount ?? 0),
        connectionCadastralKey: fullData.connectionCadastralKey ?? '',
        connectionContractNumber: fullData.connectionContractNumber ?? '',
        connectionSewerage: Boolean(fullData.connectionSewerage),
        connectionStatus: fullData.connectionStatus === 'ACTIVO', // Common API pattern
        connectionAddress: fullData.connectionAddress ?? '',
        connectionInstallationDate: fullData.connectionInstallationDate
          ? new Date(fullData.connectionInstallationDate)
          : new Date(),
        connectionPeopleNumber: fullData.connectionPeopleNumber ?? 0,
        connectionZone: Number(fullData.connectionZone ?? 0),
        longitude: fullData.longitude || 0,
        latitude: fullData.latitude || 0,
        connectionCoordinates: fullData.connectionCoordinates ?? '',
        connectionReference: fullData.connectionReference ?? '',
        ConnectionMetaData: fullData.connectionMetadata || {},
        connectionAltitude: fullData.connectionAltitude ?? 0,
        connectionPrecision: fullData.connectionPrecision ?? 0,
        connectionGeolocationDate: fullData.connectionGeolocationDate
          ? new Date(fullData.connectionGeolocationDate)
          : new Date(),
        connectionGeometricZone: fullData.connectionGeometricZone ?? '',
        propertyCadastralKey: fullData.propertyCadastralKey ?? '',
        zoneId: fullData.zoneId || 0
      };

      setSelectedConnection(connection);
      setFormData(mappedFormData);
      setIsFormOpen(true);
      setActiveStep(0); // Ensure we start at the first step
    } catch (err: any) {
      console.error('Error fetching full connection data:', err);
      setError(err.message || 'Error al cargar los detalles de la conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const openDelete = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedConnection) return;
    setIsLoading(true);
    try {
      await deleteConnectionUseCase.execute(selectedConnection.connectionId);
      setIsDeleteOpen(false);
      setSelectedConnection(null);
      handleFetch(); // Refresh list
    } catch (err: any) {
      setError(err?.message ?? 'Error al eliminar');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setSelectedConnection(null);
    setActiveStep(0);
    setFoundClient(null);
    setPendingClientData(null);
    setIsClientExisting(false);
  }, [initialFormState]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { name: string; value: any }
  ) => {
    let name: string;
    let value: any;
    let type: string | undefined;

    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
      type = (e.target as any).type;

      if (type === 'number') value = Number(value);
      if (name === 'connectionSewerage' || name === 'connectionStatus') {
        value = (e.target as HTMLInputElement).checked;
      }
    } else {
      name = e.name;
      value = e.value;
    }

    let updatedData = { ...formData, [name]: value };

    if (name === 'connectionRateId' || name === 'rateId') {
      const rateId = Number(value);
      const selectedRate = rates.find((r) => r.rateId === rateId);
      if (selectedRate) {
        updatedData = {
          ...updatedData,
          connectionRateId: rateId,
          connectionRateName: selectedRate.categoryName || selectedRate.rateName
        };
      }
    }

    setFormData(updatedData);
  };

  const searchClient = async (identification: string) => {
    setIsLoading(true);
    try {
      const client =
        await getCustomerByIdentificationUseCase.execute(identification);
      setFoundClient(client);
      if (client) {
        setFormData((prev) => ({ ...prev, clientId: client.customerId }));
      }
      return client;
    } catch (err) {
      console.error('Error searching client', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const onClientConfirm = (
    data: any,
    isExisting: boolean,
    type: 'person' | 'company'
  ) => {
    setPendingClientData(data);
    setIsClientExisting(isExisting);
    setClientType(type);
    setFoundClient(data);
    setActiveStep(1);
  };

  const handleWizardSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Process Client Registration/Update
      if (pendingClientData) {
        if (clientType === 'person') {
          if (isClientExisting) {
            const updateData: UpdateCustomerRequest = {
              customerId: Number(pendingClientData.customerId),
              firstName: pendingClientData.firstName,
              lastName: pendingClientData.lastName,
              emails: pendingClientData.emails,
              phoneNumbers: pendingClientData.phoneNumbers,
              dateOfBirth: new Date(pendingClientData.dateOfBirth),
              sexId: pendingClientData.sexId,
              civilStatus: pendingClientData.civilStatus,
              address: pendingClientData.address,
              professionId: pendingClientData.professionId || 1,
              originCountry: pendingClientData.originCountry,
              identificationType: pendingClientData.identificationType,
              parishId: pendingClientData.parishId,
              deceased: pendingClientData.deceased
            };
            await updateCustomerUseCase.execute(
              pendingClientData.customerId.toString(),
              updateData
            );
          } else {
            try {
              await createCustomerUseCase.execute(pendingClientData);
            } catch (err: any) {
              if (err.response?.status === 409 || err.statusCode === 409) {
                // Handle conflict if needed
              } else throw err;
            }
          }
        } else if (clientType === 'company') {
          if (isClientExisting) {
            const updateData: UpdateCompanyRequest = {
              companyName: pendingClientData.companyName,
              socialReason: pendingClientData.socialReason,
              companyRuc: pendingClientData.companyRuc,
              companyAddress: pendingClientData.companyAddress,
              companyParishId: pendingClientData.companyParishId,
              companyCountry: pendingClientData.companyCountry,
              companyEmails: pendingClientData.companyEmails,
              companyPhones: pendingClientData.companyPhones,
              identificationType: pendingClientData.identificationType
            };
            await updateCompanyUseCase.execute(
              pendingClientData.companyRuc,
              updateData
            );
          } else {
            await createCompanyUseCase.execute(pendingClientData);
          }
        }
      }

      // 2. Format Payload (Sanitization)
      const finalData = {
        ...formData,
        clientId:
          clientType === 'person'
            ? pendingClientData.customerId
            : pendingClientData.companyRuc,
        connectionId: formData.connectionCadastralKey,
        propertyCadastralKey: formData.propertyCadastralKey || null,
        ConnectionMetaData:
          (formData as any).ConnectionMetaData ||
          (formData as any).connectionMetaData ||
          {}
      };

      // Remove legacy/frontend fields before sending
      delete (finalData as any).connectionCoordinates;
      delete (finalData as any).connectionCadastralKey;
      delete (finalData as any).connectionSector;
      delete (finalData as any).connectionAccount;
      delete (finalData as any).connectionMetaData;

      console.log('Final Wizard Payload:', finalData);

      if (selectedConnection) {
        await updateConnectionUseCase.execute(
          selectedConnection.connectionId,
          finalData as any
        );
      } else {
        await createConnectionUseCase.execute(finalData as any);
      }

      setIsFormOpen(false);
      resetForm();
      handleFetch();
    } catch (err: any) {
      console.error('Error in handleWizardSave:', err);
      setError(err.message || 'Error occurred while creating connection');
    } finally {
      setIsLoading(false);
    }
  };

  // ── 5. DERIVED STATE / FILTERING ──────────────────────────────────────────
  const filteredConnections = useMemo(
    () =>
      applyLocalFilters(
        connections,
        searchQuery,
        searchField,
        selectedStatus,
        selectedSewerage,
        sortConfig
      ),
    [
      connections,
      searchQuery,
      searchField,
      selectedStatus,
      selectedSewerage,
      sortConfig
    ]
  );

  const canFetch =
    !isLoading &&
    (activeTab === 'all'
      ? true
      : activeTab === 'sector'
        ? Boolean(sectorInput.trim())
        : Boolean(clientIdInput.trim()));

  const handleTabChange = (tab: ConnectionTab) => {
    setActiveTab(tab);
    setConnections([]);
    setOffset(0);
    setHasMore(true);
    setSearchQuery('');
    setSearchField('all');
    setSelectedStatus('');
    setSelectedSewerage('');
    setSortConfig(null);
    setError(null);
  };

  const handleSort = (key: string, direction: SortDirection) => {
    setSortConfig({ key, direction });
  };

  // ── 6. INITIALIZATION ──
  useEffect(() => {
    loadRates();
  }, [loadRates]);

  return {
    state: {
      isLoading,
      error,
      activeTab,
      sectorInput,
      clientIdInput,
      searchQuery,
      searchField,
      selectedStatus,
      selectedSewerage,
      sortConfig,
      filteredConnections,
      canFetch,
      hasMore,
      // CRUD/Wizard State
      isFormOpen,
      isDeleteOpen,
      selectedConnection,
      rates,
      activeStep,
      foundClient,
      pendingClientData,
      isClientExisting,
      clientType,
      formData
    },
    actions: {
      handleFetch,
      loadMore,
      handleSort,
      handleTabChange,
      setSectorInput,
      setClientIdInput,
      setSearchQuery,
      setSearchField,
      setSelectedStatus,
      setSelectedSewerage,
      // CRUD/Wizard Actions
      setIsFormOpen,
      setIsDeleteOpen,
      setSelectedConnection,
      setFormData,
      openEdit,
      openDelete,
      handleDelete,
      resetForm,
      searchClient,
      onClientConfirm,
      handleWizardSave,
      setActiveStep,
      loadRates,
      handleInputChange
    }
  };
};
