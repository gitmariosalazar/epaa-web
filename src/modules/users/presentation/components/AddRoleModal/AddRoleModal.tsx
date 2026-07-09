import { useState, useEffect } from 'react';
import { Modal } from "@/shared/presentation/components/Modal/Modal";
import { Button } from "@/shared/presentation/components/Button/Button";
import { Shield, ShieldAlert, User, Star, CheckCircle2 } from 'lucide-react';
import { GetRolesUseCase } from '@/modules/roles/application/usecases/GetRolesUseCase';
import { RoleRepositoryImpl } from '@/modules/roles/infrastructure/repositories/RoleRepositoryImpl';
import type { Role } from '@/modules/roles/domain/models/Role';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import './AddRoleModal.css';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleId: number) => void;
}

// Inicializar UseCase y Repositorio para acceder a la BD
const roleRepository = new RoleRepositoryImpl();
const getRolesUseCase = new GetRolesUseCase(roleRepository);

export default function AddRoleModal({
  isOpen,
  onClose,
  onSave,
}: AddRoleModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      getRolesUseCase.execute(100, 0)
        .then(data => {
          // Guardar solo roles activos
          setRoles(data.filter(r => r.isActive));
        })
        .catch(err => {
          console.error('Error fetching roles:', err);
          setError('Error al cargar los roles desde la base de datos.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSelectedRoleId(null);
    }
  }, [isOpen]);

  // Función auxiliar para asignar ícono según el nombre del rol (dinámico)
  const getRoleIcon = (roleName: string) => {
    const upperName = roleName.toUpperCase();
    if (upperName.includes('ADMIN')) return <ShieldAlert size={18} />;
    if (upperName.includes('SUPERVISOR')) return <Star size={18} />;
    if (upperName.includes('EMPLEAD')) return <User size={18} />;
    return <Shield size={18} />;
  };

  // Footer con botones de acción
  const footerContent = (
    <div className="add-role-modal__footer">
      <Button variant="ghost" onClick={onClose}>
        Cancelar
      </Button>
      <Button
        onClick={() => selectedRoleId && onSave(selectedRoleId)}
        disabled={!selectedRoleId || loading}
      >
        Asignar Rol
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Nuevo Rol"
      description="Selecciona el rol que deseas otorgarle a este usuario. Esto definirá sus permisos de acceso y capacidades en la plataforma."
      footer={footerContent}
      size="lg" // Hacemos el modal más ancho
    >
      {loading ? (
        <div className="add-role-modal__loading">
          <CircularProgress />
        </div>
      ) : error ? (
        <div className="add-role-modal__error">
          {error}
        </div>
      ) : (
        <div className="add-role-modal__grid">
          {roles.map(role => {
            const isSelected = selectedRoleId === role.rolId;

            return (
              <div
                key={role.rolId}
                onClick={() => setSelectedRoleId(role.rolId)}
                className={`add-role-modal__card ${isSelected ? 'add-role-modal__card--selected' : ''}`}
              >
                {isSelected && (
                  <div className="add-role-modal__check">
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                  </div>
                )}

                <div className="add-role-modal__card-body">
                  <div className="add-role-modal__icon-box">
                    {getRoleIcon(role.name)}
                  </div>

                  <div className="add-role-modal__card-content">
                    <h3 className="add-role-modal__card-title">
                      {role.name}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}

          {roles.length === 0 && !loading && (
            <div className="add-role-modal__empty">
              No hay roles activos disponibles en la base de datos.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
