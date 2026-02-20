import React from 'react';
import { Input } from '@/shared/presentation/components/Input/Input';
import { PasswordInput } from '@/shared/presentation/components/Input/PasswordInput';
import type { UserFormData } from '../../models/UserFormData';
import '@/shared/presentation/styles/Users.css';

interface UserFormWizardProps {
  currentStep: number;
  formData: UserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isEditMode: boolean;
  isCreateMode: boolean;
}

export const UserFormWizard: React.FC<UserFormWizardProps> = ({
  currentStep,
  formData,
  onChange,
  isEditMode,
  isCreateMode
}) => {
  switch (currentStep) {
    case 0: // Account Details
      return (
        <div className="user-form-wizard__step">
          <div className="user-form-wizard__row-2">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder="jdoe"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="user-form-wizard__row-2">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
              placeholder="John"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={onChange}
              placeholder="Doe"
            />
          </div>

          {/* Password only for Create or explicit change */}
          <div className="user-form-wizard__row-2">
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password || ''}
              onChange={onChange}
              placeholder={
                isEditMode ? 'Leave blank to keep current' : '••••••••'
              }
              showStrength={true}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={onChange}
              placeholder="••••••••"
              showStrength={false}
              valueToMatch={formData.password}
            />
          </div>
        </div>
      );

    case 1: // Personal Info
      return (
        <div className="user-form-wizard__step">
          <div className="user-form-wizard__row-3">
            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={onChange}
            />
            <Input
              label="Sex ID"
              type="number"
              name="sexId"
              value={formData.sexId}
              onChange={onChange}
              placeholder="1"
            />
            <Input
              label="ID Card"
              name="idCard"
              value={formData.idCard}
              onChange={onChange}
              placeholder="1234567890"
            />
          </div>
          <Input
            label="Citizen ID"
            name="citizenId"
            value={formData.citizenId}
            onChange={onChange}
            placeholder="Optional citizen reference"
          />
        </div>
      );

    case 2: // Employment Details
      return (
        <div className="user-form-wizard__step">
          <div className="user-form-wizard__row-3">
            <Input
              label="Position ID"
              type="number"
              name="positionId"
              value={formData.positionId}
              onChange={onChange}
            />
            <Input
              label="Contract Type ID"
              type="number"
              name="contractTypeId"
              value={formData.contractTypeId}
              onChange={onChange}
            />
            <Input
              label="Status ID"
              type="number"
              name="employeeStatusId"
              value={formData.employeeStatusId}
              onChange={onChange}
            />
          </div>
          <div className="user-form-wizard__row-2">
            <Input
              label="Hire Date"
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={onChange}
            />
            <Input
              label="Termination Date"
              type="date"
              name="terminationDate"
              value={formData.terminationDate}
              onChange={onChange}
            />
          </div>
          <div className="user-form-wizard__row-2">
            <Input
              label="Base Salary"
              type="number"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={onChange}
            />
            <Input
              label="Supervisor ID"
              name="supervisorId"
              value={formData.supervisorId}
              onChange={onChange}
            />
          </div>
          <Input
            label="Assigned Zones"
            name="assignedZones"
            value={formData.assignedZones}
            onChange={onChange}
            placeholder="1, 2, 3"
          />
        </div>
      );

    case 3: // Contact & Other
      return (
        <div className="user-form-wizard__step">
          <div className="user-form-wizard__row-2">
            <Input
              label="Internal Phone"
              name="internalPhone"
              value={formData.internalPhone}
              onChange={onChange}
            />
            <Input
              label="Internal Email"
              type="email"
              name="internalEmail"
              value={formData.internalEmail}
              onChange={onChange}
            />
          </div>
          <div className="user-form-wizard__row-2">
            <Input
              label="Driver License"
              name="driverLicense"
              value={formData.driverLicense}
              onChange={onChange}
            />
            <div className="user-form-wizard__vehicle-select">
              <label className="user-form-wizard__vehicle-label">
                Has Company Vehicle
              </label>
              <select
                name="hasCompanyVehicle"
                className="user-form-wizard__vehicle-input"
                value={formData.hasCompanyVehicle}
                onChange={onChange}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
          <Input
            label="Photo URL"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={onChange}
          />
          {isCreateMode && (
            <Input
              label="Created By"
              name="createdBy"
              value={formData.createdBy}
              onChange={onChange}
            />
          )}
        </div>
      );
    default:
      return null;
  }
};
