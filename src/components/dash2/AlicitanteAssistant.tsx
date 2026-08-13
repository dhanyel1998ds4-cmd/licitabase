import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Clock3,
  FileSearch,
  History,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { OPEN_ALICITANTE_EVENT, type OpenAlicitanteDetail } from "@/lib/alicitante-events";
import { cn } from "@/lib/utils";

type AssistantTab = "chat" | "history";

type LocalMessage = {
  id: string;
  content: string;
};

type HistoryEntry = {
  id: string;
  title: string;
  createdAt: string;
};

const defaultSuggestions = [
  "Quais oportunidades combinam com meu negócio?",
  "Resuma as novas oportunidades de hoje.",
  "Quais propostas possuem prazos próximos?",
  "Quais disputas estão em andamento?",
  "Analise os requisitos deste edital.",
  "Existem portais conectados com problemas?",
];

const opportunitySuggestions = [
  "Resuma a oportunidade atual.",
  "Quais são os requisitos de habilitação?",
  "Identifique os principais riscos deste edital.",
  "Quais produtos podem atender esta licitação?",
];

const topicChips = ["Oportunidades", "Editais", "Propostas", "Bot de Lances"];

export function AlicitanteAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantTab>("chat");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const suggestions = useMemo(
    () =>
      location.pathname.startsWith("/dash2/oportunidades/novas")
        ? opportunitySuggestions
        : defaultSuggestions,
    [location.pathname],
  );

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<OpenAlicitanteDetail>;
      setDraft(customEvent.detail?.draft ?? "");
      setActiveTab("chat");
      setOpen(true);
    };

    window.addEventListener(OPEN_ALICITANTE_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_ALICITANTE_EVENT, handleOpen);
  }, []);

  const startNewConversation = () => {
    setMessages([]);
    setDraft("");
    setActiveTab("chat");
  };

  const submitPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const id = `message-${Date.now()}`;
    setMessages((current) => [...current, { id, content }]);
    setHistory((current) => [
      { id, title: content, createdAt: "Agora" },
      ...current.filter((entry) => entry.title !== content),
    ]);
    setDraft("");
  };

  const openHistoryEntry = (entry: HistoryEntry) => {
    setMessages([{ id: entry.id, content: entry.title }]);
    setActiveTab("chat");
  };

  const deleteHistoryEntry = (id: string) => {
    setHistory((current) => current.filter((entry) => entry.id !== id));
    setPendingDeleteId(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir a Alicitante"
        aria-expanded={open}
        className="flex size-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#29C454]/45 bg-white p-0 text-brand-strong transition-colors hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] xl:w-auto xl:min-w-[166px] xl:px-3"
      >
        <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-tint">
          <img
            src="/images/alicitante-card.png"
            alt=""
            className="h-10 w-8 object-cover object-top"
          />
          <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full border-2 border-white bg-[#29C454]" />
        </span>
        <span className="hidden whitespace-nowrap text-[12.5px] font-bold xl:inline">
          Peça à Alicitante
        </span>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          overlayClassName="!z-[95] bg-slate-950/20 backdrop-blur-[1px]"
          className="inset-y-0 top-0 z-[100] flex h-dvh w-full max-w-none flex-col gap-0 border-hairline bg-white p-0 font-manrope sm:bottom-0 sm:top-16 sm:h-[calc(100dvh-4rem)] sm:w-[min(60vw,420px)] sm:max-w-none xl:w-[440px]"
        >
          <SheetTitle className="sr-only">Alicitante, assistente de IA</SheetTitle>
          <SheetDescription className="sr-only">
            Assistente contextual para oportunidades, editais, propostas e bot de lances.
          </SheetDescription>

          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-hairline px-4">
            <div className="flex rounded-xl bg-page p-1" aria-label="Alternar área do assistente">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold transition-colors",
                  activeTab === "chat"
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-text hover:text-ink",
                )}
                aria-pressed={activeTab === "chat"}
              >
                <MessageCircle className="size-3.5" aria-hidden="true" />
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold transition-colors",
                  activeTab === "history"
                    ? "bg-white text-ink shadow-sm"
                    : "text-slate-text hover:text-ink",
                )}
                aria-pressed={activeTab === "history"}
              >
                <History className="size-3.5" aria-hidden="true" />
                Histórico
              </button>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={startNewConversation}
                aria-label="Iniciar nova conversa"
                className="flex min-h-10 items-center gap-1.5 rounded-xl px-2.5 text-[11.5px] font-bold text-brand-strong transition-colors hover:bg-brand-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                <Plus className="size-4" aria-hidden="true" />
                <span className="hidden min-[360px]:inline">Novo</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar assistente de IA"
                className="grid size-10 place-items-center rounded-xl text-slate-text transition-colors hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
              >
                <ArrowLeft className="size-5 sm:hidden" aria-hidden="true" />
                <X className="hidden size-5 sm:block" aria-hidden="true" />
              </button>
            </div>
          </header>

          {activeTab === "chat" ? (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
                {messages.length === 0 ? (
                  <div className="flex min-h-full flex-col">
                    <div className="mx-auto flex max-w-sm flex-col items-center px-3 pt-5 text-center sm:pt-8">
                      <div className="relative">
                        <div className="absolute inset-2 rounded-full bg-[#29C454]/20 blur-xl" />
                        <img
                          src="/images/alicitante-assistant.png"
                          alt="Alicitante, assistente virtual do Licitabase"
                          className="relative size-20 rounded-full border border-[#29C454]/20 object-cover object-top shadow-sm"
                        />
                      </div>
                      <h2 className="mt-4 text-[19px] font-extrabold text-ink">Olá, Jussefer 👋</h2>
                      <p className="mt-1 text-[13.5px] font-medium text-slate-text">
                        Como posso ajudar hoje?
                      </p>
                    </div>

                    <div className="mt-auto space-y-2 pt-8">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => setDraft(suggestion)}
                          className="group flex min-h-12 w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left text-[12.5px] font-semibold text-ink transition-colors hover:border-hairline hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                        >
                          <ArrowUpRight
                            className="size-4 shrink-0 text-brand-strong transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-[#29C454] px-4 py-3 text-[13px] font-medium leading-relaxed text-white shadow-sm"
                      >
                        {message.content}
                      </div>
                    ))}
                    <div
                      className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3"
                      role="status"
                    >
                      <div className="flex gap-2.5">
                        <Bot className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden="true" />
                        <div>
                          <p className="text-[12px] font-bold text-blue-900">Interface preparada</p>
                          <p className="mt-1 text-[11.5px] font-medium leading-relaxed text-blue-800/80">
                            A mensagem foi registrada. As respostas serão ativadas quando o provider
                            de IA estiver conectado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-hairline bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
                <div className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {topicChips.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() =>
                        setDraft(`Quero saber mais sobre ${topic.toLocaleLowerCase("pt-BR")}.`)
                      }
                      className="min-h-9 shrink-0 rounded-full border border-hairline bg-page px-3 text-[10.5px] font-bold text-slate-text transition-colors hover:border-[#29C454]/40 hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={submitPrompt}
                  className="relative rounded-2xl border border-hairline bg-white shadow-sm focus-within:border-[#29C454] focus-within:ring-4 focus-within:ring-[#29C454]/10"
                >
                  <label htmlFor="alicitante-prompt" className="sr-only">
                    Pergunte algo à Alicitante
                  </label>
                  <textarea
                    id="alicitante-prompt"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    rows={2}
                    placeholder="Pergunte algo à IA da Licitabase..."
                    className="block max-h-32 min-h-[72px] w-full resize-none rounded-2xl bg-transparent px-4 pb-11 pt-3 text-[13px] font-medium text-ink outline-none placeholder:text-slate-text"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Enviar mensagem"
                    className="absolute bottom-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-[#29C454] text-white transition-colors hover:bg-[#22AD49] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                  >
                    <Send className="size-4" aria-hidden="true" />
                  </button>
                </form>
                <p className="mt-2 text-center text-[9.5px] font-medium text-slate-text">
                  A IA pode cometer erros. Confira sempre as informações do edital.
                </p>
              </div>
            </>
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
              <div className="mb-5">
                <h2 className="text-[18px] font-extrabold text-ink">Histórico</h2>
                <p className="mt-1 text-[12px] font-medium text-slate-text">
                  Conversas iniciadas nesta sessão.
                </p>
              </div>

              {history.length === 0 ? (
                <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-hairline bg-page/60 px-8 text-center">
                  <div>
                    <Clock3 className="mx-auto size-8 text-slate-text/60" aria-hidden="true" />
                    <p className="mt-3 text-[13px] font-bold text-ink">Nenhuma conversa ainda</p>
                    <p className="mt-1 text-[11.5px] font-medium text-slate-text">
                      Suas conversas aparecerão aqui.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-hairline bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => openHistoryEntry(entry)}
                          className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
                        >
                          <p className="line-clamp-2 text-[12.5px] font-bold leading-relaxed text-ink">
                            {entry.title}
                          </p>
                          <p className="mt-1 text-[10.5px] font-medium text-slate-text">
                            {entry.createdAt}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeleteId(entry.id)}
                          aria-label={`Excluir conversa: ${entry.title}`}
                          className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-text transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                      {pendingDeleteId === entry.id && (
                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-hairline pt-3">
                          <span className="text-[10.5px] font-semibold text-slate-text">
                            Excluir conversa?
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="min-h-9 rounded-lg px-3 text-[10.5px] font-bold text-slate-text hover:bg-page"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteHistoryEntry(entry.id)}
                              className="min-h-9 rounded-lg bg-red-600 px-3 text-[10.5px] font-bold text-white hover:bg-red-700"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-start gap-2 rounded-2xl border border-[#29C454]/15 bg-brand-tint/60 px-4 py-3">
                <FileSearch
                  className="mt-0.5 size-4 shrink-0 text-brand-strong"
                  aria-hidden="true"
                />
                <p className="text-[10.5px] font-medium leading-relaxed text-slate-text">
                  O histórico persistente será ativado junto com a integração segura por workspace.
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
