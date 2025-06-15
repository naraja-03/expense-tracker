import { useExpenses } from "@/context/ExpenseDataContext";
import ExpenseDaysList from "@/components/ExpenseDaysList";
import ExpenseFooter from "@/components/ExpenseFooter";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useMonth } from "@/context/AppContext";

function getMonthName(month: number) {
  return new Date(2000, month - 1).toLocaleString(undefined, { month: "long" });
}

export default function HomePage() {
  const { days, target, loading, refetch } = useExpenses();
  const { month, setMonth } = useMonth();

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
        <div className="flex items-center justify-center gap-4 min-w-[320px]">
          <button
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition w-10 flex-shrink-0 flex items-center justify-center"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <span className="flex-1 text-2xl text-center min-w-[140px]">{displayedMonth}</span>
          <button
            aria-label="Next month"
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-200 transition w-10 flex-shrink-0 flex items-center justify-center"
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
      <ExpenseFooter total={total} target={target} refetchTarget={refetch} />
    </main>
  );
}