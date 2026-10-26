import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DesignSystemPage } from '../pages/DesignSystemPage';
import { RolePlaceholderPage } from '../pages/RolePlaceholderPage';
import { StartPage } from '../pages/StartPage';
import { roles } from './roles';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<StartPage />} />
          {roles.map((role) => (
            <Route key={role.id} path={role.path} element={<RolePlaceholderPage role={role} />} />
          ))}
          <Route path="/design" element={<DesignSystemPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
