import type { DocumentosMap } from '@/modules/tramites/domain/models/DocumentoAdjunto';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import type { SolicitudForm } from './types';

export const mapRequisitoIdToDbId = (id: string, tramite?: Tramite): string => {
  const req = tramite?.requisitos.find((r) => r.id === id);
  if (req?.documentTypeId) {
    return String(req.documentTypeId);
  }

  const cleanId = id.toLowerCase();

  if (cleanId.includes('cedula') || cleanId.includes('identidad')) return '1';
  if (cleanId.includes('ruc')) return '2';
  if (cleanId.includes('papeleta') || cleanId.includes('votacion')) return '3';
  if (cleanId.includes('escritura') || cleanId.includes('propiedad')) return '4';
  if (cleanId.includes('predial') || cleanId.includes('impuesto')) return '5';
  if (cleanId.includes('deudar') || cleanId.includes('certificado')) return '6';
  if (cleanId.includes('nombramiento') || cleanId.includes('representante')) return '7';
  if (cleanId.includes('autorizacion') || cleanId.includes('propietario')) return '8';
  if (cleanId.includes('plano') || cleanId.includes('instalacion')) return '9';
  if (cleanId.includes('croquis') || cleanId.includes('ubicacion')) return '10';

  if (cleanId.endsWith('-01')) return '1';
  if (cleanId.endsWith('-02')) return '10';
  if (cleanId.endsWith('-03')) return '1';
  if (cleanId.endsWith('-04')) return '4';
  if (cleanId.endsWith('-05')) return '5';
  if (cleanId.endsWith('-06')) return '6';

  return '1';
};

export const buildSolicitudFormData = ({
  form,
  tramite,
  userId,
  documentos
}: {
  form: SolicitudForm;
  tramite: Tramite;
  userId?: string;
  documentos: DocumentosMap;
}): FormData => {
  const formData = new FormData();

  formData.append('clientId', form.cedula);
  formData.append('userId', userId || '');

  const personTypeVal = form.tipo_persona === 'JURIDICA' ? 'JURIDICA' : 'NATURAL';
  formData.append('personType', personTypeVal);

  const connectionTypeVal =
    tramite.categoria === 'alcantarillado' ? 'ALCANTARILLADO' : 'AGUA_POTABLE';
  formData.append('connectionType', connectionTypeVal);

  const useType = (form.detalles?.tipo_uso || '').toLowerCase();
  let propertyUseVal = 'RESIDENCIAL';
  if (useType.includes('comercial')) propertyUseVal = 'COMERCIAL';
  else if (useType.includes('industrial')) propertyUseVal = 'INDUSTRIAL';
  formData.append('propertyUse', propertyUseVal);

  const callePrincipal = form.detalles?.calle_principal || '';
  const calleSecundaria = form.detalles?.calle_secundaria || '';
  const barrio = form.detalles?.barrio || '';
  const parroquia = form.detalles?.parroquia || '';
  const fullAddress = `${callePrincipal}${calleSecundaria ? ` y ${calleSecundaria}` : ''}, Sector: ${barrio}, Parroquia: ${parroquia}`;
  formData.append('address', fullAddress);

  const cadastralKeyVal =
    form.detalles?.clave_catastral || null;
  formData.append('cadastralKey', cadastralKeyVal);

  const additionalInfo = {
    nombres: form.nombres,
    apellidos: form.apellidos,
    email: form.email,
    telefono: form.telefono,
    referencia: form.detalles?.referencia || '',
    diametro_solicitado: form.detalles?.diametro_solicitado || '',
    observaciones: form.detalles?.observaciones || ''
  };
  formData.append('additionalInfo', JSON.stringify(additionalInfo));

  const docTypeIds: string[] = [];
  Object.values(documentos).forEach((doc) => {
    const dbId = mapRequisitoIdToDbId(doc.requisitoId, tramite);
    docTypeIds.push(dbId);
    formData.append('files', doc.file);
  });
  formData.append('documentTypeIds', docTypeIds.join(','));

  return formData;
};

export const isLocationTramite = (categoria?: string): boolean =>
  categoria === 'nueva_acometida' || categoria === 'alcantarillado';
