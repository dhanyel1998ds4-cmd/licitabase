import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BellRing,
  ChevronRight,
  Clock3,
  Eye,
  FileCheck2,
  FileText,
  KeyRound,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";
import { InternalPageState } from "@/components/dash2/InternalPageState";
import { PageContextHeader } from "@/components/dash2/PageContextHeader";
import { PageHowItWorks } from "@/components/dash2/PageHowItWorks";
import { Panel } from "@/components/dash2/Panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type TemplateBase =
  | "authentication"
  | "alert"
  | "opportunity"
  | "digest"
  | "process"
  | "document"
  | "result"
  | "billing"
  | "security"
  | "collaboration";

type EmailFamily = {
  id: string;
  title: string;
  description: string;
  base: TemplateBase;
  events: string[];
};

type EmailTemplate = Omit<EmailFamily, "events"> & {
  id: string;
  eventDescription: string;
  familyTitle: string;
  title: string;
};

const emailFamilies: EmailFamily[] = [
  {
    id: "autenticacao",
    title: "Autenticação e acesso",
    description: "Mensagens essenciais para criar e proteger a conta.",
    base: "authentication",
    events: [
      "Confirmar endereço de e-mail",
      "Recuperar senha",
      "Senha alterada",
      "Alteração de e-mail",
      "Verificação de novo dispositivo",
      "Código de autenticação",
      "Conta criada",
      "Convite para entrar na empresa",
    ],
  },
  {
    id: "alertas",
    title: "Alertas operacionais",
    description: "Eventos da operação que pedem atenção imediata.",
    base: "alert",
    events: [
      "Disputa iniciará em breve",
      "Disputa iniciada",
      "Empresa perdeu a primeira posição",
      "Empresa assumiu a primeira posição",
      "Novo lance concorrente",
      "Bot pausado",
      "Bot interrompido por erro",
      "Piso mínimo alcançado",
      "Prazo de proposta próximo",
      "Documento complementar solicitado",
    ],
  },
  {
    id: "oportunidades",
    title: "Novas oportunidades",
    description: "Licitações compatíveis com o perfil da empresa.",
    base: "opportunity",
    events: [
      "Nova oportunidade compatível",
      "Oportunidade encontrada por filtro salvo",
      "Oportunidade com alta aderência",
      "Oportunidade em categoria monitorada",
      "Oportunidade publicada por órgão acompanhado",
    ],
  },
  {
    id: "resumos",
    title: "Resumos periódicos",
    description: "Consolidações para reduzir alertas de baixa prioridade.",
    base: "digest",
    events: [
      "Resumo diário",
      "Resumo semanal",
      "Resumo dos filtros salvos",
      "Situação das propostas",
      "Desempenho das disputas",
      "Documentos próximos do vencimento",
      "Resultados e licitações finalizadas",
    ],
  },
  {
    id: "integracoes",
    title: "Integrações e processamento",
    description: "Conexões de portais e tarefas finalizadas em segundo plano.",
    base: "process",
    events: [
      "Portal conectado",
      "Sincronização inicial concluída",
      "Credenciais incorretas",
      "Credenciais expiradas",
      "Portal desconectado",
      "Sincronização interrompida",
      "Portal novamente operacional",
      "Raio-X do edital concluído",
      "Exportação de relatório pronta",
    ],
  },
  {
    id: "documentos",
    title: "Documentos e propostas",
    description: "Validades, pendências e andamento das propostas.",
    base: "document",
    events: [
      "Documento próximo do vencimento",
      "Documento vencido",
      "Documento enviado",
      "Documento recusado",
      "Documento solicitado",
      "Proposta criada",
      "Proposta ainda em rascunho",
      "Proposta enviada",
      "Recebimento confirmado pelo portal",
    ],
  },
  {
    id: "resultados",
    title: "Resultado da licitação",
    description: "Situações finais e etapas posteriores da contratação.",
    base: "result",
    events: [
      "Empresa classificada",
      "Licitação adjudicada",
      "Licitação homologada",
      "Contrato assinado",
      "Empresa não vencedora",
      "Licitação cancelada",
      "Licitação deserta",
      "Convocação para próxima etapa",
    ],
  },
  {
    id: "equipe",
    title: "Equipe e colaboração",
    description: "Atualizações de trabalho compartilhado no workspace.",
    base: "collaboration",
    events: [
      "Convite enviado",
      "Convite aceito",
      "Usuário adicionado",
      "Função alterada",
      "Oportunidade atribuída",
      "Menção em anotação",
      "Responsável por proposta alterado",
      "Acesso suspenso",
    ],
  },
  {
    id: "cobranca",
    title: "Cobrança e assinatura",
    description: "Comunicações documentais do plano e faturamento.",
    base: "billing",
    events: [
      "Assinatura iniciada",
      "Período de teste próximo do fim",
      "Cobrança realizada",
      "Pagamento recusado",
      "Fatura disponível",
      "Plano alterado",
      "Limite próximo",
      "Limite atingido",
      "Cancelamento solicitado",
      "Assinatura cancelada",
    ],
  },
  {
    id: "seguranca",
    title: "Segurança",
    description: "Avisos imediatos e auditáveis sobre acessos à conta.",
    base: "security",
    events: [
      "Novo login",
      "Login em dispositivo desconhecido",
      "Senha alterada com sucesso",
      "E-mail alterado",
      "Tentativas repetidas de acesso",
      "Autenticação em dois fatores ativada",
      "Autenticação em dois fatores desativada",
      "Sessão encerrada remotamente",
      "Conta bloqueada",
    ],
  },
  {
    id: "onboarding",
    title: "Onboarding e relacionamento",
    description: "Mensagens opcionais para adoção e educação do produto.",
    base: "opportunity",
    events: [
      "Boas-vindas à LicitaBase",
      "Complete seu perfil",
      "Conecte um portal",
      "Crie seu primeiro filtro",
      "Analise uma oportunidade",
      "Configure documentos",
      "Conheça o Bot de Lances",
      "Onboarding incompleto",
      "Conta sem atividade",
    ],
  },
];

const eventDescriptions: Record<string, string> = {
  "Confirmar endereço de e-mail": "Ative a conta confirmando que este endereço pertence a você.",
  "Recuperar senha": "Crie uma nova senha após uma solicitação de recuperação.",
  "Senha alterada": "Confirme que a alteração recente de senha foi realizada por você.",
  "Alteração de e-mail": "Valide a troca do endereço principal da conta.",
  "Verificação de novo dispositivo":
    "Autorize ou bloqueie um dispositivo que tentou acessar a conta.",
  "Código de autenticação": "Use um código de uso único para concluir o acesso com segurança.",
  "Conta criada": "Conclua os primeiros passos após a criação da conta.",
  "Convite para entrar na empresa":
    "Aceite um convite para colaborar em um workspace da LicitaBase.",
  "Disputa iniciará em breve": "Prepare a estratégia antes da abertura da sessão pública.",
  "Disputa iniciada": "Acompanhe posição, lances e decisões do Bot de Lances em tempo real.",
  "Empresa perdeu a primeira posição":
    "Um concorrente assumiu a liderança e abriu uma janela de reação.",
  "Empresa assumiu a primeira posição": "A empresa recuperou a liderança da disputa em andamento.",
  "Novo lance concorrente": "Um concorrente reduziu o preço no item monitorado.",
  "Bot pausado": "A estratégia automática foi pausada e precisa de uma decisão do operador.",
  "Bot interrompido por erro": "O monitoramento encontrou um erro e deixou de enviar lances.",
  "Piso mínimo alcançado":
    "O valor definido como piso foi atingido; o Bot continuará apenas monitorando.",
  "Prazo de proposta próximo": "Há pouco tempo para revisar e enviar a proposta ao portal.",
  "Documento complementar solicitado":
    "O portal solicitou um documento adicional para a participação.",
  "Nova oportunidade compatível":
    "Encontramos uma licitação alinhada aos critérios da sua empresa.",
  "Oportunidade encontrada por filtro salvo":
    "Um filtro salvo identificou uma publicação que exige análise.",
  "Oportunidade com alta aderência":
    "A oportunidade atingiu um índice alto de aderência ao seu perfil.",
  "Oportunidade em categoria monitorada":
    "Foi publicada uma licitação em uma categoria acompanhada pela equipe.",
  "Oportunidade publicada por órgão acompanhado":
    "Um órgão público monitorado publicou uma nova oportunidade.",
  "Resumo diário": "Veja primeiro os prazos, disputas e oportunidades que exigem atenção hoje.",
  "Resumo semanal": "Revise a evolução da operação e as principais decisões da última semana.",
  "Resumo dos filtros salvos":
    "Entenda quais filtros encontraram novas oportunidades desde a última leitura.",
  "Situação das propostas":
    "Acompanhe rascunhos, propostas enviadas e pendências antes dos prazos.",
  "Desempenho das disputas": "Veja as disputas recentes, posições conquistadas e ações do Bot.",
  "Documentos próximos do vencimento":
    "Antecipe renovações para evitar pendências nas participações ativas.",
  "Resultados e licitações finalizadas":
    "Consulte adjudicações, homologações e licitações encerradas no período.",
  "Portal conectado": "A conexão com o portal foi concluída e está pronta para sincronizar dados.",
  "Sincronização inicial concluída": "A leitura inicial do portal foi finalizada com sucesso.",
  "Credenciais incorretas": "O portal recusou as credenciais informadas para a integração.",
  "Credenciais expiradas": "As credenciais do portal venceram e precisam ser atualizadas.",
  "Portal desconectado": "A integração deixou de receber dados do portal monitorado.",
  "Sincronização interrompida": "Uma sincronização foi interrompida antes de concluir a leitura.",
  "Portal novamente operacional": "O portal voltou a responder e a integração foi restabelecida.",
  "Raio-X do edital concluído":
    "A análise automática do edital está pronta para revisão da equipe.",
  "Exportação de relatório pronta":
    "O arquivo solicitado foi preparado e está disponível para download.",
  "Documento próximo do vencimento":
    "Renove o documento antes que ele comprometa participações em andamento.",
  "Documento vencido": "Um documento necessário já venceu e exige substituição imediata.",
  "Documento enviado": "O documento foi incluído na participação e está aguardando processamento.",
  "Documento recusado": "O portal recusou um documento e informou que é preciso corrigi-lo.",
  "Documento solicitado": "Uma participação requer o envio de um documento específico.",
  "Proposta criada": "A proposta foi iniciada e pode ser completada pela equipe responsável.",
  "Proposta ainda em rascunho":
    "Uma proposta continua sem envio próximo ao prazo informado pelo portal.",
  "Proposta enviada":
    "A proposta foi transmitida ao portal e seu recebimento pode ser acompanhado.",
  "Recebimento confirmado pelo portal":
    "O portal confirmou o recebimento da proposta enviada pela empresa.",
  "Empresa classificada": "A empresa avançou na classificação de uma licitação acompanhada.",
  "Licitação adjudicada":
    "A adjudicação foi registrada e a empresa consta como vencedora da etapa.",
  "Licitação homologada": "O resultado da licitação foi homologado pelo órgão responsável.",
  "Contrato assinado": "O contrato vinculado à licitação foi formalizado e assinado.",
  "Empresa não vencedora": "A etapa foi concluída com outro fornecedor na primeira posição.",
  "Licitação cancelada": "O órgão cancelou a licitação acompanhada pela sua empresa.",
  "Licitação deserta": "A licitação foi encerrada sem propostas válidas registradas.",
  "Convocação para próxima etapa": "O órgão convocou a empresa para uma nova etapa da licitação.",
  "Convite enviado": "Um convite para o workspace foi enviado e aguarda aceite do destinatário.",
  "Convite aceito": "Uma pessoa aceitou o convite e passou a fazer parte da equipe.",
  "Usuário adicionado": "Um novo usuário recebeu acesso ao workspace da empresa.",
  "Função alterada": "A permissão de um integrante da equipe foi atualizada.",
  "Oportunidade atribuída": "Uma oportunidade passou a ter um responsável definido na equipe.",
  "Menção em anotação": "Você foi mencionado em uma anotação vinculada a uma licitação.",
  "Responsável por proposta alterado":
    "A responsabilidade de uma proposta foi transferida para outro usuário.",
  "Acesso suspenso": "O acesso de um integrante ao workspace foi suspenso.",
  "Assinatura iniciada": "O plano escolhido foi ativado para o workspace da empresa.",
  "Período de teste próximo do fim":
    "O período de avaliação está perto do fim e precisa de uma decisão.",
  "Cobrança realizada": "Uma cobrança do plano foi processada com sucesso.",
  "Pagamento recusado": "A forma de pagamento não aprovou a cobrança do plano.",
  "Fatura disponível": "A fatura mensal está pronta para consulta e pagamento.",
  "Plano alterado": "O plano do workspace foi atualizado com novas condições e limites.",
  "Limite próximo": "O consumo de um recurso do plano está perto do limite contratado.",
  "Limite atingido": "Um limite do plano foi alcançado e pode impactar a operação.",
  "Cancelamento solicitado": "O pedido de cancelamento foi recebido e está em processamento.",
  "Assinatura cancelada": "A assinatura foi encerrada e as condições de acesso foram atualizadas.",
  "Novo login": "Um acesso recente foi identificado e pode ser revisado pela sua equipe.",
  "Login em dispositivo desconhecido": "Um dispositivo não reconhecido tentou acessar a sua conta.",
  "Senha alterada com sucesso": "A senha da conta foi atualizada e a atividade foi registrada.",
  "E-mail alterado": "O endereço principal de acesso à conta foi modificado.",
  "Tentativas repetidas de acesso": "Foram detectadas tentativas consecutivas de acesso à conta.",
  "Autenticação em dois fatores ativada":
    "A camada adicional de segurança foi habilitada com sucesso.",
  "Autenticação em dois fatores desativada":
    "A camada adicional de segurança foi removida da conta.",
  "Sessão encerrada remotamente": "Uma sessão ativa foi encerrada por uma ação de segurança.",
  "Conta bloqueada": "O acesso foi bloqueado temporariamente para proteger a conta.",
  "Boas-vindas à LicitaBase": "Conheça o primeiro passo para organizar a operação da sua empresa.",
  "Complete seu perfil": "Inclua dados essenciais para personalizar oportunidades e recomendações.",
  "Conecte um portal":
    "Conecte uma plataforma utilizada pela empresa para centralizar o acompanhamento.",
  "Crie seu primeiro filtro":
    "Configure critérios para encontrar oportunidades relevantes automaticamente.",
  "Analise uma oportunidade":
    "Use os recursos da LicitaBase para decidir se vale participar de uma publicação.",
  "Configure documentos":
    "Cadastre documentos essenciais para reduzir pendências na hora de participar.",
  "Conheça o Bot de Lances": "Entenda como definir estratégia e acompanhar sessões automatizadas.",
  "Onboarding incompleto": "Retome os passos pendentes para concluir a configuração inicial.",
  "Conta sem atividade": "Volte à plataforma e encontre o próximo passo útil para a sua operação.",
};

