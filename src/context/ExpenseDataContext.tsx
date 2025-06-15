import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { DayExpense, ExpensesData } from "@/types/expense";
import { useMonth } from "@/context/AppContext";

type ExpenseDataContextType = {
    days: DayExpense[];
    target: number;
    loading: boolean;
    refetch: (monthOverride?: string) => Promise<void>;
    setDays: React.Dispatch<React.SetStateAction<DayExpense[]>>; // For optimistic updates if needed
};

const ExpenseDataContext = createContext<ExpenseDataContextType | undefined>(undefined);

export const ExpenseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { month } = useMonth();
    const [days, setDays] = useState<DayExpense[]>([]);
    const [target, setTarget] = useState(0);
    const [loading, setLoading] = useState(true);

    // Centralized fetch
    const refetch = useCallback(async (monthOverride?: string) => {
        setLoading(true);
        try {
            const { data } = await axios.get<ExpensesData>(`/api/expenses?month=${monthOverride || month}`);
            setDays(data.expenses);
            setTarget(data.target ?? 0);
        } catch (err) {
            console.log(err);

            setDays([]);
            setTarget(0);
        }
        setLoading(false);
    }, [month]);

    // Fetch on month change
    useEffect(() => {
        refetch();
    }, [month, refetch]);

    return (
        <ExpenseDataContext.Provider value={{ days, target, loading, refetch, setDays }}>
            {children}
        </ExpenseDataContext.Provider>
    );
};

export const useExpenses = () => {
    const ctx = useContext(ExpenseDataContext);
    if (!ctx) throw new Error("useExpenses must be used within ExpenseDataProvider");
    return ctx;
};