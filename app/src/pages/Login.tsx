import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Login() {
    const navigate = useNavigate();
    const { user, signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (user) {
        return <Navigate to="/painel-pessoal" replace />;
    }

    const handleLogin = async () => {
        try {
            setError('');
            setIsLoading(true);
            await signInWithGoogle();
            navigate('/painel-pessoal');
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login com o Google.');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased h-[100dvh] w-full overflow-hidden relative">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 dark:opacity-20"
                    style={{
                        backgroundImage:
                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCHEP4uFGFEUE1iy0Cf1GMSI5ldJFp9rFaXx8MdUdIN61PgIER8vbr7_oHaddmRWogIO01D1G6oGIiHkYodKWYJDhZ5puh2JhmuloH35eDQrh1xeEOYBSJIibT2S7Lz-ncgaURoIUqjFWh18wf0PKnR_wqFYCt1CNWuBPAC_05xaJ3qnDC8mdmzXKWl8Q3S0G5kXzl_4BoXpSFqwKwycDf01Rt0FiR1NiC7qXGg9kkYHVhZCAywK5FhgP1AbfA8KDA3PGpshHtmEQU")',
                    }}
                ></div>
                <div className="absolute inset-0 bg-background-light/70 dark:bg-background-dark/80 backdrop-blur-2xl"></div>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[80px] mix-blend-multiply dark:mix-blend-screen"></div>
                </div>
            </div>

            <main className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto px-6 py-10 justify-between">
                <div className="flex-none h-12"></div>
                <div className="flex flex-col items-center justify-center flex-grow space-y-8 mt-8">
                    <div className="w-24 h-24 rounded-3xl glass-panel flex items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg border border-white/80 dark:border-slate-700/80">
                        <span className="material-symbols-outlined text-6xl text-gradient drop-shadow-sm font-light">
                            account_balance
                        </span>
                    </div>
                    <div className="text-center space-y-3 px-2">
                        <h1 className="text-[40px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                            Heritage
                        </h1>
                        <p className="text-[17px] font-medium text-slate-600 dark:text-slate-300 max-w-[280px] mx-auto leading-relaxed">
                            Gestão financeira inteligente para casais
                        </p>
                    </div>
                </div>
                <div className="flex-col w-full pb-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg text-center border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="flex items-center justify-center w-full h-14 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold gap-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="text-current w-6 h-6 flex items-center justify-center">
                            <svg fill="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                <path d="M224,128a96,96,0,1,1-21.95-61.09,8,8,0,1,1-12.33,10.18A80,80,0,1,0,207.6,136H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128Z"></path>
                            </svg>
                        </div>
                        <span className="text-[16px] tracking-wide">
                            {isLoading ? 'Conectando...' : 'Entrar com Google'}
                        </span>
                    </button>
                    <div className="text-center pt-4">
                        <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                            Ao continuar, você concorda com nossos <br />
                            <a className="underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" href="#">
                                Termos de Serviço
                            </a>{" "}
                            e{" "}
                            <a className="underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" href="#">
                                Privacidade
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
