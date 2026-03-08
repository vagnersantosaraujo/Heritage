import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToGoals } from '../lib/firestore';
import type { Goal } from '../lib/firestore';

export default function Goals() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [activeProfile, setActiveProfile] = useState<'Pessoal' | 'Família'>('Pessoal');
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setIsLoading(true);
        const unsubscribe = subscribeToGoals(user.uid, activeProfile, (data) => {
            // Ordenar por valor alvo maior primeiro para a "Main Goal"
            const sortedGoals = [...data].sort((a, b) => b.targetAmount - a.targetAmount);
            setGoals(sortedGoals);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user, activeProfile]);

    // Separa a maior meta das outras
    const mainGoal = goals.length > 0 ? goals[0] : null;
    const otherGoals = goals.length > 1 ? goals.slice(1) : [];

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

            <div className="px-4 pt-2 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {activeProfile === 'Pessoal' ? 'Metas Pessoais' : 'Metas da Família'}
                    </h3>
                </div>

                <div className="flex flex-col gap-4">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <span className="material-symbols-outlined animate-spin text-emerald-500 text-3xl">progress_activity</span>
                        </div>
                    ) : goals.length === 0 ? (
                        <div className="text-center p-8 text-slate-500 dark:text-slate-400">
                            Nenhuma meta encontrada neste perfil.
                        </div>
                    ) : mainGoal ? (
                        <div className="relative overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] border border-white/60 dark:border-slate-800">
                            <div className="absolute right-0 top-0 h-full w-1/3">
                                {/* Pode colocar uma imagem genérica ou background abstrato */}
                                <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 object-cover opacity-50"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-900 via-white/80 dark:via-slate-900/80 to-transparent"></div>
                            </div>
                            <div className="relative z-10 p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
                                        {activeProfile}
                                    </span>
                                    <span className="material-symbols-outlined text-[16px] text-[#10b981]">
                                        {mainGoal.category === 'viagem' ? 'flight_takeoff' :
                                            mainGoal.category === 'educacao' ? 'school' :
                                                mainGoal.category === 'casa' ? 'home' :
                                                    mainGoal.category === 'veiculo' ? 'directions_car' : 'flag'}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                    {mainGoal.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    {mainGoal.deadline ? `Até ${mainGoal.deadline.toLocaleDateString('pt-BR')}` : 'Sem prazo definido'}
                                </p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            R$ {mainGoal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-slate-500 dark:text-slate-400">
                                            de R$ {mainGoal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${Math.min((mainGoal.currentAmount / mainGoal.targetAmount) * 100, 100)}%` }}></div>
                                    </div>
                                    <div className="text-right text-xs font-medium text-[#10b981]">
                                        {((mainGoal.currentAmount / mainGoal.targetAmount) * 100).toFixed(0)}% Concluído
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="px-4 pb-24">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Outras Metas</h3>
                <div className="flex flex-col gap-3">
                    {otherGoals.map(goal => {
                        const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                        return (
                            <div key={goal.id} className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-900 p-3.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                    <span className="material-symbols-outlined text-[24px]">
                                        {goal.category === 'viagem' ? 'flight_takeoff' :
                                            goal.category === 'educacao' ? 'school' :
                                                goal.category === 'casa' ? 'home' :
                                                    goal.category === 'veiculo' ? 'directions_car' : 'flag'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h5 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{goal.title}</h5>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap ml-2">
                                            R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div className="h-full rounded-full bg-[#10b981]" style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 w-6 text-right">
                                            {percent.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {!isLoading && otherGoals.length === 0 && goals.length > 0 && (
                        <div className="text-center p-4 text-xs text-slate-400">Não há outras metas.</div>
                    )}
                </div>
            </div>

            <button
                onClick={() => navigate('/nova-meta')}
                className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981] text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-transform active:scale-95 border-none"
            >
                <span className="material-symbols-outlined text-[32px]">add</span>
            </button>
        </Layout>
    );
}
