import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Users, Package, Palette } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DropXCult Admin | Cult Control",
  description: "Admin panel for DropXCult store management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 p-6 hidden md:block">
              <h2 className="text-2xl font-bold mb-8 text-red-600 tracking-tighter">CULT CONTROL</h2>

              <nav className="space-y-4">
                <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link href="/products" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                  <ShoppingBag size={20} />
                  Products
                </Link>
                <Link href="/orders" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                  <Package size={20} />
                  Orders
                </Link>
                <Link href="/users" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                  <Users size={20} />
                  Users
                </Link>
                <Link href="/custom-requests" className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-zinc-900 p-2 rounded transition">
                  <Palette size={20} />
                  Custom Requests
                </Link>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 bg-black overflow-x-hidden">
              {/* Mobile Nav */}
              <div className="md:hidden mb-6 overflow-x-auto pb-2 border-b border-zinc-800">
                <nav className="flex space-x-4 min-w-max">
                  <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-zinc-900 px-3 py-2 rounded">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/products" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-zinc-900 px-3 py-2 rounded">
                    <ShoppingBag size={16} /> Products
                  </Link>
                  <Link href="/orders" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-zinc-900 px-3 py-2 rounded">
                    <Package size={16} /> Orders
                  </Link>
                  <Link href="/users" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-zinc-900 px-3 py-2 rounded">
                    <Users size={16} /> Users
                  </Link>
                  <Link href="/custom-requests" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white bg-zinc-900 px-3 py-2 rounded">
                    <Palette size={16} /> Requests
                  </Link>
                </nav>
              </div>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
