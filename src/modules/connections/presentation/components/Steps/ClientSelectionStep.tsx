import React from 'react';
import {
  User,
  CheckCircle,
  AlertCircle,
  Building2,
  Plus,
  ArrowRight,
  Trash2,
  Heart,
  Users,
  RefreshCcw,
  MapPin
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/presentation/components/Button/Button';
import { useClientSelectionForm } from '../../hooks/useClientSelectionForm';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import { LocationSelector } from '@/shared/presentation/components/Input/LocationSelector';
import { FaBuilding, FaIdCard, FaPhone, FaUser } from 'react-icons/fa6';
import { FaMailBulk, FaMapMarkerAlt } from 'react-icons/fa';

interface ClientSelectionStepProps {
  onConfirm: (
    data: any,
    isExisting: boolean,
    type: 'person' | 'company'
  ) => void;
  loading?: boolean;
  initialData?: any;
  initialType?: 'person' | 'company' | null;
  isClientExisting?: boolean;
}

export const ClientSelectionStep: React.FC<ClientSelectionStepProps> = ({
  onConfirm,
  loading: externalLoading,
  initialData,
  initialType,
  isClientExisting
}) => {
  const { t } = useTranslation();
  const {
    activeType,
    setActiveType,
    loading: internalLoading,
    error,
    successMsg,
    isExisting,
    personForm,
    setPersonForm,
    companyForm,
    setCompanyForm,
    handleIdBlur,
    handleRucBlur,
    handleCreatePerson,
    handleCreateCompany,
    handleReset
  } = useClientSelectionForm({
    onConfirm,
    initialData,
    initialType,
    isExistingInitial: isClientExisting
  });

  const loading = externalLoading || internalLoading;

  return (
    <div className="step-animation">
      <div className="step-container">
        <h3 className="step-title">{t('connections.wizard.clientSelection.title')}</h3>
        <p className="step-description">
          {t('connections.wizard.clientSelection.description')}
        </p>

        {/* Entity Type Selector */}
        <div className="wizard-tabs">
          <button
            className={`wizard-tab ${activeType === 'person' ? 'active' : ''}`}
            onClick={() => setActiveType('person')}
          >
            <User size={14} />
            {t('connections.wizard.clientSelection.person')}
          </button>
          <button
            className={`wizard-tab ${activeType === 'company' ? 'active' : ''}`}
            onClick={() => setActiveType('company')}
          >
            <Building2 size={14} />
            {t('connections.wizard.clientSelection.company')}
          </button>
        </div>

        {activeType === 'person' ? (
          <form
            onSubmit={handleCreatePerson}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            className="form-grid"
          >
            <div className="form-group">
              <Input
                required
                size="small"
                value={personForm.customerId}
                onChange={(e) =>
                  setPersonForm({
                    ...personForm,
                    customerId: e.target.value
                  })
                }
                onBlur={handleIdBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleIdBlur();
                  }
                }}
                placeholder={t('connections.wizard.clientSelection.idPlaceholder')}
                label={t('connections.wizard.clientSelection.idCed')}
                leftIcon={<FaIdCard size={14} />}
              />
            </div>
            <div className="form-group">
              <Input
                required
                size="small"
                value={personForm.firstName}
                onChange={(e) =>
                  setPersonForm({
                    ...personForm,
                    firstName: e.target.value
                  })
                }
                label={t('connections.wizard.clientSelection.firstName')}
                leftIcon={<FaUser size={14} />}
              />
            </div>
            <div className="form-group">
              <Input
                required
                size="small"
                value={personForm.lastName}
                onChange={(e) =>
                  setPersonForm({ ...personForm, lastName: e.target.value })
                }
                label={t('connections.wizard.clientSelection.lastName')}
                leftIcon={<FaUser size={14} />}
              />
            </div>
            <div className="form-group">
              <Input
                required
                size="small"
                value={personForm.address}
                onChange={(e) =>
                  setPersonForm({ ...personForm, address: e.target.value })
                }
                label={t('connections.wizard.clientSelection.address')}
                leftIcon={<FaMapMarkerAlt size={14} />}
              />
            </div>

            <div className="form-group explorer-row" style={{ gridColumn: '1 / -1' }}>
              <div className="input-component input--small">
                <label className="input__label">{t('connections.wizard.clientSelection.dob')}</label>
                <DatePicker
                  size="small"
                  value={personForm.dateOfBirth}
                  onChange={(date) => setPersonForm({ ...personForm, dateOfBirth: date })}
                />
              </div>
              <Select
                label={t('connections.wizard.clientSelection.gender')}
                size="small"
                value={personForm.sexId}
                onChange={(e) => setPersonForm({ ...personForm, sexId: parseInt(e.target.value) })}
                options={[
                  { value: 1, label: t('customers.form.male') },
                  { value: 2, label: t('customers.form.female') }
                ]}
                leftIcon={<Users size={14} />}
              />
              <Select
                label={t('connections.wizard.clientSelection.civilStatus')}
                size="small"
                value={personForm.civilStatus}
                onChange={(e) => setPersonForm({ ...personForm, civilStatus: parseInt(e.target.value) })}
                options={[
                  { value: 1, label: t('customers.form.single') },
                  { value: 2, label: t('customers.form.married') },
                  { value: 3, label: t('customers.form.divorced') },
                  { value: 4, label: t('customers.form.widowed') },
                  { value: 5, label: t('customers.form.freeUnion') }
                ]}
                leftIcon={<Heart size={14} />}
              />
            </div>

            <div className="form-section-title" style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <MapPin size={14} /> {t('connections.wizard.clientSelection.location')}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <LocationSelector
                size="small"
                countryId={personForm.countryId}
                provinceId={personForm.provinceId}
                cantonId={personForm.cantonId}
                parishId={personForm.parishId}
                onLocationChange={(loc) => setPersonForm({
                  ...personForm,
                  countryId: loc.countryId,
                  provinceId: loc.provinceId,
                  cantonId: loc.cantonId,
                  parishId: loc.parishId
                })}
              />
            </div>

            <div className="form-group">
              <Input
                type="number"
                size="small"
                label={t('connections.wizard.clientSelection.profession')}
                value={personForm.professionId || 1}
                onChange={(e) => setPersonForm({ ...personForm, professionId: parseInt(e.target.value) })}
                leftIcon={<Users size={14} />}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '100%', paddingTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={personForm.deceased}
                  onChange={(e) => setPersonForm({ ...personForm, deceased: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                {t('connections.wizard.clientSelection.deceased')}
              </label>
            </div>

            <div className="form-group">
              <label className="input__label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.65rem' }}>
                <FaMailBulk size={12} style={{ marginRight: '4px' }} />
                {t('connections.wizard.clientSelection.emails')}
              </label>
              {personForm.emails.map((email, idx) => (
                <div key={`person-email-${idx}`} className="dynamic-input-row">
                  <Input
                    type="email"
                    size="small"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...personForm.emails];
                      newEmails[idx] = e.target.value;
                      setPersonForm({ ...personForm, emails: newEmails });
                    }}
                    placeholder={`${t('customers.form.email')} ${idx + 1}`}
                    leftIcon={<FaMailBulk size={14} />}
                  />
                  {personForm.emails.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newEmails = personForm.emails.filter(
                          (_, i) => i !== idx
                        );
                        setPersonForm({ ...personForm, emails: newEmails });
                      }}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPersonForm({
                    ...personForm,
                    emails: [...personForm.emails, '']
                  })
                }
                className="add-btn-minimal"
              >
                <Plus size={14} /> {t('connections.wizard.clientSelection.addEmail')}
              </button>
            </div>

            <div className="form-group">
              <label className="input__label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.65rem' }}>
                <FaPhone size={12} style={{ marginRight: '4px' }} />
                {t('connections.wizard.clientSelection.phones')}
              </label>
              {personForm.phoneNumbers.map((phone, idx) => (
                <div key={`person-phone-${idx}`} className="dynamic-input-row">
                  <Input
                    size="small"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...personForm.phoneNumbers];
                      newPhones[idx] = e.target.value;
                      setPersonForm({
                        ...personForm,
                        phoneNumbers: newPhones
                      });
                    }}
                    placeholder={`${t('customers.form.phone')} ${idx + 1}`}
                    leftIcon={<FaPhone size={14} />}
                  />
                  {personForm.phoneNumbers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = personForm.phoneNumbers.filter(
                          (_, i) => i !== idx
                        );
                        setPersonForm({
                          ...personForm,
                          phoneNumbers: newPhones
                        });
                      }}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPersonForm({
                    ...personForm,
                    phoneNumbers: [...personForm.phoneNumbers, '']
                  })
                }
                className="add-btn-minimal"
              >
                <Plus size={14} /> {t('connections.wizard.clientSelection.addPhone')}
              </button>
            </div>

            <div
              className="form-action-row"
              style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <RefreshCcw size={14} style={{ marginRight: '8px' }} />
                {t('connections.wizard.clientSelection.clear')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{ flex: 2, justifyContent: 'center' }}
              >
                {loading
                  ? t('connections.wizard.clientSelection.processing')
                  : isExisting
                    ? t('connections.wizard.clientSelection.updateContinue')
                    : t('connections.wizard.clientSelection.createContinue')}
                <ArrowRight size={14} style={{ marginLeft: '8px' }} />
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleCreateCompany}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            className="form-grid"
          >
            <div className="form-group">
              <Input
                required
                size="small"
                value={companyForm.companyRuc}
                onChange={(e) =>
                  setCompanyForm({
                    ...companyForm,
                    companyRuc: e.target.value
                  })
                }
                onBlur={handleRucBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRucBlur();
                  }
                }}
                placeholder={t('connections.wizard.clientSelection.rucPlaceholder')}
                label={t('connections.wizard.clientSelection.rucNumber')}
                leftIcon={<FaBuilding size={14} />}
              />
            </div>
            <div className="form-group">
              <Input
                required
                size="small"
                value={companyForm.companyName}
                onChange={(e) =>
                  setCompanyForm({
                    ...companyForm,
                    companyName: e.target.value
                  })
                }
                label={t('connections.wizard.clientSelection.companyName')}
                leftIcon={<FaBuilding size={14} />}
              />
            </div>
            <div className="form-group">
              <Input
                required
                size="small"
                value={companyForm.socialReason}
                onChange={(e) =>
                  setCompanyForm({
                    ...companyForm,
                    socialReason: e.target.value
                  })
                }
                label={t('connections.wizard.clientSelection.socialReason')}
                leftIcon={<FaBuilding size={14} />}
              />
            </div>
            <div className="form-group">
              <Input
                required
                size="small"
                value={companyForm.companyAddress}
                onChange={(e) =>
                  setCompanyForm({
                    ...companyForm,
                    companyAddress: e.target.value
                  })
                }
                label={t('connections.wizard.clientSelection.address')}
                leftIcon={<FaMapMarkerAlt size={14} />}
              />
            </div>

            <div className="form-section-title" style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              <MapPin size={14} /> {t('connections.wizard.clientSelection.location')}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <LocationSelector
                size="small"
                countryId={companyForm.companyCountryId}
                provinceId={companyForm.companyProvinceId}
                cantonId={companyForm.companyCantonId}
                parishId={companyForm.companyParishId}
                onLocationChange={(loc) => setCompanyForm({
                  ...companyForm,
                  companyCountryId: loc.countryId,
                  companyProvinceId: loc.provinceId,
                  companyCantonId: loc.cantonId,
                  companyParishId: loc.parishId
                })}
              />
            </div>

            <div className="form-group">
              <label className="input__label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.65rem' }}>
                <FaMailBulk size={12} style={{ marginRight: '4px' }} />
                {t('connections.wizard.clientSelection.emails')}
              </label>
              {companyForm.companyEmails.map((email, idx) => (
                <div key={`company-email-${idx}`} className="dynamic-input-row">
                  <Input
                    type="email"
                    size="small"
                    value={email}
                    onChange={(e) => {
                      const newEmails = [...companyForm.companyEmails];
                      newEmails[idx] = e.target.value;
                      setCompanyForm({
                        ...companyForm,
                        companyEmails: newEmails
                      });
                    }}
                    placeholder={`${t('customers.form.email')} ${idx + 1}`}
                    leftIcon={<FaMailBulk size={14} />}
                  />
                  {companyForm.companyEmails.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newEmails = companyForm.companyEmails.filter(
                          (_, i) => i !== idx
                        );
                        setCompanyForm({
                          ...companyForm,
                          companyEmails: newEmails
                        });
                      }}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCompanyForm({
                    ...companyForm,
                    companyEmails: [...companyForm.companyEmails, '']
                  })
                }
                className="add-btn-minimal"
              >
                <Plus size={14} /> {t('connections.wizard.clientSelection.addEmail')}
              </button>
            </div>

            <div className="form-group">
              <label className="input__label" style={{ marginBottom: '8px', display: 'block', fontSize: '0.65rem' }}>
                <FaPhone size={12} style={{ marginRight: '4px' }} />
                {t('connections.wizard.clientSelection.phones')}
              </label>
              {companyForm.companyPhones.map((phone, idx) => (
                <div key={`company-phone-${idx}`} className="dynamic-input-row">
                  <Input
                    size="small"
                    value={phone}
                    onChange={(e) => {
                      const newPhones = [...companyForm.companyPhones];
                      newPhones[idx] = e.target.value;
                      setCompanyForm({
                        ...companyForm,
                        companyPhones: newPhones
                      });
                    }}
                    placeholder={`${t('customers.form.phone')} ${idx + 1}`}
                    leftIcon={<FaPhone size={14} />}
                  />
                  {companyForm.companyPhones.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = companyForm.companyPhones.filter(
                          (_, i) => i !== idx
                        );
                        setCompanyForm({
                          ...companyForm,
                          companyPhones: newPhones
                        });
                      }}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCompanyForm({
                    ...companyForm,
                    companyPhones: [...companyForm.companyPhones, '']
                  })
                }
                className="add-btn-minimal"
              >
                <Plus size={14} /> {t('connections.wizard.clientSelection.addPhone')}
              </button>
            </div>

            <div
              className="form-action-row"
              style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <RefreshCcw size={14} style={{ marginRight: '8px' }} />
                {t('connections.wizard.clientSelection.clear')}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{ flex: 2, justifyContent: 'center' }}
              >
                {loading
                  ? t('connections.wizard.clientSelection.processing')
                  : isExisting
                    ? t('connections.wizard.clientSelection.updateContinue')
                    : t('connections.wizard.clientSelection.createContinue')}
                <ArrowRight size={14} style={{ marginLeft: '8px' }} />
              </Button>
            </div>
          </form>
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
            <CheckCircle size={14} />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="alert-error" style={{ marginTop: '1rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
