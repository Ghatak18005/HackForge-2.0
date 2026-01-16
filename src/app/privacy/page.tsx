import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Homepage
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 pb-6 border-b border-slate-100">
            Last updated: January 16, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
            </div>
            <p className="mb-4">
              To facilitate the printing service, we collect only the necessary information required to process your order:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <li><strong>Personal Info:</strong> Name, Email address, and Phone number (for OTP authentication).</li>
              <li><strong>Usage Data:</strong> Uploaded documents (PDFs, Word files) and print settings.</li>
              <li><strong>Transaction Data:</strong> Payment IDs and timestamps (processed via Razorpay).</li>
            </ul>
          </section>

          {/* Section 2 - Critical for Trust */}
          <section>
             <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">2. Document Security</h2>
            </div>
            <p className="mb-4">
              We understand that your assignments and documents are important. We adhere to a strict data retention policy:
            </p>
            <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex gap-4 items-start">
              <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900">Auto-Deletion Protocol</h3>
                <p className="text-blue-800 text-sm mt-1">
                  All uploaded files are stored in a secure, encrypted AWS S3 bucket. They are <strong>automatically permanently deleted</strong> from our servers 24 hours after your order status is marked as "Picked Up."
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
             <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">3. Third-Party Sharing</h2>
            </div>
            <p>
              We do not sell your personal data. We only share specific data with:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2 text-slate-600">
              <li><strong>Shop Partners:</strong> The specific shop you select will receive your file for printing.</li>
              <li><strong>Payment Gateways:</strong> Razorpay receives transaction details to process payments.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">4. Contact Us</h2>
            <p>
              If you have specific concerns about your data, please email our Data Protection Officer at <a href="mailto:privacy@printlink.in" className="text-blue-600 font-semibold hover:underline">privacy@printlink.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}