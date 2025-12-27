"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Globe,
  Shield,
  Upload,
  Trash2,
  Plus,
  Save,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { db, storage, Lead, Target, Audit } from "@/lib/firebase";
import { StatCard } from "@/components/stat-card";
import TiltCard from "@/components/tilt-card";
import FloatingLabelInput from "@/components/floating-label-input";

interface ChartDatum {
  name: string;
  value: number;
  fill: string;
}

export default function WarRoomPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Audit Form State
  const [auditCompany, setAuditCompany] = useState("");
  const [auditNotes, setAuditNotes] = useState("");
  const [auditFile, setAuditFile] = useState<File | null>(null);
  const [isUploadingAudit, setIsUploadingAudit] = useState(false);

  // Target Form State
  const [newTargetCompany, setNewTargetCompany] = useState("");
  const [newTargetContact, setNewTargetContact] = useState("");
  const [newTargetNotes, setNewTargetNotes] = useState("");
  const [isAddingTarget, setIsAddingTarget] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("tlayersolution_gatekeeper")
        : null;
    if (token === "granted") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.replace("/gatekeeper");
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthorized) return;

    const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const targetsQuery = query(
      collection(db, "targets"),
      orderBy("createdAt", "desc"),
    );
    const auditsQuery = query(collection(db, "audits"), orderBy("createdAt", "desc"));

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const nextLeads: Lead[] = snapshot.docs.map((document) => {
        const data = document.data() as any;
        return {
          id: document.id,
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp,
          message: data.message,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
          status: data.status,
          dealValue: typeof data.dealValue === "number" ? data.dealValue : undefined,
          source: data.source,
        };
      });
      setLeads(nextLeads);
    });

    const unsubscribeTargets = onSnapshot(targetsQuery, (snapshot) => {
      const nextTargets: Target[] = snapshot.docs.map((document) => {
        const data = document.data() as any;
        return {
          id: document.id,
          company: data.company,
          contact: data.contact,
          status: data.status,
          notes: data.notes,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
        };
      });
      setTargets(nextTargets);
    });

    const unsubscribeAudits = onSnapshot(auditsQuery, (snapshot) => {
      const nextAudits: Audit[] = snapshot.docs.map((document) => {
        const data = document.data() as any;
        return {
          id: document.id,
          company: data.company,
          filePath: data.filePath,
          url: data.url,
          notes: data.notes,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
        };
      });
      setAudits(nextAudits);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeTargets();
      unsubscribeAudits();
    };
  }, [isAuthorized]);

  useEffect(() => {
    setCurrentTime(new Date());
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // --- ACTIONS ---

  const handleUpdateLead = async (id: string, field: string, value: any) => {
    try {
      const leadRef = doc(db, "leads", id);
      await updateDoc(leadRef, {
        [field]: value,
      });
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

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetCompany.trim()) return;

    setIsAddingTarget(true);
    try {
      await addDoc(collection(db, "targets"), {
        company: newTargetCompany.trim(),
        contact: newTargetContact.trim(),
        notes: newTargetNotes.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setNewTargetCompany("");
      setNewTargetContact("");
      setNewTargetNotes("");
    } catch (error) {
      console.error("Error adding target:", error);
    } finally {
      setIsAddingTarget(false);
    }
  };

  const handleUpdateTarget = async (id: string, field: string, value: any) => {
    try {
      const targetRef = doc(db, "targets", id);
      await updateDoc(targetRef, {
        [field]: value,
      });
    } catch (error) {
      console.error("Error updating target:", error);
    }
  };

  const handleDeleteTarget = async (id: string) => {
    if (!confirm("¿Eliminar este objetivo?")) return;
    try {
      await deleteDoc(doc(db, "targets", id));
    } catch (error) {
      console.error("Error deleting target:", error);
    }
  };

  const handleAuditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auditCompany.trim() || !auditFile) return;

    setIsUploadingAudit(true);
    try {
      const auditDoc = await addDoc(collection(db, "audits"), {
        company: auditCompany.trim(),
        notes: auditNotes.trim() || null,
        createdAt: serverTimestamp(),
      });

      const storageReference = ref(
        storage,
        `audits/${auditDoc.id}/${auditFile.name}`,
      );
      await uploadBytes(storageReference, auditFile);
      const downloadUrl = await getDownloadURL(storageReference);

      await updateDoc(auditDoc, {
        filePath: storageReference.fullPath,
        url: downloadUrl,
      });

      setAuditCompany("");
      setAuditNotes("");
      setAuditFile(null);
    } finally {
      setIsUploadingAudit(false);
    }
  };

  const handleDeleteAudit = async (audit: Audit) => {
    if (!confirm(`¿Eliminar auditoría de ${audit.company}? Esto borrará el archivo también.`)) return;

    try {
      // 1. Delete Firestore Record
      await deleteDoc(doc(db, "audits", audit.id));

      // 2. Delete File from Storage (if path exists)
      if (audit.filePath) {
        const storageRef = ref(storage, audit.filePath);
        await deleteObject(storageRef).catch((error) => {
           console.warn("Could not delete file from storage (might not exist):", error);
        });
      }
    } catch (error) {
      console.error("Error deleting audit:", error);
      alert("Error al eliminar la auditoría.");
    }
  };

  // --- METRICS ---

  const leadsCount = leads.length;
  // Calculate pipeline total only from leads that are NOT lost
  const pipelineTotal = leads.reduce((total, lead) => {
    if (lead.status === "lost") return total;
    return total + (lead.dealValue || 0);
  }, 0);
  const targetAmount = 1000;

  const progressPercent = useMemo(() => {
    if (targetAmount === 0) return 0;
    // Calculate won total specifically for progress if desired,
    // but for now keeping "Pipeline Estimado" logic as requested (sum of non-lost).
    // If "Progreso" should be ONLY WON deals:
    // const wonTotal = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + (l.dealValue || 0), 0);
    // return Math.round((wonTotal / targetAmount) * 100);

    const value = Math.round((pipelineTotal / targetAmount) * 100);
    if (Number.isNaN(value)) return 0;
    if (value < 0) return 0;
    if (value > 100) return 100;
    return value;
  }, [pipelineTotal]);

  const financialChartData: ChartDatum[] = [
    {
      name: "Progreso",
      value: progressPercent,
      fill: "#22d3ee",
    },
  ];

  const argentinaTime = currentTime
    ? currentTime.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
      })
    : "--:--:--";

  const utcTime = currentTime
    ? currentTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      })
    : "--:--:--";

  if (isAuthorized === null) {
    return null;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-cyan-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:px-6 lg:px-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
              <Shield className="h-4 w-4" />
              War Room
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-cyan-50 md:text-4xl">
              Operations Command Center
            </h1>
            <p className="max-w-xl font-mono text-sm text-cyan-100/70">
              Estado de la misión hacia los 1.000 USD. Leads, objetivos y auditorías
              centralizados en un único panel.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TiltCard className="h-full max-w-xs">
              <div className="flex h-full flex-col justify-between rounded-xl border border-cyan-500/40 bg-black/70 px-4 py-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Clock className="h-4 w-4" />
                    <span>System</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-emerald-300">ONLINE</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-cyan-100/80">
                  <div>
                    <div className="text-cyan-400/80">AR TIME</div>
                    <div className="text-sm">{argentinaTime}</div>
                  </div>
                  <div>
                    <div className="text-cyan-400/80">UTC</div>
                    <div className="text-sm">{utcTime}</div>
                  </div>
                </div>
              </div>
            </TiltCard>

            <TiltCard className="h-full max-w-xs">
              <div className="flex h-full flex-col justify-between rounded-xl border border-cyan-500/40 bg-black/70 px-4 py-3 font-mono text-xs">
                <div className="flex items-center justify-between text-cyan-300">
                  <Globe className="h-4 w-4" />
                  <span>Web + Firebase Link</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-100/80">
                  <span>WEB STACK</span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300">
                    Next + Firebase
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-cyan-400/70">
                  Leads, targets y auditorías sincronizados en tiempo real.
                </div>
              </div>
            </TiltCard>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard label="Leads Totales" value={<span>{leadsCount}</span>} />
          <StatCard
            label="Pipeline Activo"
            value={
              <span>
                $
                {pipelineTotal.toLocaleString("es-AR", {
                  maximumFractionDigits: 0,
                })}
              </span>
            }
          />
          <StatCard
            label="Progreso hacia 1.000 USD"
            value={
              <span>
                {progressPercent}
                <span className="text-2xl align-top text-cyan-400">%</span>
              </span>
            }
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <TiltCard className="h-[260px] w-full rounded-2xl border border-cyan-500/40 bg-black/70 p-4">
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
                  Meta Financiera
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-100/70">
                  <span>Objetivo</span>
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
                    $1.000
                  </span>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-6">
                <div className="h-44 w-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={financialChartData}
                      startAngle={220}
                      endAngle={-40}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        dataKey="value"
                        tick={false}
                      />
                      <RadialBar background dataKey="value" cornerRadius={999} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 font-mono text-xs text-cyan-100/80">
                  <div>
                    <div className="text-cyan-400/80">Pipeline</div>
                    <div className="text-lg">
                      $
                      {pipelineTotal.toLocaleString("es-AR", {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-cyan-400/80">Gap</div>
                    <div className="text-lg">
                      $
                      {Math.max(targetAmount - pipelineTotal, 0).toLocaleString(
                        "es-AR",
                        {
                          maximumFractionDigits: 0,
                        },
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-cyan-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span>Sync activo con Firestore.</span>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="h-[260px] w-full rounded-2xl border border-cyan-500/40 bg-black/70 p-4">
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
                  Cacería de Objetivos (Targets)
                </div>
                <div className="font-mono text-[11px] text-cyan-100/70">
                  Activos: <span className="text-cyan-300">{targets.length}</span>
                </div>
              </div>

              {/* Add Target Form */}
              <form
                onSubmit={handleAddTarget}
                className="mb-3 flex items-center gap-2 border-b border-cyan-500/20 pb-3"
              >
                <input
                  type="text"
                  placeholder="Empresa..."
                  value={newTargetCompany}
                  onChange={(e) => setNewTargetCompany(e.target.value)}
                  className="w-1/3 rounded border border-cyan-500/30 bg-black/50 px-2 py-1 text-[10px] text-cyan-100 placeholder:text-cyan-500/40 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Contacto..."
                  value={newTargetContact}
                  onChange={(e) => setNewTargetContact(e.target.value)}
                  className="w-1/3 rounded border border-cyan-500/30 bg-black/50 px-2 py-1 text-[10px] text-cyan-100 placeholder:text-cyan-500/40 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newTargetCompany || isAddingTarget}
                  className="flex items-center justify-center rounded bg-cyan-500/20 px-3 py-1 text-cyan-300 hover:bg-cyan-500/40 disabled:opacity-50"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </form>

              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 font-mono text-xs text-cyan-100/80">
                  {targets.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-cyan-400/60">
                      Sin objetivos en radar.
                    </div>
                  ) : (
                    <table className="min-w-full border-separate border-spacing-y-1">
                      <thead className="sticky top-0 bg-black/90">
                        <tr className="text-[10px] text-cyan-400/80">
                          <th className="px-2 py-1 text-left font-normal">Empresa</th>
                          <th className="px-2 py-1 text-left font-normal">Status</th>
                          <th className="px-2 py-1 text-right font-normal">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {targets.map((target) => (
                          <tr key={target.id} className="text-[11px]">
                            <td className="rounded-l-md bg-cyan-500/5 px-2 py-1 align-middle">
                              <div className="font-semibold text-cyan-100">
                                {target.company}
                              </div>
                              <div className="text-[9px] text-cyan-100/50">
                                {target.contact || "Sin contacto"}
                              </div>
                            </td>
                            <td className="bg-cyan-500/5 px-2 py-1 align-middle">
                              <select
                                value={target.status || "pending"}
                                onChange={(e) =>
                                  handleUpdateTarget(target.id, "status", e.target.value)
                                }
                                className={`w-full rounded border-none bg-transparent py-0 pl-0 pr-6 text-[10px] font-semibold uppercase tracking-wide focus:ring-0 ${
                                  target.status === "converted"
                                    ? "text-emerald-400"
                                    : target.status === "discarded"
                                    ? "text-red-400"
                                    : "text-cyan-300"
                                }`}
                              >
                                <option value="pending">Pendiente</option>
                                <option value="analyzing">Analizando</option>
                                <option value="contacted">Contactado</option>
                                <option value="converted">Convertido</option>
                                <option value="discarded">Descartado</option>
                              </select>
                            </td>
                            <td className="rounded-r-md bg-cyan-500/5 px-2 py-1 text-right align-middle">
                              <button
                                onClick={() => handleDeleteTarget(target.id)}
                                className="inline-flex rounded p-1 hover:bg-red-500/20 hover:text-red-400"
                                title="Eliminar objetivo"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </TiltCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <TiltCard className="w-full rounded-2xl border border-cyan-500/40 bg-black/70 p-4">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
                  Lead Manager (CRM)
                </div>
                <div className="font-mono text-[11px] text-cyan-100/70">
                  Leads activos: <span className="text-cyan-300">{leadsCount}</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 font-mono text-xs text-cyan-100/80">
                  {leads.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-cyan-400/60">
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
                            <tr key={lead.id} className="text-[11px]">
                              {/* Name & Message Snippet */}
                              <td className="max-w-[120px] rounded-l-md bg-cyan-500/5 px-2 py-2">
                                <div className="truncate font-semibold text-cyan-100">
                                  {lead.name || "Anónimo"}
                                </div>
                                <div className="truncate text-[9px] text-cyan-100/50" title={lead.message}>
                                  {lead.message || "Sin mensaje"}
                                </div>
                              </td>

                              {/* Status Selector */}
                              <td className="bg-cyan-500/5 px-2 py-2">
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
                              <td className="bg-cyan-500/5 px-2 py-2">
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
                              <td className="bg-cyan-500/5 px-2 py-2">
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
                              <td className="rounded-r-md bg-cyan-500/5 px-2 py-2 text-right">
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
          </TiltCard>

          <TiltCard className="w-full rounded-2xl border border-cyan-500/40 bg-black/70 p-4">
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
                  Audit Manager
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-100/70">
                  <Upload className="h-3 w-3" />
                  <span>Backups cifrados en Storage</span>
                </div>
              </div>

              <form onSubmit={handleAuditSubmit} className="space-y-3 text-xs">
                <FloatingLabelInput
                  id="audit_company"
                  label="Empresa"
                  value={auditCompany}
                  onChange={(event) => setAuditCompany(event.target.value)}
                />
                <FloatingLabelInput
                  id="audit_notes"
                  label="Notas (opcional)"
                  as="textarea"
                  value={auditNotes}
                  onChange={(event) => setAuditNotes(event.target.value)}
                />
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="file"
                    accept=".pdf,.zip,.txt,.doc,.docx"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setAuditFile(file);
                    }}
                    className="block w-full text-[11px] text-cyan-100/70 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-cyan-100 hover:file:bg-cyan-500/30"
                  />
                  <button
                    type="submit"
                    disabled={
                      isUploadingAudit || !auditCompany.trim() || !auditFile
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-cyan-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-black hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploadingAudit ? "Subiendo..." : "Subir"}
                  </button>
                </div>
              </form>

              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 font-mono text-xs text-cyan-100/80">
                  {audits.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-cyan-400/60">
                      Aún no hay auditorías cargadas.
                    </div>
                  ) : (
                    <table className="min-w-full border-separate border-spacing-y-1">
                      <thead className="sticky top-0 bg-black/80">
                        <tr className="text-[10px] text-cyan-400/80">
                          <th className="px-2 py-1 text-left font-normal">Empresa</th>
                          <th className="px-2 py-1 text-left font-normal">Archivo</th>
                          <th className="px-2 py-1 text-left font-normal">Acceso</th>
                        </tr>
                      </thead>
                      <tbody>
                        {audits.map((audit) => (
                          <tr key={audit.id} className="text-[11px]">
                            <td className="rounded-l-md bg-cyan-500/5 px-2 py-1">
                              {audit.company}
                            </td>
                            <td className="max-w-xs truncate bg-cyan-500/5 px-2 py-1">
                              {(audit.filePath || "").split("/").pop() || "Archivo desconocido"}
                            </td>
                            <td className="rounded-r-md bg-cyan-500/5 px-2 py-1">
                              {audit.url ? (
                                <a
                                  href={audit.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-cyan-300 hover:bg-cyan-500/20"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Abrir
                                </a>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-red-400 cursor-not-allowed" title="Hubo un error al subir el archivo">
                                  <AlertCircle className="h-3 w-3" />
                                  Error
                                </span>
                              )}
                              
                              <button
                                onClick={() => handleDeleteAudit(audit)}
                                className="inline-flex rounded p-1 hover:bg-red-500/20 hover:text-red-400"
                                title="Eliminar Auditoría"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </TiltCard>
        </section>
      </div>
    </main>
  );
}
