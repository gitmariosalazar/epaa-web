import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import {
  Key,
  Search,
  Check,
  Plus,
  Trash2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { PermissionRepositoryImpl } from '@/modules/permissions/infrastructure/repositories/PermissionRepositoryImpl';
import type { Permission } from '@/modules/permissions/domain/models/Permission';
import type { User as UserModel } from '@/modules/users/domain/models/User';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { DateTimePicker } from '@/shared/presentation/components/DatePicker/DateTimePicker';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import {
  DataList,
  type Column
} from '@/shared/presentation/components/Table/DataList';
import './AddDirectPermissionModal.css';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export interface SelectedStagedPermission {
  permissionId: number;
  permissionName: string;
  permissionDescription?: string;
  scopes?: string;
  categoryId?: string | number;
  isTemporary: boolean;
  expirationDate: string; // YYYY-MM-DDTHH:mm
}

interface AddDirectPermissionModalProps {
  isOpen: boolean;
  userSelected: UserModel;
  onClose: () => void;
  onSaveBatch?: (
    permissions: Array<{ permissionId: number; expirationDate?: string | null }>
  ) => Promise<void>;
  onSave?: (
    permissionId: number,
    expirationDate?: string | null
  ) => Promise<void>;
  alreadyAssignedIds?: number[];
}

const permissionRepository = new PermissionRepositoryImpl();

export const AddDirectPermissionModal: React.FC<
  AddDirectPermissionModalProps
> = ({
  isOpen,
  userSelected,
  onClose,
  onSaveBatch,
  onSave,
  alreadyAssignedIds = []
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stagedPermissions, setStagedPermissions] = useState<
    SelectedStagedPermission[]
  >([]);
  const [globalDate, setGlobalDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setStagedPermissions([]);
      setSearchTerm('');
      setSelectedCategory('ALL');
      setGlobalDate('');

      permissionRepository
        .findAll()
        .then((data) => {
          setPermissions(data.filter((p) => p.isActive));
        })
        .catch((err: unknown) => {
          console.error('Error fetching permissions for user assignment:', err);
          MessageToastCustom(
            'error',
            'Error al cargar el catálogo de permisos',
            'Error'
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Extract unique category names
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    permissions.forEach((p) => {
      if (p.categoryId) cats.add(String(p.categoryId));
    });
    return ['ALL', ...Array.from(cats)];
  }, [permissions]);

  // Filtered available permissions (excluding already assigned to user)
  const filteredCatalog = useMemo(() => {
    return permissions.filter((perm) => {
      // Exclude already assigned permissions
      if (alreadyAssignedIds.includes(perm.permissionId)) return false;

      // Filter by category
      if (
        selectedCategory !== 'ALL' &&
        String(perm.categoryId) !== selectedCategory
      ) {
        return false;
      }

      // Filter by search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const nameMatch = (perm.permissionName || '')
        .toLowerCase()
        .includes(term);
      const descMatch = (perm.permissionDescription || '')
        .toLowerCase()
        .includes(term);
      const scopeMatch = (perm.scopes || '').toLowerCase().includes(term);
      return nameMatch || descMatch || scopeMatch;
    });
  }, [permissions, alreadyAssignedIds, selectedCategory, searchTerm]);

  // Column definition for catalog DataList
  const catalogColumns: Column<Permission>[] = useMemo(
    () => [
      {
        header: 'Permiso',
        accessor: 'permissionName',
        id: 'permissionName'
      },
      {
        header: 'Descripción',
        accessor: (p) => p.permissionDescription || '',
        id: 'permissionDescription'
      },
      {
        header: 'Categoría',
        accessor: (p) => String(p.categoryId || 'General'),
        id: 'categoryId'
      },
      {
        header: 'Scope',
        accessor: (p) => p.scopes || '',
        id: 'scopes'
      }
    ],
    []
  );

  // Stage or unstage item
  const handleToggleStage = (perm: Permission) => {
    const isStaged = stagedPermissions.some(
      (item) => item.permissionId === perm.permissionId
    );
    if (isStaged) {
      setStagedPermissions((prev) =>
        prev.filter((item) => item.permissionId !== perm.permissionId)
      );
    } else {
      setStagedPermissions((prev) => [
        ...prev,
        {
          permissionId: perm.permissionId,
          permissionName: perm.permissionName,
          permissionDescription: perm.permissionDescription,
          scopes: perm.scopes,
          categoryId: perm.categoryId,
          isTemporary: false,
          expirationDate: ''
        }
      ]);
    }
  };

  // Stage all filtered items
  const handleStageAllFiltered = () => {
    const unadded = filteredCatalog.filter(
      (perm) =>
        !stagedPermissions.some((s) => s.permissionId === perm.permissionId)
    );
    const newItems: SelectedStagedPermission[] = unadded.map((perm) => ({
      permissionId: perm.permissionId,
      permissionName: perm.permissionName,
      permissionDescription: perm.permissionDescription,
      scopes: perm.scopes,
      categoryId: perm.categoryId,
      isTemporary: false,
      expirationDate: ''
    }));
    setStagedPermissions((prev) => [...prev, ...newItems]);
  };

  // Change individual permission temporary status
  const handleToggleTemporary = (permId: number, isTemporary: boolean) => {
    setStagedPermissions((prev) =>
      prev.map((item) => {
        if (item.permissionId === permId) {
          return {
            ...item,
            isTemporary,
            expirationDate: isTemporary ? item.expirationDate || globalDate : ''
          };
        }
        return item;
      })
    );
  };

  // Change individual permission expiration date
  const handleChangeExpirationDate = (permId: number, date: string) => {
    setStagedPermissions((prev) =>
      prev.map((item) => {
        if (item.permissionId === permId) {
          return { ...item, expirationDate: date };
        }
        return item;
      })
    );
  };

  // Remove single item from staging
  const handleRemoveStaged = (permId: number) => {
    setStagedPermissions((prev) =>
      prev.filter((item) => item.permissionId !== permId)
    );
  };

  // Apply global expiration to all staged items
  const handleApplyGlobalDate = () => {
    if (!globalDate) {
      MessageToastCustom(
        'warning',
        'Seleccione primero una fecha y hora global',
        'Atención'
      );
      return;
    }
    setStagedPermissions((prev) =>
      prev.map((item) => ({
        ...item,
        isTemporary: true,
        expirationDate: globalDate
      }))
    );
    MessageToastCustom(
      'success',
      `Fecha aplicada a ${stagedPermissions.length} permisos`,
      'Configuración Global'
    );
  };

  // Reset all staged items to permanent
  const handleSetAllPermanent = () => {
    setStagedPermissions((prev) =>
      prev.map((item) => ({
        ...item,
        isTemporary: false,
        expirationDate: ''
      }))
    );
  };

  // Submit all staged permissions
  const handleConfirmBatch = async () => {
    if (stagedPermissions.length === 0) return;

    // Validate that temporary permissions have an expiration date
    const invalidItems = stagedPermissions.filter(
      (item) => item.isTemporary && !item.expirationDate
    );
    if (invalidItems.length > 0) {
      MessageToastCustom(
        'warning',
        `Debe especificar la fecha de expiración para los ${invalidItems.length} permisos temporales`,
        'Validación'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = stagedPermissions.map((item) => ({
        permissionId: item.permissionId,
        expirationDate:
          item.isTemporary && item.expirationDate
            ? new Date(item.expirationDate).toISOString()
            : null
      }));

      if (onSaveBatch) {
        await onSaveBatch(payload);
      } else if (onSave) {
        await Promise.all(
          payload.map((p) => onSave(p.permissionId, p.expirationDate))
        );
      }
      onClose();
    } catch (err: unknown) {
      console.error('Error saving direct permissions batch:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDateTime = useMemo(() => {
    const now = dateService.getCurrentDate();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d}T${h}:${min}`;
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--info)'
          }}
        >
          <Key size={22} color="var(--info)" />
          <span className="direct-perm-panel__title-text">
            Asignación Masiva de Permisos Directos — {userSelected.firstName}{' '}
            {userSelected.lastName}
          </span>
        </div>
      }
      description="Seleccione los permisos del catálogo izquierdo y configúrelos como permanentes o temporales en la mesa de trabajo derecha."
      size="full"
      footer={
        <div className="direct-perm-footer">
          <div className="direct-perm-footer__info">
            <Layers size={18} color="var(--primary)" />
            <span>
              <strong>{stagedPermissions.length}</strong> permiso(s)
              seleccionado(s) para conceder
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmBatch}
              disabled={stagedPermissions.length === 0 || isSubmitting}
              leftIcon={<Check size={18} />}
            >
              {isSubmitting
                ? 'Asignando...'
                : `Guardar y Asignar (${stagedPermissions.length})`}
            </Button>
          </div>
        </div>
      }
    >
      <div className="direct-perm-workbench">
        {/* PANEL IZQUIERDO: Catálogo de Permisos Disponibles */}
        <div className="direct-perm-panel">
          <div className="direct-perm-panel__header">
            <div className="direct-perm-panel__title-row">
              <h4 className="direct-perm-panel__title">
                <Search size={16} /> Catálogo de Permisos
              </h4>
              <span className="direct-perm-panel__badge">
                {filteredCatalog.length} disponibles
              </span>
            </div>

            <Input
              leftIcon={<Search size={16} />}
              placeholder="Buscar por nombre, código o scope (ej: ot:leer)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {availableCategories.length > 2 && (
              <div className="direct-perm-panel__categories">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`direct-perm-panel__cat-btn ${
                      selectedCategory === cat
                        ? 'direct-perm-panel__cat-btn--active'
                        : ''
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === 'ALL' ? 'Todos los Módulos' : cat}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStageAllFiltered}
                disabled={filteredCatalog.length === 0}
                leftIcon={<Plus size={14} />}
              >
                Agregar todos los filtrados
              </Button>
            </div>
          </div>

          <div className="direct-perm-panel__datalist-wrapper">
            <DataList<Permission>
              data={filteredCatalog}
              columns={catalogColumns}
              renderItem={(perm) => {
                const isStaged = stagedPermissions.some(
                  (s) => s.permissionId === perm.permissionId
                );
                return (
                  <div
                    key={perm.permissionId}
                    className={`direct-perm-card ${
                      isStaged ? 'direct-perm-card--staged' : ''
                    }`}
                    onClick={() => handleToggleStage(perm)}
                  >
                    <div className="direct-perm-card__info">
                      <div className="direct-perm-card__header-line">
                        <span className="direct-perm-card__name">
                          {perm.permissionName}
                        </span>
                        <span className="direct-perm-card__id">
                          #{perm.permissionId}
                        </span>
                      </div>
                      {perm.permissionDescription && (
                        <span className="direct-perm-card__desc">
                          {perm.permissionDescription}
                        </span>
                      )}
                      <div className="direct-perm-card__tags">
                        {perm.scopes && (
                          <span className="direct-perm-tag-scope">
                            {perm.scopes}
                          </span>
                        )}
                        <span className="direct-perm-tag-cat">
                          {perm.categoryId || 'General'}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isStaged ? 'secondary' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStage(perm);
                      }}
                      leftIcon={
                        isStaged ? <Check size={14} /> : <Plus size={14} />
                      }
                    >
                      {isStaged ? 'Agregado' : 'Elegir'}
                    </Button>
                  </div>
                );
              }}
              isLoading={loading}
              pagination={true}
              pageSize={10}
              showColumnModal={false}
              showFilters={false}
              showTotalRecords={true}
              showRowsPerPage={true}
              fullHeight={true}
              containerClassName="direct-perm-datalist-container"
              gridClassName="direct-perm-datalist-grid"
              emptyState={
                <div className="direct-perm-empty">
                  <Key size={36} />
                  <p>
                    No se encontraron permisos disponibles para los criterios
                    especificados.
                  </p>
                </div>
              }
            />
          </div>
        </div>

        {/* PANEL DERECHO: Mesa de Trabajo / Tabla de Seleccionados */}
        <div className="direct-perm-panel">
          <div className="direct-perm-panel__header">
            <div className="direct-perm-panel__title-row">
              <h4 className="direct-perm-panel__title">
                <Sparkles size={16} color="var(--primary)" /> Permisos
                Seleccionados
              </h4>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <span className="direct-perm-panel__badge">
                  {stagedPermissions.length} en mesa
                </span>
                {stagedPermissions.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStagedPermissions([])}
                    leftIcon={<Trash2 size={14} />}
                  >
                    Vaciar
                  </Button>
                )}
              </div>
            </div>

            {/* Acciones Rápidas Globales de Expiración */}
            {stagedPermissions.length > 0 && (
              <div className="direct-perm-bulk-bar">
                <div className="direct-perm-bulk-bar__left">
                  <Clock size={16} color="var(--primary)" />
                  <span>Caducidad global:</span>
                  <div style={{ width: '220px' }}>
                    <DateTimePicker
                      size="small"
                      value={globalDate}
                      min={minDateTime}
                      onChange={setGlobalDate}
                      placeholder="Fecha y hora límite..."
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleApplyGlobalDate}
                    disabled={!globalDate}
                  >
                    Aplicar a todos
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSetAllPermanent}
                >
                  Hacer todos permanentes
                </Button>
              </div>
            )}
          </div>

          <div className="direct-perm-panel__body direct-perm-panel__body--table">
            {stagedPermissions.length === 0 ? (
              <div className="direct-perm-empty">
                <Key size={48} style={{ opacity: 0.3 }} />
                <h4>Mesa de Trabajo Vacía</h4>
                <p>
                  Haz clic en cualquier permiso de la lista izquierda o en
                  "Agregar todos los filtrados" para configurarlos y guardarlos
                  juntos de una sola vez.
                </p>
              </div>
            ) : (
              <div className="direct-perm-table-container">
                <table className="direct-perm-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Permiso</th>
                      <th style={{ width: '22%' }}>Modalidad</th>
                      <th style={{ width: '30%' }}>Fecha de Expiración</th>
                      <th style={{ width: '8%', textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagedPermissions.map((item) => (
                      <tr key={item.permissionId}>
                        <td>
                          <div
                            style={{
                              fontWeight: 600,
                              color: 'var(--text-main)'
                            }}
                          >
                            {item.permissionName}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              gap: '4px',
                              marginTop: '2px'
                            }}
                          >
                            {item.scopes && (
                              <span className="direct-perm-tag-scope">
                                {item.scopes}
                              </span>
                            )}
                            <span className="direct-perm-tag-cat">
                              {item.categoryId || 'General'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <select
                            className="direct-perm-type-select"
                            value={item.isTemporary ? 'temp' : 'perm'}
                            onChange={(e) =>
                              handleToggleTemporary(
                                item.permissionId,
                                e.target.value === 'temp'
                              )
                            }
                          >
                            <option value="perm">
                              Indefinido / Permanente
                            </option>
                            <option value="temp">
                              Temporal con Expiración
                            </option>
                          </select>
                        </td>
                        <td>
                          {item.isTemporary ? (
                            <div style={{ width: '100%', maxWidth: '210px' }}>
                              <DateTimePicker
                                size="xs"
                                value={item.expirationDate}
                                min={minDateTime}
                                onChange={(date) =>
                                  handleChangeExpirationDate(
                                    item.permissionId,
                                    date
                                  )
                                }
                                placeholder="Definir fecha y hora..."
                              />
                            </div>
                          ) : (
                            <span
                              style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.78rem'
                              }}
                            >
                              Sin fecha límite
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Tooltip
                            content="Quitar de la lista"
                            followCursor={false}
                            themeColor="error"
                          >
                            <Button
                              type="button"
                              variant="ghost"
                              color="error"
                              circle
                              size="xs"
                              onClick={() =>
                                handleRemoveStaged(item.permissionId)
                              }
                              leftIcon={<Trash2 size={16} />}
                            ></Button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
