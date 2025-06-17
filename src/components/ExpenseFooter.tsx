import { useState, useRef } from "react";
import axios from "axios";
import { useMonth } from "@/context/AppContext";

interface Props {
  total: number;
  target: number;
  refetchTarget: () => void;
}

function useDebouncedCallback(callback: (...args: any[]) => void, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  return (...args: any[]) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback(...args), delay);
  };
}

export default function ExpenseFooter({ total, target, refetchTarget }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(target);
  const { month } = useMonth();

  const debouncedSave = useDebouncedCallback(async (value: number) => {
    await axios.post("/api/expenses", {
      type: "target",
      month: month,
      target: value
    });
    refetchTarget();
  }, 666);

  const handleEdit = () => {
    setEditValue(target);
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setEditValue(value);
    debouncedSave(value);
  };

  const handleBlur = () => {
    setEditing(false);
    debouncedSave(editValue);
  };

  const pl = target - total;
  const plColor = pl > 0 ? "text-green-600" : pl < 0 ? "text-red-600" : "text-gray-600";

  return (
    <div className="fixed inset-x-0 bottom-6 flex justify-center pointer-events-none z-30">
      <div
        className="pointer-events-auto flex flex-row items-center gap-8 px-8 py-4 rounded-2xl shadow-2xl bg-white/80 backdrop-blur border border-gray-200"
        style={{
          minWidth: 320,
          maxWidth: 420,
        }}
      >
        <div>
          Total: <span className="font-mono text-blue-700">₹{total}</span>
        </div>
        <div>
          Target:{" "}
          {editing ? (
            <input
              className="bg-transparent border-b border-blue-400 focus:outline-none font-mono text-indigo-700 w-20"
              type="number"
              value={editValue}
              autoFocus
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
            />
          ) : (
            <span
              className="font-mono text-indigo-700 cursor-pointer border-b border-dotted border-indigo-400"
              tabIndex={0}
              onClick={handleEdit}
              onFocus={handleEdit}
            >
              ₹{target}
            </span>
          )}
        </div>
        <div>
          P/L: <span className={`font-mono ${plColor}`}>₹{pl || '0'}</span>
        </div>
      </div>
    </div>
  );
}