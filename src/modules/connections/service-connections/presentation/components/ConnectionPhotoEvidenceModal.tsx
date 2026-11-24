import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera } from 'lucide-react';
import type { Connection } from '../../domain/models/Connection';
import type { UpdateConnectionBasicRequest } from '../../domain/models/UpdateConnectionBasic';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useConnectionsContext } from '../context/ConnectionContext';
import {
  BasicUpdateConnectionStep,
  type BasicUpdatePayload
} from './Steps/BasicUpdateConnectionStep';

/**
 * Interface Segregation Principle (ISP):
 * Minimal contract required to open and manage the photographic evidence modal.
 */
export interface ConnectionPhotoEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  connection: Connection | null;
  /**
   * Optional handler injected from the ViewModel (DIP).
   * If omitted, falls back to the Application UseCase in ConnectionContext.
   */
  onUpdateConnectionBasic?: (
    request: UpdateConnectionBasicRequest
  ) => Promise<boolean>;
  onSuccess?: () => void;
}

const STANDALONE_FORM_ID = 'standalone-connection-evidence-form';

const mapConnectionToFormData = (
  conn: Connection | null
): Omit<Connection, 'connectionId'> => ({
  clientId: conn?.clientId ?? '',
  clientName: conn?.clientName ?? '',
  clientAddress: conn?.clientAddress ?? '',
  connectionRateId: conn?.connectionRateId ?? 0,
  connectionRateName: conn?.connectionRateName ?? '',
  connectionMeterNumber: conn?.connectionMeterNumber ?? '',
  connectionSector: conn?.connectionSector ?? 0,
  connectionAccount: conn?.connectionAccount ?? 0,
  connectionCadastralKey: conn?.connectionCadastralKey ?? '',
  connectionContractNumber: conn?.connectionContractNumber ?? '',
  connectionSewerage: conn?.connectionSewerage ?? false,
  connectionStatus: conn?.connectionStatus ?? 'ACTIVA',
  connectionAddress: conn?.connectionAddress ?? '',
  connectionInstallationDate: conn?.connectionInstallationDate
    ? new Date(conn.connectionInstallationDate)
    : new Date(),
  connectionPeopleNumber: conn?.connectionPeopleNumber ?? 0,
  connectionZone: conn?.connectionZone ?? 0,
  longitude: conn?.longitude ?? 0,
  latitude: conn?.latitude ?? 0,
  connectionCoordinates: conn?.connectionCoordinates ?? '',
  connectionReference: conn?.connectionReference ?? '',
  ConnectionMetaData: conn?.ConnectionMetaData ?? {},
  connectionAltitude: conn?.connectionAltitude ?? 0,
  connectionPrecision: conn?.connectionPrecision ?? 0,
  connectionGeolocationDate: conn?.connectionGeolocationDate
    ? new Date(conn.connectionGeolocationDate)
    : new Date(),
  connectionGeometricZone: conn?.connectionGeometricZone ?? '',
  propertyCadastralKey: conn?.propertyCadastralKey ?? '',
  zoneId: conn?.zoneId ?? 0,
  zoneCode: conn?.zoneCode ?? '',
  zoneName: conn?.zoneName ?? '',
  connectionHasFacade: conn?.connectionHasFacade ?? false,
  incidents: conn?.incidents ?? 0,
  connectionStateId: conn?.connectionStateId ?? 0,
  connectionIsReadable: conn?.connectionIsReadable ?? true,
  connectionType: conn?.connectionType ?? 'AGUA_POTABLE',
  connectionTypeName: conn?.connectionTypeName ?? 'Agua Potable'
});

/**
 * Single Responsibility Principle (SRP):
 * Renders exclusively the modal for uploading photographic evidence and verifying
 * the meter number of a specific connection, reusing BasicUpdateConnectionStep (OCP).
 */
export const ConnectionPhotoEvidenceModal: React.FC<
  ConnectionPhotoEvidenceModalProps
