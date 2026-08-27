import { BarChart3 } from 'lucide-react';
import {
  IconAccounting,
  IconIncomes,
  IconOverduePayments,
  IconPayments,
  IconPendingBills
} from '@/shared/presentation/components/icons/custom-icons';
import type { NavSection } from '@/shared/domain/models/Navigation';

export const getContabilidadSection = (): NavSection => ({
  title: 'Contabilidad',
  hideTitle: true,
  items: [
    {
      icon: <IconAccounting size={20} />,
      label: 'Contabilidad',
      subItems: [
        {
          icon: <IconPayments size={18} />,
          label: 'Pagos',
          to: '/accounting'
        },
        {
          icon: <BarChart3 size={18} />,
          label: 'Reportes de Ingreso',
          to: '/accounting/entry-data'
        },
        {
          icon: <IconOverduePayments />,
          label: 'Cartera Vencida',
          to: '/accounting/overdue'
        },
        {
          icon: <IconIncomes />,
          label: 'Ingresos General',
          to: '/accounting/general-collection'
        },
        {
          icon: <IconPayments size={18} />,
          label: 'Convenios',
          to: '/accounting/agreements'
        },
        {
          icon: <IconPendingBills size={18} />,
          label: 'Consulta de Comprobantes',
          to: '/accounting/payment-receipts'
        },
      ]
    }
  ]
});
