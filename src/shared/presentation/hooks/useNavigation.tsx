// ============================================================
// Navigation Hook — WP Management Portal
// Defines the sidebar navigation sections for the management portal.
// Clean Architecture: Delegated configuration to modular files.
// ============================================================

import { useTranslation } from 'react-i18next';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { getGeneralSection } from './navigation/sections/generalSection';
import { getAdministrationSection } from './navigation/sections/administrationSection';
import { getCustomersSection } from './navigation/sections/customersSection';
import { getCatastrosSection } from './navigation/sections/catastrosSection';
import { getContabilidadSection } from './navigation/sections/contabilidadSection';
import { getLecturasSection } from './navigation/sections/lecturasSection';
import { getRecoleccionSection } from './navigation/sections/recoleccionSection';
import { getPropiedadesSection } from './navigation/sections/propiedadesSection';
import { getTramitesSection } from './navigation/sections/tramitesSection';

export const useNavigation = (): NavSection[] => {
  const { t } = useTranslation();

  return [
    getGeneralSection(t),
    getAdministrationSection(t),
    getCustomersSection(t),
    getCatastrosSection(t),
    getContabilidadSection(),
    getLecturasSection(),
    getRecoleccionSection(),
    getPropiedadesSection(t),
    getTramitesSection(),
  ];
};
