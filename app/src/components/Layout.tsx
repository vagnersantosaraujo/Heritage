import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

interface LayoutProps {
    children: ReactNode;
    showBottomNav?: boolean;
    showHeader?: boolean;
    title?: string;
    showBackButton?: boolean;
    onBack?: () => void;
}

export function Layout({
    children,
    showBottomNav = true,
    showHeader = true,
    title = '',
    showBackButton = false,
    onBack
}: LayoutProps) {
    return (
        <div className="relative flex min-h-[100dvh] w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            {showHeader && (
                <Header
                    title={title}
                    showBackButton={showBackButton}
                    onBack={onBack}
                />
            )}

            <main className={`flex-1 flex flex-col ${showBottomNav ? 'pb-24' : 'pb-6'}`}>
                {children}
            </main>

            {showBottomNav && <BottomNav />}
        </div>
    );
}
