import { Waves, type LucideIcon } from "lucide-react";
import { type IconType } from "react-icons";
import "./icons-water.css";
import { IoWater } from "react-icons/io5";
import { FaRoute } from "react-icons/fa";

// 1. Definimos la interfaz (tipo) para los elementos del servicio
export interface ServiceItem {
  id: string;
  name: string;
  icon: LucideIcon | IconType;
  themeClass: string;
}

// 2. Opcional pero recomendado: tipar el array
export const SERVICES: ServiceItem[] = [
  {
    id: "potable",
    name: "Agua Potable",
    icon: IoWater,
    themeClass: "service-potable",
  },
  {
    id: "alcantarillado",
    name: "Alcantarillado",
    icon: Waves,
    themeClass: "service-alcantarillado",
  },
  {
    id: "inspeccion",
    name: "Inspección en Ruta",
    icon: FaRoute,
    themeClass: "service-inspeccion",
  },
];

// 3. Tipamos las props del componente
export function ServiceCard({ item }: { item: ServiceItem }) {
  const IconComponent = item.icon;

  return (
    <div
      className={`service-icon-container ${item.themeClass}`}
      style={{ gap: '0.75rem', padding: '1rem', width: 'fit-content', borderRadius: '0.75rem' }}
    >
      <IconComponent className="service-icon-svg" style={{ width: '1.5rem', height: '1.5rem' }} />
      <span style={{ fontWeight: 600 }}>{item.name}</span>
    </div>
  );
}
