export const BID_BOT_ROUTES = {
  overview: "/bot-lances",
  disputes: "/bot-lances/disputas",
  monitoring: "/bot-lances/monitoramento",
  reports: "/bot-lances/relatorios",
  history: "/bot-lances/historico",
  settings: "/bot-lances/configuracoes",
} as const;

export const bidBotSummary = [
  { value: "200", label: "Disputas", hint: "156 aguardando", tone: "navy" as const },
  { value: "11", label: "Ativas", hint: "Em andamento", tone: "brand" as const },
  { value: "1.958", label: "Lances", hint: "No total", tone: "info" as const },
  { value: "838", label: "Itens", hint: "Disputados", tone: "warn" as const },
  { value: "R$ 189,4M", label: "Valor estimado", hint: "Total em disputa", tone: "brand" as const },
];

export const bidBotActiveConfig = [
  { label: "Estratégia", value: "Decremento fixo" },
  { label: "Decremento", value: "R$ 0,20" },
  { label: "Piso (% orçado)", value: "85%" },
  { label: "Intervalo entre lances", value: "20s" },
  { label: "Só quando perdendo", value: "Sim" },
];

export const bidBotQuickSummary = [
  { value: "97", label: "Eventos hoje", tone: "brand" as const },
  { value: "24min", label: "Duração média", tone: "navy" as const },
  { value: "28", label: "Lances deste mês", tone: "brand" as const },
  { value: "14", label: "Disputas finalizadas", tone: "info" as const },
];

export type DisputeStatus = "Ativa" | "Aguardando" | "Pausada" | "Finalizada";

export type Dispute = {
  id: string;
  agency: string;
  object: string;
  date: string;
  status: DisputeStatus;
  estimatedValue: string;
  items: number;
  bids: string;
  uasg: string;
  notice: string;
};

export const disputes: Dispute[] = [
  {
    id: "d-1",
    agency: "Câmara Municipal de Guarulhos - SP",
    object: "Contratação de solução integrada de gestão documental.",
    date: "25/06, 10:00",
    status: "Aguardando",
    estimatedValue: "R$ 10.567,48",
    items: 1,
    bids: "—",
    uasg: "986477",
    notice: "Pregão 845/2026",
  },
  {
    id: "d-2",
    agency: "ESP-Gab. Sec. Meio Ambiente e Infraestrutura",
    object: "Serviços especializados de atendimento técnico ambiental.",
    date: "15/07, 09:00",
    status: "Aguardando",
    estimatedValue: "—",
    items: 1,
    bids: "—",
    uasg: "925102",
    notice: "Pregão 112/2026",
  },
  {
    id: "d-3",
    agency: "Inst. Fed. de Educ., Ciênc. e Tec. de São Paulo",
    object: "Contratação, por meio de Registro de Preços, de equipamentos.",
    date: "28/07, 10:00",
    status: "Aguardando",
    estimatedValue: "R$ 57.116.499,98",
    items: 1,
    bids: "—",
    uasg: "158154",
    notice: "Pregão 220/2026",
  },
  {
    id: "d-4",
    agency: "Prefeitura Municipal de Guarulhos - SP",
    object:
      "Aquisição de computadores com monitor e placa de vídeo offboard, com desempenho gráfico avançado para Secretaria de Habitação.",
    date: "06/08, 09:00",
    status: "Ativa",
    estimatedValue: "R$ 42.496,67",
    items: 1,
    bids: "28",
    uasg: "986477",
    notice: "Pregão 845/2026",
  },
  {
    id: "d-5",
    agency: "ESP-Centro de Energia Nuclear na Agricultura",
    object: "Ata de registro de preços visando aquisição de insumos laboratoriais.",
    date: "07/08, 08:00",
    status: "Ativa",
    estimatedValue: "R$ 8.045,45",
    items: 1,
    bids: "6",
    uasg: "153033",
    notice: "Pregão 310/2026",
  },
  {
    id: "d-6",
    agency: "Vitória Câmara Municipal",
    object: "Contratação de pessoa jurídica para prestação de serviços de manutenção.",
    date: "07/08, 08:59",
    status: "Ativa",
    estimatedValue: "R$ 697.106,40",
    items: 1,
    bids: "12",
    uasg: "926611",
    notice: "Pregão 077/2026",
  },
  {
    id: "d-7",
    agency: "Superintend. Estad. de Compras e Licitações",
    object: "Objeto da despesa é a contratação de empresa especializada em TI.",
    date: "10/08, 10:00",
    status: "Aguardando",
    estimatedValue: "R$ 3.752,81",
    items: 1,
    bids: "—",
    uasg: "925522",
    notice: "Pregão 401/2026",
  },
  {
    id: "d-8",
    agency: "Câmara Municipal de Jacareí - SP",
    object: "Contratação de empresa especializada para o fornecimento de licenças.",
    date: "04/08, 08:59",
    status: "Pausada",
    estimatedValue: "R$ 18.271,40",
    items: 1,
    bids: "3",
    uasg: "987012",
    notice: "Pregão 059/2026",
  },
  {
    id: "d-9",
    agency: "Fiotec - Fundação para o Desenvolvimento Científico",
    object: "Contratação de licença de software: RD Station e correlatos.",
    date: "29/07, 07:05",
    status: "Pausada",
    estimatedValue: "R$ 15.000.000,00",
    items: 1,
    bids: "1",
    uasg: "254420",
    notice: "Pregão 018/2026",
  },
  {
    id: "d-10",
    agency: "Inst. Fed. de Educ., Ciênc. e Tec. do R. Grande",
    object: "Registro de preços para aquisição de servidores de rede.",
    date: "14/07, 09:00",
    status: "Finalizada",
    estimatedValue: "R$ 1.103.954,00",
    items: 1,
    bids: "34",
    uasg: "158126",
    notice: "Pregão 133/2026",
  },
];

