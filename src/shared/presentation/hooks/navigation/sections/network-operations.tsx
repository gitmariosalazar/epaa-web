import type { NavSection } from "@/shared/domain/models/Navigation";
import { Map } from "lucide-react";
import { MdOutlineCable } from "react-icons/md";

export const getNetworkOperationsSection = (): NavSection => ({
  title: 'Operaciones de Red',
  hideTitle: true,
  items: [
    {
      icon: <MdOutlineCable size={20} />,
      label: 'Operaciones de Red',
      subItems: [
        {
          icon: <Map size={18} />,
          label: 'Mapa de Infraestructura',
          to: '/network-operations/scada'
        }
      ]
    }
  ]
});