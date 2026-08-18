import { useEffect, useMemo, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import {
  BellRing,
  Check,
  Download,
  FileCheck2,
  FileText,
  FolderOpen,
  Grid2X2,
  List,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
import { InternalPageState, UnsavedChangesDialog } from "@/components/dash2/InternalPageState";
import { Panel } from "@/components/dash2/Panel";
import { useResizableColumns } from "@/components/dash2/ResizableColumns";
import { ResourceListGridHeader } from "@/components/dash2/ResourceList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import pdfWorkerSource from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

type DocumentStatus = "valid" | "soon" | "expired" | "review";
type DocumentKind = "Certidão" | "Habilitação" | "Proposta" | "Financeiro" | "Técnico";
type DocumentOwner = "Empresa" | "Equipe" | "Pessoal";

type VaultDocument = {
  id: string;
  name: string;
  fileName: string;
  mimeType?: string | undefined;
  kind: DocumentKind;
  owner: DocumentOwner;
  status: DocumentStatus;
  expiresAt?: string | undefined;
  size: string;
  uploadedAt: string;
  updatedBy: string;
  uses: number;
  tags: string[];
  version: number;
};

type DocumentDraft = {
  name: string;
  kind: DocumentKind;
  owner: DocumentOwner;
  expiresAt: string;
  tags: string;
};

const storageKey = "licitabase.documents-vault.v1";
const documentFilesDatabase = "licitabase-documents-files";
const documentFilesStore = "files";

const documentResizableColumns = [
  { id: "validity", width: 188, min: 148, max: 300 },
  { id: "usage", width: 132, min: 116, max: 220 },
  { id: "actions", width: 128, min: 112, max: 190 },
];

const initialDocuments: VaultDocument[] = [
  {
    id: "certidao-federal",
    name: "Certidão conjunta federal",
    fileName: "certidao-federal-iridia.pdf",
    kind: "Certidão",
    owner: "Empresa",
    status: "valid",
    expiresAt: "2026-11-14",
    size: "824 KB",
    uploadedAt: "14 ago 2026 · 09:32",
    updatedBy: "Jussefer",
    uses: 4,
    tags: ["habilitação", "federal"],
    version: 2,
  },
  {
    id: "certidao-estadual",
    name: "Certidão negativa estadual",
    fileName: "certidao-estadual-mg.pdf",
    kind: "Certidão",
    owner: "Empresa",
    status: "soon",
    expiresAt: "2026-08-25",
    size: "512 KB",
    uploadedAt: "03 ago 2026 · 11:36",
    updatedBy: "Jussefer",
    uses: 3,
    tags: ["habilitação", "MG"],
    version: 1,
  },
  {
    id: "atestado-capacidade",
    name: "Atestado de capacidade técnica",
    fileName: "atestado-capacidade-tecnica.pdf",
    kind: "Técnico",
    owner: "Empresa",
    status: "review",
    size: "1,8 MB",
    uploadedAt: "29 jul 2026 · 15:14",
    updatedBy: "Jussefer",
    uses: 2,
    tags: ["TI", "experiência"],
    version: 3,
  },
  {
    id: "balanco-2025",
    name: "Balanço patrimonial 2025",
    fileName: "balanco-patrimonial-2025.pdf",
    kind: "Financeiro",
    owner: "Empresa",
    status: "valid",
    expiresAt: "2027-04-30",
    size: "2,4 MB",
    uploadedAt: "11 jul 2026 · 10:08",
    updatedBy: "Ana Martins",
    uses: 1,
    tags: ["financeiro", "balanço"],
    version: 1,
  },
  {
    id: "proposta-tecnica",
    name: "Modelo de proposta técnica",
    fileName: "modelo-proposta-tecnica.docx",
    kind: "Proposta",
    owner: "Equipe",
    status: "valid",
    size: "186 KB",
    uploadedAt: "08 ago 2026 · 16:22",
    updatedBy: "Ana Martins",
    uses: 6,
    tags: ["modelo", "proposta"],
    version: 5,
  },
  {
    id: "regularidade-municipal",
    name: "Certidão municipal — Iridia Soluções",
    fileName: "regularidade-municipal.pdf",
    kind: "Certidão",
    owner: "Empresa",
    status: "expired",
    expiresAt: "2026-08-10",
    size: "406 KB",
    uploadedAt: "10 maio 2026 · 14:45",
    updatedBy: "Jussefer",
    uses: 0,
    tags: ["habilitação", "municipal"],
    version: 1,
  },
];

const statusCopy: Record<
  DocumentStatus,
  { label: string; detail: string; className: string; Icon: LucideIcon }
> = {
  valid: {
    label: "Válido",
    detail: "Pronto para uso",
    className: "bg-brand-tint text-brand-strong",
    Icon: ShieldCheck,
  },
  soon: {
    label: "Vence em breve",
    detail: "Revisar antes do próximo uso",
    className: "bg-[#FFF6E8] text-[#C77008]",
    Icon: BellRing,
  },
  expired: {
    label: "Vencido",
    detail: "Substituição necessária",
    className: "bg-rose-50 text-rose-700",
    Icon: FileCheck2,
  },
  review: {
    label: "Revisar",
    detail: "Confirme a versão atual",
    className: "bg-[#EEF4FF] text-[#2455B6]",
    Icon: FileText,
  },
};

function readDocuments() {
  if (typeof window === "undefined") return initialDocuments;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as VaultDocument[]) : initialDocuments;
  } catch {
    return initialDocuments;
  }
}