export const disputeCounts = {
  todas: 200,
  ativas: 11,
  aguardando: 156,
  pausadas: 19,
  finalizadas: 14,
};

export const disputePerformance = {
  position: "1º",
  ourBid: "R$ 36.500,00",
  bestBid: "R$ 42.496,67",
  discount: "-14,1%",
  bidsGiven: 28,
  estimatedDuration: "24min 43s",
  itemsInDispute: 1,
  nextEvent: "09:04:21",
  sessionPlanned: "06/08/2026, 09:00",
  sessionStart: "06/08, 09:00:37",
  sessionEnd: "06/08, 09:25:20",
};

export const disputeBotConfig = [
  { label: "Modo", value: "Decremento fixo" },
  { label: "Decremento", value: "R$ 0,20" },
  { label: "Preço piso", value: "Sem limite" },
  { label: "Intervalo entre lances", value: "20s" },
  { label: "Máx. lances por item", value: "Ilimitado" },
  { label: "Só quando perdendo", value: "Sim" },
];

export const disputeItems = [
  {
    number: 1,
    description: 'Computador com monitor 24", placa de vídeo offboard, SSD 512GB, Windows 11 Pro.',
    ourBid: "R$ 36.500,00",
    ourBidAt: "06/08, 09:04:21",
    bestBid: "R$ 42.496,67",
    bestBidAt: "06/08, 09:02:05",
    discount: "-14,1%",
    bids: 28,
    position: "1º",
    nextEvent: "09:04:21",
    checks: "39x verificações",
  },
];

export const disputeRanking = [
  { pos: 1, supplier: "MK Solucoes em Seguranca e Servicos Ltda", uf: "SP", type: "ME/EPP", bid: "R$ 346.761,91", delta: "" },
  { pos: 2, supplier: "Renato Palladino de Freitas 41131128869", uf: "SP", type: "ME/EPP", bid: "R$ 361.900,00", delta: "" },
  { pos: 3, supplier: "Multicompany Brasil Comercial e Servicos Ltda", uf: "SP", type: "ME/EPP", bid: "R$ 376.200,00", delta: "" },
  { pos: 4, supplier: "ASX Comercial Ltda", uf: "SP", type: "ME/EPP", bid: "R$ 397.100,00", delta: "" },
  { pos: 5, supplier: "Iridia Solucoes Ltda", uf: "MG", type: "ME/EPP", bid: "R$ 36.500,00", delta: "-14,1%", you: true },
  { pos: 6, supplier: "Camila Fernandes Sant Ana", uf: "SP", type: "ME/EPP", bid: "R$ 400.708,00", delta: "+2,7%" },
  { pos: 7, supplier: "A3 Infotech Comercio e Prestacao de Servicos", uf: "SP", type: "ME/EPP", bid: "R$ 416.460,00", delta: "+11,4%" },
  { pos: 8, supplier: "Litimax Servico e Comercio Ltda", uf: "RJ", type: "ME/EPP", bid: "R$ 418.000,00", delta: "+11,8%" },
  { pos: 9, supplier: "Ederson Cunha de Sousa - Comercio de Informatica", uf: "DF", type: "ME/EPP", bid: "R$ 423.500,00", delta: "+13,4%" },
  { pos: 10, supplier: "Thads Servicos Ltda", uf: "SP", type: "ME/EPP", bid: "R$ 425.194,00", delta: "+13,9%" },
];

export type TimelineKind = "Nosso lance" | "Preço caiu" | "Monitorando" | "Sistema" | "Fase" | "Sessão";

