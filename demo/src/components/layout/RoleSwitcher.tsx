import { NavLink } from 'react-router-dom';
import { roleCopy, roles } from '../../app/roles';
import { cn } from '../../lib/cn';
import { t } from '../../strings';

export function RoleSwitcher() {
  return (
    <nav
      aria-label={t.nav.rolesLabel}
      className="flex items-center gap-1 rounded-full border border-outline-variant/40 bg-surface-container-low p-1"
    >
      {roles.map(({ id, path, icon: Icon }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            cn(
              'flex h-9 items-center gap-2 rounded-full px-4 text-label-lg whitespace-nowrap transition-all duration-150',
              isActive ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:text-secondary',
            )
          }
        >
          <Icon className="size-4" strokeWidth={2} />
          {roleCopy(id).label}
        </NavLink>
      ))}
    </nav>
  );
}
