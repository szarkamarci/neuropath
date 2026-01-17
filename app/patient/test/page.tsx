"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientService } from '@/lib/services/patientService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, Check, Timer } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';

export default function PatientTestPage() {
    const router = useRouter();
    const [step, setStep] = useState(0); // Start at 0 for GP Selection
    const [formData, setFormData] = useState({
        gpId: '', // GP Selection
        name: '',
        age: '',
        cognitiveScore: ''
    });
    const [submitted, setSubmitted] = useState(false);

    // Use a simpler mock scoring for self-test (e.g. 5 questions)
    // For prototype we just use the same simple input but styled differently

    const handleSubmit = async () => {
        try {
            // 1. Submit Screening
            const screeningResult = await patientService.submitScreening({
                age: parseInt(formData.age),
                cognitiveScore: parseInt(formData.cognitiveScore) || 28 // Default good score if skipped/mocked
            });

            // 2. Add Patient to Database
            await patientService.addPatient({
                name: formData.name,
                age: parseInt(formData.age),
                riskScore: screeningResult.score
            });

            setSubmitted(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFinish = () => {
        const { useUserStore } = require('@/lib/store/userStore');
        useUserStore.getState().setRole('doctor');
        window.location.href = '/doctor';
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-in fade-in duration-700">
                <div className="bg-emerald-100 p-8 rounded-full mb-8">
                    <Check className="w-20 h-20 text-emerald-600" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Köszönjük!</h1>
                <p className="text-xl text-slate-600 max-w-lg mb-12">
                    A teszt kiértékelése megtörtént. Kérjük, adja vissza a tabletet az orvosának.
                </p>
                <Button onClick={handleFinish} variant="outline" size="lg" className="text-slate-400 border-slate-200">
                    (Orvos) Vissza a Főoldalra
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">

            {/* Step Indicator */}
            <div className="flex justify-between mb-12 px-8">
                <div className={`text-sm font-bold uppercase tracking-wider ${step >= 0 ? 'text-emerald-600' : 'text-slate-300'}`}>1. Orvos</div>
                <div className={`text-sm font-bold uppercase tracking-wider ${step >= 1 ? 'text-emerald-600' : 'text-slate-300'}`}>2. Adatok</div>
                <div className={`text-sm font-bold uppercase tracking-wider ${step >= 2 ? 'text-emerald-600' : 'text-slate-300'}`}>3. Teszt</div>
                <div className={`text-sm font-bold uppercase tracking-wider ${step >= 3 ? 'text-emerald-600' : 'text-slate-300'}`}>4. Kész</div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                {step === 0 && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Válassza ki Háziorvosát</h2>
                        <p className="text-lg text-slate-500 mb-8">Kérjük, jelölje ki, kihez tartozik.</p>

                        <div className="grid gap-4">
                            {['Dr. Kovács István', 'Dr. Szabó Anna', 'Dr. Tóth Péter'].map((gp) => (
                                <Button
                                    key={gp}
                                    variant={formData.gpId === gp ? 'default' : 'outline'}
                                    className={`h-auto py-6 text-xl justify-start ${formData.gpId === gp ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:border-emerald-500'}`}
                                    onClick={() => setFormData({ ...formData, gpId: gp })}
                                >
                                    {formData.gpId === gp && <Check className="mr-3 w-6 h-6" />}
                                    {gp}
                                </Button>
                            ))}
                        </div>

                        <div className="pt-8">
                            <Button
                                className="w-full text-xl py-8 h-auto bg-emerald-600 hover:bg-emerald-700"
                                disabled={!formData.gpId}
                                onClick={() => setStep(1)}
                            >
                                Tovább <ArrowRight className="ml-3 w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Személyes Adatok</h2>
                        <p className="text-lg text-slate-500 mb-8">Kérjük, adja meg nevét és életkorát a kezdéshez.</p>

                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="name" className="text-lg mb-2 block">Teljes Név</Label>
                                <Input
                                    id="name"
                                    className="text-xl p-6 h-auto"
                                    placeholder="Pl. Nagy Éva"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="age" className="text-lg mb-2 block">Életkor</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    className="text-xl p-6 h-auto"
                                    placeholder="72"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button
                                className="w-full text-xl py-8 h-auto bg-emerald-600 hover:bg-emerald-700"
                                disabled={!formData.name || !formData.age}
                                onClick={() => setStep(2)}
                            >
                                Tovább <ArrowRight className="ml-3 w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Memória Teszt</h2>
                        <p className="text-lg text-slate-500 mb-8">Ebben a demóban csak egy egyszerű pontszámot szimulálunk.</p>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <Timer className="w-8 h-8 text-slate-400" />
                                <p className="text-slate-600">Képzeljen el itt egy 5 perces interaktív tesztet (Szómemória, Óra rajzolás, stb.)</p>
                            </div>

                            <Label htmlFor="score" className="text-lg mb-2 block">Szimulált Pontszám (0-30)</Label>
                            <Input
                                id="score"
                                type="number"
                                max="30"
                                className="text-xl p-6 h-auto"
                                placeholder="28"
                                value={formData.cognitiveScore}
                                onChange={(e) => setFormData({ ...formData, cognitiveScore: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full text-xl py-8 h-auto bg-emerald-600 hover:bg-emerald-700"
                                disabled={!formData.cognitiveScore}
                                onClick={handleSubmit}
                            >
                                Teszt Befejezése
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
