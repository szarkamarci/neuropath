"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { patientService } from '@/lib/services/patientService';
import { Patient } from '@/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus, User } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';

export default function DoctorDashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const { setRole } = useUserStore();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await patientService.getPatients();
                setPatients(data);
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const getStatusColor = (status: Patient['status']) => {
        switch (status) {
            case 'MCI Detected': return 'destructive'; // Red
            case 'Healthy': return 'secondary'; // Slate/Green-ish depending on theme, 'secondary' is usually gray. Let's use custom class if needed but badge variants are limited.
            case 'Enrolled': return 'default'; // Primary/Black
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Beteglista</h1>
                    <p className="text-slate-500">Kezelje a szűrési előzményeket és a bevont betegeket.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setRole('patient');
                            window.location.href = '/patient';
                        }}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Kioszk Mód
                    </Button>
                    <Link href="/doctor/screening/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Új Szűrés Indítása
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Név</TableHead>
                            <TableHead>Kor</TableHead>
                            <TableHead>Szűrés Dátuma</TableHead>
                            <TableHead>Kockázati Szint</TableHead>
                            <TableHead>Státusz</TableHead>
                            <TableHead className="text-right">Művelet</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                    Adatok betöltése...
                                </TableCell>
                            </TableRow>
                        ) : patients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                                    Nincs megjeleníthető adat.
                                </TableCell>
                            </TableRow>
                        ) : (
                            patients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>{patient.age} év</TableCell>
                                    <TableCell>{patient.screeningDate}</TableCell>
                                    <TableCell>
                                        <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${patient.riskScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${patient.riskScore}%` }}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(patient.status) as any}>
                                            {patient.status === 'MCI Detected' ? 'MCI Észlelve' :
                                                patient.status === 'Healthy' ? 'Egészséges' :
                                                    patient.status === 'Enrolled' ? 'Bevonva' :
                                                        'Függőben'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Részletek</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
