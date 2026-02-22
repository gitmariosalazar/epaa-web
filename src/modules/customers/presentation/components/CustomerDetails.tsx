import React from 'react';
import { CheckCircle, XCircle, User, Shield, Phone } from 'lucide-react';
import type { Customer } from '../../domain/models/Customer';
import '../styles/UserDetails.css';

interface CustomerDetailsProps {
  customer: Omit<Customer, 'customerId'> & { customerId: string };
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer
}) => {
  const isDeceased = customer.deceased;
  const initial = customer.firstName ? customer.firstName.charAt(0) : 'U';

  const formatEmail = () => {
    const email = customer.emails?.[0];
    if (!email) return 'N/A';
    return typeof email === 'object' ? (email as any).correo : email;
  };

  const formatPhone = () => {
    const phone = customer.phoneNumbers?.[0];
    if (!phone) return 'N/A';
    return typeof phone === 'object' ? (phone as any).numero : phone;
  };

  const civilStatusMap: Record<number, string> = {
    1: 'Single',
    2: 'Married',
    3: 'Divorced',
    4: 'Widowed',
    5: 'Free Union'
  };

  return (
    <div className="user-details">
      <div className="user-details__header">
        <div className="user-details__avatar">{initial}</div>
        <div
          className={`user-details__status ${isDeceased ? 'user-details__status--inactive' : 'user-details__status--active'}`}
        >
          {isDeceased ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {isDeceased ? 'Deceased' : 'Active Account'}
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <User size={16} />
          GENERAL INFORMATION
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">First Name</span>
            <span className="user-details__value">
              {customer.firstName || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Last Name</span>
            <span className="user-details__value">
              {customer.lastName || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Identity ID (Cedula)</span>
            <span className="user-details__value">
              {customer.customerId || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Date of Birth</span>
            <span className="user-details__value">
              {customer.dateOfBirth
                ? customer.dateOfBirth.split('T')[0]
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <Phone size={16} />
          CONTACT INFORMATION
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">Email</span>
            <span className="user-details__value">{formatEmail()}</span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Phone Number</span>
            <span className="user-details__value">{formatPhone()}</span>
          </div>
          <div className="user-details__field" style={{ gridColumn: 'span 2' }}>
            <span className="user-details__label">Address</span>
            <span className="user-details__value">
              {customer.address || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <div className="user-details__section">
        <h3 className="user-details__section-title">
          <Shield size={16} />
          ADDITIONAL DETAILS
        </h3>
        <div className="user-details__grid">
          <div className="user-details__field">
            <span className="user-details__label">Sex</span>
            <span className="user-details__value">
              <span className="user-details__badge">
                {customer.sexId === 1
                  ? 'Male'
                  : customer.sexId === 2
                    ? 'Female'
                    : 'Unknown'}
              </span>
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Civil Status</span>
            <span className="user-details__value">
              <span className="user-details__badge">
                {civilStatusMap[customer.civilStatus as number] || 'Unknown'}
              </span>
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Parish ID</span>
            <span className="user-details__value">
              {customer.parishId || 'N/A'}
            </span>
          </div>
          <div className="user-details__field">
            <span className="user-details__label">Origin Country</span>
            <span className="user-details__value">
              {customer.originCountry || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
