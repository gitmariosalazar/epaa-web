import React from 'react';
import type { Position } from '@/modules/roles/domain/models/Position';
import { Table } from '@/shared/presentation/components/Table/Table';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Edit2 } from 'lucide-react';
import '@/shared/presentation/styles/Table.css';
import '@/modules/accounting/presentation/styles/entry-data/EntryDataFilters.css';
import '@/shared/presentation/styles/Roles.css';
import { MdClose } from 'react-icons/md';
import { usePositionsViewModel } from '../../hooks/usePositionsViewModel';
import { PositionsFilters } from '../../components/positions/PositionsFilters';
import { Select } from '@/shared/presentation/components/Input/Select';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export const PositionsPage: React.FC = () => {
  const {
    positions,
    isLoading,
    createPosition,
    updatePosition,
    disablePosition,
    fetchPositions
  } = usePositionsViewModel();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedPosition, setSelectedPosition] = React.useState<Position | null>(null);
  const [formData, setFormData] = React.useState<Partial<Position>>({
    name: '',
    description: '',
    levelJerarchy: 3,
    isActive: true
  });

  const { t } = useTranslation();

  const handleSave = async () => {
    try {
      if (selectedPosition) {
        await updatePosition(selectedPosition.positionId, formData);
      } else {
        await createPosition({
          name: formData.name || '',
          description: formData.description || '',
          levelJerarchy: formData.levelJerarchy || 3,
          isActive: formData.isActive !== undefined ? formData.isActive : true
        });
      }
      setIsCreateOpen(false);
      setSelectedPosition(null);
      setFormData({ name: '', description: '', levelJerarchy: 3, isActive: true });
    } catch (error) {
      alert('Failed to save position');
    }
  };

  const handleDisable = async (position: Position) => {
    if (confirm('Are you sure you want to disable this position?')) {
      try {
        await disablePosition(position.positionId);
      } catch (error) {
        alert('Failed to disable position');
      }
    }
  };

  const openEdit = (position: Position) => {
    setSelectedPosition(position);
    setFormData({
      name: position.name,
      description: position.description,
      levelJerarchy: position.levelJerarchy,
      isActive: position.isActive
    });
    setIsCreateOpen(true);
  };

  const filteredPositions = positions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: Column<Position>[] = [
    { header: 'ID', accessor: 'positionId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Nivel Jerárquico', accessor: (p) => p.levelJerarchy === 1 ? 'Gerencia' : p.levelJerarchy === 2 ? 'Jefatura' : 'Operativo' },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Active',
      accessor: (pos) => (
        <span
          className={
            pos.isActive
              ? 'profile-page__status-active'
              : 'profile-page__status-inactive'
          }
        >
          {pos.isActive ? 'Active' : 'Disabled'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (pos) => (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <Tooltip content="Edit Position" followCursor={false}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => openEdit(pos)}
              circle
              style={{ color: 'var(--blue)' }}
            >
              <Edit2 size={16} />
            </Button>
          </Tooltip>

          <Tooltip content={pos.isActive ? "Disable Position" : "Enable Position"} followCursor={false}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDisable(pos)}
              circle
              style={{ color: pos.isActive ? 'var(--error)' : 'var(--success)' }}
            >
              <MdClose size={16} />
            </Button>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      className="roles-page"
      filters={
        <PositionsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRefresh={() => {
            fetchPositions();
          }}
          onCreateClick={() => {
            setSelectedPosition(null);
            setFormData({ name: '', description: '', levelJerarchy: 3, isActive: true });
            setIsCreateOpen(true);
          }}
        />
      }
    >
      <div
        className="table-responsive-wrapper"
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Table
          data={filteredPositions}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={10}
          emptyState={
            <EmptyState
              message="No se encontraron cargos"
              icon={IoInformationCircleOutline}
              description={t(
                'common.noResultsDescription',
                'Intenta ajustar los filtros de búsqueda para ver los resultados.'
              )}
              minHeight="300px"
              variant="info"
            />
          }
        />
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={selectedPosition ? 'Edit Position' : 'Create Position'}
        footer={
          <>
            <Button variant="subtle" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Name"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Description"
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Select
              label="Nivel Jerárquico"
              value={formData.levelJerarchy?.toString()}
              onChange={(e) => setFormData({ ...formData, levelJerarchy: Number(e.target.value) })}
              options={[
                { value: 1, label: 'Gerencia' },
                { value: 2, label: 'Jefatura / Asesoría' },
                { value: 3, label: 'Operativo' }
              ]}
            />
          </div>
          {selectedPosition && (
            <label
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              Active
            </label>
          )}
        </div>
      </Modal>
    </PageLayout>
  );
};
