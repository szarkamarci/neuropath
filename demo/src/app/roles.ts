import { BrainCircuit, ChartColumn, Smartphone, Stethoscope, type LucideIcon } from 'lucide-react';
import { t } from '../strings';

export type RoleId = 'gp' | 'specialist' | 'patient' | 'research';

export interface RoleDef {
  id: RoleId;
  path: string;
  icon: LucideIcon;
  /** Build phase in which the view is implemented. */
  phase: number;
}

// Order matters: it is the role-switcher order and the 1–4 shortcut order.
export const roles: RoleDef[] = [
  { id: 'gp', path: '/gp', icon: Stethoscope, phase: 2 },
  { id: 'specialist', path: '/specialist', icon: BrainCircuit, phase: 3 },
  { id: 'patient', path: '/patient', icon: Smartphone, phase: 3 },
  { id: 'research', path: '/research', icon: ChartColumn, phase: 4 },
];

export function roleCopy(id: RoleId) {
  return t.roles[id];
}
