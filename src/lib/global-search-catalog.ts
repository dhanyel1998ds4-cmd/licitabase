import {
  BarChart3,
  Bell,
  BellRing,
  Bot,
  BriefcaseBusiness,
  Building2,
  Camera,
  CircleDollarSign,
  FileSearch,
  FileText,
  FolderOpen,
  Gauge,
  History,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  Mail,
  Network,
  Package,
  PanelTop,
  Phone,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Swords,
  Tags,
  UserRound,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type GlobalSearchType = "page" | "section" | "setting" | "action" | "resource";
export type GlobalSearchStatus = "available" | "coming-soon";
export type GlobalSearchRole = "admin" | "member";
export type GlobalSearchFilter =
  "Todos" | "Páginas" | "Oportunidades" | "Operação" | "Conta" | "Gestão" | "Configurações";
export type GlobalSearchRoute =
  | "/dash2"
  | "/dash2/licitacoes/buscar"
  | "/dash2/licitacoes/$licitacaoId"
  | "/dash2/oportunidades/novas"
  | "/dash2/oportunidades/favoritos"
  | "/dash2/operacao/minhas-licitacoes"
  | "/bot-lances"
  | "/bot-lances/disputas"
  | "/bot-lances/monitoramento"
  | "/bot-lances/relatorios"
  | "/bot-lances/historico"
  | "/bot-lances/configuracoes"
  | "/dash2/configuracoes/perfil"
  | "/dash2/configuracoes/empresa"
  | "/dash2/configuracoes/equipe"
  | "/dash2/configuracoes/plano"
  | "/dash2/configuracoes/seguranca"
  | "/dash2/configuracoes/notificacoes"
  | "/dash2/ajuda";
export type GlobalSearchAction = "open-notifications" | "open-alicitante" | "open-user-menu";

export type GlobalSearchItem = {
  id: string;
  title: string;
  navigationLabel?: string;
  description: string;
  type: GlobalSearchType;
  group: string;
  breadcrumb: string[];
  icon: LucideIcon;
  filters: Exclude<GlobalSearchFilter, "Todos">[];
  keywords: string[];
  synonyms: string[];
  status: GlobalSearchStatus;
  route?: GlobalSearchRoute;
  action?: GlobalSearchAction;
  permission?: GlobalSearchRole[];
  frequentlyUsed?: boolean;
  contextPaths?: string[];
};

export const globalSearchFilters: GlobalSearchFilter[] = [
  "Todos",
  "Páginas",
  "Oportunidades",
  "Operação",
  "Conta",
  "Gestão",
  "Configurações",
];

export const globalSearchCatalog: GlobalSearchItem[] = [
  {
    id: "dashboard-home",
    title: "Visão geral",
    description: "Resumo do dia, indicadores e situação da operação",
    type: "page",
    group: "Páginas",
    breadcrumb: ["Dashboard", "Visão geral"],
    icon: LayoutDashboard,
    filters: ["Páginas"],
    keywords: ["dashboard", "início", "home", "resumo", "indicadores", "kpis"],
    synonyms: ["painel", "página inicial", "resumo do dia"],
    status: "available",
    route: "/dash2",
    frequentlyUsed: true,
    contextPaths: ["/dash2"],
  },
  {
    id: "new-opportunities",
    title: "Novas oportunidades",
    description: "Analise, priorize ou descarte novas licitações",
    type: "page",
    group: "Oportunidades",
    breadcrumb: ["Oportunidades", "Novas oportunidades"],
    icon: Sparkles,
    filters: ["Páginas", "Oportunidades"],
    keywords: ["nova", "licitação", "edital", "match", "analisar", "priorizar", "descartar"],
    synonyms: ["oportunidades", "pregões novos", "licitações novas"],
    status: "available",
    route: "/dash2/oportunidades/novas",
    frequentlyUsed: true,
    contextPaths: ["/dash2/oportunidades"],
  },
  {
    id: "bid-bot-home",
    title: "Bot de Lances",
    description: "Visão geral da automação de lances",
    type: "page",
    group: "Operação",
    breadcrumb: ["Minha operação", "Bot de Lances"],
    icon: Bot,
    filters: ["Páginas", "Operação"],
    keywords: ["bot", "lance", "automação", "robô", "visão geral"],
    synonyms: ["robô de lances", "lances automáticos", "aliciante bot"],
    status: "available",
    route: "/bot-lances",
    frequentlyUsed: true,
    contextPaths: ["/bot-lances"],
  },
  {
    id: "bid-bot-disputes",
    title: "Disputas",
    description: "Acompanhe sessões, posições e lances em andamento",
    type: "page",
    group: "Operação",
    breadcrumb: ["Bot de Lances", "Disputas"],
    icon: Swords,
    filters: ["Páginas", "Operação"],
    keywords: ["disputa", "pregão", "sessão", "posição", "lance", "ao vivo"],
    synonyms: ["pregões", "disputas ativas", "sessão pública"],
    status: "available",
    route: "/bot-lances/disputas",
    frequentlyUsed: true,
    contextPaths: ["/bot-lances"],
  },
  {
    id: "bid-bot-monitoring",
    title: "Monitoramento",
    description: "Status e saúde das automações em tempo real",
    type: "page",
    group: "Operação",
    breadcrumb: ["Bot de Lances", "Monitoramento"],
    icon: Radio,
    filters: ["Páginas", "Operação"],
    keywords: ["monitorar", "status", "tempo real", "atividade", "saúde"],
    synonyms: ["acompanhamento", "monitor", "robôs ativos"],
    status: "available",
    route: "/bot-lances/monitoramento",
    contextPaths: ["/bot-lances"],
  },
  {
    id: "bid-bot-reports",
    title: "Relatórios do Bot",
    navigationLabel: "Relatórios",
    description: "Resultados, métricas e desempenho das automações",
    type: "page",
    group: "Operação",
    breadcrumb: ["Bot de Lances", "Relatórios"],
    icon: BarChart3,
    filters: ["Páginas", "Operação"],
    keywords: ["relatório", "resultado", "desempenho", "métrica", "análise", "dados"],
    synonyms: ["relatórios", "performance", "indicadores do bot"],
    status: "available",
    route: "/bot-lances/relatorios",
    contextPaths: ["/bot-lances"],
  },
  {
    id: "bid-bot-history",
    title: "Histórico do Bot",
    navigationLabel: "Histórico",
    description: "Consulte sessões e ações anteriores",
    type: "page",
    group: "Operação",
    breadcrumb: ["Bot de Lances", "Histórico"],
    icon: History,
    filters: ["Páginas", "Operação"],
    keywords: ["histórico", "anterior", "passado", "sessão", "registro", "eventos"],
    synonyms: ["atividades anteriores", "registro de lances"],
    status: "available",
    route: "/bot-lances/historico",
    contextPaths: ["/bot-lances"],
  },
  {
    id: "bid-bot-settings",
    title: "Configurações do Bot",
    navigationLabel: "Configurações",
    description: "Estratégias, decremento, limites e intervalo de lances",
    type: "page",
    group: "Configurações",
    breadcrumb: ["Bot de Lances", "Configurações"],
    icon: Settings,
    filters: ["Páginas", "Operação", "Configurações"],
    keywords: ["configuração", "config", "estratégia", "decremento", "limite", "intervalo", "piso"],
    synonyms: ["preferências do bot", "ajustar bot", "regras de lance"],
    status: "available",
    route: "/bot-lances/configuracoes",
    contextPaths: ["/bot-lances"],
  },
  {
    id: "open-notifications",
    title: "Abrir notificações",
    description: "Veja alertas e atualizações recebidas hoje",
    type: "action",
    group: "Ações rápidas",
    breadcrumb: ["Dashboard", "Notificações"],
    icon: Bell,
    filters: ["Conta", "Configurações"],
    keywords: ["notificação", "alerta", "novidade", "aviso", "sino", "não lidas"],
    synonyms: ["central de alertas", "avisos", "atualizações"],
    status: "available",
    action: "open-notifications",
    frequentlyUsed: true,
  },
  {
    id: "open-alicitante",
    title: "Peça à Alicitante",
    description: "Abra a assistente de oportunidades e editais",
    type: "action",
    group: "Ações rápidas",
    breadcrumb: ["Dashboard", "Alicitante"],
    icon: Sparkles,
    filters: ["Oportunidades", "Operação"],
    keywords: ["ia", "assistente", "chat", "perguntar", "ajuda", "edital"],
    synonyms: ["inteligência artificial", "copiloto", "aliciante"],
    status: "available",
    action: "open-alicitante",
    frequentlyUsed: true,
  },
  {
    id: "open-user-menu",
    title: "Abrir menu do usuário",
    description: "Acesse conta, workspace, preferências e saída",
    type: "action",
    group: "Ações rápidas",
    breadcrumb: ["Conta", "Menu do usuário"],
    icon: UserRound,
    filters: ["Conta"],
    keywords: ["usuário", "conta", "avatar", "perfil", "jussefer", "workspace"],
    synonyms: ["menu da conta", "minha conta"],
    status: "available",
    action: "open-user-menu",
  },
  {
    id: "account-profile",
    title: "Meu perfil",
    description: "Foto, nome, telefone e dados pessoais",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Conta", "Meu perfil"],
    icon: UserRound,
    filters: ["Conta", "Configurações"],
    keywords: ["perfil", "conta", "dados pessoais", "cadastro", "identidade"],
    synonyms: ["minha conta", "informações da conta", "configuração pessoal"],
    status: "available",
    route: "/dash2/configuracoes/perfil",
  },
  {
    id: "account-profile-photo",
    title: "Alterar foto do perfil",
    description: "Atualize a imagem exibida na sua conta",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Meu perfil", "Identidade"],
    icon: Camera,
    filters: ["Conta", "Configurações"],
    keywords: ["foto", "imagem", "perfil", "rosto", "identidade"],
    synonyms: ["avatar", "alterar foto", "foto do usuário"],
    status: "available",
    route: "/dash2/configuracoes/perfil",
  },
  {
    id: "account-name",
    title: "Nome do usuário",
    description: "Atualize o nome exibido na sua conta",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Meu perfil", "Dados pessoais"],
    icon: UserRound,
    filters: ["Conta", "Configurações"],
    keywords: ["nome", "usuário", "dados pessoais", "cadastro"],
    synonyms: ["alterar nome", "nome completo"],
    status: "available",
    route: "/dash2/configuracoes/perfil",
  },
  {
    id: "account-email",
    title: "E-mail da conta",
    description: "Consulte ou altere o endereço de e-mail",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Meu perfil", "Dados de contato"],
    icon: Mail,
    filters: ["Conta", "Configurações"],
    keywords: ["email", "e-mail", "contato", "login"],
    synonyms: ["correio eletrônico", "alterar email"],
    status: "available",
    route: "/dash2/configuracoes/perfil",
  },
  {
    id: "account-phone",
    title: "Telefone",
    description: "Adicione ou altere seu número de contato",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Meu perfil", "Dados de contato"],
    icon: Phone,
    filters: ["Conta", "Configurações"],
    keywords: ["telefone", "contato", "número", "whatsapp"],
    synonyms: ["celular", "fone", "número de telefone"],
    status: "available",
    route: "/dash2/configuracoes/perfil",
  },
  {
    id: "company-workspace",
    title: "Empresa e workspace",
    description: "Dados cadastrais, CNPJ e workspace atual",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Conta", "Empresa e workspace"],
    icon: Building2,
    filters: ["Conta", "Gestão", "Configurações"],
    keywords: [
      "empresa",
      "workspace",
      "cnpj",
      "razão social",
      "nome fantasia",
      "configuração",
      "config",
    ],
    synonyms: ["dados da empresa", "organização", "espaço de trabalho"],
    permission: ["admin"],
    status: "available",
    route: "/dash2/configuracoes/empresa",
  },
  {
    id: "company-registration",
    title: "Dados da empresa",
    description: "Razão social, nome fantasia e CNPJ",
    type: "setting",
    group: "Conta e workspace",
    breadcrumb: ["Empresa e workspace", "Dados cadastrais"],
    icon: BriefcaseBusiness,
    filters: ["Conta", "Gestão", "Configurações"],
    keywords: ["cnpj", "razão social", "nome fantasia", "empresa", "cadastro"],
    synonyms: ["dados cadastrais", "cadastro da empresa"],
    permission: ["admin"],
    status: "available",
    route: "/dash2/configuracoes/empresa",
  },
  {
    id: "multiple-companies",
    title: "Gestão de múltiplos CNPJs",
    description: "Gerencie empresas vinculadas ao workspace",
    type: "resource",
    group: "Gestão",
    breadcrumb: ["Empresa e workspace", "Empresas vinculadas"],
    icon: Network,
    filters: ["Conta", "Gestão"],
    keywords: ["cnpj", "empresas", "múltiplos", "filial", "workspace"],
    synonyms: ["vários cnpjs", "multiempresa"],
    permission: ["admin"],
    status: "coming-soon",
  },
  {
    id: "team-permissions",
    title: "Equipe e permissões",
    navigationLabel: "Equipe",
    description: "Convites, funções e níveis de acesso",
    type: "setting",
    group: "Gestão",
    breadcrumb: ["Gestão", "Equipe e permissões"],
    icon: UsersRound,
    filters: ["Gestão", "Configurações"],
    keywords: ["equipe", "usuário", "convite", "função", "permissão", "acesso", "configuração"],
    synonyms: ["membros", "colaboradores", "níveis de acesso"],
    permission: ["admin"],
    status: "available",
    route: "/dash2/configuracoes/equipe",
  },
  {
    id: "billing-plan",
    title: "Plano e faturamento",
    navigationLabel: "Planos",
    description: "Plano atual, cobrança, faturas e upgrade",
    type: "setting",
    group: "Gestão",
    breadcrumb: ["Conta", "Plano e faturamento"],
    icon: WalletCards,
    filters: ["Conta", "Gestão", "Configurações"],
    keywords: [
      "plano",
      "faturamento",
      "fatura",
      "cobrança",
      "pagamento",
      "upgrade",
      "configuração",
    ],
    synonyms: ["assinatura", "mensalidade", "financeiro"],
    permission: ["admin"],
    status: "available",
    route: "/dash2/configuracoes/plano",
  },
  {
    id: "security-access",
    title: "Segurança e acesso",
    description: "Senha, sessões abertas e autenticação",
    type: "setting",
    group: "Configurações",
    breadcrumb: ["Conta", "Segurança e acesso"],
    icon: ShieldCheck,
    filters: ["Conta", "Configurações"],
    keywords: ["segurança", "senha", "sessão", "acesso", "autenticação", "2fa", "configuração"],
    synonyms: ["alterar senha", "login", "sessões abertas"],
    status: "available",
    route: "/dash2/configuracoes/seguranca",
  },
  {
    id: "change-password",
    title: "Alterar senha",
    description: "Atualize com segurança sua senha de acesso",
    type: "setting",
    group: "Configurações",
    breadcrumb: ["Segurança e acesso", "Senha"],
    icon: LockKeyhole,
    filters: ["Conta", "Configurações"],
    keywords: ["senha", "segurança", "trocar", "alterar", "login"],
    synonyms: ["nova senha", "redefinir senha", "mudar senha"],
    status: "coming-soon",
  },
  {
    id: "notification-preferences",
    title: "Preferências de notificações",
    description: "Alertas de oportunidades, disputas, bot e e-mail",
    type: "setting",
    group: "Configurações",
    breadcrumb: ["Conta", "Notificações"],
    icon: BellRing,
    filters: ["Conta", "Configurações"],
    keywords: [
      "notificação",
      "alerta",
      "email",
      "disputa",
      "bot",
      "preferência",
      "configuração",
      "config",
    ],
    synonyms: ["configurar alertas", "avisos", "alertas por email"],
    status: "available",
    route: "/dash2/configuracoes/notificacoes",
  },
  {
    id: "search-bids",
    title: "Buscar licitações",
    description: "Encontre licitações por filtros e palavras-chave",
    type: "page",
    group: "Oportunidades",
    breadcrumb: ["Explorar licitações", "Buscar licitações"],
    icon: Search,
    filters: ["Páginas", "Oportunidades"],
    keywords: ["buscar", "pesquisar", "licitação", "edital", "filtro"],
    synonyms: ["pesquisa de editais", "encontrar pregão"],
    status: "available",
    route: "/dash2/licitacoes/buscar",
    frequentlyUsed: true,
    contextPaths: ["/dash2/licitacoes"],
  },
  {
    id: "interest-categories",
    title: "Categorias de interesse",
    description: "Defina setores, categorias e objetos relevantes",
    type: "setting",
    group: "Oportunidades",
    breadcrumb: ["Explorar licitações", "Categorias de interesse"],
    icon: Tags,
    filters: ["Oportunidades", "Configurações"],
    keywords: ["categoria", "setor", "interesse", "objeto", "segmento"],
    synonyms: ["áreas de interesse", "preferências de busca"],
    status: "coming-soon",
  },
  {
    id: "bid-items",
    title: "Itens de licitação",
    description: "Consulte itens, quantidades, preços e especificações",
    type: "resource",
    group: "Oportunidades",
    breadcrumb: ["Explorar licitações", "Itens de licitação"],
    icon: Package,
    filters: ["Oportunidades"],
    keywords: ["item", "produto", "quantidade", "preço", "especificação"],
    synonyms: ["itens do edital", "objetos da licitação"],
    status: "coming-soon",
  },
  {
    id: "documents",
    title: "Documentos e editais",
    navigationLabel: "Documentos",
    description: "Acesse editais, anexos e documentos da operação",
    type: "resource",
    group: "Operação",
    breadcrumb: ["Minha operação", "Documentos"],
    icon: FolderOpen,
    filters: ["Oportunidades", "Operação"],
    keywords: ["documento", "edital", "anexo", "arquivo", "pdf"],
    synonyms: ["arquivos", "documentação", "termo de referência"],
    status: "coming-soon",
  },
  {
    id: "bid-xray",
    title: "Raio-X do edital",
    navigationLabel: "Raio-X",
    description: "Analise requisitos, riscos, prazos e condições",
    type: "resource",
    group: "Inteligência",
    breadcrumb: ["Inteligência", "Raio-X"],
    icon: FileSearch,
    filters: ["Oportunidades", "Operação"],
    keywords: ["raio x", "edital", "análise", "requisito", "habilitação", "risco"],
    synonyms: ["analisar edital", "resumo do edital", "inteligência do edital"],
    status: "coming-soon",
  },
  {
    id: "agency-score",
    title: "Score dos órgãos",
    navigationLabel: "Score dos Órgãos",
    description: "Avalie risco, histórico e volume de compras dos órgãos",
    type: "resource",
    group: "Inteligência",
    breadcrumb: ["Inteligência", "Score dos órgãos"],
    icon: Gauge,
    filters: ["Oportunidades", "Gestão"],
    keywords: ["score", "órgão", "risco", "prefeitura", "histórico", "compras"],
    synonyms: ["nota do órgão", "avaliação do comprador"],
    status: "coming-soon",
  },
  {
    id: "integrations",
    title: "Integrações",
    description: "Conecte portais e serviços ao workspace",
    type: "setting",
    group: "Gestão",
    breadcrumb: ["Gestão", "Integrações"],
    icon: PanelTop,
    filters: ["Gestão", "Configurações"],
    keywords: ["integração", "portal", "conexão", "comprasnet", "licitanet", "pncp"],
    synonyms: ["portais conectados", "conectar plataforma"],
    permission: ["admin"],
    status: "coming-soon",
  },
  {
    id: "help-support",
    title: "Ajuda e suporte",
    description: "Encontre orientação e fale com o atendimento",
    type: "resource",
    group: "Conta e workspace",
    breadcrumb: ["Conta", "Ajuda e suporte"],
    icon: LifeBuoy,
    filters: ["Conta"],
    keywords: ["ajuda", "suporte", "atendimento", "dúvida", "problema"],
    synonyms: ["central de ajuda", "falar com suporte"],
    status: "available",
    route: "/dash2/ajuda",
  },
  {
    id: "saved-filters",
    title: "Filtros salvos",
    description: "Reutilize combinações de filtros de oportunidades",
    type: "resource",
    group: "Oportunidades",
    breadcrumb: ["Explorar licitações", "Filtros salvos"],
    icon: Settings,
    filters: ["Oportunidades", "Configurações"],
    keywords: ["filtro", "salvo", "busca", "preferência"],
    synonyms: ["pesquisas salvas", "filtros favoritos"],
    status: "coming-soon",
  },
  {
    id: "favorites",
    title: "Favoritos",
    navigationLabel: "Favoritos",
    description: "Revise oportunidades favoritas e salvas para depois",
    type: "page",
    group: "Oportunidades",
    breadcrumb: ["Explorar licitações", "Favoritos"],
    icon: Star,
    filters: ["Páginas", "Oportunidades"],
    keywords: ["favorito", "salvo", "ver depois", "oportunidade"],
    synonyms: ["minhas favoritas", "oportunidades salvas"],
    status: "available",
    route: "/dash2/oportunidades/favoritos",
    contextPaths: ["/dash2/oportunidades"],
  },
  {
    id: "company-reports",
    title: "Relatórios gerais",
    navigationLabel: "Relatórios",
    description: "Indicadores consolidados da operação",
    type: "page",
    group: "Gestão",
    breadcrumb: ["Inteligência", "Relatórios"],
    icon: BarChart3,
    filters: ["Páginas", "Gestão"],
    keywords: ["relatório", "indicador", "gestão", "resultado", "análise"],
    synonyms: ["painel gerencial", "dados consolidados"],
    status: "coming-soon",
  },
  {
    id: "workspace-sessions",
    title: "Sessões abertas",
    description: "Revise dispositivos e acessos ativos na conta",
    type: "setting",
    group: "Configurações",
    breadcrumb: ["Segurança e acesso", "Sessões abertas"],
    icon: ShieldCheck,
    filters: ["Conta", "Configurações"],
    keywords: ["sessão", "dispositivo", "acesso", "login", "segurança"],
    synonyms: ["logins ativos", "dispositivos conectados"],
    status: "coming-soon",
  },
  {
    id: "workspace-billing",
    title: "Faturas e cobrança",
    description: "Consulte pagamentos e documentos de cobrança",
    type: "setting",
    group: "Gestão",
    breadcrumb: ["Plano e faturamento", "Faturas"],
    icon: CircleDollarSign,
    filters: ["Conta", "Gestão", "Configurações"],
    keywords: ["fatura", "boleto", "cobrança", "pagamento", "nota fiscal"],
    synonyms: ["financeiro", "mensalidade", "assinatura"],
    permission: ["admin"],
    status: "coming-soon",
  },
  {
    id: "operation-pipeline",
    title: "Pipeline de licitações",
    navigationLabel: "Pipeline",
    description: "Acompanhe análise, priorização, propostas e disputas",
    type: "resource",
    group: "Operação",
    breadcrumb: ["Minha operação", "Pipeline"],
    icon: FileText,
    filters: ["Oportunidades", "Operação"],
    keywords: ["pipeline", "etapa", "análise", "prioridade", "proposta", "disputa"],
    synonyms: ["funil de oportunidades", "kanban de licitações"],
    status: "coming-soon",
  },
  {
    id: "my-bids",
    title: "Minhas licitações",
    description: "Acompanhe as licitações vinculadas à sua operação",
    type: "resource",
    group: "Operação",
    breadcrumb: ["Minha operação", "Minhas licitações"],
    icon: FileText,
    filters: ["Oportunidades", "Operação"],
    keywords: ["minhas", "licitação", "proposta", "participação", "operação"],
    synonyms: ["licitações acompanhadas", "meus processos"],
    status: "available",
    route: "/dash2/operacao/minhas-licitacoes",
  },
  {
    id: "monitored-companies",
    title: "Empresas monitoradas",
    description: "Acompanhe empresas, fornecedores e movimentações",
    type: "resource",
    group: "Inteligência",
    breadcrumb: ["Inteligência", "Empresas monitoradas"],
    icon: Building2,
    filters: ["Gestão"],
    keywords: ["empresa", "monitorada", "fornecedor", "cnpj", "movimentação"],
    synonyms: ["monitorar empresa", "site de empresas"],
    status: "coming-soon",
  },
  {
    id: "competitors",
    title: "Concorrentes",
    description: "Analise fornecedores concorrentes e histórico de disputas",
    type: "resource",
    group: "Inteligência",
    breadcrumb: ["Inteligência", "Concorrentes"],
    icon: Swords,
    filters: ["Oportunidades", "Gestão"],
    keywords: ["concorrente", "fornecedor", "competição", "disputa", "histórico"],
    synonyms: ["concorrência", "empresas concorrentes"],
    status: "coming-soon",
  },
];

export function normalizeGlobalSearchTerm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let row = 1; row <= a.length; row += 1) {
    current[0] = row;
    for (let column = 1; column <= b.length; column += 1) {
      current[column] = Math.min(
        (current[column - 1] ?? 0) + 1,
        (previous[column] ?? 0) + 1,
        (previous[column - 1] ?? 0) + Number(a[row - 1] !== b[column - 1]),
      );
    }
    for (let column = 0; column <= b.length; column += 1) {
      previous[column] = current[column] ?? 0;
    }
  }

  return previous[b.length] ?? Math.max(a.length, b.length);
}

