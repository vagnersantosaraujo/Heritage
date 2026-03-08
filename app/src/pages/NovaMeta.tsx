import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addGoal } from '../lib/firestore';

export default function NovaMeta() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [titulo, setTitulo] = useState('');
    const [valor, setValor] = useState('');
    const [dataLimite, setDataLimite] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tipoMeta, setTipoMeta] = useState<'Pessoal' | 'Família'>('Pessoal');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!user) return;

        const numValor = parseFloat(valor.replace(',', '.'));
        if (isNaN(numValor) || numValor <= 0 || !titulo || !categoria) {
            alert('Por favor, preencha o título, o valor e a categoria corretamente.');
            return;
        }

        try {
            setIsSaving(true);
            await addGoal({
                userId: user.uid,
                profile: tipoMeta,
                title: titulo,
                description: '', // Descrição não está no form atualmente
                targetAmount: numValor,
                currentAmount: 0,
                category: categoria,
                deadline: dataLimite ? new Date(dataLimite) : undefined
            });
            navigate(-1);
        } catch (error) {
            console.error("Erro ao salvar meta", error);
            alert("Não foi possível salvar a meta. Verifique sua conexão e permissões.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Layout title="🏛️ Heritage" showBackButton={true}>
            <div className="px-4 py-6 flex flex-col gap-6 pb-24">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Criar Nova Meta</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Defina seus objetivos e acompanhe sua evolução.</p>
                </div>

                <form className="space-y-6">

                    {/* Tipo de Meta */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200/60 dark:border-slate-800 backdrop-blur-md">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Tipo da Meta</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400" id="tipo-meta-label">{tipoMeta}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                checked={tipoMeta === 'Família'}
                                onChange={() => setTipoMeta(tipoMeta === 'Família' ? 'Pessoal' : 'Família')}
                                className="sr-only peer"
                                type="checkbox"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10b981] dark:bg-slate-700 dark:after:border-slate-600"></div>
                        </label>
                    </div>

                    {/* Título da Meta */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Título da Meta</label>
                        <div className="relative">
                            <input
                                className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                                placeholder="Ex: Viagem para a Itália"
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Valor Objetivo */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Valor Objetivo (R$)</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-4 font-medium text-slate-400 dark:text-slate-500">R$</span>
                            <input
                                className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                                placeholder="0,00"
                                type="number"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Data Limite */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Data Limite</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">calendar_today</span>
                                <input
                                    className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none"
                                    placeholder="DD/MM/AAAA"
                                    type="date"
                                    value={dataLimite}
                                    onChange={(e) => setDataLimite(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categoria */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Categoria</label>
                            <div className="relative">
                                <select
                                    className="w-full h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all outline-none appearance-none"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                >
                                    <option value="" disabled>Selecionar</option>
                                    <option value="viagem">Viagem</option>
                                    <option value="educacao">Educação</option>
                                    <option value="casa">Casa</option>
                                    <option value="veiculo">Veículo</option>
                                    <option value="outros">Outros</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Prévia da Meta Card */}
                    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-[#10b981] to-emerald-600 dark:to-emerald-800 text-white shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/40 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-emerald-100 text-xs uppercase tracking-widest font-bold">Prévia da Meta ({tipoMeta})</p>
                            <h3 className="text-xl font-bold mt-2 truncate w-full">{titulo || 'Título da Meta'}</h3>
                            <div className="mt-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-2xl font-bold">R$ 0,00</span>
                                    <span className="text-xs text-emerald-100 font-medium">Meta: R$ {valor || '0,00'}</span>
                                </div>
                                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                    <div className="bg-white h-full w-[2%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Abstract Background Pattern */}
                        <div className="absolute -right-10 -bottom-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full h-14 bg-[#10b981] hover:bg-emerald-600 font-bold rounded-xl shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">{isSaving ? 'hourglass_empty' : 'check_circle'}</span>
                        {isSaving ? 'Salvando...' : 'Salvar Meta'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
