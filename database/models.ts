export interface User {
    id: number;
    name: string;
    onboarding: boolean;
    currency: string;
}

export interface Budget {
    id: number;
    title: string;
    amount: number;
    themeColor: string;
}

export interface Transaction {
    id: number;
    budgetId: number;
    type: string;
    amount: number;
    category: string;
    title?: string | null;
    notes?: string | null;
    date: string;
    createdAt: string;
}
