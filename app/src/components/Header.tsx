import { useNavigate } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBack?: () => void;
}

export function Header({ title, showBackButton = false, onBack }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        document.title = title ? `Heritage - ${title}` : 'Heritage';
    }, [title]);

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const getThemeIcon = () => {
        if (theme === 'light') return 'light_mode';
        if (theme === 'dark') return 'dark_mode';
        return 'contrast';
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-shrink-0 items-center p-4 sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 gap-2 transition-colors duration-300">
            {showBackButton && (
                <button
                    onClick={handleBack}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors mr-2 flex-shrink-0"
                >
                    <span className="material-symbols-outlined text-[24px]">chevron_left</span>
                </button>
            )}

            {title && (
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                    {title}
                </h2>
            )}

            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                <button
                    onClick={toggleTheme}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    aria-label="Toggle theme"
                >
                    <span className="material-symbols-outlined text-[24px]">
                        {getThemeIcon()}
                    </span>
                </button>
                <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="focus:outline-none">
                        <img
                            alt="Profile"
                            className="h-10 w-10 rounded-full border border-white dark:border-slate-700 shadow-sm object-cover bg-slate-200 dark:bg-slate-800"
                            src={user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                            referrerPolicy="no-referrer"
                        />
                    </button>

                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                        {user?.displayName || 'Usuário'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setShowUserMenu(false); navigate('/perfil'); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    Perfil
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); navigate('/painel-familia'); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">group</span>
                                    Família
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); alert("Preferências em desenvolvimento"); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors border-b border-slate-100 dark:border-slate-700"
                                >
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    Preferências
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    Sair da Conta
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
