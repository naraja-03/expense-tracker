import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: { name: string; target: number; notes: string }) => void;
}

export default function AddCustomProjectModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setTarget("");
      setNotes("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    onSubmit({ name, target: Number(target), notes });
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 mx-4 my-8"
        style={{
          minWidth: 0,
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
          boxShadow: "0 8px 32px 0 rgba(80,120,255,0.13)",
        }}
      >
        <h2 className="font-bold text-xl mb-6">Add Custom Project</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Expense Name</span>
            <input
              type="text"
              className="px-3 py-2 rounded-lg bg-gray-100 outline-none border border-transparent focus:border-blue-400 transition-all text-base"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              style={{ height: 40 }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Target Amount</span>
            <input
              type="number"
              className="px-3 py-2 rounded-lg bg-gray-100 outline-none border border-transparent focus:border-blue-400 transition-all text-base"
              value={target}
              onChange={e => setTarget(e.target.value)}
              required
              min={1}
              style={{ height: 40 }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Notes</span>
            <input
              type="text"
              className="px-3 py-2 rounded-lg bg-gray-100 outline-none border border-transparent focus:border-blue-400 transition-all text-base"
              value={notes}
              onChange={e => setNotes(e.target.value)}
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