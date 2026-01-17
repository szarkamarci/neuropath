"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro } from 'lucide-react';
import { patientService } from '@/lib/services/patientService';

export function ROICalculator() {
    const [stats, setStats] = useState({ total: 0, mci: 0, enrolled: 0, healthy: 0 });
    const COST_SAVING_PER_PATIENT = 15000; // €15k approx saving per faster recruitment

    useEffect(() => {
        patientService.getStats().then(setStats);
    }, []);

    const totalSavings = stats.enrolled * COST_SAVING_PER_PATIENT;

    return (
        <Card className="bg-slate-900 text-white border-none">
            <CardHeader>
                <CardTitle className="text-slate-200 text-sm uppercase tracking-wider">
                    Becsült Megtakarítás
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400">
                        <Euro className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-4xl font-bold">
                            €{totalSavings.toLocaleString()}
                        </div>
                        <div className="text-emerald-400 text-sm font-medium">
                            +€{COST_SAVING_PER_PATIENT.toLocaleString()} per beteg
                        </div>
                    </div>
                </div>
                <p className="text-slate-400 text-xs mt-4">
                    A hagyományos kórházi toborzáshoz képest számított költségelőny a jelenlegi bevonási ráta alapján.
                </p>
            </CardContent>
        </Card>
    );
}
