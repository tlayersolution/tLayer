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
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { 
  Upload, 
  Trash2, 
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { db, storage, Audit } from "@/lib/firebase";
import FloatingLabelInput from "@/components/floating-label-input";

export function ArchivesView() {
  const [audits, setAudits] = useState<Audit[]>([]);
  
  // Form State
  const [auditCompany, setAuditCompany] = useState("");
  const [auditNotes, setAuditNotes] = useState("");
  const [auditFile, setAuditFile] = useState<File | null>(null);
  const [isUploadingAudit, setIsUploadingAudit] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "audits"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Audit[];
      setAudits(data);
    });
    return () => unsub();
  }, []);

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
      await deleteDoc(doc(db, "audits", audit.id));
      if (audit.filePath) {
        const storageRef = ref(storage, audit.filePath);
        await deleteObject(storageRef).catch((error) => {
           console.warn("Could not delete file from storage (might not exist):", error);
        });
      }
    } catch (error) {
      console.error("Error deleting audit:", error);
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/40 bg-black/70 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
            Archives / Audit Manager
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-cyan-100/70">
            <Upload className="h-3 w-3" />
            <span>Backups cifrados en Storage</span>
          </div>
        </div>

        <form onSubmit={handleAuditSubmit} className="space-y-3 text-xs bg-black/40 p-3 rounded-lg border border-cyan-500/20">
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
              <div className="flex h-48 items-center justify-center text-cyan-400/60">
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
                    <tr key={audit.id} className="text-[11px] hover:bg-cyan-500/5 transition-colors">
                      <td className="rounded-l-md px-2 py-1">
                        {audit.company}
                      </td>
                      <td className="max-w-xs truncate px-2 py-1">
                        {(audit.filePath || "").split("/").pop() || "Archivo desconocido"}
                      </td>
                      <td className="rounded-r-md px-2 py-1">
                        <div className="flex items-center gap-2">
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
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-wide text-red-400 cursor-not-allowed" title="Error al subir">
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
