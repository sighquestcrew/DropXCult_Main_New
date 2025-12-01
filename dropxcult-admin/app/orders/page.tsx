"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import dayjs from "dayjs";

export default function AdminOrdersPage() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const { data } = await axios.get("/api/orders");
            return data;
        },
    });

    if (isLoading) return <div className="p-10 text-white"><Loader2 className="animate-spin h-8 w-8 text-red-600" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Order History</h1>

            <div className="bg-zinc-900 rounded border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-black text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Paid</th>
                                <th className="p-4">Delivered</th>
                                <th className="p-4">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {orders?.map((order: any) => (
                                <tr key={order.id} className="hover:bg-zinc-800/50 transition">
                                    <td className="p-4 font-mono text-xs text-white">{order.id.substring(0, 8)}...</td>
                                    <td className="p-4 text-sm">{dayjs(order.createdAt).format("DD MMM YYYY")}</td>
                                    <td className="p-4 text-white">
                                        {order.shippingAddress?.fullName || "Guest"}
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4 font-bold text-white">₹{order.totalPrice}</td>

                                    {/* Paid Status */}
                                    <td className="p-4">
                                        {order.isPaid ? (
                                            <span className="flex items-center gap-1 text-green-500 text-xs font-bold uppercase">
                                                <CheckCircle size={14} /> Paid
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-500 text-xs font-bold uppercase">
                                                <XCircle size={14} /> Pending
                                            </span>
                                        )}
                                    </td>

                                    {/* Delivered Status */}
                                    <td className="p-4">
                                        {order.isDelivered ? (
                                            <span className="text-green-500 text-xs font-bold uppercase">Delivered</span>
                                        ) : (
                                            <span className="text-yellow-500 text-xs font-bold uppercase flex items-center gap-1">
                                                <Clock size={14} /> Processing
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-4 text-xs">
                                        {order.orderItems.length} items
                                    </td>
                                </tr>
                            ))}
                            {orders?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">No orders found yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
