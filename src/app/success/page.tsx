"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Printer } from "lucide-react";
import { useEffect } from "react";
// If you didn't install canvas-confetti, delete the import and useEffect below
// import confetti from "canvas-confetti"; 

export default function SuccessPage() {
  
  // Optional: Simple animation on load
  useEffect(() => {
    // You can add simple JS confetti here or just leave it blank
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-200">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-8">
          Your file has been sent to <span className="font-semibold text-slate-900">Raju Xerox</span>.
        </p>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 text-left flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg">
             <Printer className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Pickup Code: 8291</p>
            <p className="text-xs text-slate-500">Show this code at the shop counter.</p>
          </div>
        </div>

        <Link href="/">
          <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
            Back to Home <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}