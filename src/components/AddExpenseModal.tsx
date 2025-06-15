import { useState, useEffect } from "react";
import type { ExpenseItem } from "@/types/expense";

interface Props {
  open: boolean;
  date: string; // "" means fresh/new, else use passed date
  onClose: () => void;
  onSubmit: (item: ExpenseItem, date: string) => void;
}

export default function AddExpenseModal({ open, date, onClose, onSubmit }: Props) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    if (open) {
      setCategory("");
      setAmount("");
      setNote("");
      setEditDate(date || new Date().toISOString().slice(0, 10));
    }
  }, [open, date]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !editDate) return;
    onSubmit(
      {
        category,
        amount: parseInt(amount, 10),
        note,
      },
      editDate
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8"
        style={{
          minWidth: 400,
          boxShadow: "0 8px 32px 0 rgba(80,120,255,0.13)",
        }}
      >
        <h2 className="font-bold text-xl mb-6">Add Expense</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Date</span>
            <input
              type="date"
              className="px-3 py-2 rounded-lg bg-gray-100 focus:bg-gray-100 outline-none border border-transparent focus:border-transparent transition-all text-base"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              required
              style={{ height: 40 }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Category</span>
            <input
              type="text"
              className="px-3 py-2 rounded-lg bg-gray-100 focus:bg-gray-100 outline-none border border-transparent focus:border-transparent transition-all text-base"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              autoFocus
              style={{ height: 40 }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Amount</span>
            <input
              type="number"
              className="px-3 py-2 rounded-lg bg-gray-100 focus:bg-gray-100 outline-none border border-transparent focus:border-transparent transition-all text-base"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min={1}
              style={{ height: 40 }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Note</span>
            <input
              type="text"
              className="px-3 py-2 rounded-lg bg-gray-100 focus:bg-gray-100 outline-none border border-transparent focus:border-transparent transition-all text-base"
              value={note}
              onChange={e => setNote(e.target.value || "-")}
              placeholder="Optional"
              style={{ height: 40 }}
            />
          </label>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-5 py-2.5 text-base font-medium hover:bg-blue-700 transition-colors"
              style={{ minWidth: 80, fontSize: 15, height: 40 }}
            >
              Add
            </button>
            <button
              type="button"
              className="bg-gray-200 rounded-lg px-5 py-2.5 text-base font-medium hover:bg-gray-300 transition-colors"
              style={{ minWidth: 80, fontSize: 15, height: 40 }}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}