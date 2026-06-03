import React from 'react';
import { GetParishUseCase } from '@/modules/location/application/usecases/GetParishUseCase';
import { GetParishRepositoryImpl } from '@/modules/location/infrastructure/repositories/GetParishRepositoryImpl';
import { INITIAL_FORM_ACOMETIDA } from '../../components/forms/FormAcometida';
import { INITIAL_FORM_SUSPENSION } from '../../components/forms/FormSuspension';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { Tramite } from '@/modules/tramites/domain/models/Tramite';
import type { SolicitudForm } from './types';
// import { GetProfileUseCase } from '@/modules/customers/application/usecases/GetProfileUseCase';
// import { UserCustomerRepositoryImpl } from '@/modules/customers/infrastructure/repositories/UserCustomerRepositoryImpl';


interface AuthUserLike {
  username?: string;
}

export const useSolicitudFormSetup = (
  form: SolicitudForm,
  setForm: React.Dispatch<React.SetStateAction<SolicitudForm>>,
  _authUser?: AuthUserLike | null,
  tramite?: Tramite | null
) => {
  // const userRepository = React.useMemo(() => new UserCustomerRepositoryImpl(), []);
  // const getProfileUseCase = React.useMemo(
  //   () => new GetProfileUseCase(userRepository),
  //   [userRepository]
  // );
  const parishUseCase = React.useMemo(
    () => new GetParishUseCase(new GetParishRepositoryImpl(apiClient)),
    []
  );
  /*
  React.useEffect(() => {
    const loadProfileData = async () => {
      if (!authUser?.username) return;
      try {
        const userData = await getProfileUseCase.execute(authUser.username);
        if (!userData) return;

        const isCompany = !!userData.company;
        setForm((prev) => ({
          ...prev,
          cedula: prev.cedula || userData.username || '',
          nombres: prev.nombres || (isCompany ? userData.company?.businessName : userData.person?.firstName) || '',
          apellidos: prev.apellidos || (isCompany ? userData.company?.commercialName : userData.person?.lastName) || '',
          email: prev.email || userData.email || '',
          telefono: prev.telefono || (isCompany ? (userData.company?.phones?.[0]?.numero ?? '') : (userData.person?.phones?.[0]?.numero ?? '')) || '',
          tipo_persona: isCompany ? 'JURIDICA' : 'NATURAL'
        }));
      } catch (error) {
        console.error('Error fetching user profile for auto-population:', error);
      }
    };

    loadProfileData();
  }, [authUser?.username, getProfileUseCase, setForm]);
  */

  React.useEffect(() => {
    if (!tramite || Object.keys(form.detalles).length > 0) return;

    if (
      tramite.categoria === 'nueva_acometida' ||
      tramite.categoria === 'alcantarillado'
    ) {
      setForm((prev) => ({
        ...prev,
        detalles: { ...INITIAL_FORM_ACOMETIDA }
      }));
      return;
    }

    if (tramite.categoria === 'suspension') {
      setForm((prev) => ({
        ...prev,
        detalles: { ...INITIAL_FORM_SUSPENSION }
      }));
    }
  }, [tramite, form.detalles, setForm]);

  React.useEffect(() => {
    const parishId = form.detalles?.parishId;
    if (!parishId || parishId === 'NO_ASIGNADO' || parishId === 'no_asignado' || parishId === 'no asignado') return;

    const syncParishName = async () => {
      try {
        const parish = await parishUseCase.getParishById(parishId);
        if (parish?.parishName && parish.parishName !== form.detalles?.parroquia) {
          setForm((prev) => ({
            ...prev,
            detalles: {
              ...prev.detalles,
              parroquia: parish.parishName
            }
          }));
        }
      } catch (error) {
        console.error('Error syncing selected parish name:', error);
      }
    };

    syncParishName();
  }, [form.detalles?.parishId, form.detalles?.parroquia, parishUseCase, setForm]);
};
