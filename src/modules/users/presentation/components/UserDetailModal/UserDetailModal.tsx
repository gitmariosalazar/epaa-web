import React from 'react';
import type { User } from '@/modules/users/domain/models/User';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { CheckCircle, XCircle, Shield, Key } from 'lucide-react';
import './UserDetailModal.css';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isLoading?: boolean;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  isLoading = false
}) => {
  if (!isOpen) return null;

  if (!user && !isLoading) {
    console.warn('UserDetailModal: User is null and not loading');
    return null;
  }

  const formatDate = (date: Date | string | undefined | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>Close</Button>
        </div>
      }
    >
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          Loading user details...
        </div>
      ) : user ? (
        <div className="user-detail-modal">
          <div className="user-detail__header">
            <Avatar
              name={
                user.firstName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
              }
              size="lg"
            />
            <div className="user-detail__info-main">
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <div
                className="user-detail__status"
                style={{
                  color: user.isActive ? 'var(--success)' : 'var(--error)'
                }}
              >
                {user.isActive ? (
                  <CheckCircle size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {user.isActive ? 'Active Account' : 'Inactive Account'}
              </div>
            </div>
          </div>

          <div className="user-detail__section">
            <h3>General Information</h3>
            <div className="user-detail__grid">
              <div className="user-detail__item">
                <label>Username</label>
                <span>{user.username}</span>
              </div>
              <div className="user-detail__item">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="user-detail__item">
                <label>Registered At</label>
                <span>{formatDate(user.registeredAt)}</span>
              </div>
              <div className="user-detail__item">
                <label>Last Login</label>
                <span>{formatDate(user.lastLogin)}</span>
              </div>
            </div>
          </div>

          <div className="user-detail__section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} /> Roles
            </h3>
            <div className="user-detail__tags">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role, idx) => {
                  const roleName = typeof role === 'string' ? role : role.name;
                  return (
                    <span
                      key={idx}
                      className="user-detail__tag user-detail__tag--role"
                    >
                      {roleName}
                    </span>
                  );
                })
              ) : user.username === 'root' ? (
                <span className="user-detail__tag user-detail__tag--role">
                  All Permissions - Super User
                </span>
              ) : (
                <span
                  style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}
                >
                  No roles assigned
                </span>
              )}
            </div>
          </div>

          <div className="user-detail__section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={16} /> Permissions
            </h3>
            <div className="user-detail__tags">
              {user.permissions && user.permissions.length > 0 ? (
                user.permissions.map((perm, idx) => {
                  const permName = typeof perm === 'string' ? perm : perm.name;
                  return (
                    <span
                      key={idx}
                      className="user-detail__tag user-detail__tag--perm"
                    >
                      {permName}
                    </span>
                  );
                })
              ) : user.username === 'root' ? (
                <span className="user-detail__tag user-detail__tag--perm">
                  All Permissions - Super User
                </span>
              ) : (
                <span
                  style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}
                >
                  No specific permissions
                </span>
              )}
            </div>
          </div>

          {(typeof user.failedAttempts === 'number' ||
            user.twoFactorEnabled !== undefined) && (
            <div className="user-detail__section">
              <h3>Security & Audit</h3>
              <div className="user-detail__grid">
                <div className="user-detail__item">
                  <label>Failed Login Attempts</label>
                  <span>{user.failedAttempts || 0}</span>
                </div>
                <div className="user-detail__item">
                  <label>2FA Enabled</label>
                  <span>{user.twoFactorEnabled ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>User not found</div>
      )}
    </Modal>
  );
};
