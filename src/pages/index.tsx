import { useEffect, useState } from "react";
import axios from "axios";
import type { ExpensesData, DayExpense } from "@/types/expense";
import ExpenseDaysList from "@/components/ExpenseDaysList";
import ExpenseFooter from "@/components/ExpenseFooter";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";



function getMonthName(month: number) {
  return new Date(2000, month - 1).toLocaleString(undefined, { month: "long" });
}

export default function HomePage() {
  // Default to current month in YYYY-MM format
  const now = new Date();
  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );
  const [days, setDays] = useState<DayExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(0);

  const refetch = async (monthVal = month) => {
    setLoading(true);
    try {
      const { data } = await axios.get<ExpensesData>(`/api/expenses?month=${monthVal}`);
      setDays(data.expenses);
      setTarget(data.target ?? 0);
    } catch (err) {
      console.log(err);
      setDays([]);
      setTarget(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    refetch(month);
    // eslint-disable-next-line
  }, [month]);

  // Handle month navigation
  const changeMonth = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    const newDate = new Date(y, m - 1 + delta, 1);
    setMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`);
  };

  const [year, monthNum] = month.split("-").map(Number);
  const displayedMonth = `${getMonthName(monthNum)} Expense`;

  const total = days?.reduce(
    (sum, d) => sum + d.items.reduce((s, i) => s + i.amount, 0),
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 pb-24">
      <div className="flex flex-col items-center py-6 relative">
        <div className="flex items-center justify-center gap-4">
          <button
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <span className="text-2xl">{displayedMonth}</span>
          <button
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-1 text-4xl tracking-widest text-gray-400 select-none pointer-events-none font-normal">
          {year}
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <ExpenseDaysList />
      )}
      <ExpenseFooter total={total} target={target} refetchTarget={() => refetch(month)} />
    </main>
  );
}