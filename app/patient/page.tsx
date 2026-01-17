"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ClipboardCheck } from 'lucide-react';

export default function PatientWelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <div className="bg-emerald-100 p-6 rounded-full mb-8">
                <ClipboardCheck className="w-16 h-16 text-emerald-600" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Üdvözöljük a NeuroPath Szűrésen
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mb-12">
                Kérjük, válaszoljon néhány egyszerű kérdésre. A teszt körülbelül 2 percet vesz igénybe, és segít orvosának felmérni a memória állapotát.
            </p>

            <Link href="/patient/test">
                <Button size="lg" className="text-xl px-12 py-8 bg-emerald-600 hover:bg-emerald-700 h-auto rounded-xl shadow-lg transition-transform active:scale-95">
                    Teszt Indítása <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
            </Link>

            <p className="mt-8 text-sm text-slate-400">
                Minden adatot bizalmasan kezelünk.
            </p>
        </div>
    );
}
