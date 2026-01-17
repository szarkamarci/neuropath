"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { patientService } from '@/lib/services/patientService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Check, ChevronRight, User } from 'lucide-react';

export default function ScreeningPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        cognitiveScore: ''
    });
    const [result, setResult] = useState<{ status: string; score: number } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleNext = () => {
        if (step === 1 && (!formData.name || !formData.age)) return; // Validation
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Submit Screening
            const screeningResult = await patientService.submitScreening({
                age: parseInt(formData.age),
                cognitiveScore: parseInt(formData.cognitiveScore)
            });
            setResult({ status: screeningResult.status, score: screeningResult.score });

            // 2. Add Patient to Database
            await patientService.addPatient({
                name: formData.name,
                age: parseInt(formData.age),
                riskScore: screeningResult.score
            });

            setStep(3); // Result Step
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            {/* Stepper Indicator */}
            <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                        <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold border-2
              ${step === s ? 'border-emerald-600 text-emerald-600 bg-emerald-50' :
                                step > s ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 text-slate-400'}
            `}>
                            {step > s ? <Check className="h-5 w-5" /> : s}
                        </div>
                        {s < 3 && <div className={`w-24 h-1 bg-slate-200 mx-2 ${step > s ? 'bg-emerald-600' : ''}`} />}
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Beteg Adatai"}
                        {step === 2 && "Kognitív Teszt"}
                        {step === 3 && "Eredmény"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Kérjük adja meg a páciens alapvető demográfiai adatait."}
                        {step === 2 && "Végezze el a gyorstesztet és rögzítse a pontszámot."}
                        {step === 3 && "A szűrés kiértékelése megtörtént."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="name">Teljes Név</Label>
                                <Input
                                    id="name"
                                    placeholder="pl. Kovács János"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="age">Életkor</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="72"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg border">
                                <h4 className="font-semibold mb-2">Mini-Mental State Examination (MMSE)</h4>
                                <p className="text-sm text-slate-500 mb-4">Végezze el a papíralapú tesztet, majd írja be az összesített pontszámot (0-30).</p>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="score">Pontszám</Label>
                                    <Input
                                        id="score"
                                        type="number"
                                        max="30"
                                        placeholder="24"
                                        value={formData.cognitiveScore}
                                        onChange={(e) => setFormData({ ...formData, cognitiveScore: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && result && (
                        <div className="text-center py-6">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${result.status === 'MCI Detected' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                <Activity className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">
                                {result.status === 'MCI Detected' ? 'Kockázat Észlelve' : 'Negatív Eredmény'}
                            </h3>
                            <p className="text-slate-500 mb-6">
                                Mért pontszám: <span className="font-bold text-slate-900">{result.score}/30</span>
                            </p>
                            {result.status === 'MCI Detected' && (
                                <div className="bg-rose-50 border border-rose-200 rounded p-3 text-sm text-rose-700">
                                    A beteg állapota további kivizsgálást igényel.
                                </div>
                            )}
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between">
                    {step < 3 ? (
                        <>
                            {step > 1 ? (
                                <Button variant="outline" onClick={() => setStep(step - 1)}>Vissza</Button>
                            ) : (
                                <Button variant="ghost" onClick={() => router.push('/doctor')}>Mégse</Button>
                            )}

                            {step === 2 ? (
                                <Button onClick={handleSubmit} disabled={submitting || !formData.cognitiveScore}>
                                    {submitting ? "Kiértékelés..." : "Kiértékelés Rögzítése"}
                                </Button>
                            ) : (
                                <Button onClick={handleNext} disabled={!formData.name || !formData.age}>
                                    Tovább <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </>
                    ) : (
                        <Button className="w-full" onClick={() => router.push('/doctor')}>
                            Vissza a Beteglistához
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
