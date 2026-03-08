import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    Timestamp,
    orderBy
} from 'firebase/firestore';
import { db } from './firebase';

// Interfaces
export interface Transaction {
    id?: string;
    userId: string;
    profile: 'Pessoal' | 'Família';
    title: string;
    amount: number;
    category: string;
    date: Date;
    type: 'income' | 'expense';
    paymentMethod?: string;
    splitType?: string;
}

export interface Goal {
    id?: string;
    userId: string;
    profile: 'Pessoal' | 'Família';
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    category: string;
    deadline?: Date;
}

// Funções para Transações
export const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'transactions'), {
            ...transaction,
            date: Timestamp.fromDate(transaction.date)
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const subscribeToTransactions = (
    userId: string,
    profile: 'Pessoal' | 'Família',
    callback: (transactions: Transaction[]) => void
) => {
    const q = query(
        collection(db, 'transactions'),
        where('userId', '==', userId),
        where('profile', '==', profile),
        orderBy('date', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const transactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            transactions.push({
                id: doc.id,
                ...data,
                date: data.date.toDate()
            } as Transaction);
        });
        callback(transactions);
    });
};

// Funções para Metas
export const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
        const docRef = await addDoc(collection(db, 'goals'), {
            ...goal,
            deadline: goal.deadline ? Timestamp.fromDate(goal.deadline) : null
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding goal: ", e);
        throw e;
    }
};

export const subscribeToGoals = (
    userId: string,
    profile: 'Pessoal' | 'Família',
    callback: (goals: Goal[]) => void
) => {
    const q = query(
        collection(db, 'goals'),
        where('userId', '==', userId),
        where('profile', '==', profile)
    );

    return onSnapshot(q, (querySnapshot) => {
        const goals: Goal[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            goals.push({
                id: doc.id,
                ...data,
                deadline: data.deadline ? data.deadline.toDate() : undefined
            } as Goal);
        });
        callback(goals);
    });
};
