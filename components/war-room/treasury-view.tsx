"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Target 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { db, Transaction, SystemSettings } from "@/lib/firebase";
import TiltCard from "@/components/tilt-card";
import FloatingLabelInput from "@/components/floating-label-input";

export function TreasuryView() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("other");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    });

    // Fetch settings (assuming a single doc 'global_settings' for simplicity, or we can query)
    // For now, let's mock or fetch if exists.
    // Ideally, we'd have a separate collection 'settings'.
    
    return () => unsub();
  }, []);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "transactions"), {
        description: desc,
        amount: parseFloat(amount),
        type,
        category,
        date: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      setDesc("");
      setAmount("");
      setCategory("other");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Borrar transacción?")) return;
    await deleteDoc(doc(db, "transactions", id));
  };

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const margin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0";

  // Chart Data (Last 5 transactions for simplicity or grouped by category)
  // Let's do a simple Income vs Expense chart
  const chartData = [
    { name: "Ingresos", amount: totalIncome, fill: "#34d399" },
    { name: "Gastos", amount: totalExpenses, fill: "#f87171" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <TiltCard className="rounded-xl border border-emerald-500/20 bg-black/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-emerald-500/60">Ingresos Totales</p>
              <p className="text-xl font-bold text-emerald-400">${totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="rounded-xl border border-red-500/20 bg-black/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-500/10 p-2 text-red-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-red-500/60">Gastos Totales</p>
              <p className="text-xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="rounded-xl border border-cyan-500/20 bg-black/40 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-cyan-500/10 p-2 text-cyan-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-cyan-500/60">Beneficio Neto</p>
              <p className={`text-xl font-bold ${netProfit >= 0 ? "text-cyan-400" : "text-red-400"}`}>
                ${netProfit.toLocaleString()}
              </p>
              <p className="text-[10px] text-cyan-500/40">Margen: {margin}%</p>
            </div>
          </div>
        </TiltCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Transactions List */}
        <div className="space-y-4">
          <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-4">
            <h3 className="mb-4 text-xs font-mono uppercase tracking-widest text-cyan-400">
              Historial de Transacciones
            </h3>
            <div className="h-[400px] overflow-y-auto pr-2">
              {transactions.length === 0 ? (
                <div className="flex h-full items-center justify-center text-cyan-500/30 font-mono text-xs">
                  Sin registros financieros.
                </div>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="sticky top-0 bg-black/90 text-cyan-500/50">
                    <tr>
                      <th className="pb-2">Fecha</th>
                      <th className="pb-2">Descripción</th>
                      <th className="pb-2">Cat.</th>
                      <th className="pb-2 text-right">Monto</th>
                      <th className="pb-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/10">
                    {transactions.map((t) => (
                      <tr key={t.id} className="group hover:bg-cyan-500/5">
                        <td className="py-2 text-cyan-100/60">
                          {t.date.toLocaleDateString()}
                        </td>
                        <td className="py-2 text-cyan-100 font-semibold">{t.description}</td>
                        <td className="py-2 text-cyan-100/50 uppercase text-[10px]">{t.category}</td>
                        <td className={`py-2 text-right font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                        </td>
                        <td className="py-2 text-right">
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="text-red-500/40 opacity-0 hover:text-red-400 group-hover:opacity-100 transition-opacity"
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

        {/* Add Transaction & Charts */}
        <div className="space-y-6">
          {/* Add Form */}
          <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-4">
            <h3 className="mb-4 text-xs font-mono uppercase tracking-widest text-cyan-400">
              Nueva Transacción
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${type === "income" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-black/40 text-gray-500 border border-transparent"}`}
                >
                  Ingreso
                </button>
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${type === "expense" ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-black/40 text-gray-500 border border-transparent"}`}
                >
                  Gasto
                </button>
              </div>

              <FloatingLabelInput 
                id="desc"
                label="Descripción"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              
              <div className="flex gap-2">
                <div className="w-1/2">
                  <FloatingLabelInput 
                    id="amount"
                    label="Monto"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-full w-full rounded bg-transparent border-b border-cyan-500/50 text-xs text-cyan-100 focus:outline-none bg-black"
                  >
                    <option value="project_payment">Pago Proyecto</option>
                    <option value="hosting">Hosting</option>
                    <option value="marketing">Marketing</option>
                    <option value="software_license">Licencias</option>
                    <option value="contractor">Contratista</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 text-xs font-bold uppercase transition-colors"
              >
                <Plus className="h-3 w-3" /> Registrar
              </button>
            </form>
          </div>

          {/* Mini Chart */}
          <div className="h-48 rounded-xl border border-cyan-500/20 bg-black/60 p-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#0891b2" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #06b6d4' }}
                    itemStyle={{ color: '#fff', fontSize: '11px' }}
                    cursor={{fill: 'rgba(6, 182, 212, 0.1)'}}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
