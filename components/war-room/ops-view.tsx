"use client";

import { useEffect, useState } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  deleteDoc, 
  doc 
} from "firebase/firestore";
import { 
  Briefcase, 
  Code, 
  GitBranch, 
  Plus, 
  Trash2, 
  Calendar,
  ExternalLink
} from "lucide-react";
import { db, Project, ProjectStatus } from "@/lib/firebase";
import FloatingLabelInput from "@/components/floating-label-input";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  lead: "text-gray-400 bg-gray-500/10 border-gray-500/30",
  negotiation: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  development: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  qa: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  deployment: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  maintenance: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  completed: "text-green-400 bg-green-500/10 border-green-500/30",
  archived: "text-slate-500 bg-slate-500/10 border-slate-500/30",
};

export function OpsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newStack, setNewStack] = useState("");
  const [newRepo, setNewRepo] = useState("");

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        startDate: doc.data().startDate?.toDate(),
        deadline: doc.data().deadline?.toDate(),
      })) as Project[];
      setProjects(data);
    });
    return () => unsub();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newClient) return;

    try {
      await addDoc(collection(db, "projects"), {
        name: newName,
        clientName: newClient,
        status: "lead",
        techStack: newStack ? newStack.split(",").map(s => s.trim()) : [],
        repositoryUrl: newRepo,
        createdAt: serverTimestamp(),
      });
      setNewName("");
      setNewClient("");
      setNewStack("");
      setNewRepo("");
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "projects", id), { status });
  };

  const deleteProject = async (id: string) => {
    if (!confirm("¿Eliminar proyecto y todo su historial?")) return;
    await deleteDoc(doc(db, "projects", id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-mono font-semibold text-cyan-50">
          Proyectos Activos <span className="text-cyan-500/50">({projects.length})</span>
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded bg-cyan-500/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:bg-cyan-500/30 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nuevo Proyecto
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProject} className="rounded-xl border border-cyan-500/30 bg-black/60 p-4 space-y-4">
           <div className="grid gap-4 md:grid-cols-2">
             <FloatingLabelInput id="p_name" label="Nombre del Proyecto" value={newName} onChange={(e) => setNewName(e.target.value)} />
             <FloatingLabelInput id="p_client" label="Cliente" value={newClient} onChange={(e) => setNewClient(e.target.value)} />
             <FloatingLabelInput id="p_stack" label="Tech Stack (sep por comas)" value={newStack} onChange={(e) => setNewStack(e.target.value)} />
             <FloatingLabelInput id="p_repo" label="Repo URL" value={newRepo} onChange={(e) => setNewRepo(e.target.value)} />
           </div>
           <div className="flex justify-end gap-2">
             <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 text-xs text-gray-500 hover:text-white">Cancelar</button>
             <button type="submit" className="rounded bg-cyan-500 px-4 py-1 text-xs font-bold text-black uppercase">Crear</button>
           </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full py-10 text-center font-mono text-sm text-cyan-500/40 border border-dashed border-cyan-500/20 rounded-xl">
            No hay operaciones activas. Inicia un nuevo proyecto.
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="group relative flex flex-col justify-between rounded-xl border border-cyan-500/20 bg-black/40 p-5 hover:border-cyan-500/50 hover:bg-black/60 transition-all">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-cyan-100">{project.name}</h3>
                    <p className="text-xs text-cyan-100/60 flex items-center gap-1 mt-1">
                      <Briefcase className="h-3 w-3" /> {project.clientName}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${STATUS_COLORS[project.status] || STATUS_COLORS.lead}`}>
                    {project.status}
                  </div>
                </div>

                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="space-y-2 pt-2 border-t border-cyan-500/10">
                  {project.repositoryUrl && (
                    <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-cyan-400 hover:underline">
                      <GitBranch className="h-3 w-3" /> Repositorio
                    </a>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-cyan-500/40">
                    <Calendar className="h-3 w-3" /> 
                    Creado: {project.createdAt?.toLocaleDateString() || "N/A"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-cyan-500/10">
                <select
                  value={project.status}
                  onChange={(e) => updateStatus(project.id, e.target.value)}
                  className="bg-transparent text-[10px] text-cyan-100/70 focus:outline-none uppercase font-mono cursor-pointer hover:text-cyan-300"
                >
                  {Object.keys(STATUS_COLORS).map((s) => (
                    <option key={s} value={s} className="bg-black text-gray-300">{s}</option>
                  ))}
                </select>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
