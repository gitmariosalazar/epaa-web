import { TbClock24 } from 'react-icons/tb';
import { MdAssignmentAdd, MdReport, MdAdminPanelSettings, MdOutlineContentPasteSearch } from 'react-icons/md';
import { IoMdPhotos } from 'react-icons/io';
import { TiThList } from 'react-icons/ti';
import { FaEdit } from 'react-icons/fa';
import { ClipboardList, LucideCalendarSync } from 'lucide-react';
import type { NavSection } from '@/shared/domain/models/Navigation';
import { RiListCheck3 } from 'react-icons/ri';

export const getLecturasSection = (): NavSection => ({
  title: 'Lecturas',
  hideTitle: true,
  items: [
    {
      icon: <TbClock24 size={20} />,
      label: 'Lecturas',
      subItems: [
        {
          icon: <RiListCheck3 size={18} />,
          label: 'Gestión',
          subItems: [
            {
              icon: <MdAssignmentAdd size={18} />,
              label: 'Agregar Lectura',
              to: '/readings/add'
            },
            {
              icon: <FaEdit size={18} />,
              label: 'Actualizar Lectura',
              to: '/readings/update'
            },
            {
              icon: <IoMdPhotos size={18} />,
              label: 'Foto Lecturas',
              to: '/readings/images'
            }
          ]
        },
        {
          icon: <MdOutlineContentPasteSearch size={18} />,
          label: 'Consultas',
          subItems: [
            {
              icon: <TiThList size={18} />,
              label: 'Lista de Lecturas',
              to: '/readings/list'
            },
            {
              icon: <ClipboardList size={18} />,
              label: 'Auditoría de Lecturas',
              to: '/readings/audit'
            },
            {
              icon: <MdReport size={18} />,
              label: 'Reportes de Lecturas',
              to: '/readings/report'
            }
          ]
        },
        {
          icon: <MdAdminPanelSettings size={18} />,
          label: 'Opciones Avanzadas',
          subItems: [
            {
              icon: <TiThList size={18} />,
              label: 'Lista de Lectura',
              to: '/readings/report-errors'
            },
            {
              icon: <FaEdit size={18} />,
              label: 'Actualización Avanzada',
              to: '/readings/advanced-update'
            },
            {
              icon: <LucideCalendarSync size={18} />,
              label: 'Sincronización de Lecturas',
              to: '/readings/reconciliation'
            }
          ]
        }
      ]
    }
  ]
});
