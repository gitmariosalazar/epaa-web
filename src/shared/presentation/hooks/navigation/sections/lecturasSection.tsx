import { TbClock24 } from 'react-icons/tb';
import { MdAssignmentAdd } from 'react-icons/md';
import { IoMdPhotos } from 'react-icons/io';
import { TiThList } from 'react-icons/ti';
import { FaEdit } from 'react-icons/fa';
import { ClipboardList } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getLecturasSection = (): NavSection => ({
  title: 'Lecturas',
  hideTitle: true,
  items: [
    {
      icon: <TbClock24 size={20} />,
      label: 'Lecturas',
      subItems: [
        {
          icon: <MdAssignmentAdd size={18} />,
          label: 'Agregar Lectura',
          to: '/readings/add'
        },
        {
          icon: <IoMdPhotos size={18} />,
          label: 'Foto Lecturas',
          to: '/readings/images'
        },
        {
          icon: <TiThList size={18} />,
          label: 'Lecturas',
          to: '/readings/list'
        },
        {
          icon: <FaEdit size={18} />,
          label: 'Actualizar Lectura',
          to: '/readings/update'
        },
        {
          icon: <ClipboardList size={18} />,
          label: 'Auditoría de Lecturas',
          to: '/readings/audit'
        }
      ]
    }
  ]
});
