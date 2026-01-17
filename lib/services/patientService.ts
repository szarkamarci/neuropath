import { Patient, ScreeningResult } from '@/types';

// Mock Data
let MOCK_PATIENTS: Patient[] = [
    { id: '1', name: 'Kovács János', age: 72, riskScore: 45, status: 'Pending', screeningDate: '2023-10-25' },
    { id: '2', name: 'Nagy Éva', age: 68, riskScore: 72, status: 'MCI Detected', screeningDate: '2023-10-26' },
    { id: '3', name: 'Szabó Péter', age: 75, riskScore: 30, status: 'Healthy', screeningDate: '2023-10-24' },
    { id: '4', name: 'Varga Anna', age: 70, riskScore: 85, status: 'Enrolled', screeningDate: '2023-10-20' },
    { id: '5', name: 'Tóth Gábor', age: 69, riskScore: 60, status: 'MCI Detected', screeningDate: '2023-10-27' },
];

export const patientService = {
    getPatients: async (): Promise<Patient[]> => {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
        return [...MOCK_PATIENTS];
    },

    addPatient: async (patient: Omit<Patient, 'id' | 'status' | 'screeningDate'>): Promise<Patient> => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newPatient: Patient = {
            ...patient,
            id: Math.random().toString(36).substr(2, 9),
            status: 'Pending',
            screeningDate: new Date().toISOString().split('T')[0],
            riskScore: 0 // Default
        };
        MOCK_PATIENTS.push(newPatient);
        return newPatient;
    },

    updatePatientStatus: async (id: string, status: Patient['status'], riskScore?: number): Promise<void> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        MOCK_PATIENTS = MOCK_PATIENTS.map(p =>
            p.id === id ? { ...p, status, ...(riskScore !== undefined && { riskScore }) } : p
        );
    },

    submitScreening: async (data: { age: number; cognitiveScore: number }): Promise<ScreeningResult> => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Simple logic: lower cognitive score = higher risk
        // Suppose cognitive score is out of 30 (MMSE-like)
        // < 24 indicates possible MCI/Dementia

        const isMCI = data.cognitiveScore < 24;
        return {
            score: data.cognitiveScore,
            status: isMCI ? 'MCI Detected' : 'Healthy'
        };
    },

    getStats: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const total = MOCK_PATIENTS.length;
        const mci = MOCK_PATIENTS.filter(p => p.status === 'MCI Detected').length;
        const enrolled = MOCK_PATIENTS.filter(p => p.status === 'Enrolled').length;
        const healthy = MOCK_PATIENTS.filter(p => p.status === 'Healthy').length;

        return { total, mci, enrolled, healthy };
    }
};
