import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction, Goal } from "./firestore";

// Inicializa a API do Gemini
// Em produção, isso virá de uma variável de ambiente (ex: import.meta.env.VITE_GEMINI_API_KEY)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `Você é o assistente financeiro IA do aplicativo "Heritage", projetado para ajudar casais a gerenciar suas finanças.
O aplicativo possui dois perfis: "Pessoal" (finanças individuais) e "Família" (finanças conjuntas).
Você tem um tom profissional, acolhedor e focado em educação financeira e controle de gastos.

Ao final desta mensagem de sistema, serão fornecidos os dados atuais (Transações e Metas) do usuário que está fazendo a pergunta.
Sua tarefa é analisar os dados fornecidos e responder de forma direta e concisa as perguntas que o usuário fizer.
Caso o usuário pergunte algo não relacionado a finanças (ex: receita de bolo, piada), responda educadamente que você é um assistente financeiro do Heritage e mude de assunto.
Sempre formate as moedas em Real (R$).

DADOS DO USUÁRIO LOGADO:
`;

export async function askGemini(
    prompt: string,
    transactions: Transaction[],
    goals: Goal[]
): Promise<string> {

    if (!API_KEY) {
        return "Por favor, configure sua API Key do Google Gemini no painel do Heritage (ou arquivo .env.local) para ativar meu processamento cognitivo.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Formatando transações num modo que LLMs conseguem entender facilmente
        const transactionsContext = transactions.map(t =>
            `- Data: ${t.date.toLocaleDateString('pt-BR')} | Perfil: ${t.profile} | Categoria: ${t.category} | Título: ${t.title} | Valor: R$ ${t.amount}`
        ).join('\\n');

        const goalsContext = goals.map(g =>
            `- Meta: ${g.title} | Perfil: ${g.profile} | Alvo: R$ ${g.targetAmount} | Categoria: ${g.category} | Prazo: ${g.deadline ? g.deadline.toLocaleDateString('pt-BR') : 'Sem prazo'}`
        ).join('\\n');

        const finalPrompt = `${SYSTEM_PROMPT}

-- TRANSAÇÕES REGISTRADAS --
${transactionsContext || 'Nenhuma transação registrada ainda.'}

-- METAS ATUAS --
${goalsContext || 'Nenhuma meta registrada ainda.'}

Pergunta do Usuário: ${prompt}`;

        const result = await model.generateContent(finalPrompt);
        const response = result.response;
        return response.text();

    } catch (error: any) {
        console.error("Erro na integração Gemini:", error);
        return "Desculpe, ocorreu um erro ao se comunicar com a minha base de processamento (Google AI). Error: " + error.message;
    }
}
