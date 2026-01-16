import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 
import { createClient } from "@/utils/supabase/server"; // Import Supabase

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Print-Link",
  description: "Remote printing service",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch User Session Here
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Pass User to Navbar */}
        <Navbar user={user} />
        
        <main>
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}