const emailTemplates: EmailTemplate[] = emailFamilies.flatMap(
  ({ events, title: familyTitle, ...family }) =>
    events.map((title) => ({
      ...family,
      eventDescription: eventDescriptions[title] ?? family.description,
      familyTitle,
      id: `${family.id}-${title}`,
      title,
    })),
);

const iconsByBase = {
  authentication: KeyRound,
  alert: BellRing,
  opportunity: Sparkles,
  digest: Clock3,
  process: FileCheck2,
  document: FileText,
  result: Mail,
  billing: Mail,
  security: ShieldCheck,
  collaboration: UsersRound,
};

export const Route = createFileRoute("/dash2/gestao/templates-emails")({
  head: () => ({ meta: [{ title: "Templates de e-mail — LicitaBase" }] }),
  component: EmailTemplatesPage,
});

function EmailTemplatesPage() {
  const [query, setQuery] = useState("");
  const [activeFamilyId, setActiveFamilyId] = useState("alertas");
  const [activeTemplateId, setActiveTemplateId] = useState(
    "alertas-Empresa perdeu a primeira posição",
  );
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const filteredFamilies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return emailFamilies.map((family) => {
      const templates = emailTemplates.filter((template) => {
        if (template.id.split("-")[0] !== family.id) return false;
        return (
          !normalizedQuery ||
          `${template.title} ${template.familyTitle} ${template.eventDescription}`
            .toLocaleLowerCase("pt-BR")
            .includes(normalizedQuery)
        );
      });
      return { family, templates };
    });
  }, [query]);

  const activeFamilyData =
    filteredFamilies.find(({ family }) => family.id === activeFamilyId) ??
    filteredFamilies.find(({ templates }) => templates.length > 0) ??
    filteredFamilies[0];
  const activeTemplates = activeFamilyData?.templates ?? [];
  const activeTemplate =
    activeTemplates.find((template) => template.id === activeTemplateId) ??
    activeTemplates[0] ??
    null;

  const selectFamily = (familyId: string) => {
    const nextFamily = filteredFamilies.find(({ family }) => family.id === familyId);
    setActiveFamilyId(familyId);
    if (nextFamily?.templates[0]) setActiveTemplateId(nextFamily.templates[0].id);
  };

  const selectTemplate = (templateId: string) => {
    setActiveTemplateId(templateId);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setMobilePreviewOpen(true);
    }
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <div className="space-y-5 sm:space-y-6">
        <PageContextHeader
          context="management"
          title="Templates de e-mail"
          description="Uma biblioteca editorial para revisar cada comunicação antes de ela existir em produção. Nenhum e-mail será enviado nesta etapa."
          className="lg:items-end"
          actions={
            <div className="rounded-xl border border-[#29C454]/20 bg-[#F1FFF5] px-3 py-2 text-[11px] font-semibold text-brand-strong">
              {emailTemplates.length} comunicações mapeadas · apenas prévias
            </div>
          }
        />

        <PageHowItWorks
          title="Revise a comunicação antes de ela chegar ao cliente"
          description="Navegue por coleções, abra cada prévia no contexto de uma caixa de entrada e compare tom, dados e chamada para ação antes da implementação técnica."
          steps={[
            {
              title: "Escolha uma coleção",
              description: "Comece pelo tipo de comunicação que quer revisar.",
            },
            {
              title: "Leia a prévia",
              description: "Confira assunto, remetente, corpo e chamada para ação.",
            },
            {
              title: "Registre o padrão",
              description: "Use a referência aprovada na construção do e-mail real.",
            },
          ]}
        />

        <Panel className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full max-w-xl">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-text"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por e-mail, evento ou categoria..."
                className="h-11 rounded-xl border-hairline bg-[#FBFCFD] pl-10 text-[13px] shadow-none"
              />
            </label>
            <p className="text-[12px] font-medium text-slate-text">
              Escolha uma categoria e leia cada comunicação no contexto de uma caixa de entrada.
            </p>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:thin]">
            {filteredFamilies.map(({ family, templates }) => (
              <FilterChip
                key={family.id}
                active={activeFamilyData?.family.id === family.id}
                disabled={!templates.length}
                onClick={() => selectFamily(family.id)}
              >
                {family.title} · {templates.length}
              </FilterChip>
            ))}
          </div>
        </Panel>

        {activeTemplate ? (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(208px,0.72fr)_minmax(440px,1.75fr)] xl:grid-cols-[minmax(208px,0.72fr)_minmax(460px,1.75fr)_minmax(260px,0.92fr)]">
            <Panel className="hidden overflow-hidden p-2 lg:block">
              <div className="px-3 pb-3 pt-2">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                  Coleções
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-text">
                  Cada família usa uma base visual adequada ao seu tipo de mensagem.
                </p>
              </div>
              <nav aria-label="Categorias de templates" className="space-y-1">
                {filteredFamilies.map(({ family, templates }) => {
                  const Icon = iconsByBase[family.base];
                  const active = activeFamilyData?.family.id === family.id;
                  return (
                    <button
                      key={family.id}
                      type="button"
                      disabled={!templates.length}
                      onClick={() => selectFamily(family.id)}
                      className={cn(
                        "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] disabled:cursor-not-allowed disabled:opacity-40",
                        active
                          ? "bg-[#EDFFF3] text-brand-strong"
                          : "text-slate-text hover:bg-[#F8FAF9] hover:text-ink",
                      )}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white text-brand-strong shadow-[0_1px_2px_rgba(13,38,24,0.08)]">
                        <Icon className="size-3.5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-bold">{family.title}</span>
                        <span className="mt-0.5 block text-[10px] font-medium text-slate-text">
                          {templates.length} prévias
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>
            </Panel>

            <div className="hidden min-w-0 lg:block">
              <EmailReadingFrame template={activeTemplate} />
            </div>

            <Panel className="overflow-hidden p-0 lg:col-span-2 xl:col-span-1">
              <div className="border-b border-hairline bg-white px-4 py-4 sm:px-5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-strong">
                  {activeFamilyData?.family.title}
                </p>
                <h2 className="mt-1 text-[16px] font-extrabold tracking-tight text-ink">
                  Comunicações da coleção
                </h2>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                  Selecione uma mensagem para trocar a leitura sem sair da biblioteca.
                </p>
              </div>
              <div className="max-h-[440px] space-y-1 overflow-y-auto p-2 [scrollbar-width:thin] lg:max-h-[246px] xl:max-h-[688px]">
                {activeTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => selectTemplate(template.id)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
                      template.id === activeTemplate.id
                        ? "border-[#29C454]/30 bg-[#EDFFF3]"
                        : "border-transparent hover:border-hairline hover:bg-[#FAFCFB]",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[12px] font-extrabold text-ink">
                        {template.title}
                      </span>
                      <ChevronRight
                        className="size-3.5 shrink-0 text-brand-strong"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-1 block line-clamp-2 text-[10px] leading-relaxed text-slate-text">
                      {template.eventDescription}
                    </span>
                  </button>
                ))}
              </div>
              <div className="border-t border-hairline bg-[#FBFCFB] p-3 lg:hidden">
                <Button
                  type="button"
                  onClick={() => setMobilePreviewOpen(true)}
                  className="min-h-11 w-full rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139E3E]"
                >
                  <Eye className="size-4" aria-hidden="true" /> Abrir prévia em tela cheia
                </Button>
              </div>
            </Panel>
          </div>
        ) : (
          <InternalPageState
            state="empty"
            title="Nenhum template encontrado"
            description="Tente buscar pelo evento, como “senha”, “bot”, “fatura” ou “convite”."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setActiveFamilyId("alertas");
                  setActiveTemplateId("alertas-Empresa perdeu a primeira posição");
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        )}
      </div>

      <EmailPreviewSheet
        template={mobilePreviewOpen ? activeTemplate : null}
        onOpenChange={setMobilePreviewOpen}
      />
    </div>
  );
}

