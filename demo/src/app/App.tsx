import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { GpPanelPage } from '../features/gp/GpPanelPage';
import { PatientDetailPage } from '../features/gp/PatientDetailPage';
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
          <Route path="/gp" element={<GpPanelPage />} />
          <Route path="/gp/patient/:patientId" element={<PatientDetailPage />} />
          {roles
            .filter((role) => role.id !== 'gp')
            .map((role) => (
              <Route key={role.id} path={role.path} element={<RolePlaceholderPage role={role} />} />
            ))}
          <Route path="/design" element={<DesignSystemPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
