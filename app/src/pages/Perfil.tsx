import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Perfil() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [hasFamily, setHasFamily] = useState(false);
    const [loadingFamily, setLoadingFamily] = useState(true);

    useEffect(() => {
        const checkFamily = async () => {
            if (!user) return;
            try {
                // Checa se o usuário já tem alguma transação ou meta com profile 'Família'
                // ou se existe uma coleção de família onde ele é membro (placeholder para futura expansão)
                const qTx = query(
                    collection(db, 'transactions'),
                    where('userId', '==', user.uid),
                    where('profile', '==', 'Família')
                );
                const querySnapshot = await getDocs(qTx);

                if (!querySnapshot.empty) {
                    setHasFamily(true);
                } else {
                    setHasFamily(false);
                }
            } catch (error) {
                console.error("Erro ao checar status da família:", error);
            } finally {
                setLoadingFamily(false);
            }
        };

        checkFamily();
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <Layout title="Perfil" showBackButton={true}>
            <div className="px-4 py-6 flex flex-col items-center">

                {/* Profile Header */}
                <div className="relative mb-4">
                    <img
                        src={user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-[#10b981] object-cover shadow-lg"
                        referrerPolicy="no-referrer"
                    />
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-[16px] text-white">edit</span>
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {user?.displayName || 'Usuário'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                    {user?.email || 'email@exemplo.com'}
                </p>

                {/* Options List */}
                <div className="w-full max-w-md space-y-4">
                    <button className="w-full flex items-center bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">account_balance_wallet</span>
                        </div>
                        <div className="flex-1 text-left ml-4">
                            <div className="font-bold text-slate-900 dark:text-white">Contas Conectadas</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">3 instituições conectadas</div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>

                    <button className="w-full flex items-center bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">notifications</span>
                        </div>
                        <div className="flex-1 text-left ml-4">
                            <div className="font-bold text-slate-900 dark:text-white">Preferências de Notificação</div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>

                    <button className="w-full flex items-center bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">security</span>
                        </div>
                        <div className="flex-1 text-left ml-4">
                            <div className="font-bold text-slate-900 dark:text-white">Segurança</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Face ID, Senha</div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>

                    <button className="w-full flex items-center bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform mb-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">delete</span>
                        </div>
                        <div className="flex-1 text-left ml-4">
                            <div className="font-bold text-slate-900 dark:text-white">Lixeira</div>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                    </button>

                    {/* Family Button */}
                    {!loadingFamily && (
                        <button
                            onClick={() => navigate('/painel-familia')}
                            className="w-full flex items-center bg-[#10b981] hover:bg-emerald-600 rounded-[2rem] p-4 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform text-white group mt-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-white">group_add</span>
                            </div>
                            <div className="flex-1 text-left ml-4">
                                <div className="font-bold text-white">
                                    {hasFamily ? 'Gerenciar Painel da Família' : 'Criar Painel da Família'}
                                </div>
                                <div className="text-xs text-emerald-100">
                                    {hasFamily ? 'Configure participantes e limites' : 'Gerencie as finanças juntos'}
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
                        </button>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform mt-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-red-500 dark:text-red-400">logout</span>
                        </div>
                        <div className="flex-1 text-left ml-4">
                            <div className="font-bold text-red-500 dark:text-red-400">Sair</div>
                        </div>
                    </button>
                </div>
            </div>
        </Layout>
    );
}
