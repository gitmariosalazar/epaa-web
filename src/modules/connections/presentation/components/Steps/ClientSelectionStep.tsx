import React from 'react';
import {
  Search,
  User,
  CheckCircle,
  AlertCircle,
  Building2,
  Plus,
  ArrowRight
} from 'lucide-react';
import type { Customer } from '@/modules/customers/domain/models/Customer';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useClientSelectionForm } from '../../hooks/useClientSelectionForm';

interface ClientSelectionStepProps {
  foundClient: Customer | null;
  searchClient: (identification: string) => Promise<Customer | null>;
  createClient: (clientData: any) => Promise<boolean>;
  createCompany: (companyData: any) => Promise<boolean>;
  loading: boolean;
  nextStep: () => void;
}

export const ClientSelectionStep: React.FC<ClientSelectionStepProps> = (
  props
) => {
  const { foundClient, loading, nextStep } = props;
  const {
    activeTab,
    setActiveTab,
    entityType,
    setEntityType,
    identification,
    setIdentification,
    error,
    successMsg,
    personForm,
    setPersonForm,
    companyForm,
    setCompanyForm,
    handleSearch,
    handleIdBlur,
    handleRucBlur,
    handleCreatePerson,
    handleCreateCompany
  } = useClientSelectionForm(props);

  return (
    <div className="step-animation">
      <div className="step-container">
        <h3 className="step-title">Step 1: Client Selection</h3>

        {/* Tabs */}
        <div className="wizard-tabs">
          <button
            className={`wizard-tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search size={18} />
            Search Existing
          </button>
          <button
            className={`wizard-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <Plus size={18} />
            Register New
          </button>
        </div>

        {activeTab === 'search' && (
          <div className="tab-content step-animation">
            <p className="step-description">
              Search for an existing client by their identification number. If
              the client exists, their details will be automatically loaded.
            </p>

            <div className="search-box">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  value={identification}
                  onChange={(e) => setIdentification(e.target.value)}
                  placeholder="Enter Identification Number"
                  className="wizard-input search-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="search-icon" size={20} />
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading || !identification}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="tab-content step-animation">
            <p className="step-description">
              Register a new client or company. If the ID exists, details will
              load automatically.
            </p>

            {/* Entity Type Toggle */}
            <div className="entity-toggle">
              <button
                className={`entity-option ${entityType === 'person' ? 'active' : ''}`}
                onClick={() => setEntityType('person')}
              >
                <User size={20} />
                Person
              </button>
              <button
                className={`entity-option ${entityType === 'company' ? 'active' : ''}`}
                onClick={() => setEntityType('company')}
              >
                <Building2 size={20} />
                Company
              </button>
            </div>

            {entityType === 'person' ? (
              <form onSubmit={handleCreatePerson} className="form-grid">
                <div className="form-group">
                  <label className="form-label">Identification (Cédula)</label>
                  <input
                    className="wizard-input"
                    required
                    value={personForm.customerId}
                    onChange={(e) =>
                      setPersonForm({
                        ...personForm,
                        customerId: e.target.value
                      })
                    }
                    onBlur={handleIdBlur}
                    placeholder="Enter ID to auto-check"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="wizard-input"
                    required
                    value={personForm.firstName}
                    onChange={(e) =>
                      setPersonForm({
                        ...personForm,
                        firstName: e.target.value
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="wizard-input"
                    required
                    value={personForm.lastName}
                    onChange={(e) =>
                      setPersonForm({ ...personForm, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="wizard-input"
                    type="email"
                    value={personForm.email}
                    onChange={(e) =>
                      setPersonForm({ ...personForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="wizard-input"
                    value={personForm.phone}
                    onChange={(e) =>
                      setPersonForm({ ...personForm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    className="wizard-input"
                    value={personForm.address}
                    onChange={(e) =>
                      setPersonForm({ ...personForm, address: e.target.value })
                    }
                  />
                </div>
                <div className="form-action-row">
                  <Button type="submit" disabled={loading}>
                    {foundClient &&
                    foundClient.customerId === personForm.customerId
                      ? 'Use Existing Person'
                      : loading
                        ? 'Creating...'
                        : 'Create Person'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateCompany} className="form-grid">
                <div className="form-group">
                  <label className="form-label">RUC</label>
                  <input
                    className="wizard-input"
                    required
                    value={companyForm.companyRuc}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        companyRuc: e.target.value
                      })
                    }
                    onBlur={handleRucBlur}
                    placeholder="Enter RUC to auto-check"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    className="wizard-input"
                    required
                    value={companyForm.companyName}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        companyName: e.target.value
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Social Reason</label>
                  <input
                    className="wizard-input"
                    required
                    value={companyForm.socialReason}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        socialReason: e.target.value
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    className="wizard-input"
                    required
                    value={companyForm.companyAddress}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        companyAddress: e.target.value
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="wizard-input"
                    type="email"
                    value={companyForm.companyEmails[0]}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        companyEmails: [e.target.value]
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="wizard-input"
                    value={companyForm.companyPhones[0]}
                    onChange={(e) =>
                      setCompanyForm({
                        ...companyForm,
                        companyPhones: [e.target.value]
                      })
                    }
                  />
                </div>
                <div className="form-action-row">
                  <Button type="submit" disabled={loading}>
                    {foundClient &&
                    (foundClient as any).companyRuc === companyForm.companyRuc
                      ? 'Use Existing Company'
                      : loading
                        ? 'Creating...'
                        : 'Create Company'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {successMsg && (
          <div
            className="alert-success"
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Show card ONLY if not in Create mode OR if searching */}
        {activeTab === 'search' && foundClient && (
          <div className="client-card">
            <div className="client-card-header">
              <div className="client-info">
                <div className="client-icon">
                  <User size={24} />
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      margin: 0
                    }}
                  >
                    {foundClient.firstName} {foundClient.lastName}
                  </h4>
                  <p
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      margin: '4px 0 0'
                    }}
                  >
                    {foundClient.identificationType}: {foundClient.customerId}
                  </p>
                  <div
                    style={{ display: 'flex', gap: '16px', marginTop: '8px' }}
                  >
                    {foundClient.emails && foundClient.emails[0] && (
                      <span
                        style={{
                          fontSize: 'var(--font-size-sm)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {foundClient.emails[0]}
                      </span>
                    )}
                    {foundClient.phoneNumbers &&
                      foundClient.phoneNumbers[0] && (
                        <span
                          style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {foundClient.phoneNumbers[0]}
                        </span>
                      )}
                  </div>
                </div>
              </div>
              <CheckCircle size={24} color="var(--success)" />
            </div>

            <div
              className="step-actions"
              style={{
                justifyContent: 'flex-end',
                borderTop: 'none',
                paddingTop: 0
              }}
            >
              <Button
                onClick={nextStep}
                style={{
                  backgroundColor: 'var(--success)',
                  borderColor: 'var(--success)'
                }}
              >
                Continue with this Client
                <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