export const disputeTimeline: {
  time: string;
  event: string;
  kind: TimelineKind;
  detail: string;
  value: string;
  status: string;
  note: string;
}[] = [
  { time: "09:00:37", event: "Sessão iniciada", kind: "Sessão", detail: "A disputa foi aberta pelo órgão.", value: "—", status: "Sistema", note: "Disputa aberta pelo órgão." },
  { time: "09:00:43", event: "Nosso lance", kind: "Nosso lance", detail: "Lance registrado com sucesso.", value: "R$ 36.500,00", status: "Ganhando", note: "Mantemos a melhor oferta." },
  { time: "09:00:49", event: "Preço caiu", kind: "Preço caiu", detail: "Novo lance do concorrente.", value: "R$ 36.122,17", status: "Preço caiu", note: "Concorrente superou nosso lance." },
  { time: "09:01:12", event: "Nosso lance", kind: "Nosso lance", detail: "Lance registrado com sucesso.", value: "R$ 36.122,17", status: "Ganhando", note: "Voltamos a assumir a liderança." },
  { time: "09:02:05", event: "Monitorando", kind: "Monitorando", detail: "Verificações automáticas em andamento.", value: "39x verificações", status: "Monitorando", note: "Monitoramento contínuo ativo." },
  { time: "09:04:21", event: "Monitorando", kind: "Monitorando", detail: "Verificações automáticas em andamento.", value: "39x verificações", status: "Monitorando", note: "Monitoramento contínuo ativo." },
  { time: "09:04:26", event: "Preço caiu", kind: "Preço caiu", detail: "Novo lance do concorrente.", value: "R$ 36.122,17", status: "Preço caiu", note: "Concorrente superou nosso lance." },
  { time: "09:04:32", event: "Preço caiu", kind: "Preço caiu", detail: "Novo lance do concorrente.", value: "R$ 36.122,17", status: "Preço caiu", note: "Variação mínima registrada." },
  { time: "09:25:08", event: "Fase", kind: "Fase", detail: "Fase: sealed_bid", value: "—", status: "Sistema", note: "Fase de lances fechada automaticamente." },
  { time: "09:25:09", event: "Nosso lance", kind: "Nosso lance", detail: "Lance final registrado.", value: "R$ 36.122,17", status: "Ganhando", note: "Último lance da sessão." },
  { time: "09:25:20", event: "Sessão encerrada", kind: "Sessão", detail: "Disputa encerrada pelo sistema.", value: "—", status: "Sistema", note: "Disputa encerrada." },
];

export const monitoringWatchers = [
  { name: "Prefeitura Municipal de Guarulhos - SP", scope: "Pregão 845/2026 · Item 1", frequency: "20s", checks: "39x", state: "Monitorando" as const },
  { name: "ESP-Centro de Energia Nuclear na Agricultura", scope: "Pregão 310/2026 · Item 1", frequency: "30s", checks: "18x", state: "Monitorando" as const },
  { name: "Vitória Câmara Municipal", scope: "Pregão 077/2026 · Item 1", frequency: "60s", checks: "9x", state: "Pausado" as const },
  { name: "Câmara Municipal de Jacareí - SP", scope: "Pregão 059/2026 · Item 1", frequency: "60s", checks: "4x", state: "Pausado" as const },
];

export const monitoringMetrics = [
  { value: "12", label: "Sessões monitoradas", tone: "navy" as const },
  { value: "39x", label: "Verificações / minuto", tone: "brand" as const },
  { value: "2", label: "Alertas abertos", tone: "warn" as const },
  { value: "100%", label: "Disponibilidade", tone: "info" as const },
];

export const reportMetrics = [
  { value: "R$ 189,4M", label: "Valor em disputa", tone: "brand" as const },
  { value: "62%", label: "Taxa de vitória", tone: "info" as const },
  { value: "-11,4%", label: "Desconto médio", tone: "warn" as const },
  { value: "24min", label: "Duração média", tone: "navy" as const },
];

export const reportRows = [
  { period: "Agosto/2026", disputes: 42, bids: 618, wins: 27, savings: "R$ 1.204.900,00" },
  { period: "Julho/2026", disputes: 55, bids: 742, wins: 33, savings: "R$ 1.981.310,00" },
  { period: "Junho/2026", disputes: 48, bids: 401, wins: 25, savings: "R$ 872.440,00" },
  { period: "Maio/2026", disputes: 55, bids: 197, wins: 30, savings: "R$ 1.113.070,00" },
];

export const historyRows = [
  { id: "h-1", date: "05/08/2026", dispute: "Pregão 845/2026 · Guarulhos - SP", result: "Vencemos" as const, ourBid: "R$ 36.122,17", bids: 28 },
  { id: "h-2", date: "02/08/2026", dispute: "Pregão 310/2026 · CENA/USP", result: "Vencemos" as const, ourBid: "R$ 7.980,00", bids: 12 },
  { id: "h-3", date: "28/07/2026", dispute: "Pregão 018/2026 · Fiotec", result: "Perdemos" as const, ourBid: "R$ 14.870.000,00", bids: 9 },
  { id: "h-4", date: "21/07/2026", dispute: "Pregão 133/2026 · IFRS", result: "Vencemos" as const, ourBid: "R$ 1.089.440,00", bids: 34 },
  { id: "h-5", date: "14/07/2026", dispute: "Pregão 059/2026 · Jacareí - SP", result: "Cancelada" as const, ourBid: "—", bids: 3 },
];
