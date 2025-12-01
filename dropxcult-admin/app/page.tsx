"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, DollarSign, ShoppingBag, Users, Package } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await axios.get("/api/stats");
      return data;
    },
  });

  if (isLoading) return <div className="p-10 text-white"><Loader2 className="animate-spin h-8 w-8 text-red-600" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Mission Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Total Revenue</h3>
            <DollarSign className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">₹{stats?.totalRevenue || 0}</p>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Total Orders</h3>
            <Package className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">{stats?.ordersCount || 0}</p>
        </div>

        {/* Card 3: Products */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Products</h3>
            <ShoppingBag className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{stats?.productsCount || 0}</p>
        </div>

        {/* Card 4: Users */}
        <div className="bg-zinc-900 p-6 rounded border border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase">Cult Members</h3>
            <Users className="text-red-500" />
          </div>
          <p className="text-3xl font-bold">{stats?.usersCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
