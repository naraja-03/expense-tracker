"use client";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState, useRef } from "react";
import type { DayExpense, ExpenseItem } from "@/types/expense";
import axios from "axios";
import AddExpenseModal from "./AddExpenseModal";
import { useFabHover } from "@/context/FabHoverContext";

function useDebouncedCallback(callback: (...args: any[]) => void, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: any[]) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback(...args), delay);
  };
}

interface Props {
  day: DayExpense;
  onDropAdd: (date: string) => void;
  refetch?: () => void;
}

export default function ExpenseDayCard({ day, refetch }: Props) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // For dnd-kit
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day.date}`,
  });

  // Inline edit state
  const [edit, setEdit] = useState<{ i: number, field: keyof ExpenseItem } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // Debounced save to API (edit)
  const debouncedSave = useDebouncedCallback(async (i: number, field: keyof ExpenseItem, value: string) => {
    const newItem = { ...day.items[i], [field]: field === "amount" ? Number(value) : value };
    await axios.post("/api/expenses", {
      type: "edit",
      date: day.date,
      index: i,
      newItem,
    });
    refetch?.();
  }, 666);

  const handleStartEdit = (i: number, field: keyof ExpenseItem, value: string) => {
    setEdit({ i, field });
    setEditValue(String(value ?? ""));
  };

  const handleChange = (i: number, field: keyof ExpenseItem, value: string) => {
    setEditValue(value);
    debouncedSave(i, field, value);
  };

  const handleBlur = async (i: number, field: keyof ExpenseItem, value: string) => {
    setEdit(null);
    await axios.post("/api/expenses", {
      type: "edit",
      date: day.date,
      index: i,
      newItem: { ...day.items[i], [field]: field === "amount" ? Number(value) : value },
    });
    refetch?.();
  };

  const handleAddExpense = async (item: ExpenseItem, date: string) => {
    await axios.post("/api/expenses", {
      type: "add",
      date,
      newItem: item,
    });
    setModalOpen(false);
    refetch?.();
  };

  // Highlight border if this card is hovered by FAB
  const { hoveredDate } = useFabHover();

  return (
    <>
      <div
        ref={setNodeRef}
        className={`bg-white rounded-xl shadow p-3 mx-2 md:mx-10 lg:mx-40 relative transition-all duration-500
    ${isOver ? "ring-4 ring-blue-400 border-blue-400" : ""}
    ${hoveredDate === day.date ? "border border-blue-500" : "border border-transparent"}
  `}
        style={{ minHeight: 60 }}
      >
        <button
          className="w-full text-left flex items-center"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <span className="font-bold text-lg">
            Day - {Number(day.date.split("-")[2])}
          </span>
          <span className="ml-2 text-gray-500 text-sm">
            ({new Date(day.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })})
          </span>
          <span className="flex-1" />
          {open ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
        <div className={`overflow-hidden transition-all duration-700 ${open ? "max-h-96" : "max-h-0"}`}>
          <ul className=" mt-2">
            {day.items.map((item, i) => (
              <li key={i} className="py-2 flex flex-col items-start gap-0">
                <div className="flex flex-row items-center gap-2">
                  {/* Category */}
                  {edit?.i === i && edit.field === "category" ? (
                    <input
                      className="bg-transparent border-b border-gray-200 focus:border-blue-400 outline-none font-medium w-24"
                      value={editValue}
                      autoFocus
                      onChange={e => handleChange(i, "category", e.target.value)}
                      onBlur={e => handleBlur(i, "category", e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                    />
                  ) : (
                    <span
                      className="font-medium cursor-pointer"
                      tabIndex={0}
                      onClick={() => handleStartEdit(i, "category", item.category)}
                      onFocus={() => handleStartEdit(i, "category", item.category)}
                    >
                      {item.category}
                    </span>
                  )}
                  {/* Amount */}
                  {edit?.i === i && edit.field === "amount" ? (
                    <input
                      className="bg-transparent border-b border-gray-200 focus:border-blue-400 outline-none font-mono text-blue-600 w-16"
                      value={editValue}
                      type="number"
                      autoFocus
                      onChange={e => handleChange(i, "amount", e.target.value)}
                      onBlur={e => handleBlur(i, "amount", e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                    />
                  ) : (
                    <span
                      className="font-mono text-blue-600 cursor-pointer"
                      tabIndex={0}
                      onClick={() => handleStartEdit(i, "amount", String(item.amount))}
                      onFocus={() => handleStartEdit(i, "amount", String(item.amount))}
                    >
                      ₹{item.amount}
                    </span>
                  )}
                </div>
                {/* Note, indented and on next line */}
                {edit?.i === i && edit.field === "note" ? (
                  <input
                    className="bg-transparent border-b border-gray-200 focus:border-blue-400 outline-none text-sm italic text-gray-400 w-32 ml-6 mt-1"
                    value={editValue}
                    autoFocus
                    onChange={e => handleChange(i, "note", e.target.value)}
                    onBlur={e => handleBlur(i, "note", e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                  />
                ) : (
                  item.note && (
                    <span
                      className="text-sm text-gray-400 italic cursor-pointer ml-6 mt-1"
                      tabIndex={0}
                      onClick={() => handleStartEdit(i, "note", item.note || "")}
                      onFocus={() => handleStartEdit(i, "note", item.note || "")}
                    >
                      {item.note}
                    </span>
                  )
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Drop overlay for add button */}
        {isOver && (
          <div className="absolute inset-0 bg-blue-200/40 pointer-events-none rounded-xl transition" />
        )}
      </div>
      {/* Modal for add expense (not used by FAB, but kept for possible card-level add) */}
      <AddExpenseModal
        open={modalOpen}
        date={day.date}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </>
  );
}