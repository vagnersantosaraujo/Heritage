import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addTransaction } from '../lib/firestore';

export default function NovaTransacao() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [valor, setValor] = useState('');
    const [titulo, setTitulo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [data, setData] = useState(new Date().toISOString().split('T')[0]);
    const [quemPagou, setQuemPagou] = useState('Vagner');
    const [isFamily, setIsFamily] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        // Validação básica
        const numValor = parseFloat(valor.replace(',', '.'));
        const transDate = data ? new Date(data + 'T12:00:00') : new Date();

        if (isNaN(numValor) || numValor <= 0 || !titulo || !categoria || !data) {
            alert('Por favor, preencha o valor, título, data e categoria corretamente.');
            return;
        }

        try {
            setIsSaving(true);
            await addTransaction({
                userId: user.uid,
                profile: isFamily ? 'Família' : 'Pessoal',
                title: titulo,
                amount: numValor,
                category: categoria,
                date: transDate,
                type: 'expense',
                splitType: isFamily ? '50/50' : 'Fixo'
            });
            // Volta para a tela anterior com sucesso
            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar despesa", error);
            alert("Não foi possível salvar a transação. Verifique sua conexão e permissões.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout title="Nova Transação" showBackButton={true}>
            <div className="px-4 py-6 flex flex-col gap-6 pb-24">

                {/* Switch de Família (No Topo) */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-800 backdrop-blur-md">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">A transação é da família?</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{isFamily ? 'Sim, dividir despesa' : 'Não, apenas pessoal'}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            checked={isFamily}
                            onChange={(e) => setIsFamily(e.target.checked)}
                            className="sr-only peer"
                            type="checkbox"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] dark:bg-slate-700 dark:after:border-slate-600"></div>
                    </label>
                </div>

                {/* Valor */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">Valor (R$)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium z-10">R$</span>
                        <input
                            className="w-full rounded-2xl border-0 bg-white dark:bg-slate-900 py-4 pl-12 pr-4 text-2xl font-bold text-slate-800 dark:text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200/60 dark:ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-[#10b981] backdrop-blur-md outline-none transition-shadow"
                            placeholder="0,00"
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                        />
                    </div>
                </div>

                {/* Título */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">Título</label>
                    <input
                        className="w-full rounded-2xl border-0 bg-white dark:bg-slate-900 py-4 px-4 text-base font-medium text-slate-800 dark:text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200/60 dark:ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-[#10b981] backdrop-blur-md placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-shadow"
                        placeholder="Ex: Supermercado"
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>

                {/* Data */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">Data da Transação</label>
                    <input
                        className="w-full rounded-2xl border-0 bg-white dark:bg-slate-900 py-4 px-4 text-base font-medium text-slate-800 dark:text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200/60 dark:ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-[#10b981] backdrop-blur-md outline-none transition-shadow"
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                </div>

                {/* Categoria */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">Categoria</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined z-10">category</span>
                        <select
                            className="w-full appearance-none rounded-2xl border-0 bg-white dark:bg-slate-900 py-4 pl-12 pr-10 text-base font-medium text-slate-800 dark:text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-inset ring-slate-200/60 dark:ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-[#10b981] backdrop-blur-md outline-none transition-shadow"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option disabled value="">Selecione uma categoria</option>
                            <option value="alimentacao">Alimentação</option>
                            <option value="moradia">Moradia</option>
                            <option value="transporte">Transporte</option>
                            <option value="saude">Saúde</option>
                            <option value="lazer">Lazer</option>
                            <option value="educacao">Educação</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined pointer-events-none">expand_more</span>
                    </div>
                </div>

                {/* Quem pagou - Oculto se não for família */}
                {isFamily && (
                    <div className="flex flex-col gap-3 animate-fade-in">
                        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-2">Quem pagou?</label>
                        <div className="flex gap-4">
                            <label className="flex flex-col items-center gap-2 cursor-pointer flex-1 group">
                                <input
                                    checked={quemPagou === 'Vagner'}
                                    onChange={() => setQuemPagou('Vagner')}
                                    className="peer sr-only"
                                    name="quem_pagou"
                                    type="radio"
                                />
                                <div className="h-16 w-16 rounded-full border-4 border-transparent peer-checked:border-[#10b981] transition-colors overflow-hidden relative shadow-sm group-hover:ring-2 group-hover:ring-emerald-200 dark:group-hover:ring-emerald-900">
                                    <img alt="Vagner" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx9etMasLdLxWBtSh83h2smHJ0lL02Sj10qE5rSgJ-MZp4MBjxnCZow0vjd_WGL0VSvJtKn49QiWj1c5XjX8guH_slWQxjpRMObwNyLd7422KbVMJSfpI4KzI0U0fs22xIcui9iqGmcOq9NuWNq01Ad7D9iP2zZVok0D01fHXh_hQwdcsOCo8M2ci6pKs8D9J2YeBd05itAiM9dtYJ7E2q5LTs9LmMRgQBDXAeWyMrAKn7RXQuEjL_j6TUom7xVsJ0urtCFD-29fQ" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 peer-checked:text-[#10b981] peer-checked:font-bold">Vagner</span>
                            </label>
                            <label className="flex flex-col items-center gap-2 cursor-pointer flex-1 group">
                                <input
                                    checked={quemPagou === 'Soane'}
                                    onChange={() => setQuemPagou('Soane')}
                                    className="peer sr-only"
                                    name="quem_pagou"
                                    type="radio"
                                />
                                <div className="h-16 w-16 rounded-full border-4 border-transparent peer-checked:border-[#10b981] transition-colors overflow-hidden relative shadow-sm group-hover:ring-2 group-hover:ring-emerald-200 dark:group-hover:ring-emerald-900">
                                    <img alt="Soane" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhaa-DVWv4_oGHwDZ2vOV9t66YhjICDHHgGBfTr_2gvIeqjD4m7CbshXq31luPH5RsQumsCcOj74e0OZavSiho_gPBSrkJis9julHAHFUVgoZsd_VeT3Qx9rz-lB0i6GhDXFxN5plGVeD6Dud6M9uyWAJgi1RG_x90fM-1BBB63QgAopU57QDjtpGvJo2jUCoQzdPzsvAkPX1b1KmuR3J855pWmAEs-awATXKNEYMrqmCHxxrNw2dVVBQfCXNNoOGDqjUpmpF1z_Y" />
                                </div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 peer-checked:text-[#10b981] peer-checked:font-bold">Soane</span>
                            </label>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-4 w-full rounded-2xl bg-[#10b981] py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Salvando...' : 'Salvar Transação'}
                </button>
            </div>
        </Layout>
    );
}
