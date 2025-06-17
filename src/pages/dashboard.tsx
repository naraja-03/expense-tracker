import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PlusIcon, CurrencyRupeeIcon } from "@heroicons/react/24/solid";
import AddCustomProjectModal from "@/components/AddCustomProjectModal";

// Type for a custom expense project
type CustomExpense = {
    _id: string;
    title: string;
    description?: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const [customExpenses, setCustomExpenses] = useState<CustomExpense[]>([]);
    const [plusModalOpen, setPlusModalOpen] = useState(false);

    // On mount, fetch all custom projects from backend
    useEffect(() => {
        fetch("/api/custom_expenses")
            .then(res => res.json())
            .then(data => setCustomExpenses(data.items || []));
    }, []);

    // Handle adding new custom project (from modal)
    const handleAddCustomProject = async (project: { name: string; target: number; notes: string }) => {
        // Save to backend
        const res = await fetch("/api/custom_expenses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: project.name,
                target: project.target,
                description: project.notes
            }),
        });
        const data = await res.json();
        if (data.ok) {
            setCustomExpenses(prev => [
                ...prev,
                {
                    _id: data.id,
                    title: project.name,
                    description: project.notes,
                    target: project.target
                }
            ]);
        }
        setPlusModalOpen(false);
    };

    return (
        <main className="min-h-screen bg-gray-100 pt-10 pb-24 px-4 flex flex-col items-center">
            <h1 className="text-2xl font-semibold mb-8 text-center">Finance Dashboard</h1>
            <div className="flex flex-col gap-5 w-full max-w-md">
                {/* Monthly Expense Card */}
                <div
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-row items-center cursor-pointer hover:shadow-lg transition"
                    onClick={() => router.push("/monthExpense")}
                >
                    <div className="flex-1">
                        <div className="text-lg font-bold mb-1">Monthly Overview</div>
                        <div className="text-gray-500 text-sm">Track your recurring expenses</div>
                    </div>
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path d="M8 17l4 4 4-4m-4-5V3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {/* Custom Expense Cards */}
                {customExpenses.map(exp => (
                    <div
                        key={exp._id}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-row items-center cursor-pointer hover:shadow-lg transition"
                        onClick={() => router.push(`/custom/${exp._id}`)}
                    >
                        <div className="flex-1">
                            <div className="text-lg font-bold mb-1">{exp.title}</div>
                            <div className="text-gray-500 text-sm">{exp.description || "Custom project expense"}</div>
                        </div>
                        <CurrencyRupeeIcon className="h-7 w-7 text-amber-600" />
                    </div>
                ))}
                {/* Plus Card (always last) */}
                <div
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-row items-center cursor-pointer hover:shadow-lg transition border-2 border-dashed border-blue-200"
                    onClick={() => setPlusModalOpen(true)}
                >
                    <div className="flex-1">
                        <div className="text-lg font-bold mb-1">Add Custom Project</div>
                        <div className="text-gray-500 text-sm">Create a new investment or one-time expense</div>
                    </div>
                    <span className="flex items-center justify-center bg-blue-50 rounded-full p-2">
                        <PlusIcon className="h-7 w-7 text-blue-600" />
                    </span>
                </div>
            </div>
            {/* Modal for adding custom expense */}
            <AddCustomProjectModal
                open={plusModalOpen}
                onClose={() => setPlusModalOpen(false)}
                onSubmit={handleAddCustomProject}
            />
        </main>
    );
}