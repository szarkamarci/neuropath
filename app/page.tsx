"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { Card } from '@/components/ui/card';
import { UserRole } from '@/types';
import { User, Activity, Building2, Stethoscope, Pill, HeartPulse } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { setRole } = useUserStore();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    if (role === 'doctor') router.push('/doctor');
    else if (role === 'pharma') router.push('/pharma');
    else router.push('/patient');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">NeuroPath</h1>
        </div>
        <p className="text-xl text-slate-500">
          Válassza ki a felhasználói szerepkört a belépéshez
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Patient Card */}
        <RoleCard
          icon={<HeartPulse className="w-16 h-16 text-rose-500" />}
          title="Páciens Vagyok"
          description="Szeretném elvégezni a memóriatesztet."
          color="hover:border-rose-500 hover:shadow-rose-100"
          onClick={() => handleRoleSelect('patient')}
        />

        {/* Doctor Card */}
        <RoleCard
          icon={<Stethoscope className="w-16 h-16 text-emerald-600" />}
          title="Orvos Vagyok"
          description="Beteglista kezelése és új szűrések indítása."
          color="hover:border-emerald-500 hover:shadow-emerald-100"
          onClick={() => handleRoleSelect('doctor')}
        />

        {/* Pharma Card */}
        <RoleCard
          icon={<Building2 className="w-16 h-16 text-indigo-600" />}
          title="Pharma Partner"
          description="Vizsgálati adatok és toborzási statisztikák."
          color="hover:border-indigo-500 hover:shadow-indigo-100"
          onClick={() => handleRoleSelect('pharma')}
        />
      </div>
    </div>
  );
}

function RoleCard({ icon, title, description, onClick, color }: { icon: React.ReactNode, title: string, description: string, onClick: () => void, color: string }) {
  return (
    <Card
      className={`p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-transparent ${color}`}
      onClick={onClick}
    >
      <div className="mb-6 bg-slate-50 p-6 rounded-full">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
      <p className="text-slate-500">{description}</p>
    </Card>
  );
}
