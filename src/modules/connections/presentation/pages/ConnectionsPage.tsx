import { useConnectionViewModel } from '../hooks/useConnectionViewModel';
import { Table } from '@/shared/presentation/components/Table/Table';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Card } from '@/shared/presentation/components/Card/Card';
import { Check, Edit2, EyeIcon, Plus, Search, Trash, X } from 'lucide-react';
import { CreateConnectionWizard } from '../components/CreateConnectionWizard';
import type { Connection } from '../../domain/models/Connection';
import type { Column } from '@/shared/presentation/components/Table/Table';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { getTrafficLightColor } from '@/shared/presentation/utils/colors/traffic-lights.colors';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

export const ConnectionsPage = () => {
  const {
    loading,
    searchTerm,
    isFormOpen,
    handleDelete,
    openEdit,
    openDelete,
    setSearchTerm,
    setIsFormOpen,
    resetForm,
    filteredConnections,
    isDeleteOpen,
    setIsDeleteOpen
  } = useConnectionViewModel();

  const columns: Column<Connection>[] = [
    {
      accessor: 'connectionId',
      header: 'ID'
    },
    {
      accessor: 'connectionMeterNumber',
      header: 'Meter Number'
    },
    {
      accessor: 'connectionAccount',
      header: 'Account'
    },
    {
      accessor: 'connectionCadastralKey',
      header: 'Cadastral Key'
    },
    {
      accessor: 'connectionContractNumber',
      header: 'Contract Number'
    },
    {
      header: 'Sewerage',
      accessor: (item: Connection) => {
        const color: string = getTrafficLightColor(
          item.connectionSewerage ? 100 : 0
        );
        return (
          <ColorChip
            label={item.connectionSewerage ? 'Yes' : 'No'}
            color={color}
            icon={<Check size={16} />}
            variant="soft"
            size="sm"
          />
        );
      }
    },
    {
      header: 'Status',
      accessor: (item: Connection) => {
        const color: string = getTrafficLightColor(
          item.connectionStatus ? 100 : 0
        );
        return (
          <ColorChip
            label={item.connectionStatus ? 'Active' : 'Inactive'}
            color={color}
            icon={item.connectionStatus ? <Check size={16} /> : <X size={16} />}
            variant="soft"
            size="sm"
          />
        );
      }
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div
          style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openEdit(row)}
            title="Edit Connection"
            circle
            style={{ color: 'var(--blue)' }}
          >
            <Edit2 size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => openDelete(row)}
            title="Delete Connection"
            circle
            style={{ color: 'var(--error)' }}
          >
            <Trash size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              alert('View Connection');
            }}
            title="View Connection"
            circle
            style={{ color: 'var(--success)' }}
          >
            <EyeIcon size={16} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="connections-page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)'
        }}
      >
        <div className="connections-header">
          <h1>Connections</h1>
          <p>Manage connection details</p>
        </div>
        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        >
          Create Connection
        </Button>
      </div>

      <Card>
        <div
          style={{
            padding: 'var(--spacing-md)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '300px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}
            />
            <input
              type="text"
              placeholder="Search connections..."
              style={{
                width: '100%',
                padding: '8px 10px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Table
          data={filteredConnections}
          columns={columns}
          isLoading={loading}
          pageSize={25}
          pagination
          emptyState={
            <EmptyState
              message="No connections found"
              description={`No connections found matching your search criteria. Try adjusting your search or filters.`}
            />
          }
          fullHeight
        />
      </Card>

      {isFormOpen && (
        <CreateConnectionWizard onClose={() => setIsFormOpen(false)} />
      )}

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Connection"
        footer={
          <>
            <Button variant="subtle" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              style={{ backgroundColor: 'var(--error)' }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete this connection?</p>
      </Modal>
    </div>
  );
};
