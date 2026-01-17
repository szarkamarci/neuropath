export default function PatientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            {/* Simple Header */}
            <header className="p-6 flex justify-between items-center bg-white border-b">
                <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                        N
                    </div>
                    <span>NeuroPath</span>
                </div>
                <div className="text-sm text-slate-400 font-medium">Betegek Részére</div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
}