function FilterChip({
  active,
  children,
  disabled = false,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "min-h-9 shrink-0 rounded-full border px-3 text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]",
        active
          ? "border-[#29C454]/35 bg-[#EDFFF3] text-brand-strong"
          : "border-hairline bg-white text-slate-text hover:border-[#29C454]/30 hover:text-ink disabled:cursor-not-allowed disabled:opacity-45",
      )}
    >
      {children}
    </button>
  );
}

function EmailPreviewSheet({
  template,
  onOpenChange,
}: {
  template: EmailTemplate | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={Boolean(template)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full max-w-none flex-col gap-0 overflow-hidden border-l border-hairline bg-[#F6F8F7] p-0 sm:w-[760px] sm:max-w-[760px]"
      >
        {template ? (
          <>
            <div className="border-b border-hairline bg-white px-5 py-5 pr-14 sm:px-6">
              <p className="text-[11px] font-bold text-brand-strong">Prévia do e-mail</p>
              <SheetTitle className="mt-1 text-[20px] font-extrabold tracking-tight text-ink">
                {template.title}
              </SheetTitle>
              <SheetDescription className="mt-1 text-[12px] leading-relaxed text-slate-text">
                {template.eventDescription} Nenhum e-mail será enviado a partir desta página.
              </SheetDescription>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <EmailReadingFrame template={template} />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function EmailReadingFrame({ template }: { template: EmailTemplate }) {
  const content = previewContent(template);
  const metadata = emailMetadata(template);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#DDE4E0] bg-[#EEF2F0] shadow-[0_16px_45px_rgba(13,38,24,0.10)]">
      <div className="border-b border-[#DDE4E0] bg-white px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#18B849] text-[11px] font-extrabold text-white">
            LB
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-extrabold text-ink">
              Licitabase &lt;comunicados@licitabase.com.br&gt;
            </p>
            <p className="mt-0.5 truncate text-[10px] text-slate-text">
              para Jussefer · Iridia Soluções
            </p>
          </div>
          <span className="rounded-full bg-[#F1FFF5] px-2 py-1 text-[9px] font-extrabold text-brand-strong">
            PRÉVIA
          </span>
        </div>
        <div className="mt-3 border-t border-hairline pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">
                Assunto
              </p>
              <p className="mt-1 text-[14px] font-extrabold text-ink">{content.subject}</p>
            </div>
            <time className="shrink-0 text-right text-[10px] font-medium leading-relaxed text-slate-text">
              {metadata.date}
              <br />
              {metadata.time}
            </time>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{content.preheader}</p>
        </div>
      </div>
      <div className="p-2 sm:p-5">
        <div className="mx-auto max-w-[640px]">
          <EmailCanvas template={template} />
        </div>
      </div>
    </div>
  );
}

function EmailCanvas({ template }: { template: EmailTemplate }) {
  const content = previewContent(template);
  return (
    <article className="overflow-hidden rounded-[18px] bg-white shadow-[0_2px_8px_rgba(12,41,25,0.08)]">
      <header className="border-b border-hairline px-6 py-4 sm:px-9">
        <div className="flex items-center justify-between gap-4">
          <div>
            <BrandLogo className="scale-[0.84] origin-left" />
            <p className="mt-1 text-[10px] font-semibold text-slate-text">
              Inteligência para licitações públicas
            </p>
          </div>
          <span className="shrink-0 text-[10px] font-semibold text-slate-text underline underline-offset-2">
            Ver no navegador
          </span>
        </div>
      </header>
      <main className="px-6 py-7 sm:px-9 sm:py-9">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-strong">
            {content.eyebrow}
          </p>
          <span className="rounded-full border border-[#CDEED9] bg-[#F3FFF6] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.07em] text-brand-strong">
            {content.status ?? "Comunicado"}
          </span>
        </div>
        <h3 className="mt-3 max-w-[480px] text-[25px] font-extrabold leading-[1.15] tracking-[-0.025em] text-[#0B132B]">
          {content.headline}
        </h3>
        <p className="mt-4 text-[16px] leading-[1.55] text-[#51637A]">{content.intro}</p>
        <EmailSpecificContent template={template} />
        <Button
          type="button"
          className="mt-7 min-h-11 rounded-xl bg-[#18B849] px-5 text-[13px] font-extrabold text-white hover:bg-[#139E3E]"
        >
          {content.cta}
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
        <p className="mt-5 text-[12px] leading-relaxed text-[#78879A]">{content.note}</p>
      </main>
      <footer className="border-t border-hairline bg-[#FBFCFB] px-6 py-5 sm:px-9">
        <p className="text-[11px] leading-relaxed text-[#728096]">
          Você recebeu este e-mail porque possui uma conta ou acompanha informações na LicitaBase.
        </p>
        <p className="mt-3 text-[11px] font-medium text-[#5E7187] underline underline-offset-2">
          Gerenciar preferências · Central de ajuda · Privacidade
        </p>
        <p className="mt-3 text-[11px] font-bold text-[#0B132B]">Licitabase Tecnologia Ltda.</p>
        <p className="mt-1 text-[10px] text-[#728096]">São Paulo, SP · Brasil</p>
      </footer>
    </article>
  );
}

function EmailSpecificContent({ template }: { template: EmailTemplate }) {
  if (template.base === "authentication") {
    return <AccessEmailBlock template={template} />;
  }
  if (template.title === "Empresa perdeu a primeira posição") {
    return <PositionChangeBlock />;
  }
  if (template.base === "alert") {
    return <AlertEmailBlock template={template} />;
  }
  if (template.base === "opportunity") {
    return template.id.startsWith("onboarding-") ? (
      <OnboardingEmailBlock template={template} />
    ) : (
      <OpportunityEmailBlock template={template} />
    );
  }
  if (template.base === "digest") {
    return <DigestEmailBlock template={template} />;
  }
  if (template.base === "document") {
    return <DocumentEmailBlock template={template} />;
  }
  if (template.base === "billing") {
    return <BillingEmailBlock template={template} />;
  }
  if (template.base === "security") {
    return <SecurityEmailBlock template={template} />;
  }
  if (template.base === "collaboration") {
    return <EventSummaryBlock template={template} tone="success" />;
  }
  return (
    <EventSummaryBlock
      template={template}
      tone={template.base === "result" ? "attention" : "neutral"}
    />
  );
}

function AccessEmailBlock({ template }: { template: EmailTemplate }) {
  const access = accessDetails[template.title] ?? accessDetails["Confirmar endereço de e-mail"]!;
  const isCode = access.kind === "code";
  return (
    <div className="mt-6 rounded-2xl border border-[#CDEED9] bg-[#F6FFF8] p-4 sm:p-5">
      {isCode ? (
        <>
          <p className="text-[10px] font-bold uppercase tracking-[0.09em] text-brand-strong">
            {access.label}
          </p>
          <p className="mt-3 text-center text-[28px] font-extrabold tracking-[0.22em] text-[#0B132B] sm:text-[32px]">
            {access.code}
          </p>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-text">
            {access.detail}
          </p>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-[#D8F0E0] pb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-strong">
              {access.label}
            </p>
            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-ink">
              {access.status}
            </span>
          </div>
          <ol className="mt-4 space-y-3 text-[12px] leading-relaxed text-slate-text">
            {access.steps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#18B849] text-[10px] font-extrabold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function AlertEmailBlock({ template }: { template: EmailTemplate }) {
  const alert = alertDetails[template.title] ?? alertDetails["Disputa iniciada"]!;
  return (
    <div
      className={cn(
        "mt-6 overflow-hidden rounded-2xl border",
        alert.tone === "danger"
          ? "border-[#F4D1CE] bg-[#FFF8F7]"
          : alert.tone === "success"
            ? "border-[#BDEECE] bg-[#F4FFF7]"
            : "border-[#F5D291] bg-[#FFF9ED]",
      )}
    >
      <div className="flex items-start gap-3 border-b border-[#F9E3B9] p-4">
        <span
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            alert.tone === "danger"
              ? "bg-[#D64B42]"
              : alert.tone === "success"
                ? "bg-[#18B849]"
                : "bg-[#F07A0A]",
          )}
        />
        <div>
          <p className="text-[12px] font-extrabold text-[#743F04]">{alert.status}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#8A663A]">{alert.detail}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-[#F9E3B9]">
        <div className="bg-[#FFFDF8] p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8A663A]">
            {alert.metricLabel}
          </p>
          <p className="mt-1 text-[12px] font-extrabold leading-snug text-[#0B132B]">
            {alert.metric}
          </p>
        </div>
        <div className="bg-[#FFFDF8] p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8A663A]">
            Atualizado
          </p>
          <p className="mt-1 text-[12px] font-extrabold text-[#0B132B]">{alert.updatedAt}</p>
        </div>
      </div>
    </div>
  );
}

function PositionChangeBlock() {
  return (
    <div className="mt-6">
      <div className="rounded-2xl border border-[#F6D6A1] bg-[#FFF9ED] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A25B04]">
          Janela de reação aberta
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-[#7A613E]">
          O Bot pode reagir respeitando o decremento configurado para esta sessão.
        </p>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_28px_1fr] items-center gap-2">
        <div className="rounded-xl border border-[#D5EADF] bg-white p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-text">
            Posição anterior
          </p>
          <p className="mt-1 text-[23px] font-extrabold text-brand-strong">1º</p>
          <p className="text-[10px] text-slate-text">R$ 36.122,17</p>
        </div>
        <ChevronRight className="mx-auto size-5 text-slate-text" aria-hidden="true" />
        <div className="rounded-xl border border-[#FFD0CC] bg-[#FFF7F6] p-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#B84C45]">
            Posição atual
          </p>
          <p className="mt-1 text-[23px] font-extrabold text-[#D64B42]">2º</p>
          <p className="text-[10px] text-[#B86A64]">R$ 36.120,00</p>
        </div>
      </div>
    </div>
  );
}

function OpportunityEmailBlock({ template }: { template: EmailTemplate }) {
  const opportunity =
    opportunityDetails[template.title] ?? opportunityDetails["Nova oportunidade compatível"]!;
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[#BDEECE] bg-[#F4FFF7]">
      <div className="flex items-end justify-between gap-4 border-b border-[#D4F3DE] p-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-strong">
            Aderência ao perfil
          </p>
          <p className="mt-1 text-[30px] font-extrabold tracking-[-0.05em] text-brand-strong">
            {opportunity.score}
          </p>
        </div>
        <p className="max-w-[180px] text-right text-[11px] leading-relaxed text-[#47775A]">
          {opportunity.reason}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <EmailField label="Órgão" value={opportunity.agency} />
        <EmailField label="Propostas até" value={opportunity.deadline} />
        <EmailField label="Objeto" value={opportunity.object} />
        <EmailField label="Valor estimado" value={opportunity.value} />
      </div>
    </div>
  );
}

function DigestEmailBlock({ template }: { template: EmailTemplate }) {
  const digest = digestDetails[template.title] ?? digestDetails["Resumo diário"]!;
  return (
    <div className="mt-6 divide-y divide-[#E8EEEA] rounded-2xl border border-[#DDE8E1] bg-white px-4">
      {digest.items.map(([amount, label, description, tag]) => (
        <div
          key={label}
          className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 py-3"
        >
          <span className="text-[22px] font-extrabold tracking-[-0.04em] text-brand-strong">
            {amount}
          </span>
          <span className="min-w-0">
            <span className="block text-[12px] font-extrabold text-ink">{label}</span>
            <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-text">
              {description}
            </span>
          </span>
          {tag ? (
            <span className="rounded-full bg-[#FFF6E7] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#A25B04]">
              {tag}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DocumentEmailBlock({ template }: { template: EmailTemplate }) {
  const document =
    documentDetails[template.title] ?? documentDetails["Documento próximo do vencimento"]!;
  return (
    <div className="mt-6 rounded-2xl border border-[#F5D291] bg-[#FFFDF8] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#A25B04]">
            {document.status}
          </p>
          <p className="mt-1 text-[15px] font-extrabold text-[#0B132B]">{document.name}</p>
        </div>
        <span className="rounded-lg bg-[#FFF2DA] px-2 py-1 text-[10px] font-bold text-[#A25B04]">
          {document.date}
        </span>
      </div>
      <div className="mt-4 space-y-2 border-t border-[#F8E7C2] pt-4 text-[11px] text-slate-text">
        {document.tasks.map(([done, label]) => (
          <div key={String(label)} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-4 place-items-center rounded-[5px] border text-[10px] font-extrabold",
                done
                  ? "border-[#18B849] bg-[#18B849] text-white"
                  : "border-[#C7D1CA] bg-white text-transparent",
              )}
            >
              ✓
            </span>
            {String(label)}
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingEmailBlock({ template }: { template: EmailTemplate }) {
  const billing = billingDetails[template.title] ?? billingDetails["Fatura disponível"]!;
  return (
    <div className="mt-6 rounded-2xl border border-[#DCE6E0] bg-[#F9FBFA] p-4">
      <div className="flex items-start justify-between gap-4 border-b border-[#E4ECE7] pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-text">
            {billing.reference}
          </p>
          <p className="mt-1 text-[14px] font-extrabold text-ink">{billing.plan}</p>
        </div>
        <p className="text-[24px] font-extrabold tracking-[-0.04em] text-ink">{billing.amount}</p>
      </div>
      <div className="mt-4 space-y-2 text-[11px] text-slate-text">
        {billing.lines.map(([label, value]) => (
          <EmailLine key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

function SecurityEmailBlock({ template }: { template: EmailTemplate }) {
  const security = securityDetails[template.title] ?? securityDetails["Novo login"]!;
  return (
    <div className="mt-6 rounded-2xl border border-[#F4D1CE] bg-[#FFF8F7] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#BB4C45]">
        {security.label}
      </p>
      <div className="mt-3 grid gap-3 text-[11px] sm:grid-cols-2">
        {security.fields.map(([label, value]) => (
          <EmailField key={label} label={label} value={value} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-lg bg-[#18B849] px-3 py-2 text-[11px] font-extrabold text-white">
          {security.primary}
        </span>
        <span className="rounded-lg border border-[#F0B5B0] bg-white px-3 py-2 text-[11px] font-extrabold text-[#B8423A]">
          {security.secondary}
        </span>
      </div>
    </div>
  );
}

function OnboardingEmailBlock({ template }: { template: EmailTemplate }) {
  const onboarding =
    onboardingDetails[template.title] ?? onboardingDetails["Boas-vindas à LicitaBase"]!;
  return (
    <div className="mt-6 rounded-2xl border border-[#CDEED9] bg-[#F7FFF9] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand-strong">
          Seu primeiro acesso
        </p>
        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-extrabold text-brand-strong">
          {onboarding.progress}
        </span>
      </div>
      <p className="mt-3 text-[15px] font-extrabold text-ink">{onboarding.highlight}</p>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-text">{onboarding.detail}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#D9F3E1]">
        <div className="h-full rounded-full bg-[#18B849]" style={{ width: onboarding.width }} />
      </div>
    </div>
  );
}

function EventSummaryBlock({
  template,
  tone,
}: {
  template: EmailTemplate;
  tone: "success" | "attention" | "neutral";
}) {
  const workflow = workflowDetails[template.title];
  return (
    <PreviewFacts
      facts={
        workflow?.facts ?? [
          ["Evento", template.title],
          ["Detalhe", template.eventDescription],
        ]
      }
      tone={tone}
    />
  );
}

type WorkflowPreview = { facts: [string, string][] };

const workflowDetails: Record<string, WorkflowPreview> = {
  "Portal conectado": {
    facts: [
      ["Portal", "Compras.gov"],
      ["Conta", "Iridia Soluções"],
      ["Leitura inicial", "Concluída"],
      ["Status", "Operacional"],
    ],
  },
  "Sincronização inicial concluída": {
    facts: [
      ["Portal", "PNCP"],
      ["Editais lidos", "1.248"],
      ["Duração", "3 min 42 s"],
      ["Status", "Concluída"],
    ],
  },
  "Credenciais incorretas": {
    facts: [
      ["Portal", "ComprasNet"],
      ["Última tentativa", "17 ago · 09h14"],
      ["Motivo", "Acesso recusado"],
      ["Ação", "Atualizar credenciais"],
    ],
  },
  "Credenciais expiradas": {
    facts: [
      ["Portal", "BNC"],
      ["Validade", "Encerrada"],
      ["Última leitura", "16 ago · 18h03"],
      ["Ação", "Reconectar portal"],
    ],
  },
  "Portal desconectado": {
    facts: [
      ["Portal", "Licitações-e"],
      ["Desde", "17 ago · 08h51"],
      ["Impacto", "Alertas pausados"],
      ["Ação", "Ver conexão"],
    ],
  },
  "Sincronização interrompida": {
    facts: [
      ["Portal", "Portal de Compras Públicas"],
      ["Etapa", "Leitura de itens"],
      ["Último progresso", "72%"],
      ["Ação", "Retomar leitura"],
    ],
  },
  "Portal novamente operacional": {
    facts: [
      ["Portal", "Licitações-e"],
      ["Indisponibilidade", "19 minutos"],
      ["Leitura", "Retomada"],
      ["Status", "Operacional"],
    ],
  },
  "Raio-X do edital concluído": {
    facts: [
      ["Edital", "PE 310/2026"],
      ["Exigências", "14 identificadas"],
      ["Pontos de atenção", "3"],
      ["Ação", "Abrir análise"],
    ],
  },
  "Exportação de relatório pronta": {
    facts: [
      ["Relatório", "Oportunidades de agosto"],
      ["Formato", "XLSX"],
      ["Registros", "604"],
      ["Disponível até", "24 ago 2026"],
    ],
  },
  "Empresa classificada": {
    facts: [
      ["Licitação", "PE 845/2026"],
      ["Posição", "2º lugar"],
      ["Órgão", "Prefeitura de Guarulhos"],
      ["Próxima etapa", "Aguardar julgamento"],
    ],
  },
  "Licitação adjudicada": {
    facts: [
      ["Licitação", "PE 133/2026"],
      ["Resultado", "Adjudicada"],
      ["Valor", "R$ 245.800,00"],
      ["Próxima etapa", "Homologação"],
    ],
  },
  "Licitação homologada": {
    facts: [
      ["Licitação", "PE 133/2026"],
      ["Resultado", "Homologada"],
      ["Órgão", "IFRS"],
      ["Próxima etapa", "Acompanhar contrato"],
    ],
  },
  "Contrato assinado": {
    facts: [
      ["Contrato", "CT-2026-044"],
      ["Vigência", "12 meses"],
      ["Valor", "R$ 86.400,00"],
      ["Status", "Formalizado"],
    ],
  },
  "Empresa não vencedora": {
    facts: [
      ["Licitação", "PE 077/2026"],
      ["Posição final", "3º lugar"],
      ["Melhor oferta", "R$ 697.106,40"],
      ["Ação", "Ver histórico"],
    ],
  },
  "Licitação cancelada": {
    facts: [
      ["Licitação", "PE 229/2026"],
      ["Órgão", "Prefeitura de Campinas"],
      ["Publicação", "17 ago 2026"],
      ["Ação", "Arquivar acompanhamento"],
    ],
  },
  "Licitação deserta": {
    facts: [
      ["Licitação", "PE 187/2026"],
      ["Motivo", "Sem propostas válidas"],
      ["Órgão", "UFMG"],
      ["Ação", "Acompanhar republicação"],
    ],
  },
  "Convocação para próxima etapa": {
    facts: [
      ["Licitação", "PE 310/2026"],
      ["Etapa", "Habilitação"],
      ["Prazo", "20 ago · 16h"],
      ["Ação", "Enviar documentos"],
    ],
  },
  "Convite enviado": {
    facts: [
      ["Convidado", "ana@iridia.com.br"],
      ["Função", "Analista"],
      ["Expira em", "24 ago 2026"],
      ["Status", "Aguardando aceite"],
    ],
  },
  "Convite aceito": {
    facts: [
      ["Integrante", "Ana Souza"],
      ["Função", "Analista"],
      ["Workspace", "Iridia Soluções"],
      ["Status", "Acesso ativo"],
    ],
  },
  "Usuário adicionado": {
    facts: [
      ["Integrante", "Carlos Mendes"],
      ["Função", "Visualizador"],
      ["Incluído por", "Jussefer"],
      ["Status", "Acesso ativo"],
    ],
  },
  "Função alterada": {
    facts: [
      ["Integrante", "Ana Souza"],
      ["Função anterior", "Analista"],
      ["Nova função", "Gestora"],
      ["Alterado por", "Jussefer"],
    ],
  },
  "Oportunidade atribuída": {
    facts: [
      ["Oportunidade", "PE 310/2026"],
      ["Responsável", "Ana Souza"],
      ["Prazo", "22 ago · 14h"],
      ["Status", "Em análise"],
    ],
  },
  "Menção em anotação": {
    facts: [
      ["Licitação", "PE 845/2026"],
      ["Mencionado por", "Carlos Mendes"],
      ["Anotação", "Revisar exigência técnica"],
      ["Quando", "Hoje · 11h32"],
    ],
  },
  "Responsável por proposta alterado": {
    facts: [
      ["Proposta", "PE 310/2026"],
      ["Novo responsável", "Ana Souza"],
      ["Anterior", "Carlos Mendes"],
      ["Status", "Aguardando revisão"],
    ],
  },
  "Acesso suspenso": {
    facts: [
      ["Integrante", "Carlos Mendes"],
      ["Workspace", "Iridia Soluções"],
      ["Motivo", "Revisão administrativa"],
      ["Status", "Sem acesso"],
    ],
  },
};

type AccessPreview = {
  kind: "steps" | "code";
  label: string;
  status: string;
  detail: string;
  code?: string;
  steps: string[];
};

const accessDetails: Record<string, AccessPreview> = {
  "Confirmar endereço de e-mail": {
    kind: "steps",
    label: "Ativação da conta",
    status: "Pendente",
    detail: "",
    steps: [
      "Confirme que este endereço pertence a você.",
      "Use o botão abaixo em até 30 minutos.",
      "Complete a configuração da conta da Iridia Soluções.",
    ],
  },
  "Recuperar senha": {
    kind: "steps",
    label: "Recuperação solicitada",
    status: "Expira em 30 min",
    detail: "",
    steps: [
      "Verifique se esta solicitação foi feita por você.",
      "Defina uma senha nova e exclusiva para a conta.",
      "Entre novamente após concluir a alteração.",
    ],
  },
  "Senha alterada": {
    kind: "steps",
    label: "Senha atualizada",
    status: "Concluído",
    detail: "",
    steps: [
      "A nova senha já está protegendo a sua conta.",
      "Sessões antigas foram encerradas por segurança.",
      "Revise a atividade se não reconhece esta ação.",
    ],
  },
  "Alteração de e-mail": {
    kind: "steps",
    label: "Novo e-mail",
    status: "Confirmação necessária",
    detail: "",
    steps: [
      "Confirme o novo endereço principal de acesso.",
      "O endereço anterior continuará válido até a confirmação.",
      "Revise a alteração caso ela não tenha sido solicitada.",
    ],
  },
  "Verificação de novo dispositivo": {
    kind: "steps",
    label: "Novo dispositivo",
    status: "Revisar acesso",
    detail: "",
    steps: [
      "Compare o dispositivo com seus acessos recentes.",
      "Autorize o acesso somente se reconhecer a atividade.",
      "Bloqueie e altere a senha se houver qualquer dúvida.",
    ],
  },
  "Código de autenticação": {
    kind: "code",
    label: "Código de uso único",
    status: "Válido por 30 min",
    code: "482 917",
    detail: "Use este código apenas na tela oficial da LicitaBase. Não compartilhe com ninguém.",
    steps: [],
  },
  "Conta criada": {
    kind: "steps",
    label: "Conta criada",
    status: "Próximo passo",
    detail: "",
    steps: [
      "Conclua o cadastro da empresa e das regiões atendidas.",
      "Defina categorias e portais para monitorar.",
      "Configure como deseja receber seus primeiros alertas.",
    ],
  },
  "Convite para entrar na empresa": {
    kind: "steps",
    label: "Convite de equipe",
    status: "Válido por 7 dias",
    detail: "",
    steps: [
      "Confira se o workspace Iridia Soluções é o esperado.",
      "Aceite o convite para receber acesso como Administrador.",
      "Recuse o convite caso não reconheça a empresa.",
    ],
  },
};

type AlertPreview = {
  tone: "success" | "attention" | "danger";
  status: string;
  detail: string;
  metricLabel: string;
  metric: string;
  updatedAt: string;
};

const alertDetails: Record<string, AlertPreview> = {
  "Disputa iniciará em breve": {
    tone: "attention",
    status: "Sessão próxima de iniciar",
    detail: "Revise a estratégia antes que o portal abra a fase de lances.",
    metricLabel: "Início previsto",
    metric: "Hoje · 14h00",
    updatedAt: "há 5 minutos",
  },
  "Disputa iniciada": {
    tone: "success",
    status: "Sessão ao vivo",
    detail: "O portal iniciou a disputa e o Bot está acompanhando o item principal.",
    metricLabel: "Nossa posição",
    metric: "1º lugar",
    updatedAt: "há 12 segundos",
  },
  "Empresa perdeu a primeira posição": {
    tone: "attention",
    status: "Liderança perdida",
    detail: "Um concorrente reduziu o valor e a janela de reação está aberta.",
    metricLabel: "Posição atual",
    metric: "2º lugar",
    updatedAt: "há 8 segundos",
  },
  "Empresa assumiu a primeira posição": {
    tone: "success",
    status: "Liderança recuperada",
    detail: "A estratégia registrou um novo lance e a empresa voltou à primeira posição.",
    metricLabel: "Melhor lance",
    metric: "R$ 36.121,97",
    updatedAt: "há 4 segundos",
  },
  "Novo lance concorrente": {
    tone: "attention",
    status: "Movimento concorrente",
    detail: "O portal identificou uma redução de preço no item monitorado.",
    metricLabel: "Novo valor",
    metric: "R$ 36.120,00",
    updatedAt: "há 15 segundos",
  },
  "Bot pausado": {
    tone: "attention",
    status: "Automação pausada",
    detail: "A estratégia assistida foi interrompida por uma ação do operador.",
    metricLabel: "Sessão",
    metric: "Pregão 845/2026",
    updatedAt: "há 2 minutos",
  },
  "Bot interrompido por erro": {
    tone: "danger",
    status: "Ação necessária",
    detail: "O monitoramento não conseguiu ler o portal e deixou de enviar novos lances.",
    metricLabel: "Integração",
    metric: "Compras.gov",
    updatedAt: "há 1 minuto",
  },
  "Piso mínimo alcançado": {
    tone: "attention",
    status: "Piso atingido",
    detail: "O Bot seguirá monitorando, mas não reduzirá abaixo do limite configurado.",
    metricLabel: "Piso definido",
    metric: "R$ 36.100,00",
    updatedAt: "há 28 segundos",
  },
  "Prazo de proposta próximo": {
    tone: "attention",
    status: "Prazo crítico",
    detail: "Ainda há campos e documentos para revisar antes de transmitir a proposta.",
    metricLabel: "Encerra em",
    metric: "14 horas",
    updatedAt: "hoje · 09h00",
  },
  "Documento complementar solicitado": {
    tone: "danger",
    status: "Documento solicitado",
    detail: "O órgão incluiu uma exigência complementar na participação em andamento.",
    metricLabel: "Prazo de envio",
    metric: "19 ago · 16h",
    updatedAt: "há 23 minutos",
  },
};

const opportunityDetails: Record<
  string,
  { score: string; reason: string; agency: string; deadline: string; object: string; value: string }
> = {
  "Nova oportunidade compatível": {
    score: "92%",
    reason: "Produtos, região e filtro “Tecnologia” correspondem a esta publicação.",
    agency: "Prefeitura Municipal de São Paulo",
    deadline: "22 ago 2026 · 17h",
    object: "Equipamentos de informática",
    value: "R$ 950.000,00",
  },
  "Oportunidade encontrada por filtro salvo": {
    score: "86%",
    reason: "Encontrada pelo filtro salvo “Hardware e periféricos”.",
    agency: "Instituto Federal do Rio Grande do Sul",
    deadline: "21 ago 2026 · 10h",
    object: "Estações de trabalho e monitores",
    value: "R$ 1.430.000,00",
  },
  "Oportunidade com alta aderência": {
    score: "97%",
    reason: "O objeto, a região e o histórico de participação têm alta compatibilidade.",
    agency: "Prefeitura Municipal de Campinas",
    deadline: "25 ago 2026 · 15h",
    object: "Soluções para infraestrutura de TI",
    value: "R$ 2.180.000,00",
  },
  "Oportunidade em categoria monitorada": {
    score: "81%",
    reason: "A categoria “Tecnologia e informática” está entre as acompanhadas pela equipe.",
    agency: "Universidade Federal de Minas Gerais",
    deadline: "23 ago 2026 · 14h",
    object: "Notebooks e acessórios",
    value: "R$ 645.000,00",
  },
  "Oportunidade publicada por órgão acompanhado": {
    score: "78%",
    reason: "Este órgão faz parte da sua lista de acompanhamentos estratégicos.",
    agency: "Ministério da Educação",
    deadline: "29 ago 2026 · 9h",
    object: "Equipamentos para laboratórios",
    value: "R$ 3.400.000,00",
  },
};

const digestDetails: Record<string, { items: [string, string, string, string][] }> = {
  "Resumo diário": {
    items: [
      ["3", "Propostas próximas do prazo", "Uma encerra amanhã às 14h", "Prioridade"],
      ["2", "Disputas em andamento", "Uma delas está em 1º lugar", "Ao vivo"],
      ["12", "Novas oportunidades", "4 com aderência acima de 85%", ""],
    ],
  },
  "Resumo semanal": {
    items: [
      ["18", "Oportunidades analisadas", "6 avançaram para a etapa de proposta", "Semana"],
      ["4", "Disputas encerradas", "2 resultados favoráveis à empresa", "Resultado"],
      ["R$ 1,43 mi", "Valor homologado", "Em contratos conquistados nesta semana", ""],
    ],
  },
  "Resumo dos filtros salvos": {
    items: [
      ["7", "Filtro Tecnologia", "Oportunidades publicadas desde ontem", "Ativo"],
      ["3", "Filtro Saúde", "Uma publicação vence em menos de 48h", "Prazo"],
      ["2", "Filtro Órgãos acompanhados", "Novidades em órgãos priorizados", ""],
    ],
  },
  "Situação das propostas": {
    items: [
      ["2", "Aguardando revisão", "Responsáveis ainda não concluíram a checagem", "Ação"],
      ["5", "Enviadas ao portal", "Todas aguardam a próxima etapa pública", "Enviadas"],
      ["1", "Em rascunho", "Prazo final amanhã às 14h", "Prazo"],
    ],
  },
  "Desempenho das disputas": {
    items: [
      ["3", "Sessões acompanhadas", "O Bot atuou em duas disputas", "Ao vivo"],
      ["2", "Melhores posições", "Itens liderados ao fim da leitura", "1º lugar"],
      ["28", "Lances registrados", "Média de 14 lances por sessão", ""],
    ],
  },
  "Documentos próximos do vencimento": {
    items: [
      ["1", "Vence amanhã", "Certidão Negativa Estadual", "Urgente"],
      ["2", "Vencem em até 7 dias", "Documentos usados em 4 participações", "Revisar"],
      ["6", "Documentos válidos", "Sem ação necessária no momento", ""],
    ],
  },
  "Resultados e licitações finalizadas": {
    items: [
      ["2", "Licitações homologadas", "Valor total de R$ 1,43 mi", "Positivo"],
      ["1", "Contrato assinado", "Documentação concluída pelo órgão", "Concluído"],
      ["3", "Licitações encerradas", "Aguardando análise dos próximos passos", ""],
    ],
  },
};

const onboardingDetails: Record<
  string,
  { progress: string; highlight: string; detail: string; width: string }
> = {
  "Boas-vindas à LicitaBase": {
    progress: "1 de 5",
    highlight: "Vamos configurar sua operação",
    detail: "Em poucos minutos você terá oportunidades mais relevantes.",
    width: "20%",
  },
  "Complete seu perfil": {
    progress: "2 de 5",
    highlight: "Conte sobre a sua empresa",
    detail: "Essas informações melhoram as recomendações e alertas.",
    width: "40%",
  },
  "Conecte um portal": {
    progress: "3 de 5",
    highlight: "Centralize os portais utilizados",
    detail: "Conectar um portal deixa a leitura e os alertas mais completos.",
    width: "60%",
  },
  "Crie seu primeiro filtro": {
    progress: "4 de 5",
    highlight: "Salve um critério de busca",
    detail: "A LicitaBase acompanha publicações compatíveis automaticamente.",
    width: "80%",
  },
  "Analise uma oportunidade": {
    progress: "5 de 5",
    highlight: "Faça sua primeira análise",
    detail: "Abra uma oportunidade e veja os dados que orientam a decisão.",
    width: "100%",
  },
  "Configure documentos": {
    progress: "3 de 5",
    highlight: "Organize documentos essenciais",
    detail: "Evite pendências quando a sua equipe precisar enviar uma proposta.",
    width: "60%",
  },
  "Conheça o Bot de Lances": {
    progress: "4 de 5",
    highlight: "Entenda a estratégia assistida",
    detail: "Defina limites antes de colocar o Bot para acompanhar uma disputa.",
    width: "80%",
  },
  "Onboarding incompleto": {
    progress: "2 de 5",
    highlight: "Retome de onde parou",
    detail: "Faltam poucos passos para personalizar sua experiência na plataforma.",
    width: "40%",
  },
  "Conta sem atividade": {
    progress: "1 de 5",
    highlight: "Encontre seu próximo passo",
    detail: "Volte à LicitaBase para revisar oportunidades e configurar alertas úteis.",
    width: "20%",
  },
};

type DocumentPreview = { status: string; name: string; date: string; tasks: [boolean, string][] };

const documentDetails: Record<string, DocumentPreview> = {
  "Documento próximo do vencimento": {
    status: "Vencimento em 1 dia",
    name: "Certidão Negativa Estadual",
    date: "18 ago 2026",
    tasks: [
      [true, "Confirmar a validade do documento"],
      [false, "Enviar uma versão atualizada"],
      [false, "Revisar as 3 participações vinculadas"],
    ],
  },
  "Documento vencido": {
    status: "Documento vencido",
    name: "Certidão de Regularidade Fiscal",
    date: "Venceu em 16 ago",
    tasks: [
      [true, "Identificar participações impactadas"],
      [false, "Substituir o documento vencido"],
      [false, "Confirmar o novo envio ao portal"],
    ],
  },
  "Documento enviado": {
    status: "Envio registrado",
    name: "Balanço Patrimonial 2025",
    date: "Enviado às 10h14",
    tasks: [
      [true, "Documento anexado à proposta"],
      [true, "Transmissão concluída"],
      [false, "Acompanhar processamento do portal"],
    ],
  },
  "Documento recusado": {
    status: "Correção necessária",
    name: "Declaração de capacidade técnica",
    date: "Recusado às 11h06",
    tasks: [
      [true, "Ler o motivo informado pelo portal"],
      [false, "Corrigir o arquivo enviado"],
      [false, "Reenviar antes do prazo final"],
    ],
  },
  "Documento solicitado": {
    status: "Documento complementar",
    name: "Comprovação de qualificação",
    date: "Prazo: 19 ago · 16h",
    tasks: [
      [true, "Revisar a solicitação do órgão"],
      [false, "Separar o documento correto"],
      [false, "Anexar e confirmar o envio"],
    ],
  },
  "Proposta criada": {
    status: "Proposta iniciada",
    name: "PE 310/2026",
    date: "Criada às 09h20",
    tasks: [
      [true, "Responsável definido"],
      [false, "Completar valores e documentos"],
      [false, "Enviar ao portal dentro do prazo"],
    ],
  },
  "Proposta ainda em rascunho": {
    status: "Rascunho pendente",
    name: "PE 310/2026",
    date: "Prazo amanhã · 14h",
    tasks: [
      [true, "Proposta salva pela equipe"],
      [false, "Revisar campos obrigatórios"],
      [false, "Concluir o envio ao portal"],
    ],
  },
  "Proposta enviada": {
    status: "Proposta transmitida",
    name: "Pregão 845/2026",
    date: "Enviada às 13h42",
    tasks: [
      [true, "Valores enviados"],
      [true, "Documentos anexados"],
      [false, "Aguardar o recibo do portal"],
    ],
  },
  "Recebimento confirmado pelo portal": {
    status: "Recibo confirmado",
    name: "Pregão 845/2026",
    date: "Confirmado às 13h44",
    tasks: [
      [true, "Portal confirmou o recebimento"],
      [true, "Recibo registrado na LicitaBase"],
      [false, "Acompanhar próxima etapa"],
    ],
  },
};

type BillingPreview = {
  reference: string;
  plan: string;
  amount: string;
  lines: [string, string][];
};

const billingDetails: Record<string, BillingPreview> = {
  "Assinatura iniciada": {
    reference: "Assinatura ativa",
    plan: "Plano Profissional",
    amount: "R$ 299,00",
    lines: [
      ["Início", "17 ago 2026"],
      ["Próxima cobrança", "17 set 2026"],
      ["Pagamento", "Cartão final 4242"],
    ],
  },
  "Período de teste próximo do fim": {
    reference: "Período de teste",
    plan: "Plano Profissional",
    amount: "Faltam 3 dias",
    lines: [
      ["Fim do teste", "20 ago 2026"],
      ["Após o período", "R$ 299,00/mês"],
      ["Forma de pagamento", "Ainda não informada"],
    ],
  },
  "Cobrança realizada": {
    reference: "Cobrança aprovada",
    plan: "Plano Profissional",
    amount: "R$ 299,00",
    lines: [
      ["Competência", "ago 2026"],
      ["Data do pagamento", "17 ago 2026"],
      ["Pagamento", "Cartão final 4242 · 1x"],
    ],
  },
  "Pagamento recusado": {
    reference: "Pagamento não aprovado",
    plan: "Plano Profissional",
    amount: "R$ 299,00",
    lines: [
      ["Tentativa", "17 ago 2026 · 17h30"],
      ["Forma de pagamento", "Cartão final 4242"],
      ["Próxima ação", "Atualizar forma de pagamento"],
    ],
  },
  "Fatura disponível": {
    reference: "Fatura FAT-2026-00817",
    plan: "Plano Profissional",
    amount: "R$ 299,00",
    lines: [
      ["Período", "01–31 ago 2026"],
      ["Vencimento", "25 ago 2026"],
      ["Pagamento", "Cartão final 4242 · 1x"],
    ],
  },
  "Plano alterado": {
    reference: "Alteração confirmada",
    plan: "Plano Profissional",
    amount: "Novo plano",
    lines: [
      ["Vigência", "A partir de 17 ago 2026"],
      ["Principal mudança", "Mais usuários e alertas"],
      ["Próxima cobrança", "17 set 2026"],
    ],
  },
  "Limite próximo": {
    reference: "Uso do plano",
    plan: "Exportações mensais",
    amount: "85% usado",
    lines: [
      ["Utilizado", "17 de 20 exportações"],
      ["Renovação", "01 set 2026"],
      ["Alternativa", "Alterar o plano"],
    ],
  },
  "Limite atingido": {
    reference: "Limite alcançado",
    plan: "Exportações mensais",
    amount: "20 de 20",
    lines: [
      ["Renovação", "01 set 2026"],
      ["Impacto", "Novas exportações bloqueadas"],
      ["Alternativa", "Alterar o plano"],
    ],
  },
  "Cancelamento solicitado": {
    reference: "Pedido recebido",
    plan: "Plano Profissional",
    amount: "Acesso até 16 set",
    lines: [
      ["Solicitado em", "17 ago 2026"],
      ["Fim do acesso", "16 set 2026"],
      ["Cobranças futuras", "Não serão renovadas"],
    ],
  },
  "Assinatura cancelada": {
    reference: "Assinatura encerrada",
    plan: "Plano Profissional",
    amount: "Cancelada",
    lines: [
      ["Encerramento", "16 set 2026"],
      ["Acesso", "Modo leitura após a data"],
      ["Faturas", "Continuam disponíveis"],
    ],
  },
};

type SecurityPreview = {
  label: string;
  fields: [string, string][];
  primary: string;
  secondary: string;
};

const securityDetails: Record<string, SecurityPreview> = {
  "Novo login": {
    label: "Confirme esta atividade",
    fields: [
      ["Dispositivo", "Windows · Chrome"],
      ["Localização", "São Paulo, SP"],
      ["Data e hora", "17 ago 2026 · 14h32"],
      ["Endereço IP", "177.42.168.***"],
    ],
    primary: "Fui eu",
    secondary: "Não reconheço",
  },
  "Login em dispositivo desconhecido": {
    label: "Ação de segurança necessária",
    fields: [
      ["Dispositivo", "macOS · Safari"],
      ["Localização", "Curitiba, PR"],
      ["Data e hora", "17 ago 2026 · 15h04"],
      ["Endereço IP", "189.35.114.***"],
    ],
    primary: "Proteger minha conta",
    secondary: "Reconheço o acesso",
  },
  "Senha alterada com sucesso": {
    label: "Alteração confirmada",
    fields: [
      ["Ação", "Senha atualizada"],
      ["Data e hora", "17 ago 2026 · 10h42"],
      ["Dispositivo", "Windows · Chrome"],
      ["Sessões", "Outros acessos encerrados"],
    ],
    primary: "Revisar atividade",
    secondary: "Não fui eu",
  },
  "E-mail alterado": {
    label: "Valide o novo endereço",
    fields: [
      ["E-mail anterior", "ju***@iridia.com.br"],
      ["Novo e-mail", "ju***@empresa.com.br"],
      ["Data e hora", "17 ago 2026 · 11h20"],
      ["Status", "Aguardando confirmação"],
    ],
    primary: "Confirmar alteração",
    secondary: "Cancelar alteração",
  },
  "Tentativas repetidas de acesso": {
    label: "Tentativas bloqueadas",
    fields: [
      ["Tentativas", "7 em 5 minutos"],
      ["Origem", "Endereço IP desconhecido"],
      ["Última tentativa", "17 ago 2026 · 14h29"],
      ["Status", "Proteção ativa"],
    ],
    primary: "Revisar segurança",
    secondary: "Alterar senha",
  },
  "Autenticação em dois fatores ativada": {
    label: "Proteção adicional ativa",
    fields: [
      ["Método", "Aplicativo autenticador"],
      ["Data", "17 ago 2026"],
      ["Conta", "Jussefer"],
      ["Status", "Ativa"],
    ],
    primary: "Ver configurações",
    secondary: "Encerrar sessões",
  },
  "Autenticação em dois fatores desativada": {
    label: "Proteção removida",
    fields: [
      ["Método", "Aplicativo autenticador"],
      ["Data", "17 ago 2026"],
      ["Conta", "Jussefer"],
      ["Status", "Ação confirmada"],
    ],
    primary: "Ativar novamente",
    secondary: "Não fui eu",
  },
  "Sessão encerrada remotamente": {
    label: "Sessão encerrada",
    fields: [
      ["Dispositivo", "Windows · Chrome"],
      ["Ação", "Sessão removida pela segurança"],
      ["Data", "17 ago 2026 · 14h40"],
      ["Status", "Sem acesso ativo"],
    ],
    primary: "Ver sessões",
    secondary: "Alterar senha",
  },
  "Conta bloqueada": {
    label: "Conta temporariamente bloqueada",
    fields: [
      ["Motivo", "Tentativas repetidas de acesso"],
      ["Data", "17 ago 2026 · 14h31"],
      ["Próxima ação", "Redefinir senha"],
      ["Status", "Acesso protegido"],
    ],
    primary: "Desbloquear com segurança",
    secondary: "Falar com suporte",
  },
};

function EmailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#728096]">{label}</p>
      <p className="mt-1 text-[12px] font-extrabold leading-snug text-[#0B132B]">{value}</p>
    </div>
  );
}

function EmailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="text-right font-extrabold text-ink">{value}</span>
    </div>
  );
}

function PreviewFacts({
  facts,
  tone,
}: {
  facts: string[][];
  tone: "success" | "attention" | "neutral";
}) {
  const toneClass =
    tone === "success"
      ? "border-[#BDEECE] bg-[#F1FFF5]"
      : tone === "attention"
        ? "border-[#FAD7A5] bg-[#FFF9EF]"
        : "border-[#DFE7F0] bg-[#F8FAFC]";
  return (
    <dl
      className={cn(
        "mt-6 grid grid-cols-1 gap-x-5 gap-y-4 rounded-2xl border p-4 sm:grid-cols-2",
        toneClass,
      )}
    >
      {facts.map(([term, value]) => (
        <div key={term}>
          <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#728096]">
            {term}
          </dt>
          <dd className="mt-1 text-[13px] font-extrabold text-[#0B132B]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function emailMetadata(template: EmailTemplate) {
  const sequence = Math.max(
    0,
    emailTemplates.findIndex((item) => item.id === template.id),
  );
  const hour = String(8 + (sequence % 10)).padStart(2, "0");
  const minute = String((sequence * 7 + 11) % 60).padStart(2, "0");
  return {
    date: `${14 + Math.floor(sequence / 18)} ago 2026`,
    time: `${hour}:${minute}`,
  };
}

type PreviewContent = {
  eyebrow: string;
  status?: string;
  subject: string;
  preheader: string;
  headline: string;
  intro: string;
  cta: string;
  note: string;
};

const priorityEmailCopy: Record<string, PreviewContent> = {
  "Confirmar endereço de e-mail": {
    eyebrow: "Confirme seu acesso",
    subject: "Confirme seu e-mail para começar na LicitaBase",
    preheader: "Uma etapa rápida para ativar com segurança a sua conta.",
    headline: "Confirme seu endereço de e-mail",
    intro:
      "Olá, Jussefer. Falta uma etapa para liberar sua conta e personalizar a LicitaBase para a Iridia Soluções.",
    cta: "Confirmar meu e-mail",
    note: "Este link é pessoal e expira em 30 minutos. Se você não criou esta conta, ignore esta mensagem.",
  },
  "Recuperar senha": {
    eyebrow: "Segurança e acesso",
    subject: "Redefina sua senha com segurança",
    preheader: "Recebemos um pedido para alterar a senha da sua conta.",
    headline: "Você solicitou uma nova senha?",
    intro:
      "Olá, Jussefer. Use o botão abaixo para criar uma nova senha. A alteração só acontece depois da sua confirmação.",
    cta: "Redefinir minha senha",
    note: "Por segurança, o link expira em 30 minutos e pode ser usado uma única vez.",
  },
  "Convite para entrar na empresa": {
    eyebrow: "Equipe e colaboração",
    subject: "Você foi convidado para a Iridia Soluções",
    preheader: "Junte-se ao workspace e acompanhe a operação da empresa.",
    headline: "Seu acesso à Iridia Soluções está pronto",
    intro:
      "Jussefer, você recebeu um convite para colaborar no workspace da Iridia Soluções como Administrador.",
    cta: "Aceitar convite",
    note: "O convite é válido por 7 dias. Você pode recusar o acesso diretamente dentro da plataforma.",
  },
  "Nova oportunidade compatível": {
    eyebrow: "Nova oportunidade",
    subject: "Nova licitação com 92% de aderência para você",
    preheader: "Uma oportunidade compatível acabou de ser publicada.",
    headline: "Encontramos uma oportunidade que combina com sua operação",
    intro:
      "Olá, Jussefer. Esta licitação corresponde aos produtos, regiões e filtros salvos pela Iridia Soluções.",
    cta: "Analisar oportunidade",
    note: "Você recebeu este aviso porque acompanha categorias e regiões relacionadas a esta publicação.",
  },
  "Disputa iniciada": {
    eyebrow: "Disputa ao vivo",
    subject: "A disputa do Pregão 845/2026 começou",
    preheader: "Acompanhe a posição e os lances em tempo real.",
    headline: "A sessão está ao vivo. É hora de acompanhar os lances.",
    intro:
      "A disputa da Prefeitura Municipal de Guarulhos foi iniciada. Seu Bot de Lances está pronto para agir conforme a estratégia configurada.",
    cta: "Entrar na sala de disputa",
    note: "A leitura do portal e os eventos do bot também ficam registrados no histórico da sessão.",
  },
  "Empresa perdeu a primeira posição": {
    eyebrow: "Atenção necessária",
    subject: "Você perdeu a liderança no Pregão 845/2026",
    preheader: "Um concorrente reduziu o preço. Veja a janela de reação disponível.",
    headline: "Um concorrente assumiu a liderança desta disputa",
    intro:
      "Olá, Jussefer. A Iridia Soluções está agora na 2ª posição. O preço líder mudou e a estratégia pode reagir dentro do decremento definido.",
    cta: "Recuperar liderança",
    note: "Este alerta permanece disponível na central de notificações e no histórico da disputa.",
  },
  "Prazo de proposta próximo": {
    eyebrow: "Prazo próximo",
    subject: "Sua proposta vence amanhã às 14h",
    preheader: "Revise documentos e envie antes do encerramento do prazo.",
    headline: "Sua proposta está perto do prazo final",
    intro:
      "A proposta do PE 310/2026 precisa ser enviada até amanhã, às 14h. Revise os documentos obrigatórios antes de concluir.",
    cta: "Revisar proposta",
    note: "Os horários exibidos seguem o cronograma publicado pelo portal de origem.",
  },
  "Resumo diário": {
    eyebrow: "Resumo diário",
    subject: "Seu dia na LicitaBase: oportunidades, prazos e disputas",
    preheader: "Veja primeiro o que exige a sua atenção hoje.",
    headline: "O que merece sua atenção hoje",
    intro:
      "Bom dia, Jussefer. Reunimos os movimentos mais importantes da operação da Iridia Soluções desde a última atualização.",
    cta: "Abrir meu resumo",
    note: "A frequência dos resumos poderá ser configurada nas preferências de notificações.",
  },
  "Fatura disponível": {
    eyebrow: "Plano e faturamento",
    subject: "Sua fatura de agosto já está disponível",
    preheader: "Plano Profissional · R$ 299,00 · vencimento em 25 ago 2026.",
    headline: "A fatura do seu plano está pronta para consulta",
    intro:
      "Olá, Jussefer. A cobrança da Iridia Soluções referente ao plano Profissional já pode ser visualizada na área de faturamento.",
    cta: "Ver fatura",
    note: "Informações completas de pagamento e o documento fiscal ficam disponíveis somente na área autenticada.",
  },
  "Novo login": {
    eyebrow: "Segurança e acesso",
    subject: "Novo acesso identificado na sua conta",
    preheader: "Confira o dispositivo e a localização deste login recente.",
    headline: "Identificamos um novo acesso à sua conta",
    intro:
      "Olá, Jussefer. Um login foi realizado usando Windows e Chrome em São Paulo, SP. Confirme se este acesso foi seu.",
    cta: "Revisar atividade",
    note: "Se você não reconhece este acesso, altere sua senha e encerre sessões abertas imediatamente.",
  },
};

const actionByTitle: Record<string, { cta: string; status: string }> = {
  "Confirmar endereço de e-mail": { cta: "Confirmar meu e-mail", status: "Ação necessária" },
  "Recuperar senha": { cta: "Redefinir minha senha", status: "Link seguro" },
  "Senha alterada": { cta: "Revisar atividade", status: "Alteração concluída" },
  "Alteração de e-mail": { cta: "Confirmar novo e-mail", status: "Confirmação pendente" },
  "Verificação de novo dispositivo": { cta: "Verificar dispositivo", status: "Revisar acesso" },
  "Código de autenticação": { cta: "Abrir tela de acesso", status: "Código temporário" },
  "Conta criada": { cta: "Configurar minha conta", status: "Próximo passo" },
  "Convite para entrar na empresa": { cta: "Aceitar convite", status: "Convite recebido" },
  "Disputa iniciará em breve": { cta: "Revisar estratégia", status: "Em breve" },
  "Disputa iniciada": { cta: "Entrar na sala de disputa", status: "Ao vivo" },
  "Empresa perdeu a primeira posição": { cta: "Recuperar liderança", status: "Atenção" },
  "Empresa assumiu a primeira posição": { cta: "Acompanhar disputa", status: "Ganhando" },
  "Novo lance concorrente": { cta: "Ver movimento", status: "Novo lance" },
  "Bot pausado": { cta: "Retomar Bot", status: "Automação pausada" },
  "Bot interrompido por erro": { cta: "Corrigir conexão", status: "Ação necessária" },
  "Piso mínimo alcançado": { cta: "Ver estratégia", status: "Piso atingido" },
  "Prazo de proposta próximo": { cta: "Revisar proposta", status: "Prazo crítico" },
  "Documento complementar solicitado": { cta: "Enviar documento", status: "Pendência aberta" },
  "Nova oportunidade compatível": { cta: "Analisar oportunidade", status: "Alta aderência" },
  "Oportunidade encontrada por filtro salvo": {
    cta: "Abrir filtro e oportunidade",
    status: "Filtro acionado",
  },
  "Oportunidade com alta aderência": { cta: "Priorizar oportunidade", status: "97% de aderência" },
  "Oportunidade em categoria monitorada": { cta: "Ver publicação", status: "Categoria monitorada" },
  "Oportunidade publicada por órgão acompanhado": {
    cta: "Analisar órgão",
    status: "Órgão acompanhado",
  },
  "Resumo diário": { cta: "Abrir meu resumo", status: "Hoje" },
  "Resumo semanal": { cta: "Ver semana completa", status: "Esta semana" },
  "Resumo dos filtros salvos": { cta: "Revisar filtros", status: "Filtros ativos" },
  "Situação das propostas": { cta: "Gerenciar propostas", status: "Atualização operacional" },
  "Desempenho das disputas": { cta: "Analisar disputas", status: "Sessões recentes" },
  "Documentos próximos do vencimento": {
    cta: "Renovar documentos",
    status: "Vencimentos próximos",
  },
  "Resultados e licitações finalizadas": { cta: "Abrir resultados", status: "Período concluído" },
  "Portal conectado": { cta: "Ver integração", status: "Conexão ativa" },
  "Sincronização inicial concluída": { cta: "Ver dados importados", status: "Sincronizado" },
  "Credenciais incorretas": { cta: "Atualizar credenciais", status: "Conexão bloqueada" },
  "Credenciais expiradas": { cta: "Renovar credenciais", status: "Credenciais vencidas" },
  "Portal desconectado": { cta: "Reconectar portal", status: "Indisponível" },
  "Sincronização interrompida": { cta: "Retomar sincronização", status: "Interrompida" },
  "Portal novamente operacional": { cta: "Ver sincronização", status: "Operacional" },
  "Raio-X do edital concluído": { cta: "Abrir análise do edital", status: "Análise pronta" },
  "Exportação de relatório pronta": { cta: "Baixar relatório", status: "Arquivo disponível" },
  "Documento próximo do vencimento": { cta: "Renovar documento", status: "Vence em breve" },
  "Documento vencido": { cta: "Substituir documento", status: "Vencido" },
  "Documento enviado": { cta: "Acompanhar envio", status: "Em processamento" },
  "Documento recusado": { cta: "Corrigir documento", status: "Correção necessária" },
  "Documento solicitado": { cta: "Anexar documento", status: "Solicitação recebida" },
  "Proposta criada": { cta: "Continuar proposta", status: "Rascunho iniciado" },
  "Proposta ainda em rascunho": { cta: "Concluir proposta", status: "Envio pendente" },
  "Proposta enviada": { cta: "Ver comprovante", status: "Transmitida" },
  "Recebimento confirmado pelo portal": { cta: "Abrir recibo", status: "Confirmado" },
  "Empresa classificada": { cta: "Ver classificação", status: "Classificada" },
  "Licitação adjudicada": { cta: "Ver adjudicação", status: "Adjudicada" },
  "Licitação homologada": { cta: "Ver resultado homologado", status: "Homologada" },
  "Contrato assinado": { cta: "Abrir contrato", status: "Contrato assinado" },
  "Empresa não vencedora": { cta: "Ver resultado final", status: "Não vencedora" },
  "Licitação cancelada": { cta: "Ver cancelamento", status: "Encerrada" },
  "Licitação deserta": { cta: "Acompanhar republicação", status: "Sem propostas" },
  "Convocação para próxima etapa": { cta: "Enviar documentos", status: "Nova etapa" },
  "Convite enviado": { cta: "Gerenciar convite", status: "Aguardando aceite" },
  "Convite aceito": { cta: "Ver equipe", status: "Novo integrante" },
  "Usuário adicionado": { cta: "Gerenciar acesso", status: "Acesso liberado" },
  "Função alterada": { cta: "Revisar permissões", status: "Permissão atualizada" },
  "Oportunidade atribuída": { cta: "Abrir oportunidade", status: "Responsável definido" },
  "Menção em anotação": { cta: "Responder anotação", status: "Você foi mencionado" },
  "Responsável por proposta alterado": { cta: "Abrir proposta", status: "Responsável atualizado" },
  "Acesso suspenso": { cta: "Revisar acesso", status: "Acesso suspenso" },
  "Assinatura iniciada": { cta: "Ver assinatura", status: "Plano ativo" },
  "Período de teste próximo do fim": { cta: "Escolher plano", status: "Restam 3 dias" },
  "Cobrança realizada": { cta: "Ver pagamento", status: "Pagamento aprovado" },
  "Pagamento recusado": { cta: "Atualizar pagamento", status: "Cobrança pendente" },
  "Fatura disponível": { cta: "Ver fatura", status: "Fatura aberta" },
  "Plano alterado": { cta: "Ver novo plano", status: "Plano atualizado" },
  "Limite próximo": { cta: "Gerenciar limite", status: "85% utilizado" },
  "Limite atingido": { cta: "Alterar plano", status: "Limite atingido" },
  "Cancelamento solicitado": { cta: "Ver solicitação", status: "Em processamento" },
  "Assinatura cancelada": { cta: "Ver acesso e faturas", status: "Assinatura encerrada" },
  "Novo login": { cta: "Revisar atividade", status: "Acesso identificado" },
  "Login em dispositivo desconhecido": {
    cta: "Proteger minha conta",
    status: "Revisão necessária",
  },
  "Senha alterada com sucesso": { cta: "Ver segurança", status: "Senha atualizada" },
  "E-mail alterado": { cta: "Confirmar alteração", status: "Validação pendente" },
  "Tentativas repetidas de acesso": { cta: "Bloquear acessos", status: "Proteção ativa" },
  "Autenticação em dois fatores ativada": { cta: "Ver configurações", status: "2FA ativo" },
  "Autenticação em dois fatores desativada": { cta: "Ativar novamente", status: "2FA removido" },
  "Sessão encerrada remotamente": { cta: "Gerenciar sessões", status: "Sessão encerrada" },
  "Conta bloqueada": { cta: "Desbloquear conta", status: "Acesso protegido" },
  "Boas-vindas à LicitaBase": { cta: "Começar configuração", status: "Primeiro acesso" },
  "Complete seu perfil": { cta: "Completar perfil", status: "Perfil pendente" },
  "Conecte um portal": { cta: "Conectar portal", status: "Integração pendente" },
  "Crie seu primeiro filtro": { cta: "Criar filtro", status: "Próximo passo" },
  "Analise uma oportunidade": { cta: "Abrir oportunidade", status: "Aprenda na prática" },
  "Configure documentos": { cta: "Cadastrar documentos", status: "Preparar operação" },
  "Conheça o Bot de Lances": { cta: "Conhecer o Bot", status: "Automação" },
  "Onboarding incompleto": { cta: "Retomar onboarding", status: "Etapas pendentes" },
  "Conta sem atividade": { cta: "Voltar à LicitaBase", status: "Sua operação espera" },
};

function previewContent(template: EmailTemplate): PreviewContent {
  const priorityCopy = priorityEmailCopy[template.title];
  const action = actionByTitle[template.title] ?? {
    cta: "Abrir comunicado",
    status: "Atualização",
  };
  if (priorityCopy) return { ...priorityCopy, status: action.status };

  const fallbacks: Record<TemplateBase, Omit<PreviewContent, "headline" | "subject">> = {
    authentication: {
      eyebrow: "Segurança e acesso",
      preheader: "Uma atualização importante sobre o acesso à sua conta.",
      intro:
        "Olá, Jussefer. Registramos uma atualização relacionada ao acesso da sua conta LicitaBase.",
      cta: "Continuar com segurança",
      note: "Se você não solicitou esta ação, pode ignorar esta mensagem com segurança.",
    },
    alert: {
      eyebrow: "Alerta operacional",
      preheader: "Uma mudança exige sua atenção para manter a operação acompanhada.",
      intro:
        "Olá, Jussefer. Há uma atualização importante em uma licitação acompanhada pela Iridia Soluções.",
      cta: "Ver atualização",
      note: "Este alerta também fica disponível na central de notificações e no histórico da operação.",
    },
    opportunity: {
      eyebrow: "Nova oportunidade",
      preheader: "Uma licitação compatível com os seus critérios foi encontrada.",
      intro:
        "Olá, Jussefer. Encontramos uma oportunidade relacionada aos filtros e categorias monitorados pela sua empresa.",
      cta: "Analisar oportunidade",
      note: "Você recebeu este comunicado porque acompanha critérios relacionados a esta publicação.",
    },
    digest: {
      eyebrow: "Seu resumo",
      preheader: "Os principais movimentos da sua operação, organizados em uma única leitura.",
      intro:
        "Olá, Jussefer. Veja os acontecimentos mais relevantes da Iridia Soluções desde a última atualização.",
      cta: "Ver resumo completo",
      note: "A frequência deste resumo será definida nas preferências de notificações.",
    },
    process: {
      eyebrow: "Atualização de processamento",
      preheader: "Uma atividade da LicitaBase foi concluída ou requer sua ação.",
      intro:
        "Olá, Jussefer. Uma atividade da sua operação foi concluída ou precisa de uma revisão da equipe.",
      cta: "Ver detalhes",
      note: "As atividades continuam registradas dentro da plataforma para manter o contexto completo.",
    },
    document: {
      eyebrow: "Documentos e propostas",
      preheader: "Uma atualização foi registrada em documentos ou propostas da sua operação.",
      intro:
        "Olá, Jussefer. Existe uma atualização importante para manter a participação da sua empresa em dia.",
      cta: "Continuar na LicitaBase",
      note: "Manter documentos válidos evita pendências durante a participação em licitações.",
    },
    result: {
      eyebrow: "Resultado da licitação",
      preheader: "Uma nova etapa foi registrada em uma licitação acompanhada pela sua empresa.",
      intro:
        "Olá, Jussefer. Há uma atualização relevante no resultado ou na próxima etapa desta licitação.",
      cta: "Ver resultado",
      note: "Acompanhe também os documentos e as próximas etapas diretamente na LicitaBase.",
    },
    billing: {
      eyebrow: "Plano e faturamento",
      preheader: "Informações relevantes sobre o plano e a cobrança da sua empresa.",
      intro:
        "Olá, Jussefer. Veja os detalhes deste comunicado referente ao plano da Iridia Soluções.",
      cta: "Acessar faturamento",
      note: "Por segurança, informações de pagamento ficam disponíveis somente na área autenticada.",
    },
    security: {
      eyebrow: "Segurança e acesso",
      preheader: "Uma atividade de segurança foi registrada na sua conta.",
      intro:
        "Olá, Jussefer. Registramos uma atualização de segurança relacionada ao acesso da sua conta LicitaBase.",
      cta: "Revisar segurança",
      note: "Se você não reconhece esta atividade, altere sua senha e encerre sessões abertas imediatamente.",
    },
    collaboration: {
      eyebrow: "Equipe e colaboração",
      preheader: "Há uma atualização em uma atividade compartilhada com a sua equipe.",
      intro:
        "Olá, Jussefer. Uma atividade compartilhada com a equipe da Iridia Soluções foi atualizada.",
      cta: "Abrir atividade",
      note: "Esta comunicação mantém o contexto da equipe sem substituir a central de notificações.",
    },
  };
  const fallback = fallbacks[template.base];
  return {
    ...fallback,
    intro: `Olá, Jussefer. ${template.eventDescription}`,
    preheader: template.eventDescription,
    subject: `${template.title} — LicitaBase`,
    headline: template.title,
    cta: action.cta,
    status: action.status,
  };
}
