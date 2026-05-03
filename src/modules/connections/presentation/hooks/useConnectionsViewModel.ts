import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Connection, Rate } from '../../domain/models/Connection';
import { ACTIVE_STATES } from '../../domain/models/ConnectionState';

import { useConnectionsContext } from '../context/ConnectionContext';
import type {
  UpdateCustomerRequest,
  CreateCustomerRequest
} from '@/modules/customers/domain/repositories/CustomerRepository';
import type {
  UpdateCompanyRequest,
  CreateCompanyRequest
} from '@/modules/customers/domain/repositories/CompanyRepository';
import type { Customer } from '@/modules/customers/domain/models/Customer';
import type { Company } from '@/modules/customers/domain/models/Company';
import { decodeEWKBPoint, type Coordinate } from '@/shared/utils/geoUtils';

// -- Derived Client Types --
export type ClientData = Customer | Company;
export type ClientMutationRequest =
  | CreateCustomerRequest
  | UpdateCustomerRequest
  | CreateCompanyRequest
  | UpdateCompanyRequest;

// ── Tab type (Open/Closed: add tabs here without touching logic) ─────────────
export type ConnectionTab = 'all' | 'sector' | 'client' | 'cadastral';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LIMIT_SIZE = 1000;

// ── Generic helpers ───────────────────────────────────────────────────────────
function applySortConfig<T>(data: T[], sortConfig: SortConfig | null): T[] {
  if (!sortConfig) return data;
  const key = sortConfig.key as keyof T;
  return [...data].sort((a: T, b: T) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
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
        const key = searchField as keyof Connection;
        const value = item[key]?.toString().toLowerCase().trim() ?? '';

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
    if (selectedStatus === 'active') {
      // "Activo" → solo conexiones cuyo estado sea ACTIVA
      result = result.filter((item) => ACTIVE_STATES.has(item.connectionStatus));
    } else {
      // "Inactivo" → todo lo que NO sea ACTIVA
      result = result.filter((item) => !ACTIVE_STATES.has(item.connectionStatus));
    }
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
  const [cadastralKeyInput, setCadastralKeyInput] = useState('');

  // Local-only search + dropdowns
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSewerage, setSelectedSewerage] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [mapCenter, setMapCenter] = useState<Coordinate | null>(null);
  const [mapZoom, setMapZoom] = useState(13);

  // ── 2. CRUD / WIZARD STATE ──
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [rates, setRates] = useState<Rate[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Client selection info
  const [foundClient, setFoundClient] = useState<ClientData | null>(null);
  const [pendingClientData, setPendingClientData] = useState<
    CreateCustomerRequest | CreateCompanyRequest | null
  >(null);
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
    connectionStatus: 'ACTIVA',
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
    zoneId: 0,
    connectionStateId: 0,
    connectionIsReadable: true
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
        } else if (activeTab === 'cadastral') {
          const key = cadastralKeyInput.trim();
          if (key) {
            const detail =
              await findConnectionWithPropertyByCadastralKeyUseCase.execute(
                key
              );
            if (detail) {
              // Convert ConnectionWithProperty to Connection for the list
              const conn: Connection = {
                connectionId: detail.connectionId,
                clientId: detail.clientId,
                connectionRateId: Number(detail.connectionRateId),
                connectionRateName: detail.connectionRateName,
                connectionMeterNumber: detail.connectionMeterNumber || '',
                connectionSector: Number(detail.connectionSector || 0),
                connectionAccount: Number(detail.connectionAccount || 0),
                connectionCadastralKey: detail.connectionCadastralKey || '',
                connectionContractNumber: detail.connectionContractNumber || '',
                connectionSewerage: detail.connectionSewerage || false,
                connectionStatus: detail.connectionStatus ?? '',
                connectionAddress: detail.connectionAddress || '',
                connectionInstallationDate: detail.connectionInstallationDate
                  ? new Date(detail.connectionInstallationDate)
                  : new Date(),
                connectionPeopleNumber: detail.connectionPeopleNumber || 0,
                connectionZone: Number(detail.connectionZone || 0),
                longitude: detail.longitude || 0,
                latitude: detail.latitude || 0,
                connectionCoordinates: detail.connectionCoordinates || '',
                connectionReference: detail.connectionReference || '',
                ConnectionMetaData: detail.connectionMetadata || {},
                connectionAltitude: detail.connectionAltitude || 0,
                connectionPrecision: detail.connectionPrecision || 0,
                connectionGeolocationDate: detail.connectionGeolocationDate
                  ? new Date(detail.connectionGeolocationDate)
                  : new Date(),
                connectionGeometricZone: detail.connectionGeometricZone || '',
                propertyCadastralKey: detail.propertyCadastralKey || '',
                zoneId: detail.zoneId || 0,
                connectionStateId: 0,
                connectionIsReadable: true
              };
              result = [conn];
            }
          }
        }

        const enhancedResults = result.map((conn) => {
          if (!conn.latitude || !conn.longitude) {
            const decoded = decodeEWKBPoint(conn.connectionCoordinates);
            if (decoded) {
              return { ...conn, latitude: decoded.lat, longitude: decoded.lng };
            }
          }
          return conn;
        });

        setConnections((prev) =>
          append ? [...prev, ...enhancedResults] : enhancedResults
        );
        setHasMore(result.length >= LIMIT_SIZE);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al cargar las Acometidas';
        setError(message);
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

      // setFoundClient(fullData); // Removed: fullData is ConnectionWithProperty, not ClientData

      // 2. Map Client Data
      if (fullData.person) {
        const p = fullData.person;
        const clientData: Customer = {
          customerId: p.personId,
          firstName: p.firstName,
          lastName: p.lastName,
          emails:
            p.emails?.map((e) => (typeof e === 'string' ? e : e.email || '')) ||
            [],
          phoneNumbers:
            p.phones?.map((p_item) =>
              typeof p_item === 'string' ? p_item : p_item.numero || ''
            ) || [],
          dateOfBirth: p.birthDate,
          sexId: p.genderId,
          civilStatus: p.civilStatusId,
          address: p.address,
          originCountry: p.country,
          parishId: p.parishId,
          professionId: p.professionId || 1,
          deceased: p.isDeceased,
          identificationType: 'CEDULA' // Default or based on logic
        };
        setFoundClient(clientData);
        setPendingClientData({
          ...clientData,
          customerId: Number(clientData.customerId),
          dateOfBirth: new Date(clientData.dateOfBirth || new Date()),
          phoneNumbers: clientData.phoneNumbers,
          emails: clientData.emails
        } as CreateCustomerRequest);
        setClientType('person');
      } else if (fullData.company) {
        const c = fullData.company;
        const companyData: Company = {
          companyId: c.companyId.toString(),
          companyRuc: c.ruc,
          companyName: c.businessName,
          socialReason: c.commercialName,
          companyAddress: c.address,
          companyParishId: c.parishId,
          companyCountry: c.country,
          companyEmails:
            c.emails?.map((e) => ({
              correo: typeof e === 'string' ? e : e.email || '',
              correo_electronico_id: typeof e === 'string' ? 0 : e.emailid || 0
            })) || [],
          companyPhones:
            c.phones?.map((p_item) => ({
              numero: typeof p_item === 'string' ? p_item : p_item.numero || '',
              telefono_id:
                typeof p_item === 'string' ? 0 : p_item.telefonoid || 0
            })) || [],
          identificationType: 'RUC'
        };
        setFoundClient(companyData);
        setPendingClientData({
          companyName: companyData.companyName || '',
          socialReason: companyData.socialReason || '',
          companyRuc: companyData.companyRuc,
          companyAddress: companyData.companyAddress || '',
          companyParishId: companyData.companyParishId,
          companyCountry: companyData.companyCountry || '',
          companyEmails: companyData.companyEmails.map((e) => e.correo),
          companyPhones: companyData.companyPhones.map((p) => p.numero),
          identificationType: companyData.identificationType
        } as CreateCompanyRequest);
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
        connectionStatus: fullData.connectionStatus ?? '',
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
        zoneId: fullData.zoneId || 0,
        connectionStateId: 0,
        connectionIsReadable: true
      };

      setSelectedConnection(connection);
      setFormData(mappedFormData);

      // If we are opening edit from map, ensure it's centered
      if (mappedFormData.latitude && mappedFormData.longitude) {
        setMapCenter({
          lat: mappedFormData.latitude,
          lng: mappedFormData.longitude
        });
      }

      setIsFormOpen(true);
      setActiveStep(0); // Ensure we start at the first step
    } catch (err: unknown) {
      console.error('Error fetching full connection data:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar los detalles de la conexión';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadByCadastralKeyAndEdit = async (key: string) => {
    if (!key) return;
    setIsLoading(true);
    setError(null);
    try {
      const fullData =
        await findConnectionWithPropertyByCadastralKeyUseCase.execute(key);

      if (!fullData) {
        throw new Error('No se encontró ninguna conexión con esa clave');
      }

      // 1. Convert to a base Connection for selectedConnection
      const conn: Connection = {
        connectionId: fullData.connectionId,
        clientId: fullData.clientId,
        connectionRateId: Number(fullData.connectionRateId),
        connectionRateName: fullData.connectionRateName,
        connectionMeterNumber: fullData.connectionMeterNumber || '',
        connectionSector: Number(fullData.connectionSector || 0),
        connectionAccount: Number(fullData.connectionAccount || 0),
        connectionCadastralKey: fullData.connectionCadastralKey || '',
        connectionContractNumber: fullData.connectionContractNumber || '',
        connectionSewerage: fullData.connectionSewerage || false,
        connectionStatus: fullData.connectionStatus ?? '',
        connectionAddress: fullData.connectionAddress || '',
        connectionInstallationDate: fullData.connectionInstallationDate
          ? new Date(fullData.connectionInstallationDate)
          : new Date(),
        connectionPeopleNumber: fullData.connectionPeopleNumber || 0,
        connectionZone: Number(fullData.connectionZone || 0),
        longitude: fullData.longitude || 0,
        latitude: fullData.latitude || 0,
        connectionCoordinates: fullData.connectionCoordinates || '',
        connectionReference: fullData.connectionReference || '',
        ConnectionMetaData: fullData.connectionMetadata || {},
        connectionAltitude: fullData.connectionAltitude || 0,
        connectionPrecision: fullData.connectionPrecision || 0,
        connectionGeolocationDate: fullData.connectionGeolocationDate
          ? new Date(fullData.connectionGeolocationDate)
          : new Date(),
        connectionGeometricZone: fullData.connectionGeometricZone || '',
        propertyCadastralKey: fullData.propertyCadastralKey || '',
        zoneId: fullData.zoneId || 0,
        connectionStateId: 0,
        connectionIsReadable: true
      };

      // 2. Reuse the Edit logic by calling openEdit with the newly created conn
      await openEdit(conn);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar la conexión';
      setError(message);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar';
      setError(message);
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
      | { name: string; value: string | number | boolean | Date | object }
  ) => {
    let name: string;
    let value: string | number | boolean | Date | object;

    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
      const target = e.target as HTMLInputElement;

      if (target.type === 'number') value = Number(value);
      if (name === 'connectionSewerage' || name === 'connectionStatus') {
        value = target.checked;
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
          connectionRateName: selectedRate.rateName
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
    data: CreateCustomerRequest | CreateCompanyRequest,
    isExisting: boolean,
    type: 'person' | 'company'
  ) => {
    setPendingClientData(data);
    setIsClientExisting(isExisting);
    setClientType(type);

    // Map to ClientData for state
    if (type === 'person') {
      const d = data as CreateCustomerRequest;
      const customer: Customer = {
        customerId: d.customerId.toString(),
        firstName: d.firstName,
        lastName: d.lastName,
        emails: d.emails,
        phoneNumbers: d.phoneNumbers,
        dateOfBirth: d.dateOfBirth.toISOString(),
        sexId: d.sexId,
        civilStatus: d.civilStatus,
        address: d.address,
        professionId: d.professionId,
        originCountry: d.originCountry,
        identificationType: d.identificationType,
        parishId: d.parishId,
        deceased: d.deceased || false
      };
      setFoundClient(customer);
    } else {
      const d = data as CreateCompanyRequest;
      const company: Company = {
        companyId: '0', // Temporary or unknown until created
        companyName: d.companyName,
        socialReason: d.socialReason,
        companyRuc: d.companyRuc,
        companyAddress: d.companyAddress,
        companyParishId: d.companyParishId,
        companyCountry: d.companyCountry,
        companyEmails: d.companyEmails.map((e) => ({
          correo: e,
          correo_electronico_id: 0
        })),
        companyPhones: d.companyPhones.map((p) => ({
          numero: p,
          telefono_id: 0
        })),
        identificationType: d.identificationType
      };
      setFoundClient(company);
    }
    setActiveStep(1);
  };

  const handleWizardSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Process Client Registration/Update
      if (pendingClientData) {
        if (clientType === 'person' && pendingClientData) {
          const personData = pendingClientData as CreateCustomerRequest;
          if (isClientExisting) {
            const updateData: UpdateCustomerRequest = {
              customerId: Number(personData.customerId),
              firstName: personData.firstName,
              lastName: personData.lastName,
              emails: personData.emails,
              phoneNumbers: personData.phoneNumbers,
              dateOfBirth: new Date(personData.dateOfBirth),
              sexId: personData.sexId,
              civilStatus: personData.civilStatus,
              address: personData.address,
              professionId: personData.professionId || 1,
              originCountry: personData.originCountry,
              identificationType: personData.identificationType,
              parishId: personData.parishId,
              deceased: personData.deceased
            };
            await updateCustomerUseCase.execute(
              personData.customerId.toString(),
              updateData
            );
          } else {
            try {
              await createCustomerUseCase.execute(
                pendingClientData as CreateCustomerRequest
              );
            } catch (err: unknown) {
              if (
                err &&
                typeof err === 'object' &&
                ('response' in err || 'statusCode' in err)
              ) {
                const e = err as {
                  response?: { status: number };
                  statusCode?: number;
                };
                if (e.response?.status === 409 || e.statusCode === 409) {
                  // Handle conflict if needed
                } else throw err;
              } else throw err;
            }
          }
        } else if (clientType === 'company') {
          if (isClientExisting) {
            const data = pendingClientData as CreateCompanyRequest;
            const updateData: UpdateCompanyRequest = {
              companyName: data.companyName,
              socialReason: data.socialReason,
              companyRuc: data.companyRuc,
              companyAddress: data.companyAddress,
              companyParishId: data.companyParishId,
              companyCountry: data.companyCountry,
              companyEmails: data.companyEmails,
              companyPhones: data.companyPhones,
              identificationType: data.identificationType
            };
            await updateCompanyUseCase.execute(data.companyRuc, updateData);
          } else {
            await createCompanyUseCase.execute(
              pendingClientData as CreateCompanyRequest
            );
          }
        }
      }

      // 2. Format Payload (Sanitization)
      const clientId =
        clientType === 'person'
          ? (pendingClientData as CreateCustomerRequest).customerId.toString()
          : (pendingClientData as CreateCompanyRequest).companyRuc;

      const {
        connectionCoordinates: _unusedCoord,
        connectionCadastralKey: _unusedCad,
        connectionSector: _unusedSec,
        connectionAccount: _unusedAcc,
        ...connectionData
      } = formData;

      const finalData = {
        ...connectionData,
        clientId,
        connectionId: formData.connectionCadastralKey,
        propertyCadastralKey: formData.propertyCadastralKey || null,
        ConnectionMetaData: formData.ConnectionMetaData || {}
      };

      console.log('Final Wizard Payload:', finalData);

      if (selectedConnection) {
        await updateConnectionUseCase.execute(
          selectedConnection.connectionId,
          finalData as any // Use case expects specific type, but we ensured structure
        );
      } else {
        await createConnectionUseCase.execute(finalData as any);
      }

      setIsFormOpen(false);
      resetForm();
      handleFetch();
    } catch (err: unknown) {
      console.error('Error in handleWizardSave:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Error occurred while creating connection';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── 5. DERIVED STATE / FILTERING ──────────────────────────────────────────
  const filteredConnections = useMemo(
    () =>
      applyLocalFilters(
        connections.map((conn) => {
          if (!conn.latitude || !conn.longitude) {
            const coords = decodeEWKBPoint(conn.connectionCoordinates);
            if (coords) {
              return { ...conn, latitude: coords.lat, longitude: coords.lng };
            }
          }
          return conn;
        }),
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
        : activeTab === 'client'
          ? Boolean(clientIdInput.trim())
          : Boolean(cadastralKeyInput.trim()));

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
    handleFetch();
  }, [loadRates]);

  console.log(selectedConnection);

  return {
    state: {
      isLoading,
      error,
      activeTab,
      sectorInput,
      clientIdInput,
      cadastralKeyInput,
      searchQuery,
      searchField,
      selectedStatus,
      selectedSewerage,
      sortConfig,
      filteredConnections,
      canFetch,
      hasMore,
      viewMode,
      mapCenter,
      mapZoom,
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
      setCadastralKeyInput,
      setViewMode,
      setMapCenter,
      setMapZoom,
      searchByCadastralKey: handleFetch, // Alias for better naming
      loadByCadastralKeyAndEdit,
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
