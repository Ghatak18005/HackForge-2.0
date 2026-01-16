import Link from "next/link";
import { ArrowLeft, AlertTriangle, FileText, Scale } from "lucide-react";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500 pb-6 border-b border-slate-100">
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-12 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-slate-400" /> 1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or using Print-Link to upload documents, you agree to be legally bound by these Terms of Service. If you do not agree, you may not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-slate-400" /> 2. Prohibited Content
            </h2>
            <p className="mb-4">
              Print-Link strictly prohibits the printing of illegal materials. Shop owners reserve the right to <strong>refuse service</strong> and report users for uploading:
            </p>
            <div className="bg-red-50 border border-red-100 p-6 rounded-xl">
              <ul className="list-disc pl-5 space-y-2 text-red-800 font-medium">
                <li>Counterfeit currency or government documents (Fake IDs).</li>
                <li>Copyrighted textbooks (without license).</li>
                <li>Material containing hate speech or incitement to violence.</li>
                <li>Sexually explicit content.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-slate-400" /> 3. Liability & Print Quality
            </h2>
            <p className="mb-4">
              Print-Link is a technology platform connecting students to independent shop owners.
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-600">
              <li><strong>Quality:</strong> We are not liable for low ink, paper jams, or poor print quality. These are the responsibility of the shop owner.</li>
              <li><strong>Downtime:</strong> We do not guarantee 100% server uptime, though we strive for it.</li>
              <li><strong>Refunds:</strong> Refunds are subject to our Refund Policy and the shop owner's discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Account Termination</h2>
            <p>
              We reserve the right to suspend or ban users who abuse the platform, attempt to bypass payment systems, or repeatedly upload prohibited content.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}