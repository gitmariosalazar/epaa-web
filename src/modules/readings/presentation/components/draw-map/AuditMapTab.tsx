import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { Select } from '@/shared/presentation/components/Input/Select';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { useAuditMap } from '../../hooks/useAuditMap';
import { AuditGeojsonMap } from './AuditGeojsonMap';
import { useUsersContext } from '@/modules/users/presentation/context/UsersContext';
import { FaUserCircle } from 'react-icons/fa';
import { APIProvider } from '@vis.gl/react-google-maps';
import type { RolOrPermission } from '@/shared/utils/interfaces/RolOrPermission';

export const AuditMapTab: React.FC = () => {
  const { t } = useTranslation();
  const { geojsonData, isLoading, error, fetchMapData, clearMapData } = useAuditMap();
  const { getUsersUseCase } = useUsersContext();

  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [userId, setUserId] = useState<string>('');

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const fetchedUsers = await getUsersUseCase.execute(500, 0);
        const filterUsers = fetchedUsers.filter((user) => user.roles.map((role: RolOrPermission) => role.name).includes('LECTURISTA CAMPO'));
        setUsers(filterUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [getUsersUseCase]);

  const handleFetch = () => {
    if (date) {
      fetchMapData(date, userId || undefined);
    }
  };

  // Limpiar mapa al cambiar fecha/usuario hasta que se presione buscar
  useEffect(() => {
    clearMapData();
  }, [date, userId, clearMapData]);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';

  return (
    <APIProvider apiKey={apiKey} libraries={['marker']}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem', flexGrow: 1 }}>
        {/* Barra de Filtros Interna del Mapa */}
        <div className="entry-filters" >
          <div className="filter-section-left">

            {/* Filtro Fecha */}
            <div className="filter-group">
              <label className="filter-label">{t('readings.audit.mapDate', 'Fecha de Captura')}</label>
              <div className="filter-input-wrapper">
                <DatePicker
                  size="compact"
                  value={date}
                  onChange={(val: string) => setDate(val.substring(0, 10))}
                />
              </div>
            </div>

            {/* Filtro Usuario */}
            <div className="filter-group">
              <label className="filter-label">{t('readings.audit.mapUser', 'Usuario (Opcional)')}</label>
              <div className="filter-input">
                <Select
                  size="compact"
                  leftIcon={<FaUserCircle size={16} />}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  disabled={loadingUsers}
                >
                  <option value="">{t('common.all', 'Todos los usuarios')}</option>
                  {users.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.firstName && u.lastName ? `${u.firstName.toUpperCase()} ${u.lastName.toUpperCase()}` : u.username}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Botón Buscar */}
            <div className="filter-group">
              <label className="filter-label" style={{ visibility: 'hidden' }}>&nbsp;</label>
              <Button
                onClick={handleFetch}
                disabled={!date || isLoading}
                size="compact"
                isLoading={isLoading}
              >
                {!isLoading && <Search size={18} />}
                {isLoading ? t('common.loading', 'Cargando...') : t('common.fetch', 'Consultar')}
              </Button>
            </div>
          </div>
        </div>

        {/* Contenedor del Mapa */}
        <div style={{ flexGrow: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {error ? (
            <div className="entry-data-error" style={{ color: 'red', padding: '1rem' }}>
              <strong>Error: </strong> {error}
            </div>
          ) : isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress
                progress={50}
                size={80}
                strokeWidth={8}
                label={t('common.loadingMap', 'Cargando mapa...')}
              />
            </div>
          ) : (
            <AuditGeojsonMap geojsonData={geojsonData} />
          )}
        </div>
      </div>
    </APIProvider>
  );
};
