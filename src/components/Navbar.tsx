import Link from "next/link";
import { Printer } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Print-Link</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">
            Log in
          </Link>
          <Link href="/upload">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95 transform duration-100">
              Start Printing
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}