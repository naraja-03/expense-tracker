import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type CustomExpense = {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
};

export default function CustomExpensePage() {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState<CustomExpense | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        (async () => {
            const res = await fetch(`/api/custom_expenses?id=${id}`);
            const data = await res.json();
            setProject(data.item || null);
            setLoading(false);
        })();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!project) return <div className="p-10 text-center text-red-500">Project not found.</div>;

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
            <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full">
                <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                <div className="text-gray-500 mb-4">{project.description}</div>
                {project.createdAt && (
                    <div className="text-xs text-gray-400 mb-2">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                )}
                {/* TODO: Show expense items related to this project, if you add that feature */}
            </div>
        </main>
    );
}