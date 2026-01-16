import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Homepage
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Refund Policy</h1>
          <p className="text-slate-500 pb-6 border-b border-slate-100">
            Fair and transparent refunds for students.
          </p>
        </div>

        <div className="space-y-10 text-slate-700 leading-relaxed">
          
          <p className="text-lg">
            We know student budgets are tight. If something goes wrong with our system, we will make it right.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Eligible */}
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <h3 className="font-bold text-green-800 flex items-center gap-2 mb-4 text-lg">
                <CheckCircle className="w-6 h-6" /> Eligible for Refund
              </h3>
              <ul className="space-y-3 text-sm text-green-900 font-medium">
                <li className="flex gap-2"><span className="text-green-600">•</span> The shop was closed when you arrived.</li>
                <li className="flex gap-2"><span className="text-green-600">•</span> The shopkeeper refused to print your file.</li>
                <li className="flex gap-2"><span className="text-green-600">•</span> Payment was deducted, but the order failed.</li>
                <li className="flex gap-2"><span className="text-green-600">•</span> File corruption caused by our server.</li>
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <h3 className="font-bold text-red-800 flex items-center gap-2 mb-4 text-lg">
                <XCircle className="w-6 h-6" /> Not Eligible
              </h3>
              <ul className="space-y-3 text-sm text-red-900 font-medium">
                <li className="flex gap-2"><span className="text-red-600">•</span> You uploaded the wrong document.</li>
                <li className="flex gap-2"><span className="text-red-600">•</span> You selected wrong settings (e.g., B&W vs Color).</li>
                <li className="flex gap-2"><span className="text-red-600">•</span> You forgot to pick up the print within 48 hours.</li>
                <li className="flex gap-2"><span className="text-red-600">•</span> You changed your mind after payment.</li>
              </ul>
            </div>
          </div>

          <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
               <RefreshCw className="w-5 h-5 text-slate-500" /> Processing Time
            </h2>
            <p className="text-slate-600 mb-4">
              Approved refunds are processed automatically back to your original payment method (UPI/Card).
            </p>
            <div className="flex gap-8 text-sm font-semibold">
              <div className="text-slate-900">UPI Refunds: <span className="text-blue-600">Instantly - 24 Hours</span></div>
              <div className="text-slate-900">Card Refunds: <span className="text-blue-600">5 - 7 Business Days</span></div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">How to Request a Refund</h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-600">
              <li>Go to your <strong>Order History</strong> page.</li>
              <li>Click on the specific Order ID.</li>
              <li>Select <strong>"Report Issue / Request Refund"</strong>.</li>
              <li>Provide a reason. Our support team will review it within 2 hours.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}