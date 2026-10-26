import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GuideController } from '../../features/guide/GuideController';
import { GuideOverlay } from '../../features/guide/GuideOverlay';
import { DisclaimerBar } from './DisclaimerBar';
import { Toast } from './Toast';
import { TopBar } from './TopBar';

export function AppShell() {
  const { pathname } = useLocation();

  // Hash navigation keeps the previous scroll offset; every view should open at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      {/* 72px top bar + 36px disclaimer bar */}
      <main key={pathname} className="animate-fade-in pt-[72px] pb-9">
        <Outlet />
      </main>
      <DisclaimerBar />
      <Toast />
      <GuideController />
      <GuideOverlay />
    </div>
  );
}