function writeDocuments(documents: VaultDocument[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(documents));
}

function emptyDraft(document?: VaultDocument): DocumentDraft {
  return {
    name: document?.name ?? "",
    kind: document?.kind ?? "Certidão",
    owner: document?.owner ?? "Empresa",
    expiresAt: document?.expiresAt ?? "",
    tags: document?.tags.join(", ") ?? "",
  };
}

function deriveStatus(expiresAt: string): DocumentStatus {
  if (!expiresAt) return "review";
  const target = new Date(`${expiresAt}T12:00:00`);
  const now = new Date("2026-08-18T12:00:00");
  const difference = Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
  if (difference < 0) return "expired";
  return difference <= 30 ? "soon" : "valid";
}

function formatExpiry(document: VaultDocument) {
  if (!document.expiresAt) return "Sem validade definida";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(`${document.expiresAt}T12:00:00`),
  );
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function openDocumentFilesDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(documentFilesDatabase, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(documentFilesStore)) {
        request.result.createObjectStore(documentFilesStore);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveDocumentFile(documentId: string, file: File) {
  const database = await openDocumentFilesDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(documentFilesStore, "readwrite");
    transaction.objectStore(documentFilesStore).put(file, documentId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

async function readDocumentFile(documentId: string) {
  const database = await openDocumentFilesDatabase();
  const file = await new Promise<File | undefined>((resolve, reject) => {
    const request = database
      .transaction(documentFilesStore, "readonly")
      .objectStore(documentFilesStore)
      .get(documentId);
    request.onsuccess = () => resolve(request.result as File | undefined);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return file;
}

async function removeDocumentFile(documentId: string) {
  const database = await openDocumentFilesDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(documentFilesStore, "readwrite");
    transaction.objectStore(documentFilesStore).delete(documentId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
}

function previewType(document: VaultDocument) {
  const extension = document.fileName.split(".").pop()?.toLocaleLowerCase("pt-BR");
  if (
    document.mimeType?.startsWith("image/") ||
    ["jpg", "jpeg", "png", "webp"].includes(extension ?? "")
  ) {
    return "image";
  }
  if (document.mimeType === "application/pdf" || extension === "pdf") return "pdf";
  return null;
}

function PdfPagePreview({ source, documentName }: { source: string; documentName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | undefined;
    let renderTask: RenderTask | undefined;

    const renderFirstPage = async () => {
      try {
        setHasError(false);
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSource;

        const response = await fetch(source);
        if (!response.ok) throw new Error("Não foi possível ler o PDF.");
        const data = await response.arrayBuffer();
        loadingTask = pdfjs.getDocument({ data });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        const viewportContainer = canvas?.parentElement;
        if (!canvas || !viewportContainer || cancelled) return;

        const originalViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(viewportContainer.clientWidth - 2, 1);
        const availableHeight = Math.max(viewportContainer.clientHeight - 2, 1);
        const scale = Math.min(
          availableWidth / originalViewport.width,
          availableHeight / originalViewport.height,
        );
        const viewport = page.getViewport({ scale });
        const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context || cancelled) return;

        canvas.width = Math.ceil(viewport.width * deviceScale);
        canvas.height = Math.ceil(viewport.height * deviceScale);
        canvas.style.width = `${Math.ceil(viewport.width)}px`;
        canvas.style.height = `${Math.ceil(viewport.height)}px`;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const nextRenderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: deviceScale === 1 ? undefined : [deviceScale, 0, 0, deviceScale, 0, 0],
        });
        renderTask = nextRenderTask;
        await nextRenderTask.promise;
      } catch (error) {
        if (!cancelled) {
          setHasError(true);
          console.warn("Não foi possível renderizar a prévia do PDF", error);
        }
      }
    };

    void renderFirstPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
      void loadingTask?.destroy();
    };
  }, [source]);

  if (hasError) {
    return (
      <div className="flex size-full flex-col items-center justify-center bg-white px-5 text-center">
        <FileText className="size-6 text-brand-strong" aria-hidden="true" />
        <p className="mt-3 text-[11px] font-extrabold text-ink">Não foi possível abrir a prévia</p>
        <p className="mt-1 text-[10px] leading-relaxed text-slate-text">
          Baixe {documentName} para ver o arquivo completo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex size-full items-center justify-center overflow-hidden bg-white p-0.5">
      <canvas
        ref={canvasRef}
        aria-label={`Primeira página de ${documentName}`}
        className="max-h-full max-w-full shadow-sm"
      />
    </div>
  );
}

function DocumentPreview({
  document,
  source,
}: {
  document: VaultDocument;
  source?: string | undefined;
}) {
  const type = previewType(document);

  if (source && type === "image") {
    return (
      <img src={source} alt={`Prévia de ${document.name}`} className="size-full object-contain" />
    );
  }

  if (source && type === "pdf") {
    return <PdfPagePreview source={source} documentName={document.name} />;
  }

  const extension = document.fileName.split(".").pop()?.toUpperCase() ?? "ARQ";
  return (
    <div className="flex size-full flex-col items-center justify-center bg-page/65 px-5 text-center">
      <span className="grid size-11 place-items-center rounded-xl bg-white text-brand-strong shadow-sm">
        <FileText className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-[11px] font-extrabold text-ink">
        {source
          ? `Prévia de ${extension} indisponível no navegador`
          : "Arquivo original indisponível"}
      </p>
      <p className="mt-1 max-w-[260px] text-[10px] leading-relaxed text-slate-text">
        {source
          ? "Baixe o arquivo para abrir seu conteúdo no aplicativo compatível."
          : "Envie uma nova versão para guardar o arquivo e gerar sua prévia real."}
      </p>
    </div>
  );
}

export function DocumentsVaultPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<Record<string, string>>({});
  const [documents, setDocuments] = useState<VaultDocument[]>(readDocuments);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"library" | "pending">("library");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | DocumentKind>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<VaultDocument | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<VaultDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VaultDocument | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<DocumentDraft>(emptyDraft);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const { gridTemplateColumns: documentGridTemplateColumns, getResizeHandleProps } =
    useResizableColumns({
      storageKey: "licitabase.documents-list-widths.v1",
      columns: documentResizableColumns,
    });

  useEffect(() => {
    writeDocuments(documents);
  }, [documents]);

  useEffect(() => {
    let mounted = true;
    const loadPreviews = async () => {
      const nextEntries = await Promise.all(
        documents.map(async (document) => {
          if (previewUrlsRef.current[document.id])
            return [document.id, previewUrlsRef.current[document.id]] as const;
          try {
            const file = await readDocumentFile(document.id);
            if (!file) return null;
            const source = URL.createObjectURL(file);
            previewUrlsRef.current[document.id] = source;
            return [document.id, source] as const;
          } catch {
            return null;
          }
        }),
      );
      if (!mounted) return;
      setPreviewUrls(
        Object.fromEntries(
          nextEntries.filter((entry): entry is readonly [string, string] => Boolean(entry)),
        ),
      );
    };
    void loadPreviews();
    return () => {
      mounted = false;
    };
  }, [documents]);

  useEffect(
    () => () => {
      Object.values(previewUrlsRef.current).forEach((source) => URL.revokeObjectURL(source));
    },
    [],
  );

  useEffect(() => {
    const storedView = window.localStorage.getItem("licitabase.documents-view");
    if (storedView === "list" || storedView === "grid") setViewMode(storedView);
  }, []);

  const changeViewMode = (nextView: "list" | "grid") => {
    setViewMode(nextView);
    window.localStorage.setItem("licitabase.documents-view", nextView);
  };

  const pendingDocuments = documents.filter((document) => document.status !== "valid");
  const expiringDocuments = documents.filter((document) => document.status === "soon").length;
  const usedDocuments = documents.filter((document) => document.uses > 0).length;
  const metrics: Array<{
    label: string;
    value: number;
    description: string;
    Icon: LucideIcon;
    iconClassName: string;
  }> = [
    {
      label: "Documentos válidos",
      value: documents.filter((document) => document.status === "valid").length,
      description: "prontos para anexar",
      Icon: ShieldCheck,
      iconClassName: "bg-brand-tint text-brand-strong",
    },
    {
      label: "Próximos do vencimento",
      value: expiringDocuments,
      description: "pedem atenção nesta semana",
      Icon: BellRing,
      iconClassName: "bg-[#FFF6E8] text-[#C77008]",
    },
    {
      label: "Em propostas ativas",
      value: usedDocuments,
      description: "documentos já reutilizados",
      Icon: FileCheck2,
      iconClassName: "bg-[#EEF4FF] text-[#2455B6]",
    },
  ];

  const visibleDocuments = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return (tab === "pending" ? pendingDocuments : documents).filter((document) => {
      const matchesKind = kindFilter === "all" || document.kind === kindFilter;
      const matchesQuery = !normalized
        ? true
        : [document.name, document.fileName, document.kind, document.owner, ...document.tags]
            .join(" ")
            .toLocaleLowerCase("pt-BR")
            .includes(normalized);
      return matchesKind && matchesQuery;
    });
  }, [documents, kindFilter, pendingDocuments, query, tab]);

  const openUploader = (document?: VaultDocument) => {
    setReplaceTarget(document ?? null);
    setDraft(emptyDraft(document));
    setSelectedFile(null);
    setDirty(false);
    setEditorOpen(true);
  };

  const chooseFile = () => fileInputRef.current?.click();

  const updateDraft = <Key extends keyof DocumentDraft>(key: Key, value: DocumentDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const onFileSelected = (file?: File) => {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 20 MB.");
      return;
    }
    setSelectedFile(file);
    if (!draft.name.trim()) {
      updateDraft("name", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    } else {
      setDirty(true);
    }
  };

  const registerPreview = async (documentId: string, file: File) => {
    const previousSource = previewUrlsRef.current[documentId];
    if (previousSource) URL.revokeObjectURL(previousSource);
    const source = URL.createObjectURL(file);
    previewUrlsRef.current[documentId] = source;
    setPreviewUrls((current) => ({ ...current, [documentId]: source }));
    try {
      await saveDocumentFile(documentId, file);
    } catch {
      toast.warning("Arquivo disponível nesta sessão", {
        description: "Não foi possível mantê-lo no armazenamento local deste navegador.",
      });
    }
  };

  const saveDocument = async () => {
    const name = draft.name.trim();
    if (!name) {
      toast.error("Dê um nome para encontrar este documento depois.");
      return;
    }
    if (!replaceTarget && !selectedFile) {
      toast.error("Selecione o arquivo que será armazenado.");
      return;
    }
    const nextStatus = deriveStatus(draft.expiresAt);
    if (replaceTarget) {
      if (selectedFile) await registerPreview(replaceTarget.id, selectedFile);
      const next = documents.map((document) =>
        document.id === replaceTarget.id
          ? {
              ...document,
              name,
              kind: draft.kind,
              owner: draft.owner,
              expiresAt: draft.expiresAt || undefined,
              tags: parseTags(draft.tags),
              status: nextStatus,
              fileName: selectedFile?.name ?? document.fileName,
              mimeType: selectedFile?.type || document.mimeType,
              size: selectedFile ? `${Math.ceil(selectedFile.size / 1024)} KB` : document.size,
              updatedBy: "Jussefer",
              uploadedAt: "agora",
              version: document.version + 1,
            }
          : document,
      );
      setDocuments(next);
      toast.success("Nova versão registrada", {
        description: `${name} continua disponível nas propostas que já o utilizam.`,
      });
    } else {
      const next: VaultDocument = {
        id: `document-${Date.now()}`,
        name,
        fileName: selectedFile!.name,
        mimeType: selectedFile!.type,
        kind: draft.kind,
        owner: draft.owner,
        expiresAt: draft.expiresAt || undefined,
        status: nextStatus,
        size: `${Math.max(1, Math.ceil(selectedFile!.size / 1024))} KB`,
        uploadedAt: "agora",
        updatedBy: "Jussefer",
        uses: 0,
        tags: parseTags(draft.tags),
        version: 1,
      };
      await registerPreview(next.id, selectedFile!);
      setDocuments((current) => [next, ...current]);
      toast.success("Documento adicionado", {
        description: "Ele já pode ser reutilizado nas próximas propostas.",
      });
    }
    setDirty(false);
    setEditorOpen(false);
  };

  const requestCloseEditor = (open: boolean) => {
    if (!open && dirty) {
      setDiscardOpen(true);
      return;
    }
    setEditorOpen(open);
  };

  const openDetail = (document: VaultDocument) => {
    setSelected(document);
    setDetailOpen(true);
  };

  const removeDocument = () => {
    if (!deleteTarget) return;
    const source = previewUrlsRef.current[deleteTarget.id];
    if (source) URL.revokeObjectURL(source);
    delete previewUrlsRef.current[deleteTarget.id];
    setPreviewUrls((current) => {
      const next = { ...current };
      delete next[deleteTarget.id];
      return next;
    });
    void removeDocumentFile(deleteTarget.id);
    setDocuments((current) => current.filter((document) => document.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDetailOpen(false);
    toast.success("Documento removido da biblioteca");
  };

  const downloadDocument = (document: VaultDocument) => {
    const source = previewUrls[document.id];
    if (source) {
      const link = window.document.createElement("a");
      link.href = source;
      link.download = document.fileName;
      link.click();
      return;
    }
    toast.success("Download preparado", {
      description: "Envie uma nova versão para disponibilizar o arquivo original para download.",
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageContextHeader
        context="operation"
        title="Documentos"
        description="Centralize documentos da empresa e reutilize versões válidas nas propostas sem reenviar arquivos."
        actions={
          <Button
            onClick={() => openUploader()}
            className="bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
          >
            <Upload className="size-4" aria-hidden="true" />
            Enviar documento
          </Button>
        }
      />

      <PageHowItWorks
        title="Mantenha arquivos prontos para a próxima proposta"
        description="A biblioteca separa validade, responsável e histórico de uso para que a equipe não procure documentos durante um prazo crítico."
        steps={[
          {
            title: "Envie o arquivo",
            description: "Inclua o documento e uma identificação fácil de encontrar.",
          },
          {
            title: "Complete o contexto",
            description: "Defina tipo, titularidade, validade e tags que orientam alertas.",
          },
          {
            title: "Reutilize com segurança",
            description: "Abra a versão certa ao preparar uma proposta e acompanhe seu uso.",
          },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {metrics.map(({ label, value, description, Icon, iconClassName }) => (
          <Panel key={label} className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className={cn("grid size-10 place-items-center rounded-xl", iconClassName)}>
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <p className="text-[12px] font-extrabold text-ink">{label}</p>
            </div>
            <p className="mt-4 text-[25px] font-extrabold leading-none tracking-[-0.03em] text-ink">
              {value}
            </p>
            <p className="mt-2 text-[11px] font-medium text-slate-text">{description}</p>
          </Panel>
        ))}
      </div>

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-hairline p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
              Cofre operacional
            </p>
            <h2 className="mt-1 text-[18px] font-extrabold tracking-[-0.02em] text-ink">
              Biblioteca da sua operação
            </h2>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
              Cada arquivo registra validade, titularidade e histórico de uso.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 min-[540px]:flex-row xl:w-auto">
            <div className="relative min-w-0 flex-1 xl:w-[280px]">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar nome, tipo ou tag"
                className="h-11 rounded-xl border-hairline pl-9 text-[12px] shadow-none"
                aria-label="Buscar documentos"
              />
            </div>
            <Select
              value={kindFilter}
              onValueChange={(value) => setKindFilter(value as typeof kindFilter)}
            >
              <SelectTrigger className="h-11 border-hairline bg-white text-[12px] font-bold shadow-none min-[540px]:w-[170px]">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Certidão">Certidões</SelectItem>
                <SelectItem value="Habilitação">Habilitação</SelectItem>
                <SelectItem value="Técnico">Técnicos</SelectItem>
                <SelectItem value="Financeiro">Financeiros</SelectItem>
                <SelectItem value="Proposta">Propostas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-b border-hairline px-4 py-3 sm:px-5 min-[540px]:flex-row min-[540px]:items-center min-[540px]:justify-between">
          <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl border border-hairline bg-page/60 p-1 sm:w-[340px]">
              <TabsTrigger value="library" className="min-h-9 text-[11px] font-bold">
                Biblioteca · {documents.length}
              </TabsTrigger>
              <TabsTrigger value="pending" className="min-h-9 text-[11px] font-bold">
                Pendências · {pendingDocuments.length}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex w-full gap-2 min-[540px]:w-auto">
            <div
              className="inline-flex h-11 min-w-0 flex-1 rounded-xl border border-hairline bg-page/60 p-1 min-[540px]:flex-none"
              role="group"
              aria-label="Modo de visualização da biblioteca"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={() => changeViewMode("list")}
                className={cn(
                  "h-9 flex-1 rounded-lg px-3 text-[11px] font-bold hover:bg-white",
                  viewMode === "list" && "bg-white text-ink shadow-sm hover:bg-white",
                )}
                aria-pressed={viewMode === "list"}
              >
                <List className="size-4" aria-hidden="true" />
                Lista
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => changeViewMode("grid")}
                className={cn(
                  "h-9 flex-1 rounded-lg px-3 text-[11px] font-bold hover:bg-white",
                  viewMode === "grid" && "bg-white text-ink shadow-sm hover:bg-white",
                )}
                aria-pressed={viewMode === "grid"}
              >
                <Grid2X2 className="size-4" aria-hidden="true" />
                Grade
              </Button>
            </div>
          </div>
        </div>

        {visibleDocuments.length ? (
          <div
            className={cn(
              viewMode === "list"
                ? "divide-y divide-hairline"
                : "grid gap-3 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3 2xl:grid-cols-4",
            )}
          >
            {viewMode === "list" ? (
              <ResourceListGridHeader
                gridTemplateColumns={documentGridTemplateColumns}
                className="px-0 py-0 tracking-[0.08em]"
              >
                <div className="relative px-5 py-3">
                  Documento
                  <button
                    {...getResizeHandleProps("validity")}
                    aria-label="Redimensionar largura da coluna Validade ou situação"
                  />
                </div>
                <div className="relative border-l border-hairline px-5 py-3">
                  Validade ou situação
                  <button
                    {...getResizeHandleProps("usage")}
                    aria-label="Redimensionar largura da coluna Em uso"
                  />
                </div>
                <div className="relative border-l border-hairline px-5 py-3">
                  Em uso
                  <button
                    {...getResizeHandleProps("actions")}
                    aria-label="Redimensionar largura da coluna Ações"
                  />
                </div>
                <div className="border-l border-hairline px-5 py-3 text-right">Ações</div>
              </ResourceListGridHeader>
            ) : null}
            {visibleDocuments.map((document) => {
              const status = statusCopy[document.status];
              const StatusIcon = status.Icon;
              if (viewMode === "grid") {
                return (
                  <article
                    key={document.id}
                    className="group overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_2px_10px_rgba(15,23,42,0.025)] transition-shadow hover:shadow-[0_12px_30px_rgba(22,34,55,0.09)]"
                  >
                    <button
                      type="button"
                      onClick={() => openDetail(document)}
                      className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#29C454]"
                      aria-label={`Abrir prévia de ${document.name}`}
                    >
                      <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-xl border border-slate-200 bg-[#F5FAF6] sm:m-4">
                        <DocumentPreview document={document} source={previewUrls[document.id]} />
                        <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 p-2 shadow-sm backdrop-blur-sm">
                          <p className="truncate text-[9px] font-extrabold uppercase tracking-[0.08em] text-brand-strong">
                            {document.kind}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] font-bold leading-snug text-ink">
                            {document.name}
                          </p>
                        </div>
                        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2 py-1 text-[8px] font-extrabold text-slate-text shadow-sm backdrop-blur-sm">
                          v{document.version}
                        </span>
                      </div>
                      <div className="px-4 pb-3">
                        <div className="flex items-start gap-2">
                          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand-strong">
                            <FileText className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <h3 className="truncate text-[13px] font-extrabold text-ink">
                                {document.name}
                              </h3>
                              <span
                                className={cn(
                                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-extrabold",
                                  status.className,
                                )}
                              >
                                <StatusIcon className="size-3" aria-hidden="true" />
                                {status.label}
                              </span>
                            </div>
                            <p className="mt-1 truncate text-[10px] text-slate-text">
                              {document.fileName} · {document.size}
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center justify-between gap-3 border-t border-hairline px-4 py-3">
                      <p className="min-w-0 text-[10px] font-semibold text-slate-text">
                        {document.expiresAt
                          ? `Válido até ${formatExpiry(document)}`
                          : status.detail}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadDocument(document)}
                          className="size-9 rounded-lg text-slate-text hover:bg-page hover:text-ink"
                          aria-label={`Baixar ${document.name}`}
                        >
                          <Download className="size-4" aria-hidden="true" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 rounded-lg text-slate-text hover:bg-page hover:text-ink"
                              aria-label={`Mais ações para ${document.name}`}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="min-w-[205px] rounded-xl border-hairline p-1.5"
                          >
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.08em] text-slate-text">
                              Ações do documento
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="min-h-10 rounded-lg text-[12px] font-semibold"
                              onSelect={() => openDetail(document)}
                            >
                              <FolderOpen className="size-4" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="min-h-10 rounded-lg text-[12px] font-semibold"
                              onSelect={() => openUploader(document)}
                            >
                              <Upload className="size-4" /> Substituir versão
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="min-h-10 rounded-lg text-[12px] font-semibold text-rose-600 focus:text-rose-700"
                              onSelect={() => setDeleteTarget(document)}
                            >
                              <Trash2 className="size-4" /> Remover documento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </article>
                );
              }
              return (
                <article
                  key={document.id}
                  className="p-4 transition-colors hover:bg-page/[0.42] sm:p-5 xl:p-0"
                >
                  <div
                    className="flex flex-col gap-4 xl:grid xl:items-stretch xl:gap-0"
                    style={{ gridTemplateColumns: documentGridTemplateColumns }}
                  >
                    <button
                      type="button"
                      onClick={() => openDetail(document)}
                      className="flex min-w-0 items-start gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#29C454] xl:px-5 xl:py-5"
                      aria-label={`Abrir detalhes de ${document.name}`}
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-tint text-brand-strong">
                        <FileText className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-[14px] font-extrabold text-ink">
                            {document.name}
                          </span>
                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-extrabold",
                              status.className,
                            )}
                          >
                            <StatusIcon className="size-3" aria-hidden="true" />
                            {status.label}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-[11px] text-slate-text">
                          {document.fileName} · {document.size} · versão {document.version}
                        </span>
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-page px-2.5 py-1 text-[10px] font-semibold text-slate-text">
                            {document.kind}
                          </span>
                          <span className="rounded-full bg-page px-2.5 py-1 text-[10px] font-semibold text-slate-text">
                            {document.owner}
                          </span>
                          {document.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-brand-tint/70 px-2.5 py-1 text-[10px] font-semibold text-brand-strong"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </button>
                    <div className="grid grid-cols-[1fr_auto] gap-x-5 gap-y-3 border-t border-hairline pt-4 sm:flex sm:items-center xl:contents">
                      <div className="xl:border-l xl:border-hairline xl:px-5 xl:py-5">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                          {document.expiresAt ? "Validade" : "Situação"}
                        </p>
                        <p className="mt-1 text-[12px] font-extrabold text-ink">
                          {document.expiresAt ? formatExpiry(document) : status.detail}
                        </p>
                      </div>
                      <div className="xl:border-l xl:border-hairline xl:px-5 xl:py-5">
                        <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
                          Em uso
                        </p>
                        <p className="mt-1 text-[12px] font-extrabold text-ink">
                          {document.uses ? `${document.uses} propostas` : "Ainda não usado"}
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2 sm:col-auto xl:col-auto xl:border-l xl:border-hairline xl:py-5 xl:pl-5 xl:pr-5">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => downloadDocument(document)}
                          className="h-11 rounded-xl border-hairline px-3 text-[11px] font-bold shadow-none"
                        >
                          <Download className="size-4" aria-hidden="true" />
                          <span className="sm:hidden">Baixar</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-11 rounded-xl border-hairline shadow-none"
                              aria-label={`Mais ações para ${document.name}`}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="min-w-[205px] rounded-xl border-hairline p-1.5"
                          >
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.08em] text-slate-text">
                              Ações do documento
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="min-h-10 rounded-lg text-[12px] font-semibold"
                              onSelect={() => openDetail(document)}
                            >
                              <FolderOpen className="size-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="min-h-10 rounded-lg text-[12px] font-semibold"
                              onSelect={() => openUploader(document)}
                            >
                              <Upload className="size-4" />
                              Substituir versão
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="min-h-10 rounded-lg text-[12px] font-semibold text-rose-600 focus:text-rose-700"
                              onSelect={() => setDeleteTarget(document)}
                            >
                              <Trash2 className="size-4" />
                              Remover documento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <InternalPageState
              state="empty"
              title={
                tab === "pending"
                  ? "Nenhuma pendência encontrada"
                  : "Nenhum documento neste recorte"
              }
              description={
                tab === "pending"
                  ? "Os documentos visíveis estão válidos e prontos para uso."
                  : "Tente outro termo, ajuste o tipo ou envie um documento da empresa."
              }
              action={
                tab === "library" ? (
                  <Button
                    onClick={() => openUploader()}
                    className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
                  >
                    <Plus className="size-4" />
                    Enviar documento
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </Panel>

      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
        onChange={(event) => onFileSelected(event.target.files?.[0])}
        aria-label="Selecionar arquivo para documento"
      />

      <Sheet open={editorOpen} onOpenChange={requestCloseEditor}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-none flex-col gap-0 border-hairline bg-white p-0 sm:max-w-[560px]"
          overlayClassName="bg-slate-950/30 backdrop-blur-[1px]"
        >
          <SheetHeader className="border-b border-hairline px-5 py-5 text-left sm:px-6">
            <SheetTitle className="text-[18px] font-extrabold text-ink">
              {replaceTarget ? "Substituir documento" : "Enviar documento"}
            </SheetTitle>
            <SheetDescription className="text-[12px] leading-relaxed text-slate-text">
              {replaceTarget
                ? "A nova versão mantém o histórico e os vínculos existentes."
                : "Inclua informações suficientes para a equipe encontrar o arquivo na hora da proposta."}
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <button
              type="button"
              onClick={chooseFile}
              className="flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#29C454]/45 bg-brand-tint/40 px-5 text-center transition-colors hover:bg-brand-tint/65 focus-visible:outline-2 focus-visible:outline-[#29C454]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white text-brand-strong shadow-sm">
                <Upload className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-3 text-[13px] font-extrabold text-ink">
                {selectedFile ? selectedFile.name : "Selecione ou solte o arquivo aqui"}
              </span>
              <span className="mt-1 text-[11px] leading-relaxed text-slate-text">
                PDF, Word, Excel ou imagem · até 20 MB
              </span>
            </button>
            {selectedFile ? (
              <p className="rounded-xl bg-page px-3 py-2 text-[11px] text-slate-text">
                Arquivo selecionado: <b className="font-extrabold text-ink">{selectedFile.name}</b>
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="document-name" className="text-[11px] font-extrabold text-ink">
                Nome para a biblioteca
              </Label>
              <Input
                id="document-name"
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                placeholder="Ex.: Certidão conjunta federal"
                className="h-11 rounded-xl border-hairline text-[13px] shadow-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[11px] font-extrabold text-ink">Tipo do documento</Label>
                <Select
                  value={draft.kind}
                  onValueChange={(value) => updateDraft("kind", value as DocumentKind)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-hairline text-[12px] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Certidão">Certidão</SelectItem>
                    <SelectItem value="Habilitação">Habilitação</SelectItem>
                    <SelectItem value="Técnico">Técnico</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                    <SelectItem value="Proposta">Proposta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-extrabold text-ink">Titularidade</Label>
                <Select
                  value={draft.owner}
                  onValueChange={(value) => updateDraft("owner", value as DocumentOwner)}
                >
                  <SelectTrigger className="h-11 rounded-xl border-hairline text-[12px] shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Empresa">Empresa</SelectItem>
                    <SelectItem value="Equipe">Equipe</SelectItem>
                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="document-expiry" className="text-[11px] font-extrabold text-ink">
                  Validade <span className="font-medium text-slate-text">(opcional)</span>
                </Label>
                <Input
                  id="document-expiry"
                  type="date"
                  value={draft.expiresAt}
                  onChange={(event) => updateDraft("expiresAt", event.target.value)}
                  className="h-11 rounded-xl border-hairline text-[12px] shadow-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document-tags" className="text-[11px] font-extrabold text-ink">
                  Tags <span className="font-medium text-slate-text">(opcional)</span>
                </Label>
                <Input
                  id="document-tags"
                  value={draft.tags}
                  onChange={(event) => updateDraft("tags", event.target.value)}
                  placeholder="habilitação, SP, técnica"
                  className="h-11 rounded-xl border-hairline text-[12px] shadow-none"
                />
              </div>
            </div>
            <div className="flex gap-2 rounded-xl border border-[#3269D8]/15 bg-[#EEF4FF]/70 p-3 text-[#2455B6]">
              <FileCheck2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="text-[11px] leading-relaxed">
                A validade orienta alertas e pendências. A conferência documental continua sendo da
                sua equipe.
              </p>
            </div>
          </div>
          <SheetFooter className="border-t border-hairline bg-page/40 px-5 py-4 sm:px-6">
            <Button
              variant="outline"
              onClick={() => requestCloseEditor(false)}
              className="min-h-11 rounded-xl border-hairline text-[12px] font-bold shadow-none"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveDocument}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
            >
              <Check className="size-4" />
              {replaceTarget ? "Salvar nova versão" : "Adicionar à biblioteca"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent
          side="right"
          className="flex h-full w-full max-w-none flex-col gap-0 border-hairline bg-white p-0 sm:max-w-[500px]"
          overlayClassName="bg-slate-950/30 backdrop-blur-[1px]"
        >
          {selected ? (
            <>
              <SheetHeader className="border-b border-hairline px-5 py-5 text-left sm:px-6">
                <SheetTitle className="pr-8 text-[18px] font-extrabold text-ink">
                  {selected.name}
                </SheetTitle>
                <SheetDescription className="mt-2 text-[12px] leading-relaxed text-slate-text">
                  {selected.fileName} · versão {selected.version}
                </SheetDescription>
              </SheetHeader>
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-hairline bg-white text-center">
                  <DocumentPreview document={selected} source={previewUrls[selected.id]} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <DetailCell label="Tipo" value={selected.kind} />
                  <DetailCell label="Titular" value={selected.owner} />
                  <DetailCell label="Validade" value={formatExpiry(selected)} />
                  <DetailCell
                    label="Uso"
                    value={selected.uses ? `${selected.uses} propostas` : "Ainda não usado"}
                  />
                  <DetailCell label="Atualizado" value={selected.uploadedAt} />
                  <DetailCell label="Responsável" value={selected.updatedBy} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-text">
                    Tags
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.tags.length ? (
                      selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-brand-tint px-2.5 py-1 text-[10px] font-bold text-brand-strong"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-text">Sem tags cadastradas.</span>
                    )}
                  </div>
                </div>
              </div>
              <SheetFooter className="border-t border-hairline bg-page/40 px-5 py-4 sm:px-6">
                <Button
                  variant="outline"
                  onClick={() => downloadDocument(selected)}
                  className="min-h-11 rounded-xl border-hairline text-[12px] font-bold shadow-none"
                >
                  <Download className="size-4" />
                  Baixar
                </Button>
                <Button
                  onClick={() => {
                    setDetailOpen(false);
                    openUploader(selected);
                  }}
                  className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
                >
                  <Upload className="size-4" />
                  Nova versão
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <UnsavedChangesDialog
        open={discardOpen}
        onOpenChange={setDiscardOpen}
        onDiscard={() => {
          setDirty(false);
          setDiscardOpen(false);
          setEditorOpen(false);
        }}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="max-w-[calc(100%_-_32px)] rounded-2xl border-hairline sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover este documento?</AlertDialogTitle>
            <AlertDialogDescription>
              O arquivo deixará de estar disponível para novas propostas. Verifique os vínculos
              atuais antes de confirmar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
              onClick={removeDocument}
            >
              <Trash2 className="mr-2 size-4" />
              Remover documento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-hairline bg-page/45 p-3">
      <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-slate-text">
        {label}
      </p>
      <p className="mt-1 break-words text-[11px] font-extrabold leading-snug text-ink">{value}</p>
    </div>
  );
}
