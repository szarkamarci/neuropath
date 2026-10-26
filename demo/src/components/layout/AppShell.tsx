import { Outlet, useLocation } from 'react-router-dom';
import { DisclaimerBar } from './DisclaimerBar';
import { Toast } from './Toast';
import { TopBar } from './TopBar';

export function AppShell() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      {/* 72px top bar + 36px disclaimer bar */}
      <main key={pathname} className="animate-fade-in pt-[72px] pb-9">
        <Outlet />
      </main>
      <DisclaimerBar />
      <Toast />
    </div>
  );
}
