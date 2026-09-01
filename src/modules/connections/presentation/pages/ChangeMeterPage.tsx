import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { useChangeMeter } from '../hooks/useChangeMeter';
import '../styles/ChangeMeterPage.css';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useConnectionsContext } from '../context/ConnectionContext';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';

export interface ChangeMeterPageProps {
  cadastralKeyProp?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChangeMeterPage: React.FC<ChangeMeterPageProps> = ({ cadastralKeyProp, onSuccess, onCancel }) => {
  const { connectionId: connectionIdParams } = useParams<{ connectionId: string }>();
  const [connectionId, setConnectionId] = useState<string | undefined>(connectionIdParams);
  const navigate = useNavigate();
  const { changeMeter, isLoading } = useChangeMeter();
  const { findConnectionWithPropertyByCadastralKeyUseCase } = useConnectionsContext();

  // Form State
  const [claveCatastral, setClaveCatastral] = useState(cadastralKeyProp || '');
  const [numeroMedidor, setNumeroMedidor] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  // Previous Meter State
  const [prevMedidor, setPrevMedidor] = useState('');

  // New Meter State
  const [newMedidor, setNewMedidor] = useState('');

  useEffect(() => {
    const fetchConnectionData = async () => {
      if (cadastralKeyProp) {
        try {
          const connectionData = await findConnectionWithPropertyByCadastralKeyUseCase.execute(cadastralKeyProp);
          if (connectionData) {
            setConnectionId(connectionData.connectionId);
            setClaveCatastral(connectionData.connectionCadastralKey || '');
            setNumeroMedidor(connectionData.connectionMeterNumber || '');
            setPrevMedidor(connectionData.connectionMeterNumber || '');
            setUbicacion(connectionData.connectionAddress || '');
          }
        } catch (error) {
          console.error("Error fetching connection data", error);
        }
      }
    };
    fetchConnectionData();
  }, [cadastralKeyProp, findConnectionWithPropertyByCadastralKeyUseCase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectionId) {
      MessageToastCustom('error', 'ID de conexión no encontrado en la URL', '');
      return;
    }

    const payload = {
      connectionId,
      changeDetail: {
        clave_catastral: claveCatastral,
        numero_medidor: numeroMedidor,
        serie: '',
        ubicacion,
        observaciones: '',
        medidor_anterior: {
          numero_medidor: prevMedidor,
          ultima_lectura: 0,
          fecha_ultima_lectura: new Date().toISOString(),
        },
        medidor_nuevo: {
          numero_medidor: newMedidor,
          lectura_anterior: 0,
          lectura_actual: 0,
          fecha_ultima_lectura: new Date().toISOString(),
        },
      },
      images: [],
      imageDescriptions: [],
    };

    const success = await changeMeter(payload);
    if (success) {
      MessageToastCustom('success', 'Medidor cambiado exitosamente', '');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/connections');
      }
    } else {
      MessageToastCustom('error', 'Error al cambiar medidor', '');
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/connections');
    }
  };

  const content = (
    <div className={`change-meter-page ${cadastralKeyProp ? 'is-modal' : ''}`}>
      <div className="change-meter-form-card" style={cadastralKeyProp ? { margin: 0, padding: '1rem', boxShadow: 'none' } : {}}>

        <form onSubmit={handleSubmit}>
          <div className="change-meter-section">
            <div className="change-meter-grid">
              <div className="label-input-group" style={{ marginBottom: '1rem' }}>
                <span className="text-label">Clave Catastral:</span>
                <ColorChip
                  label={claveCatastral}
                  color='magenta'
                  variant='ghost'
                />
              </div>
              <div className="label-input-group" style={{ marginBottom: '1rem' }}>
                <span className="text-label">Medidor Actual:</span>
                <ColorChip
                  label={numeroMedidor}
                  color='cyan'
                  variant='ghost'
                />
              </div>
              <Input
                label="Nuevo número de medidor"
                value={newMedidor}
                onChange={(e) => setNewMedidor(e.target.value)}
                required
              />
              <div className="change-meter-actions">
                <Button type="button" variant="outline" onClick={handleCancelClick}>
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading} disabled={isLoading || !connectionId}>
                  Registrar Cambio
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return cadastralKeyProp ? content : <PageLayout>{content}</PageLayout>;
};
