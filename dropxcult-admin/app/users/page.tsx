"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Trash2, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();

    // 1. Fetch Users
    const { data: users, isLoading } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            const { data } = await axios.get("/api/users");
            return data;
        },
    });

    // 2. Delete User Logic
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`/api/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User removed from the cult");
        },
        onError: () => {
            toast.error("Failed to delete user");
        },
    });

    if (isLoading) return <div className="p-10 text-white"><Loader2 className="animate-spin h-8 w-8 text-red-600" /></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Cult Members ({users?.length || 0})</h1>
            </div>

            <div className="bg-zinc-900 rounded border border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-gray-400">
                    <thead className="bg-black text-xs uppercase font-bold text-gray-500">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users?.map((user: any) => (
                            <tr key={user.id} className="hover:bg-zinc-800/50 transition">
                                <td className="p-4 font-bold text-white flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-500">
                                        <UserIcon size={14} />
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    {user.isAdmin ? (
                                        <span className="bg-red-900/30 text-red-500 border border-red-900/50 text-xs px-2 py-1 rounded font-bold uppercase flex items-center gap-1 w-fit">
                                            <Shield size={12} /> Admin
                                        </span>
                                    ) : (
                                        <span className="bg-zinc-800 text-gray-400 text-xs px-2 py-1 rounded font-bold uppercase">
                                            Member
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-sm">{dayjs(user.createdAt).format("DD MMM YYYY")}</td>
                                <td className="p-4 text-right">
                                    {!user.isAdmin && (
                                        <button
                                            onClick={() => {
                                                if (confirm("Kick this user out of the cult?")) {
                                                    deleteMutation.mutate(user.id);
                                                }
                                            }}
                                            className="text-red-500 hover:text-white transition p-2 hover:bg-red-600 rounded"
                                            title="Delete User"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
