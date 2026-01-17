"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { name: 'Egészséges', value: 45, color: '#0ea5e9' }, // sky blue
    { name: 'MCI Észlelve', value: 30, color: '#f43f5e' }, // rose
    { name: 'Kizárva', value: 15, color: '#cbd5e1' }, // slate
    { name: 'Bevonva', value: 10, color: '#10b981' }, // emerald
];

export function OutcomePieChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Szűrési Eredmények</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
