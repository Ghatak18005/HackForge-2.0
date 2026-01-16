import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Printer,
  CheckCircle,
  Clock,
  IndianRupee,
  FileText,
  Download,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

export default async function ShopDashboard() {
  const supabase = await createClient();

  // 1. Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Verify Role (Security)
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "shopkeeper") {
    return (
      <div className="p-10 text-center">Access Denied. Shopkeepers only.</div>
    );
  }

  // 3. Fetch Orders (Mocking real data structure for the UI)
  // In reality: await supabase.from('orders').select('*').eq('shop_id', user.id)...
  const orders = [
    {
      id: "ORD-8921",
      user: "Aum Patel",
      file: "Physics_Assignment.pdf",
      pages: 12,
      copies: 1,
      type: "B&W",
      binding: false,
      status: "pending",
      amount: 40,
      time: "2 mins ago",
    },
    {
      id: "ORD-8920",
      user: "Riya Shah",
      file: "Project_Report_Final.pdf",
      pages: 45,
      copies: 2,
      type: "Color",
      binding: true,
      status: "pending",
      amount: 450,
      time: "5 mins ago",
    },
    {
      id: "ORD-8919",
      user: "Dev Kumar",
      file: "Lab_Manual.docx",
      pages: 8,
      copies: 1,
      type: "B&W",
      binding: false,
      status: "ready",
      amount: 20,
      time: "15 mins ago",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* PROFESSIONAL HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between ">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Raju Xerox Center
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                  Shop Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-100 px-4 py-2 rounded-lg transition">
              <RefreshCw className="w-4 h-4" /> Refresh Queue
            </button>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Today's Earnings"
            value="₹1,240"
            icon={<IndianRupee className="w-5 h-5 text-green-600" />}
            bg="bg-green-50"
          />
          <StatCard
            title="Pending Orders"
            value="12"
            icon={<Clock className="w-5 h-5 text-orange-600" />}
            bg="bg-orange-50"
          />
          <StatCard
            title="Completed"
            value="45"
            icon={<CheckCircle className="w-5 h-5 text-blue-600" />}
            bg="bg-blue-50"
          />
          <StatCard
            title="Pages Printed"
            value="892"
            icon={<FileText className="w-5 h-5 text-slate-600" />}
            bg="bg-slate-100"
          />
        </div>

        {/* LIVE ORDER QUEUE */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Live Queue{" "}
            <span className="text-sm font-normal text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              3 Pending
            </span>
          </h2>
          {/* Filter Tabs */}
          <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button className="px-4 py-1.5 text-sm font-medium bg-slate-900 text-white rounded-md shadow-sm">
              Active
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">
              Completed
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">
              Picked Up
            </button>
          </div>
        </div>

        {/* ORDER LIST - DESIGNED FOR SPEED */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:border-blue-300 transition-all"
            >
              {/* Left: Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {order.id}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {order.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400" /> {order.file}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Customer: <span className="text-slate-900">{order.user}</span>
                </p>
              </div>

              {/* Middle: Print Settings (The most important part for Shopkeepers) */}
              <div className="flex gap-4">
                <SettingBadge
                  label={order.type}
                  color={
                    order.type === "Color"
                      ? "text-purple-700 bg-purple-50 border-purple-200"
                      : "text-slate-700 bg-slate-100 border-slate-200"
                  }
                />
                <SettingBadge
                  label={`${order.pages} Pages`}
                  color="text-slate-700 bg-white border-slate-200"
                />
                <SettingBadge
                  label={`${order.copies} Copies`}
                  color="text-slate-700 bg-white border-slate-200"
                />
                {order.binding && (
                  <SettingBadge
                    label="Spiral Binding"
                    color="text-orange-700 bg-orange-50 border-orange-200"
                  />
                )}
              </div>

              {/* Right: Payment & Actions */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <div className="text-right mr-4">
                  <p className="text-xs text-slate-400 font-medium uppercase">
                    Paid via UPI
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{order.amount}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                    title="Download File"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  {order.status === "pending" ? (
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition flex items-center gap-2">
                      <Printer className="w-4 h-4" /> Mark Printed
                    </button>
                  ) : (
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-600/20 transition flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Verify OTP
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string;
  icon: any;
  bg: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
    </div>
  );
}

function SettingBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`px-3 py-1.5 rounded-md text-sm font-bold border ${color}`}
    >
      {label}
    </span>
  );
}
