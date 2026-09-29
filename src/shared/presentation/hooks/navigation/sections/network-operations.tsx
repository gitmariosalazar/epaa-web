import type { NavSection } from "@/shared/domain/models/Navigation";
import { BarChart3, LayoutDashboard, Map, ShieldAlert } from "lucide-react";
import { MdOutlineCable } from "react-icons/md";
import { TiThList } from "react-icons/ti";


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
          label: 'Dashboard SCADA/GIS',
          to: '/network-operations/scada'
        }
      ]
    }
  ]
});