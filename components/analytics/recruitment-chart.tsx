"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { name: 'Jan', screens: 12, enrolled: 4 },
    { name: 'Feb', screens: 19, enrolled: 7 },
    { name: 'Mar', screens: 25, enrolled: 11 },
    { name: 'Apr', screens: 42, enrolled: 18 },
    { name: 'May', screens: 58, enrolled: 25 },
    { name: 'Jun', screens: 80, enrolled: 32 },
];

export function RecruitmentChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Toborzási Sebesség</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="screens" name="Szűrések" stroke="#cbd5e1" strokeWidth={2} />
                            <Line type="monotone" dataKey="enrolled" name="Bevonva" stroke="#059669" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
