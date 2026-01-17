"use client";

import React from 'react';
import { RecruitmentChart } from '@/components/analytics/recruitment-chart';
import { OutcomePieChart } from '@/components/analytics/outcome-pie-chart';
import { ROICalculator } from '@/components/analytics/roi-calculator';

export default function PharmaDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Műszerfal</h1>
                <p className="text-slate-500">Valós idejű betekintés a vizsgálati toborzás státuszába.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Stats can go here if needed, ROI is one of them */}
                <ROICalculator />

                {/* Placeholder for other KPIs */}
                <div className="bg-white p-6 rounded-lg border shadow-sm md:col-span-2 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="text-sm text-slate-500">Aktív Vizsgálóhelyek</div>
                            <div className="text-3xl font-bold">12</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Szűrt Betegek / Hét</div>
                            <div className="text-3xl font-bold">45</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500">Konverziós Ráta</div>
                            <div className="text-3xl font-bold text-emerald-600">18.5%</div>
                        </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[18.5%]"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecruitmentChart />
                <OutcomePieChart />
            </div>
        </div>
    );
}
