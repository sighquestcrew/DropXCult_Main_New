"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Check, X, DollarSign, Eye } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState } from "react";
// IMPORT 2D COMPONENT INSTEAD OF 3D
import TwoDShirt from "@/components/customize/TwoDShirt"; 

export default function AdminCustomRequestsPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  
  const [selectedDesign, setSelectedDesign] = useState<any>(null);
  const [adminView, setAdminView] = useState("front"); // State to toggle views in Admin

  // 1. Fetch All Requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ["admin-custom-requests"],
    queryFn: async () => {
      const { data } = await axios.get("/api/customize", {
         headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      return data;
    },
    enabled: !!userInfo?.isAdmin,
  });

  // 2. Action Mutation (Accept/Reject/Royalty)
  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string, action: string }) => {
      await axios.post(`/api/customize/${id}/action`, { action }, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-custom-requests"] });
      toast.success("Status Updated");
      setSelectedDesign(null); 
    },
    onError: () => toast.error("Action Failed"),
  });

  if (isLoading) return <div className="p-10"><Loader2 className="animate-spin text-red-600"/></div>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8">Incoming Custom Requests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LIST SECTION */}
        <div className="space-y-4 h-[80vh] overflow-y-auto custom-scrollbar pr-2">
          {requests?.map((req: any) => (
            <div 
              key={req.id} 
              className={`bg-zinc-900 p-4 rounded border cursor-pointer transition ${selectedDesign?.id === req.id ? "border-red-600 bg-zinc-800" : "border-zinc-800 hover:border-gray-600"}`}
              onClick={() => setSelectedDesign(req)}
            >
              <div className="flex gap-4">
                {/* Thumbnail (Use Front Image or Fallback) */}
                <div className="h-20 w-20 bg-black rounded overflow-hidden relative border border-zinc-700">
                  {req.frontImage ? (
                    <img src={req.frontImage} className="object-cover h-full w-full" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-600">No Art</div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{req.user?.name || "Unknown"}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded h-fit ${
                      req.status === "Pending" ? "bg-blue-900 text-blue-300" :
                      req.status === "Accepted" ? "bg-green-900 text-green-300" :
                      req.status === "Royalty_Pending" ? "bg-yellow-900 text-yellow-300" :
                      "bg-red-900 text-red-300"
                    }`}>{req.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">{req.user?.email}</p>
                  <p className="text-sm mt-1 font-mono text-gray-300">{req.type} | {req.size} | {req.color}</p>
                </div>
              </div>
            </div>
          ))}
          {requests?.length === 0 && <p className="text-gray-500">No pending requests.</p>}
        </div>

        {/* PREVIEW & ACTION PANEL */}
        <div className="sticky top-4 h-fit">
          {selectedDesign ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded p-6">
              <h3 className="font-bold mb-4 border-b border-zinc-800 pb-2 flex justify-between items-center">
                <span>Inspecting: {selectedDesign.user?.name}</span>
                <span className="text-xs text-gray-500">{selectedDesign.id}</span>
              </h3>
              
              {/* --- 2D INSPECTOR --- */}
              <div className="h-[500px] mb-4">
                <TwoDShirt 
                  design={selectedDesign} 
                  view={adminView} 
                  setView={setAdminView} 
                  onUpdateLayer={() => {}} // Admin mostly views, but could edit if we added logic
                />
              </div>
              
              {/* ACTION BUTTONS */}
              {selectedDesign.status === "Pending" && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <button 
                    onClick={() => actionMutation.mutate({ id: selectedDesign.id, action: "accept" })}
                    className="bg-green-600 hover:bg-green-700 py-3 rounded font-bold text-sm flex flex-col items-center gap-1"
                  >
                    <Check size={18}/> Accept
                  </button>
                  <button 
                    onClick={() => actionMutation.mutate({ id: selectedDesign.id, action: "reject" })}
                    className="bg-red-600 hover:bg-red-700 py-3 rounded font-bold text-sm flex flex-col items-center gap-1"
                  >
                    <X size={18}/> Reject
                  </button>
                  <button 
                    onClick={() => actionMutation.mutate({ id: selectedDesign.id, action: "offer_royalty" })}
                    className="bg-yellow-600 hover:bg-yellow-700 py-3 rounded font-bold text-sm flex flex-col items-center gap-1"
                  >
                    <DollarSign size={18} /> Offer Royalty
                  </button>
                </div>
              )}

              {selectedDesign.status !== "Pending" && (
                <div className="text-center p-4 bg-black rounded text-gray-400">
                  Request is already processed ({selectedDesign.status})
                </div>
              )}

            </div>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-zinc-800 rounded flex flex-col items-center justify-center text-gray-500">
              <Eye size={48} className="mb-4 opacity-50" />
              <p>Select a request from the list</p>
              <p className="text-sm">to inspect the design</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}



// For 3-D

// "use client";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { Loader2, Check, X, DollarSign, Eye } from "lucide-react";
// import { toast } from "sonner";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { useState } from "react";
// import ThreeDShirt from "@/components/customize/ThreeDShirt";

// export default function AdminCustomRequestsPage() {
//   const { userInfo } = useSelector((state: RootState) => state.auth);
//   const queryClient = useQueryClient();
//   const [selectedDesign, setSelectedDesign] = useState<any>(null);

//   // 1. Fetch All Requests (Admin Mode)
//   const { data: requests, isLoading } = useQuery({
//     queryKey: ["admin-custom-requests"],
//     queryFn: async () => {
//       const { data } = await axios.get("/api/customize", {
//          headers: { Authorization: `Bearer ${userInfo?.token}` }
//       });
//       return data;
//     },
//     enabled: !!userInfo?.isAdmin,
//   });

//   // 2. Action Mutation
//   const actionMutation = useMutation({
//     mutationFn: async ({ id, action }: { id: string, action: string }) => {
//       await axios.post(`/api/customize/${id}/action`, { action }, {
//         headers: { Authorization: `Bearer ${userInfo?.token}` }
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admin-custom-requests"] });
//       toast.success("Status Updated");
//       setSelectedDesign(null); // Close preview
//     },
//     onError: () => toast.error("Action Failed"),
//   });

//   if (isLoading) return <div className="p-10"><Loader2 className="animate-spin text-red-600"/></div>;

//   return (
//     <div className="text-white">
//       <h1 className="text-3xl font-bold mb-8">Incoming Custom Requests</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* LIST SECTION */}
//         <div className="space-y-4">
//           {requests?.map((req: any) => (
//             <div key={req._id} className="bg-zinc-900 p-4 rounded border border-zinc-800 flex gap-4">
//               {/* Thumbnail */}
//               <div className="h-20 w-20 bg-black rounded overflow-hidden relative">
//                 {req.frontImage ? (
//                   <img src={req.frontImage} className="object-cover h-full w-full" />
//                 ) : (
//                   <div className="h-full w-full flex items-center justify-center text-xs text-gray-600">No Img</div>
//                 )}
//               </div>

//               {/* Details */}
//               <div className="flex-1">
//                 <div className="flex justify-between">
//                   <h3 className="font-bold">{req.user?.name || "Unknown User"}</h3>
//                   <span className={`text-xs font-bold px-2 py-1 rounded ${
//                     req.status === "Pending" ? "bg-blue-900 text-blue-300" :
//                     req.status === "Accepted" ? "bg-green-900 text-green-300" :
//                     "bg-zinc-800 text-gray-400"
//                   }`}>{req.status}</span>
//                 </div>
//                 <p className="text-xs text-gray-400">{req.user?.email}</p>
//                 <p className="text-sm mt-1">{req.type} | {req.size} | {req.color}</p>
                
//                 {/* Action Buttons */}
//                 <div className="flex gap-2 mt-3">
//                   <button 
//                     onClick={() => setSelectedDesign(req)}
//                     className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-xs"
//                   >
//                     <Eye size={12}/> Inspect 3D
//                   </button>
                  
//                   {req.status === "Pending" && (
//                     <>
//                       <button 
//                         onClick={() => actionMutation.mutate({ id: req._id, action: "accept" })}
//                         className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
//                       >
//                         Accept
//                       </button>
//                       <button 
//                         onClick={() => actionMutation.mutate({ id: req._id, action: "reject" })}
//                         className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
//                       >
//                         Reject
//                       </button>
//                       <button 
//                         onClick={() => actionMutation.mutate({ id: req._id, action: "offer_royalty" })}
//                         className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs flex items-center gap-1"
//                       >
//                         <DollarSign size={12} /> Royalty Offer
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//           {requests?.length === 0 && <p className="text-gray-500">No pending requests.</p>}
//         </div>

//         {/* 3D INSPECTION PANEL (Sticky) */}
//         <div className="sticky top-4 h-fit">
//           {selectedDesign ? (
//             <div className="bg-zinc-900 border border-zinc-800 rounded p-4">
//               <h3 className="font-bold mb-4 border-b border-zinc-800 pb-2">Inspecting: {selectedDesign.user?.name}'s Design</h3>
              
//               {/* Reusing the Shirt Component in 'Read Only' mode (no setConfig passed) */}
//               <ThreeDShirt config={selectedDesign} setConfig={() => {}} />
              
//               <div className="mt-4 text-xs text-gray-400">
//                 <p>Front Scale: {selectedDesign.designConfig.front.scale}</p>
//                 <p>Front X: {selectedDesign.designConfig.front.x}</p>
//                 <p>Front Y: {selectedDesign.designConfig.front.y}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="h-[400px] border-2 border-dashed border-zinc-800 rounded flex items-center justify-center text-gray-500">
//               Select a request to inspect 3D Model
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }