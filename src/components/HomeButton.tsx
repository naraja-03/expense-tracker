import { useRouter } from "next/router";
import { HomeIcon } from "@heroicons/react/24/solid";

export default function HomeButton() {
  const router = useRouter();
  return (
    <button
      aria-label="Go to dashboard"
      className="fixed top-5 left-5 z-50 bg-white rounded-full shadow-lg p-2 hover:bg-blue-50 transition"
      onClick={() => router.push("/dashboard")}
      style={{ boxShadow: "0 2px 8px 0 rgba(80,120,255,0.10)" }}
    >
      <HomeIcon className="w-7 h-7 text-blue-600" />
    </button>
  );
}