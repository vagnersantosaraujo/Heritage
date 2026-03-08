import { Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export function BottomNav() {
    const location = useLocation();

    const navItems = [
        { name: 'Início', path: '/painel-pessoal', icon: 'home' },
        { name: 'Transações', path: '/transacoes', icon: 'sync_alt' },
        { name: 'Metas', path: '/metas', icon: 'flag' },
        { name: 'IA', path: '/ai', icon: 'auto_awesome' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex h-20 w-full items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md pb-safe">
            {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={twMerge(
                            'flex flex-col items-center justify-center gap-1 transition-colors',
                            isActive
                                ? 'text-emerald-600 dark:text-emerald-500'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                        )}
                    >
                        <span
                            className="material-symbols-outlined text-[28px]"
                            style={{ fontVariationSettings: isActive ? '"FILL" 1' : '"FILL" 0' }}
                        >
                            {item.icon}
                        </span>
                        <span
                            className={twMerge(
                                'text-[10px] tracking-wide',
                                isActive ? 'font-semibold' : 'font-medium'
                            )}
                        >
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