function fieldScore(query: string, value: string, weights: [number, number, number]) {
  const normalized = normalizeGlobalSearchTerm(value);
  if (!normalized) return 0;
  if (normalized === query) return weights[0];
  if (normalized.startsWith(query)) return weights[1];
  if (normalized.includes(query)) return weights[2];
  return 0;
}

function fuzzyTokenScore(token: string, values: string[]) {
  if (token.length < 4) return 0;
  const allowedDistance = token.length >= 8 ? 2 : 1;
  let bestScore = 0;

  values.forEach((value) => {
    normalizeGlobalSearchTerm(value)
      .split(" ")
      .forEach((word) => {
        if (Math.abs(word.length - token.length) > allowedDistance) return;
        const distance = levenshteinDistance(token, word);
        if (distance <= allowedDistance) {
          bestScore = Math.max(bestScore, 38 - distance * 8);
        }
      });
  });

  return bestScore;
}

function scoreGlobalSearchItem(
  item: GlobalSearchItem,
  query: string,
  currentPath: string,
  recentIds: string[],
) {
  if (!query) {
    return Number(item.frequentlyUsed) * 100 + Math.max(0, 12 - recentIds.indexOf(item.id));
  }

  const normalizedQuery = normalizeGlobalSearchTerm(query);
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  const titleScore = fieldScore(normalizedQuery, item.title, [140, 118, 98]);
  const synonymScore = Math.max(
    0,
    ...item.synonyms.map((value) => fieldScore(normalizedQuery, value, [126, 104, 88])),
  );
  const breadcrumbScore = fieldScore(normalizedQuery, item.breadcrumb.join(" "), [92, 78, 66]);
  const keywordScore = fieldScore(normalizedQuery, item.keywords.join(" "), [82, 72, 60]);
  const descriptionScore = fieldScore(normalizedQuery, item.description, [72, 62, 50]);
  const categoryScore = fieldScore(normalizedQuery, item.filters.join(" "), [68, 58, 46]);

  const searchableValues = [
    item.title,
    item.description,
    item.group,
    ...item.breadcrumb,
    ...item.keywords,
    ...item.synonyms,
  ];
  const tokenScores = tokens.map((token) => {
    const direct = Math.max(
      ...searchableValues.map((value) => fieldScore(token, value, [44, 38, 32])),
    );
    return direct || fuzzyTokenScore(token, searchableValues);
  });

  if (
    !titleScore &&
    !synonymScore &&
    !breadcrumbScore &&
    !keywordScore &&
    !descriptionScore &&
    !categoryScore &&
    tokenScores.some((score) => score === 0)
  ) {
    return -1;
  }

  const tokenTotal = tokenScores.every((score) => score > 0)
    ? tokenScores.reduce((total, score) => total + score, 0)
    : 0;
  const contextBonus = item.contextPaths?.some((path) => currentPath.startsWith(path)) ? 14 : 0;
  const recentIndex = recentIds.indexOf(item.id);
  const recentBonus = recentIndex >= 0 ? Math.max(2, 10 - recentIndex) : 0;

  return (
    Math.max(
      titleScore,
      synonymScore,
      breadcrumbScore,
      keywordScore,
      descriptionScore,
      categoryScore,
    ) +
    tokenTotal +
    contextBonus +
    recentBonus
  );
}

export function searchGlobalCatalog({
  query,
  filter,
  currentPath,
  role,
  recentIds = [],
}: {
  query: string;
  filter: GlobalSearchFilter;
  currentPath: string;
  role: GlobalSearchRole;
  recentIds?: string[];
}) {
  const normalizedQuery = normalizeGlobalSearchTerm(query);

  return globalSearchCatalog
    .filter((item) => !item.permission || item.permission.includes(role))
    .filter((item) => filter === "Todos" || item.filters.includes(filter))
    .map((item) => ({
      item,
      score: scoreGlobalSearchItem(item, normalizedQuery, currentPath, recentIds),
    }))
    .filter(({ item, score }) => {
      if (normalizedQuery) return score >= 0;
      if (filter !== "Todos") return true;
      return Boolean(item.frequentlyUsed && item.status === "available");
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "pt-BR"));
}

export function getGlobalSearchItem(id: string) {
  return globalSearchCatalog.find((item) => item.id === id);
}
