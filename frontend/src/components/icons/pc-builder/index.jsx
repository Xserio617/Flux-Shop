// PC Builder İkonları
export { default as CpuIcon } from './CpuIcon';
export { default as MotherboardIcon } from './MotherboardIcon';
export { default as GpuIcon } from './GpuIcon';
export { default as RamIcon } from './RamIcon';
export { default as SsdIcon } from './SsdIcon';
export { default as PsuIcon } from './PsuIcon';
export { default as CaseIcon } from './CaseIcon';
export { default as CoolerIcon } from './CoolerIcon';
export { default as FanIcon } from './FanIcon';

// İkon slug'a göre mapping
import CpuIcon from './CpuIcon';
import MotherboardIcon from './MotherboardIcon';
import GpuIcon from './GpuIcon';
import RamIcon from './RamIcon';
import SsdIcon from './SsdIcon';
import PsuIcon from './PsuIcon';
import CaseIcon from './CaseIcon';
import CoolerIcon from './CoolerIcon';
import FanIcon from './FanIcon';

export const getComponentIcon = (iconSlug, size = 24, color = "currentColor") => {
  const icons = {
    'cpu': <CpuIcon size={size} color={color} />,
    'islemci': <CpuIcon size={size} color={color} />,
    'motherboard': <MotherboardIcon size={size} color={color} />,
    'anakart': <MotherboardIcon size={size} color={color} />,
    'gpu': <GpuIcon size={size} color={color} />,
    'ekran-karti': <GpuIcon size={size} color={color} />,
    'ram': <RamIcon size={size} color={color} />,
    'ssd': <SsdIcon size={size} color={color} />,
    'depolama': <SsdIcon size={size} color={color} />,
    'psu': <PsuIcon size={size} color={color} />,
    'guc-kaynagi': <PsuIcon size={size} color={color} />,
    'case': <CaseIcon size={size} color={color} />,
    'kasa': <CaseIcon size={size} color={color} />,
    'cooler': <CoolerIcon size={size} color={color} />,
    'sogutucu': <CoolerIcon size={size} color={color} />,
    'fan': <FanIcon size={size} color={color} />,
  };
  
  return icons[iconSlug] || <CpuIcon size={size} color={color} />;
};
