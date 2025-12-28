"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  ArrowUpRight, 
  Trash2, 
  Users 
} from "lucide-react";
import { db, Lead, LeadStatus } from "@/lib/firebase";

export function IntelView() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Lead[];
      setLeads(data);
    });
    return () => unsub();
  }, []);

  const handleUpdateLead = async (id: string, field: string, value: any) => {
    try {
      await updateDoc(doc(db, "leads", id), { [field]: value });
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("¿Eliminar este lead permanentemente?")) return;
    try {
      await deleteDoc(doc(db, "leads", id));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-black/70 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
            Intel / Lead Manager
          </div>
          <div className="font-mono text-[11px] text-cyan-100/70">
            Activos: <span className="text-cyan-300">{leads.length}</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 font-mono text-xs text-cyan-100/80">
            {leads.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-cyan-400/60">
                Aún no hay leads registrados.
              </div>
            ) : (
              <table className="min-w-full border-separate border-spacing-y-1">
                <thead className="sticky top-0 bg-black/80">
                  <tr className="text-[10px] text-cyan-400/80">
                    <th className="px-2 py-1 text-left font-normal">Lead</th>
                    <th className="px-2 py-1 text-left font-normal">Status</th>
                    <th className="px-2 py-1 text-left font-normal">Valor ($)</th>
                    <th className="px-2 py-1 text-left font-normal">
                      Contacto
                    </th>
                    <th className="px-2 py-1 text-right font-normal">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const whatsappNumber = lead.whatsapp || "";
                    const sanitizedWhatsapp = whatsappNumber.replace(
                      /[^\d]/g,
                      "",
                    );
                    const whatsappUrl =
                      sanitizedWhatsapp && lead.message
                        ? `https://wa.me/${sanitizedWhatsapp}?text=${encodeURIComponent(
                            lead.message,
                          )}`
                        : null;

                    return (
                      <tr key={lead.id} className="text-[11px] hover:bg-cyan-500/5 transition-colors">
                        {/* Name & Message Snippet */}
                        <td className="max-w-[120px] rounded-l-md px-2 py-2">
                          <div className="truncate font-semibold text-cyan-100">
                            {lead.name || "Anónimo"}
                          </div>
                          <div className="truncate text-[9px] text-cyan-100/50" title={lead.message}>
                            {lead.message || "Sin mensaje"}
                          </div>
                        </td>

                        {/* Status Selector */}
                        <td className="px-2 py-2">
                          <select
                            value={lead.status || "new"}
                            onChange={(e) =>
                              handleUpdateLead(lead.id, "status", e.target.value)
                            }
                            className={`w-full rounded border border-cyan-500/20 bg-black py-1 px-1 text-[10px] uppercase focus:border-cyan-500 focus:outline-none ${
                              lead.status === "won"
                                ? "text-emerald-400"
                                : lead.status === "lost"
                                ? "text-red-400"
                                : "text-cyan-300"
                            }`}
                          >
                            <option value="new">Nuevo</option>
                            <option value="contacted">Contactado</option>
                            <option value="negotiating">Negociando</option>
                            <option value="won">Ganado</option>
                            <option value="lost">Perdido</option>
                          </select>
                        </td>

                        {/* Deal Value Input */}
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <span className="text-cyan-500/60">$</span>
                            <input
                              type="number"
                              value={lead.dealValue || ""}
                              placeholder="0"
                              onChange={(e) =>
                                handleUpdateLead(
                                  lead.id,
                                  "dealValue",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-16 bg-transparent text-[11px] text-cyan-100 placeholder:text-cyan-500/30 focus:outline-none"
                            />
                          </div>
                        </td>

                        {/* Contact Link */}
                        <td className="px-2 py-2">
                          {whatsappUrl ? (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-[9px] text-emerald-300 hover:bg-emerald-500/20"
                            >
                              <ArrowUpRight className="h-3 w-3" />
                              WA
                            </a>
                          ) : (
                            <span className="text-[10px] text-cyan-400/30">
                              -
                            </span>
                          )}
                        </td>

                        {/* Delete Action */}
                        <td className="rounded-r-md px-2 py-2 text-right">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="inline-flex rounded p-1 hover:bg-red-500/20 hover:text-red-400"
                            title="Eliminar Lead"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
