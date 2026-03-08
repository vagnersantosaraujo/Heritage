import { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToTransactions } from '../lib/firestore';
import type { Transaction } from '../lib/firestore';

export default function DashboardPessoal() {
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

    const { incomes, expenses, balance } = useMemo(() => {
        let inc = 0;
        let exp = 0;
        transactions.forEach(t => {
            if (t.type === 'income') inc += t.amount;
            else if (t.type === 'expense') exp += t.amount;
        });
        return { incomes: inc, expenses: exp, balance: inc - exp };
    }, [transactions]);

    const latestExpenses = useMemo(() => {
        return transactions
            .filter(t => t.type === 'expense')
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 3);
    }, [transactions]);

    const expensesByCategory = useMemo(() => {
        const categories: Record<string, number> = {};
        let totalExp = 0;
        transactions.forEach(t => {
            if (t.type === 'expense') {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
                totalExp += t.amount;
            }
        });

        // Sorting and getting top 3
        const sorted = Object.entries(categories)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([cat, amount]) => ({
                cat,
                amount,
                percent: totalExp > 0 ? (amount / totalExp) * 100 : 0
            }));

        return { total: totalExp, breakdown: sorted };
    }, [transactions]);

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'moradia': return 'home';
            case 'alimentacao': return 'restaurant';
            case 'transporte': return 'directions_car';
            case 'lazer': return 'sports_esports';
            case 'saude': return 'favorite';
            case 'educacao': return 'school';
            case 'assinaturas': return 'subscriptions';
            default: return 'receipt_long';
        }
    };

    const getCategoryBgColor = (cat: string) => {
        switch (cat) {
            case 'moradia': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400';
            case 'alimentacao': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400';
            case 'transporte': return 'bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400';
            case 'lazer': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
            case 'saude': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
            case 'educacao': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
            case 'assinaturas': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <Layout title="🏛️ Painel Pessoal" showBackButton={false}>
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
                            onChange={() => {
                                setActiveProfile('Família');
                                navigate('/painel-familia');
                            }}
                            className="invisible absolute"
                            name="profile-toggle"
                            type="radio"
                            value="Família"
                        />
                    </label>
                </div>
            </div>

            <div className="px-4 py-2">
                <div className="relative flex flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/60 dark:border-slate-800 backdrop-blur-xl overflow-hidden">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
                    <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Meu Saldo Disponível</p>
                        <div className="mt-1 flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {isLoading ? '...' : `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            </h3>
                        </div>
                    </div>
                    <div className="relative z-10 grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="text-xs font-medium text-slate-400">Entradas</p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {isLoading ? '-' : `R$ ${incomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Saídas</p>
                            <p className="text-lg font-semibold text-[#c25e2e]">
                                {isLoading ? '-' : `R$ ${expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="px-4 py-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-1">Despesas Individuais</h3>
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="text-center py-4"><span className="material-symbols-outlined animate-spin text-emerald-500">progress_activity</span></div>
                    ) : latestExpenses.length === 0 ? (
                        <div className="text-center py-4 text-sm text-slate-500">Nenhuma despesa recente.</div>
                    ) : latestExpenses.map(expense => (
                        <div key={expense.id} className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 p-3 shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryBgColor(expense.category)}`}>
                                    <span className="material-symbols-outlined">{getCategoryIcon(expense.category)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{expense.category}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{expense.title}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                {/* Simplificado para mostrar apenas que foi registrado para fins de UI */}
                                <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                                    <span className="material-symbols-outlined text-[12px] text-emerald-600 dark:text-emerald-400">check_circle</span>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Registrado</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-4 py-2 mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 px-1">Gastos do Mês</h3>
                <div className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800">
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800"
                        style={{
                            background: expensesByCategory.breakdown.length > 0 ?
                                `conic-gradient(${expensesByCategory.breakdown.map((item, i, arr) => {
                                    const prevPercent = arr.slice(0, i).reduce((acc, curr) => acc + curr.percent, 0);
                                    let color = '#3b82f6'; // blue
                                    if (i === 0) color = '#f97316'; // orange
                                    else if (i === 1) color = '#6366f1'; // indigo
                                    return `${color} ${prevPercent}% ${prevPercent + item.percent}%`;
                                }).join(', ')})`
                                : ''
                        }}>
                        <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-inner">
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Total</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                                R$ {expensesByCategory.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {expensesByCategory.breakdown.length === 0 ? (
                            <span className="text-xs text-slate-500">Sem dados</span>
                        ) : expensesByCategory.breakdown.map((item, i) => {
                            let dotColor = 'bg-blue-500';
                            if (i === 0) dotColor = 'bg-orange-500';
                            else if (i === 1) dotColor = 'bg-indigo-500';

                            return (
                                <div key={item.cat} className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${dotColor} shadow-sm`}></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight capitalize">{item.cat}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{item.percent.toFixed(0)}%</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-24 right-6 z-40 shadow-2xl">
                <button
                    onClick={() => navigate('/nova-transacao')}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10b981] text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-600 transition-transform active:scale-95 border-none"
                >
                    <span className="material-symbols-outlined text-[32px]">add</span>
                </button>
            </div>
        </Layout>
    );
}