> = ({ isOpen, onClose, connection, onUpdateConnectionBasic, onSuccess }) => {
  const { t } = useTranslation();
  const { updateConnectionBasicUseCase } = useConnectionsContext();

  const [localFormData, setLocalFormData] = useState<
    Omit<Connection, 'connectionId'>
  >(() => mapConnectionToFormData(connection));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalFormData(mapConnectionToFormData(connection));
  }, [connection]);

  const handleInputChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        | { name: string; value: string | number | boolean | Date | object }
    ) => {
      if ('target' in e) {
        const { name, value } = e.target;
        setLocalFormData((prev) => ({ ...prev, [name]: value }));
      } else {
        setLocalFormData((prev) => ({ ...prev, [e.name]: e.value }));
      }
    },
    []
  );

  const handleSaveEvidence = async (basicUpdateData?: BasicUpdatePayload) => {
    if (!connection) return;

    const facadeFiles = basicUpdateData?.photosFacade || [];
    const meterFiles = basicUpdateData?.photosMeter || [];
    const resolvedMeterNumber =
      basicUpdateData?.meterNumber !== undefined
        ? basicUpdateData.meterNumber
        : localFormData.connectionMeterNumber || null;

    const hasPhotos = facadeFiles.length > 0 && meterFiles.length > 0;
    const initialMeter = (connection.connectionMeterNumber || '').trim();
    const currentMeter = (resolvedMeterNumber || '').trim();
    const hasMeterChanged =
      currentMeter.length > 0 && currentMeter !== initialMeter;

    if (!hasPhotos && !hasMeterChanged) {
      MessageToastCustom(
        'warning',
        t(
          'connections.wizard.basicUpdate.noEvidenceOrChangesWarning',
          'Debes adjuntar al menos 1 foto de fachada y 1 de medidor, o actualizar el número de medidor.'
        ),
        t('common.attention', 'Atención'),
        { position: 'top-right' }
      );
      return;
    }

    const request: UpdateConnectionBasicRequest = {
      connectionId:
        connection.connectionId || connection.connectionCadastralKey,
      meterNumber: resolvedMeterNumber,
      photosFacade: facadeFiles,
      photosFacadeDescriptions:
        basicUpdateData?.photosFacadeDescriptions ||
        facadeFiles.map(() => 'Fachada'),
      photosMeter: meterFiles,
      photosMeterDescriptions:
        basicUpdateData?.photosMeterDescriptions ||
        meterFiles.map(() => 'Medidor')
    };

    setIsSaving(true);
    try {
      if (onUpdateConnectionBasic) {
        const ok = await onUpdateConnectionBasic(request);
        if (ok) {
          onSuccess?.();
          onClose();
        }
        return;
      }

      await updateConnectionBasicUseCase.execute(request);
      MessageToastCustom(
        'success',
        t(
          'connections.wizard.basicUpdate.evidenceSavedSuccess',
          'Evidencia fotográfica y medidor actualizados correctamente.'
        ),
        t('common.success', 'Operación Exitosa'),
        { position: 'top-right' }
      );
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : t(
              'connections.wizard.basicUpdate.evidenceSaveError',
              'Error al actualizar las fotografías de evidencia.'
            );
      MessageToastCustom('error', message, t('common.error', 'Error'), {
        position: 'top-right'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !connection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      icon={<Camera size={20} />}
      headerColor="indigo"
      title={t(
        'connections.wizard.basicUpdate.modalTitle',
        'Evidencia Fotográfica y Medidor'
      )}
      description={`${t(
        'connections.wizard.basicUpdate.cadastralKey',
        'Clave Catastral'
      )}: ${connection.connectionCadastralKey || connection.connectionId}`}
      footer={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            {t('common.cancel', 'Cancelar')}
          </Button>
          <Button
            type="submit"
            form={STANDALONE_FORM_ID}
            variant="primary"
            disabled={isSaving}
            isLoading={isSaving}
          >
            {isSaving
              ? t('common.saving', 'Guardando...')
              : t(
                  'connections.wizard.basicUpdate.saveEvidenceBtn',
                  'Guardar Evidencias'
                )}
          </Button>
        </div>
      }
    >
      <div style={{ padding: '0.5rem' }}>
        <BasicUpdateConnectionStep
          key={connection.connectionId || connection.connectionCadastralKey}
          formId={STANDALONE_FORM_ID}
          headerTitle={t(
            'connections.wizard.basicUpdate.modalTitle',
            'Evidencia Fotográfica y Medidor'
          )}
          formData={localFormData}
          selectedConnection={connection}
          handleInputChange={handleInputChange}
          prevStep={onClose}
          handleWizardSave={handleSaveEvidence}
          wizardLoading={isSaving}
          hideFooterActions={true}
        />
      </div>
    </Modal>
  );
};
