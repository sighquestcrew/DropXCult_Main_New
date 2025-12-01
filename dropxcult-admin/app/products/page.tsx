"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Trash2, Plus, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminProductsPage() {
    const queryClient = useQueryClient();

    // 1. Fetch Products
    const { data: products, isLoading } = useQuery({
        queryKey: ["admin-products"],
        queryFn: async () => {
            const { data } = await axios.get("/api/products");
            return data;
        },
    });

    // 2. Delete Logic
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`/api/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            toast.success("Product deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete product");
        },
    });

    if (isLoading)
        return (
            <div className="p-10 text-white">
                <Loader2 className="animate-spin h-8 w-8 text-red-600" />
            </div>
        );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <Link href="/products/new">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 font-bold transition">
                        <Plus size={20} />
                        Add Product
                    </button>
                </Link>
            </div>

            <div className="bg-zinc-900 rounded border border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-gray-400">
                    <thead className="bg-black text-xs uppercase font-bold text-gray-500">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {products?.map((product: any) => (
                            <tr key={product.id} className="hover:bg-zinc-800/50 transition">
                                <td className="p-4">
                                    <div className="relative h-12 w-12 bg-zinc-800 rounded overflow-hidden">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-white">{product.name}</td>
                                <td className="p-4">₹{product.price}</td>
                                <td className="p-4">
                                    <span className="bg-zinc-800 text-xs px-2 py-1 rounded text-gray-300">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/products/edit/${product.id}`}>
                                        <button className="text-blue-500 hover:text-white transition">
                                            <Edit size={18} />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm("Are you sure you want to delete this item?")
                                            ) {
                                                deleteMutation.mutate(product.id);
                                            }
                                        }}
                                        className="text-red-500 hover:text-white transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
