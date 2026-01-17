"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { Button } from '@/components/ui/button';
import { Activity, Users, BarChart3, Pill, LayoutDashboard, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { role, toggleRole } = useUserStore();

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
                    <Activity className="h-6 w-6 text-emerald-600" />
                    <span>NeuroPath</span>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen sticky top-0 h-screen">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2 font-bold text-2xl text-slate-800">
                        <Activity className="h-8 w-8 text-emerald-600" />
                        <span>NeuroPath</span>
                    </div>
                    <div className="mt-2 text-xs font-medium px-2 py-1 bg-slate-100 rounded inline-block text-slate-500">
                        v0.1.0 Beta
                    </div>
                </div>

                <Sidebar className="flex-1 py-6" />

                <div className="p-4 border-t bg-slate-50">
                    <div className="mb-2 text-xs uppercase text-slate-400 font-bold tracking-wider">Dev Tools</div>
                    <Button
                        variant={role === 'doctor' ? "default" : "secondary"}
                        className={cn("w-full mb-2", role === 'pharma' && "bg-rose-600 hover:bg-rose-700 text-white")}
                        onClick={toggleRole}
                    >
                        {role === 'doctor' ? 'Orvos Mód' : 'Pharma Mód'}
                    </Button>
                    <div className="text-xs text-center text-slate-400">
                        Switch Role
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { role } = useUserStore();

    const doctorLinks = [
        { href: '/doctor', label: 'Beteglista', icon: Users },
        { href: '/doctor/screening/new', label: 'Új Szűrés', icon: Activity },
    ];

    const pharmaLinks = [
        { href: '/pharma', label: 'Műszerfal', icon: LayoutDashboard },
        { href: '/pharma/analytics', label: 'Elemzések', icon: BarChart3 },
        { href: '/pharma/sites', label: 'Vizsgálóhelyek', icon: Pill },
    ];

    const links = role === 'doctor' ? doctorLinks : pharmaLinks;

    return (
        <div className={cn("px-3", className)}>
            <div className="space-y-1">
                {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            variant={pathname === link.href ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", pathname === link.href && "bg-slate-100 text-slate-900 font-semibold")}
                        >
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
}
