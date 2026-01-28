import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { GetProfileUseCase } from '@/modules/users/application/usecases/GetProfileUseCase';
import { UserRepositoryImpl } from '@/modules/users/infrastructure/repositories/UserRepositoryImpl';
import type { User } from '@/modules/users/domain/models/User';
import './Profile.css';
import { EditProfileModal } from '@/shared/presentation/components/Modal/EditProfileModal';
import { ChangePasswordModal } from '@/shared/presentation/components/Modal/ChangePasswordModal';
import { UpdateUserUseCase } from '@/modules/users/application/usecases/UpdateUserUseCase';
import { ChangePasswordUseCase } from '@/modules/users/application/usecases/ChangePasswordUseCase';
import type { UpdateUserRequest } from '@/modules/users/domain/models/UpdateUserRequest';
import type { ChangePasswordRequest } from '@/modules/users/domain/models/ChangePasswordRequest';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Activity,
  AlertTriangle,
  Edit2,
  Lock
} from 'lucide-react';

export const ProfilePage = () => {
  const { user: authUser, updateUserSession } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fetchProfile = async () => {
    if (!authUser?.username) return;

    try {
      const userRepository = new UserRepositoryImpl();
      const getProfileUseCase = new GetProfileUseCase(userRepository);
      const userProfile = await getProfileUseCase.execute(authUser.username);
      setProfile(userProfile);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authUser]);

  const handleUpdateProfile = async (data: UpdateUserRequest) => {
    if (!profile || !authUser) return;
    const userRepository = new UserRepositoryImpl();
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const updatedUser = await updateUserUseCase.execute(profile.userId, data);

    console.log(profile);

    // Update local session to preventing logout/errors
    if (updatedUser) {
      updateUserSession({
        ...authUser,
        username: updatedUser.username
        // Add other fields to session if they exist in AuthSession type
      });
    }

    await fetchProfile(); // Reload profile to show changes
  };

  const handleChangePassword = async (data: ChangePasswordRequest) => {
    if (!profile) return;
    const userRepository = new UserRepositoryImpl();
    const changePasswordUseCase = new ChangePasswordUseCase(userRepository);
    await changePasswordUseCase.execute(profile.userId, data);
    // Optionally logout or show success toast
    alert('Password changed successfully');
  };

  if (loading) {
    return (
      <div
        className="profile-page__container"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}
      >
        <div className="profile-page__loader">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page__container">
        <div className="profile-page__error-message">
          <AlertTriangle size={24} />
          <span>{error || 'Profile not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page__container">
      <div className="profile-page__header">
        <div className="profile-page__avatar-wrapper">
          <div className="profile-page__avatar">
            {profile.firstName
              ? profile.firstName.charAt(0).toUpperCase()
              : profile.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-page__info">
          <h1>
            {profile.username === 'root' ? 'Root' : profile.firstName}{' '}
            {profile.username === 'root' ? 'User' : profile.lastName}
          </h1>
          <div className="profile-page__role-badge">
            <div className="user-detail__tags">
              {profile.username === 'root' ? (
                <span className="profile-page__permission-tag profile-page__permission-tag--super-user">
                  All Permissions - Super User
                </span>
              ) : (
                profile.roles.map((role) => {
                  const permName = typeof role === 'string' ? role : role.name;
                  const permKey =
                    typeof role === 'string' ? role : role.id.toString();
                  return (
                    <span
                      key={permKey}
                      className="user-detail__tag user-detail__tag--role"
                    >
                      {permName}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
        <button
          className={`btn-secondary profile-page__header-btn ${profile.username === 'root' ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`}
          onClick={() => setIsEditModalOpen(true)}
          disabled={profile.username === 'root'}
        >
          <Edit2 size={18} /> Edit Profile
        </button>
      </div>

      <div className="profile-page__grid">
        <div className="profile-page__card">
          <h2>
            <UserIcon size={24} strokeWidth={1.5} /> Personal Information
          </h2>

          <div className="profile-page__info-group">
            <label>Username</label>
            <div className="profile-page__info-value">
              <UserIcon size={16} />
              {profile.username}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Email</label>
            <div className="profile-page__info-value">
              <Mail size={16} /> {profile.email}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Member Since</label>
            <div className="profile-page__info-value">
              <Calendar size={16} />{' '}
              {new Date(profile.registeredAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="profile-page__card">
          <h2>
            <Activity size={24} strokeWidth={1.5} /> Account Status
          </h2>

          <div className="profile-page__info-group">
            <label>Status</label>
            <div
              className={`profile-page__info-value ${profile.isActive ? 'profile-page__status-active' : 'profile-page__status-inactive'}`}
            >
              {profile.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Last Login</label>
            <div className="profile-page__info-value">
              <Calendar size={16} />
              {profile.lastLogin
                ? new Date(profile.lastLogin).toLocaleString()
                : 'Last login not available'}
            </div>
          </div>

          <div className="profile-page__info-group">
            <label>Two-Factor Authentication</label>
            <div className="profile-page__info-value">
              <div
                className={`profile-page__info-value ${profile.twoFactorEnabled ? 'profile-page__status-active' : 'profile-page__status-inactive'}`}
              >
                {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>

          <button
            className="btn-secondary profile-page__full-width-btn"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Lock size={18} /> Change Password
          </button>
        </div>

        <div className="profile-page__card full-width">
          <h2>
            <Shield size={24} strokeWidth={1.5} /> Permissions & Security
          </h2>

          <div className="profile-page__info-group">
            <label>Assigned Permissions</label>
            <div className="profile-page__permissions-list">
              {profile.username === 'root' ? (
                <span className="profile-page__permission-tag profile-page__permission-tag--super-user">
                  All Permissions - Super User
                </span>
              ) : (
                profile.permissions.map((perm) => {
                  const permName = typeof perm === 'string' ? perm : perm.name;
                  const permKey =
                    typeof perm === 'string' ? perm : perm.id.toString();
                  return (
                    <span
                      key={permKey}
                      className="profile-page__permission-tag"
                    >
                      {permName}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {profile && (
        <>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateProfile}
            user={profile}
          />
          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSave={handleChangePassword}
          />
        </>
      )}
    </div>
  );
};
