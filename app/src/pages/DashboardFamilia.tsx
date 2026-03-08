import { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { subscribeToGoals, type Goal } from '../lib/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardFamilia() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeProfile, setActiveProfile] = useState<'Pessoal' | 'Família'>('Família');
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToGoals(user.uid, 'Família', (data) => {
            setGoals(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const sortedGoals = useMemo(() => {
        return [...goals].sort((a, b) => b.targetAmount - a.targetAmount);
    }, [goals]);

    const topGoals = sortedGoals.slice(0, 2);
    const otherGoalsList = sortedGoals.slice(2);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const getGoalIcon = (category: string) => {
        switch (category) {
            case 'viagem': return 'flight_takeoff';
            case 'casa': return 'home';
            case 'veiculo': return 'directions_car';
            case 'educacao': return 'school';
            default: return 'flag';
        }
    };

    return (
        <Layout title="🏛️ Heritage" showBackButton={false}>
            <div className="px-4 py-3">
                <div className="flex h-12 w-full items-center justify-between rounded-full bg-slate-200/50 dark:bg-slate-800/50 p-1 backdrop-blur-sm border border-white dark:border-slate-700 shadow-inner">
                    <label className="relative flex h-full flex-1 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-700 has-[:checked]:text-[#10b981] has-[:checked]:shadow-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                        <span className="truncate z-10">Pessoal</span>
                        <input
                            checked={activeProfile === 'Pessoal'}
                            onChange={() => {
                                setActiveProfile('Pessoal');
                                navigate('/painel-pessoal');
                            }}
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

            <div className="px-4 pt-2 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Metas da família</h3>
                    <button onClick={() => navigate('/metas')} className="text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400">Ver todas</button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
                    </div>
                ) : goals.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <span className="material-symbols-outlined text-[32px]">flag</span>
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-bold mb-2">Nenhuma meta ainda</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Comece a planejar o futuro da sua família!</p>
                        <button
                            onClick={() => navigate('/nova-meta')}
                            className="px-6 py-2.5 bg-[#10b981] text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 active:scale-95 transition-all text-sm"
                        >
                            Criar Meta Família
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {topGoals.map((goal, index) => {
                            const percent = goal.targetAmount > 0
                                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                                : 0;

                            // A primeira meta tem um estilo mais "hero", se houver imagem ou gradiente
                            if (index === 0) {
                                return (
                                    <div key={goal.id} className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-white/60 dark:border-slate-800">
                                        <div className="absolute right-0 top-0 h-full w-1/3">
                                            {/* Imagem de placeholder abstrata para a principal */}
                                            <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-teal-200 dark:from-emerald-900/50 dark:to-teal-900/30 opacity-60"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent"></div>
                                        </div>
                                        <div className="relative z-10 p-5">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">{goal.category || 'Família'}</span>
                                                <span className="material-symbols-outlined text-[16px] text-emerald-500">{getGoalIcon(goal.category || '')}</span>
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 truncate pr-8">{goal.title}</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(goal.currentAmount)}</span>
                                                    <span className="text-slate-500 dark:text-slate-400">de {formatCurrency(goal.targetAmount)}</span>
                                                </div>
                                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }}></div>
                                                </div>
                                                <div className="text-right text-xs font-medium text-emerald-500">{percent}% Concluído</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // A segunda meta (se houver) tem estilo secundário
                            return (
                                <div key={goal.id} className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-white/60 dark:border-slate-800 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                                                <span className="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400">{getGoalIcon(goal.category || '')}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{goal.title}</h4>
                                                </div>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{goal.category || 'Geral'}</span>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">Família</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(goal.currentAmount)}</span>
                                            <span className="text-slate-500 dark:text-slate-400">de {formatCurrency(goal.targetAmount)}</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <div className="text-right text-xs font-medium text-emerald-500">{percent}% Concluído</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {otherGoalsList.length > 0 && (
                <div className="px-4 pb-6">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Outras Metas</h3>
                    <div className="flex flex-col gap-3">
                        {otherGoalsList.map((goal) => {
                            const percent = goal.targetAmount > 0
                                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                                : 0;

                            return (
                                <div key={goal.id} className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-900 p-3.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                        <span className="material-symbols-outlined text-[24px]">{getGoalIcon(goal.category || '')}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate pr-2">{goal.title}</h5>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{formatCurrency(goal.targetAmount)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }}></div>
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 w-6 text-right">{percent}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="fixed bottom-24 right-6 z-40 shadow-2xl">
                <button
                    onClick={() => navigate('/nova-meta')}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981] text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-transform active:scale-95 border-none"
                >
                    <span className="material-symbols-outlined text-[32px]">add</span>
                </button>
            </div>
        </Layout>
    );
}
