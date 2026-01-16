import { logout } from "@/app/auth/actions";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 transition-colors hover:bg-red-50">
        <LogOut className="w-4 h-4" />
        <span className="hidden md:inline">Sign out</span>
      </button>
    </form>
  );
}
