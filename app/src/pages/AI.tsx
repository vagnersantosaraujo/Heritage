import { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Transaction, Goal } from '../lib/firestore';
import { askGemini } from '../lib/gemini';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

export default function AI() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Olá! Sou seu assistente financeiro do Heritage. Como posso te ajudar a analisar seus gastos e metas hoje?',
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !user) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Busca o contexto de dados do Firebase on-the-fly para que a IA tenha acesso aos dados mais recentes
            const txQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
            const goalsQuery = query(collection(db, 'goals'), where('userId', '==', user.uid));

            const [txSnap, goalsSnap] = await Promise.all([getDocs(txQuery), getDocs(goalsQuery)]);

            const transactions = txSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
            const goals = goalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));

            const aiResponseText = await askGemini(userMsg.text, transactions, goals);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: aiResponseText,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error("Erro ao falar com a IA:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                text: "Ops, ocorreu um erro na comunicação com a IA. Verifique sua chave de acesso ou conexão com a internet.",
                sender: 'ai',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout title="IA Heritage" showBackButton={true}>
            <div className="flex flex-col h-[calc(100vh-140px)]">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                            {msg.sender === 'ai' && (
                                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                                    <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">auto_awesome</span>
                                </div>
                            )}
                            <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-[85%] border ${msg.sender === 'user'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-slate-800 dark:text-slate-200 rounded-tr-sm border-blue-100/50 dark:border-blue-800/50'
                                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-slate-200 rounded-tl-sm border-white/50 dark:border-slate-700/50'
                                }`}>
                                <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex w-full justify-start gap-2">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                                <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400 animate-spin">progress_activity</span>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%] border border-white/50 dark:border-slate-700/50 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 p-4 sticky bottom-0">
                    <div className="max-w-2xl mx-auto flex items-center gap-3 bg-white dark:bg-slate-800 rounded-full pl-4 pr-2 py-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-200/60 dark:border-slate-700/60 transition-all focus-within:ring-2 focus-within:ring-emerald-500/50">
                        <span className="material-symbols-outlined text-slate-400">auto_awesome</span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Pergunte ao Heritage..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 p-0 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-95 shrink-0 ${input.trim() && !isLoading
                                ? 'bg-[#10b981] shadow-emerald-500/30 hover:bg-emerald-600'
                                : 'bg-slate-300 dark:bg-slate-700 shadow-none cursor-not-allowed text-slate-500'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
