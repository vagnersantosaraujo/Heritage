import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTransactions } from '../lib/firestore';
import type { Transaction } from '../lib/firestore';

export default function Transacoes() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeProfile, setActiveProfile] = useState<'Pessoal' | 'Família'>('Pessoal');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setIsLoading(true);
        const unsubscribe = subscribeToTransactions(user.uid, activeProfile, (data) => {
            setTransactions(data);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, activeProfile]);

    return (
        <Layout title="🏛️ Heritage" showBackButton={false}>
            <div className="px-4 py-3">
                <div className="flex h-12 w-full items-center justify-between rounded-full bg-slate-200/50 dark:bg-slate-800/50 p-1 backdrop-blur-sm border border-white dark:border-slate-700 shadow-inner">
                    <label className="relative flex h-full flex-1 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:text-[#10b981] has-[:checked]:shadow-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <span className="truncate z-10">Pessoal</span>
                        <input
                            checked={activeProfile === 'Pessoal'}
                            onChange={() => setActiveProfile('Pessoal')}
                            className="invisible absolute"
                            name="profile-toggle"
                            type="radio"
                            value="Pessoal"
                        />
                    </label>
                    <label className="relative flex h-full flex-1 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:text-[#10b981] has-[:checked]:shadow-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <span className="truncate z-10">Família</span>
                        <input
                            checked={activeProfile === 'Família'}
                            onChange={() => setActiveProfile('Família')}
                            className="invisible absolute"
                            name="profile-toggle"
                            type="radio"
                            value="Família"
                        />
                    </label>
                </div>
            </div>

            <div className="px-4 pt-4 pb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activeProfile === 'Pessoal' ? 'Transações Pessoais' : 'Transações da Família'}
                </h1>
            </div>

            <div className="px-4 py-2 mb-2 flex items-center justify-between">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <span className="text-base font-semibold text-slate-800 dark:text-slate-200">Outubro 2023</span>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>

            <div className="px-4 py-2 flex flex-col gap-3 pb-24">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <span className="material-symbols-outlined animate-spin text-emerald-500 text-3xl">progress_activity</span>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                        Nenhuma transação encontrada.
                    </div>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/60 dark:border-slate-800 backdrop-blur-md">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[24px]">
                                            {t.category === 'alimentacao' ? 'restaurant' :
                                                t.category === 'moradia' ? 'home' :
                                                    t.category === 'transporte' ? 'directions_car' :
                                                        t.category === 'saude' ? 'medical_services' :
                                                            t.category === 'lazer' ? 'sports_esports' :
                                                                t.category === 'educacao' ? 'school' : 'receipt_long'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {t.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}, {t.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <p className={`text-sm font-bold ${t.type === 'expense' ? 'text-slate-900 dark:text-white' : 'text-emerald-500'}`}>
                                        {t.type === 'expense' ? '- ' : '+ '}
                                        R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <span className="material-symbols-outlined text-[18px] text-emerald-500">check_circle</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                                <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-500/10 px-2 py-1 text-[10px] font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20 dark:ring-blue-500/20">
                                    {t.profile}
                                </span>
                                {t.splitType && (
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Divisão: {t.splitType}</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button className="fixed bottom-24 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-lg shadow-slate-400/20 dark:shadow-slate-900/40 hover:bg-slate-300 dark:hover:bg-slate-600 transition-transform active:scale-95 border-none">
                <span className="material-symbols-outlined text-[32px]">delete</span>
            </button>
            <button
                onClick={() => navigate('/nova-transacao')}
                className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981] text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-transform active:scale-95 border-none"
            >
                <span className="material-symbols-outlined text-[32px]">add</span>
            </button>
        </Layout>
    );
}
