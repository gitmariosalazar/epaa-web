import { ClipboardList, Users, XCircle, Heart } from 'lucide-react';
import { MdOutlineWaterDrop } from 'react-icons/md';
import { FaWheelchair } from 'react-icons/fa';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { generateTramiteMenu } from '../builders/tramiteMenuBuilder';

export const getTramitesSection = (): NavSection => ({
  title: 'Trámites',
  hideTitle: true,
  items: [
    {
      icon: <ClipboardList size={20} />,
      label: 'Trámites',
      subItems: [
        // Acometidas: fully operational
        generateTramiteMenu(<MdOutlineWaterDrop size={18} />, 'Acometidas', 'nueva_acometida', { general: '/procedures/acometidas' }, false),
        // Coming soon modules: only show placeholder page
        generateTramiteMenu(<Users size={18} />, 'Cambio de Titular', 'cambio_titular', { general: '/procedures/cambio-titular' }, true),
        generateTramiteMenu(<XCircle size={18} />, 'Suspensión', 'suspension_servicio', { general: '/procedures/suspension' }, true),
        generateTramiteMenu(<Heart size={18} />, 'Tercera Edad', 'beneficio_tercera_edad', { general: '/procedures/tercera-edad' }, true),
        generateTramiteMenu(<FaWheelchair size={16} />, 'Discapacidad', 'beneficio_discapacidad', { general: '/procedures/discapacidad' }, true)
      ]
    }
  ]
});
