import React, { useState } from 'react';
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

interface ClientSelectionStepProps {
  foundClient: Customer | null;
  searchClient: (identification: string) => Promise<Customer | null>;
  createClient: (clientData: any) => Promise<boolean>;
  createCompany: (companyData: any) => Promise<boolean>;
  loading: boolean;
  nextStep: () => void;
}

export const ClientSelectionStep: React.FC<ClientSelectionStepProps> = ({
  foundClient,
  searchClient,
  createClient,
  createCompany,
  loading,
  nextStep
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');
  const [entityType, setEntityType] = useState<'person' | 'company'>('person');

  const [identification, setIdentification] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form States
  const [personForm, setPersonForm] = useState({
    firstName: '',
    lastName: '',
    customerId: '', // Identification
    email: '',
    phone: '',
    address: '',
    identificationType: 'CEDULA',
    status: true
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    socialReason: '',
    companyRuc: '',
    companyAddress: '',
    companyParishId: '1', // Default or select
    companyCountry: 'Ecuador',
    companyEmails: [''],
    companyPhones: [''],
    identificationType: 'RUC'
  });

  const handleSearch = async () => {
    if (!identification) return;
    setError(null);
    const client = await searchClient(identification);
    if (!client) {
      setError(
        'Client not found. Please check the identification or create a new client.'
      );
    }
  };

  const handleIdBlur = async () => {
    if (!personForm.customerId) return;
    try {
      const client = await searchClient(personForm.customerId);
      if (client) {
        setPersonForm((prev) => ({
          ...prev,
          firstName: client.firstName || '',
          lastName: client.lastName || '',
          email: client.emails?.[0] || '',
          phone: client.phoneNumbers?.[0] || '',
          address: client.address || ''
        }));
        setSuccessMsg('Client found! Details loaded automatically.');
        setError(null);
      }
    } catch (e) {
      // ignore error on blur
    }
  };

  const handleRucBlur = async () => {
    if (!companyForm.companyRuc) return;
    try {
      // Assuming searchClient can find companies by RUC (mapped to customerId or similar)
      // If simpler, we use the same searchClient.
      // Note: If backend considers RUC as ID, this works.
      const client = await searchClient(companyForm.companyRuc);

      // Logic: If the backend returns a generic 'Customer' object even for companies (unlikely if strictly typed),
      // we map what we can.
      // However, if searchClient returns a Person-like object, mapping to Company fields might be tricky
      // unless we know for sure it's a company.
      // For now, let's assume if it finds something by RUC, we try to use it.
      // If the API returns 'companyName' inside the generic object, great.
      // If not, we might only be able to fill ID.

      // HACK: Casting to any to check for company fields if they exist in the response but not in Customer interface
      const rawData = client as any;

      if (client) {
        setCompanyForm((prev) => ({
          ...prev,
          companyName: rawData.companyName || client.firstName || '', // Fallback
          socialReason: rawData.socialReason || client.lastName || '',
          companyAddress: rawData.companyAddress || client.address || '',
          companyEmails: [
            rawData.companyEmails?.[0]?.correo || client.emails?.[0] || ''
          ],
          companyPhones: [
            rawData.companyPhones?.[0]?.numero || client.phoneNumbers?.[0] || ''
          ]
        }));
        setSuccessMsg('Company found! Details loaded automatically.');
        setError(null);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // If we found a client during blur (auto-filled), we might be "updating" or just "using" it.
    // createClient in logic first calls create, then search.
    // If create fails (duplicate), it enters catch.
    // We should probably check if foundClient matches the form ID.

    if (foundClient && foundClient.customerId === personForm.customerId) {
      // Just proceed, essentially "selecting" the found client
      nextStep();
      return;
    }

    const newPerson = {
      ...personForm,
      emails: [personForm.email],
      phoneNumbers: [personForm.phone],
      parishId: '1' // Default
    };

    const success = await createClient(newPerson);
    if (success) {
      // Success logic handled by parent (sets foundClient)
      // If we want to move to next step automatically:
      nextStep();
    } else {
      // If it failed, maybe it already exists?
      // We could try to search one last time if error is "exists"
      // But for now show error.
      setError('Failed to create person. User might already exist.');
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (
      foundClient &&
      (foundClient as any).companyRuc === companyForm.companyRuc
    ) {
      nextStep();
      return;
    }

    const success = await createCompany(companyForm);
    if (success) {
      nextStep();
    } else {
      setError('Failed to create company. It might already exist.');
    }
  };

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
