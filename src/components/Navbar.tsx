"use client"; // <--- Client Component

import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook to check current URL
import { Printer, LayoutDashboard } from "lucide-react";
import LogoutButton from "@/components/logout-button";
import { User } from "@supabase/supabase-js"; // Type for User

export default function Navbar({ user }: { user: User | null }) {
  const pathname = usePathname(); // Get current URL (e.g., "/dashboard")

  // Helper to check if we are on a specific page
  const isDashboard = pathname === "/dashboard";
  const isUploadPage = pathname === "/upload";

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo - Smart Redirect */}
        {/* If logged in, Logo goes to Dashboard. If not, goes to Home. */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Print-Link</span>
        </Link>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          {user ? (
            // LOGGED IN STATE
            <>
              {/* Only show "Dashboard" link if NOT on Dashboard */}
              {!isDashboard && (
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition flex items-center gap-2 px-3 py-2"
                >
                   <LayoutDashboard className="w-4 h-4" /> 
                   <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              {/* Vertical Divider (Only show if we have links to the left) */}
              {!isDashboard && <div className="h-6 w-px bg-slate-200 mx-1"></div>}
              
              <LogoutButton />
            </>
          ) : (
            // LOGGED OUT STATE
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition px-3 py-2">
              Log in
            </Link>
          )}

          {/* Primary CTA - Hide if we are already on the Upload page */}
         

        </div>
      </div>
    </nav>
  );
}