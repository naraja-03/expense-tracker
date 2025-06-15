export interface ExpenseItem {
  category: string;
  amount: number;
  note?: string;
}

export interface DayExpense {
  date: string; // "YYYY-MM-DD"
  items: ExpenseItem[];
}

export interface ExpensesData {
  target: number;
  expenses: DayExpense[];
}