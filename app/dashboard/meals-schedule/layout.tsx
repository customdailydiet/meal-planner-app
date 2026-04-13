import React from 'react';

export default function MealsScheduleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="flex-1 w-full max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}
