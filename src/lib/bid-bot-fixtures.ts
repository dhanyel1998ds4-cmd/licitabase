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
    items: 30,
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
    items: 5,
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

/**
 * Dados de demonstração por sala ativa. Cada disputa inicia com objeto, lance,
 * posição, quantidade de lances e contexto de portal próprios, para que uma
 * sala nunca reaproveite a história financeira de outra.
 */
export type LiveDisputeSession = {
  disputeId: string;
  portal: string;
  elapsedSeconds: number;
  ourBid: number;
  marketBid: number;
  position: "1º" | "2º";
  bids: number;
  item: LiveDisputeItem;
};

export const liveDisputeSessions: Record<string, LiveDisputeSession> = {
  "d-4": {
    disputeId: "d-4",
    portal: "Compras.gov",
    elapsedSeconds: 17 * 60 + 28,
    ourBid: 42496.67,
    marketBid: 42496.67,
    position: "1º",
    bids: 28,
    item: {
      number: 1,
      description:
        "Computador com monitor 24”, placa de vídeo offboard, SSD 512GB e Windows 11 Pro.",
      ourBid: "R$ 42.496,67",
      ourBidAt: "06/08, 09:17:28",
      bestBid: "R$ 42.496,67",
      bestBidAt: "06/08, 09:17:28",
      discount: "-14,1%",
      bids: 28,
      position: "1º",
      nextEvent: "17:28",
      checks: "39x verificações",
    },
  },
  "d-5": {
    disputeId: "d-5",
    portal: "Compras.gov",
    elapsedSeconds: 9 * 60 + 14,
    ourBid: 8045.45,
    marketBid: 8045.45,
    position: "1º",
    bids: 6,
    item: {
      number: 1,
      description: "Insumos laboratoriais para registro de preços, com fornecimento parcelado.",
      ourBid: "R$ 8.045,45",
      ourBidAt: "07/08, 08:09:14",
      bestBid: "R$ 8.045,45",
      bestBidAt: "07/08, 08:09:14",
      discount: "-8,6%",
      bids: 6,
      position: "1º",
      nextEvent: "09:14",
      checks: "14x verificações",
    },
  },
  "d-6": {
    disputeId: "d-6",
    portal: "Portal de Compras Públicas",
    elapsedSeconds: 13 * 60 + 1,
    ourBid: 697106.4,
    marketBid: 697106.4,
    position: "1º",
    bids: 12,
    item: {
      number: 1,
      description:
        "Serviços de manutenção preventiva e corretiva para os prédios da Câmara Municipal.",
      ourBid: "R$ 697.106,40",
      ourBidAt: "07/08, 09:12:01",
      bestBid: "R$ 697.106,40",
      bestBidAt: "07/08, 09:12:01",
      discount: "-11,2%",
      bids: 12,
      position: "1º",
      nextEvent: "13:01",
      checks: "22x verificações",
    },
  },
};

/**
 * Itens mostrados nas salas demonstrativas. A quantidade não é apenas um
 * número na listagem: ela determina a fila de trabalho da sala, o seletor do
 * item atual e o volume que a aba de itens precisa comportar.
 */
export type LiveDisputeItem = (typeof disputeItems)[number] & {
  /** Quantidade considerada para a composição atual da proposta. */
  quantity?: number;
  /** Itens fora da participação continuam visíveis, mas não compõem o total. */
  participating?: boolean;
};

function buildItem(
  number: number,
  description: string,
  amount: number,
  position: "1º" | "2º" | "3º" = "1º",
  bids = 8,
  quantity = 1,
  participating = true,
): LiveDisputeItem {
  const ourBid = Math.max(amount - (position === "1º" ? 0 : 0.2), 0);
  const bestBid = position === "1º" ? ourBid : Math.max(amount - 0.35, 0);
  return {
    number,
    description,
    ourBid: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(ourBid),
    ourBidAt: "07/08, 09:12",
    bestBid: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bestBid),
    bestBidAt: "07/08, 09:12",
    discount: position === "1º" ? "-11,2%" : "-10,8%",
    bids,
    position,
    nextEvent: "13:01",
    checks: `${8 + number * 3}x verificações`,
    quantity,
    participating,
  };
}

const guarulhosItems = Array.from({ length: 30 }, (_, index) => {
  const number = index + 1;
  const descriptions = [
    "Computador desktop corporativo com monitor, SSD e garantia on-site.",
    "Monitor profissional de 24 polegadas com painel IPS e ajuste de altura.",
    "Placa de vídeo dedicada para estações de trabalho gráficas.",
    "Notebook corporativo com processador de alto desempenho e memória ampliada.",
    "Kit de periféricos para posto de atendimento da Secretaria de Habitação.",
  ];
  const position = number % 9 === 0 ? "2º" : number % 13 === 0 ? "3º" : "1º";
  return buildItem(
    number,
    descriptions[index % descriptions.length]!,
    42496.67 + number * 173.42,
    position,
    6 + number,
    number % 5 === 0 ? 4 : number % 3 === 0 ? 2 : 1,
    [1, 3, 7, 12, 18].includes(number),
  );
});

const vitoriaItems: LiveDisputeItem[] = [
  buildItem(
    1,
    "Manutenção preventiva e corretiva de elevadores e plataformas.",
    697106.4,
    "1º",
    12,
  ),
  buildItem(
    2,
    "Manutenção elétrica dos prédios administrativos e do plenário.",
    168450.35,
    "2º",
    9,
  ),
  buildItem(3, "Manutenção de ar-condicionado e renovação de componentes.", 124980.9, "1º", 15),
  buildItem(4, "Serviços hidráulicos, reparos e substituições emergenciais.", 98670.12, "3º", 7),
  buildItem(
    5,
    "Manutenção de rede, segurança eletrônica e cabeamento estruturado.",
    142905.55,
    "1º",
    11,
  ),
];

export function getLiveDisputeItems(disputeId: string): LiveDisputeItem[] {
  if (disputeId === "d-4") return guarulhosItems;
  if (disputeId === "d-6") return vitoriaItems;
  const session = liveDisputeSessions[disputeId];
  return session ? [session.item] : disputeItems;
}

export function getLiveDisputeSession(disputeId: string) {
  return liveDisputeSessions[disputeId];
}

export type LiveDisputeStatus = "Ganhando" | "Monitorando" | "Preço caiu";

export type LiveDisputeSnapshot = {
  dispute: Dispute;
  session: LiveDisputeSession;
  status: LiveDisputeStatus;
  position: "1º" | "2º";
  currentBid: number;
  bids: number;
  updated: string;
};

const liveStatusCycle: LiveDisputeStatus[] = ["Ganhando", "Monitorando", "Preço caiu", "Ganhando"];

/**
 * Snapshot compartilhado das três salas ao vivo. A cadência é acelerada para
 * demonstrar a mudança de status no Bot e na visão geral sem dados reais.
 */
export function getLiveDisputeSnapshots(referenceTime = Date.now()): LiveDisputeSnapshot[] {
  const cycle = Math.floor(referenceTime / 4_000);

  return Object.values(liveDisputeSessions).flatMap((session, index) => {
    const dispute = disputes.find((candidate) => candidate.id === session.disputeId);
    if (!dispute) return [];

    const status = liveStatusCycle[(cycle + index) % liveStatusCycle.length]!;
    const pulse = (cycle + index) % 5;
    const priceDrop = Math.max(session.marketBid * (0.00002 + pulse * 0.00001), 0.2);
    const currentBid = status === "Preço caiu" ? session.marketBid - priceDrop : session.ourBid;

    return [
      {
        dispute,
        session,
        status,
        position: status === "Preço caiu" ? "2º" : session.position,
        currentBid,
        bids: session.bids + (cycle % 6),
        updated: `há ${1 + ((cycle + index * 2) % 8)}s`,
      },
    ];
  });
}

export type DisputeRankingRow = {
  id?: string;
  pos: number;
  supplier: string;
  uf: string;
  type: string;
  bid: string;
  delta: string;
  you?: boolean;
  movement?: "up" | "down" | "updated";
  movementLabel?: string;
};

export const disputeRanking: DisputeRankingRow[] = [
  {
    pos: 1,
    supplier: "MK Solucoes em Seguranca e Servicos Ltda",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 346.761,91",
    delta: "",
  },
  {
    pos: 2,
    supplier: "Renato Palladino de Freitas 41131128869",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 361.900,00",
    delta: "",
  },
  {
    pos: 3,
    supplier: "Multicompany Brasil Comercial e Servicos Ltda",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 376.200,00",
    delta: "",
  },
  {
    pos: 4,
    supplier: "ASX Comercial Ltda",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 397.100,00",
    delta: "",
  },
  {
    pos: 5,
    supplier: "Iridia Solucoes Ltda",
    uf: "MG",
    type: "ME/EPP",
    bid: "R$ 36.500,00",
    delta: "-14,1%",
    you: true,
  },
  {
    pos: 6,
    supplier: "Camila Fernandes Sant Ana",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 400.708,00",
    delta: "+2,7%",
  },
  {
    pos: 7,
    supplier: "A3 Infotech Comercio e Prestacao de Servicos",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 416.460,00",
    delta: "+11,4%",
  },
  {
    pos: 8,
    supplier: "Litimax Servico e Comercio Ltda",
    uf: "RJ",
    type: "ME/EPP",
    bid: "R$ 418.000,00",
    delta: "+11,8%",
  },
  {
    pos: 9,
    supplier: "Ederson Cunha de Sousa - Comercio de Informatica",
    uf: "DF",
    type: "ME/EPP",
    bid: "R$ 423.500,00",
    delta: "+13,4%",
  },
  {
    pos: 10,
    supplier: "Thads Servicos Ltda",
    uf: "SP",
    type: "ME/EPP",
    bid: "R$ 425.194,00",
    delta: "+13,9%",
  },
];

export type TimelineKind =
  "Nosso lance" | "Preço caiu" | "Monitorando" | "Sistema" | "Fase" | "Sessão";

export type TimelineEvent = {
  time: string;
  event: string;
  kind: TimelineKind;
  detail: string;
  value: string;
  status: string;
  note: string;
};

export const disputeTimeline: TimelineEvent[] = [
  {
    time: "09:00:37",
    event: "Sessão iniciada",
    kind: "Sessão",
    detail: "A disputa foi aberta pelo órgão.",
    value: "—",
    status: "Sistema",
    note: "Disputa aberta pelo órgão.",
  },
  {
    time: "09:00:43",
    event: "Nosso lance",
    kind: "Nosso lance",
    detail: "Lance registrado com sucesso.",
    value: "R$ 36.500,00",
    status: "Ganhando",
    note: "Mantemos a melhor oferta.",
  },
  {
    time: "09:00:49",
    event: "Preço caiu",
    kind: "Preço caiu",
    detail: "Novo lance do concorrente.",
    value: "R$ 36.122,17",
    status: "Preço caiu",
    note: "Concorrente superou nosso lance.",
  },
  {
    time: "09:01:12",
    event: "Nosso lance",
    kind: "Nosso lance",
    detail: "Lance registrado com sucesso.",
    value: "R$ 36.122,17",
    status: "Ganhando",
    note: "Voltamos a assumir a liderança.",
  },
  {
    time: "09:02:05",
    event: "Monitorando",
    kind: "Monitorando",
    detail: "Verificações automáticas em andamento.",
    value: "39x verificações",
    status: "Monitorando",
    note: "Monitoramento contínuo ativo.",
  },
  {
    time: "09:04:21",
    event: "Monitorando",
    kind: "Monitorando",
    detail: "Verificações automáticas em andamento.",
    value: "39x verificações",
    status: "Monitorando",
    note: "Monitoramento contínuo ativo.",
  },
  {
    time: "09:04:26",
    event: "Preço caiu",
    kind: "Preço caiu",
    detail: "Novo lance do concorrente.",
    value: "R$ 36.122,17",
    status: "Preço caiu",
    note: "Concorrente superou nosso lance.",
  },
  {
    time: "09:04:32",
    event: "Preço caiu",
    kind: "Preço caiu",
    detail: "Novo lance do concorrente.",
    value: "R$ 36.122,17",
    status: "Preço caiu",
    note: "Variação mínima registrada.",
  },
  {
    time: "09:25:08",
    event: "Fase",
    kind: "Fase",
    detail: "Fase: sealed_bid",
    value: "—",
    status: "Sistema",
    note: "Fase de lances fechada automaticamente.",
  },
  {
    time: "09:25:09",
    event: "Nosso lance",
    kind: "Nosso lance",
    detail: "Lance final registrado.",
    value: "R$ 36.122,17",
    status: "Ganhando",
    note: "Último lance da sessão.",
  },
  {
    time: "09:25:20",
    event: "Sessão encerrada",
    kind: "Sessão",
    detail: "Disputa encerrada pelo sistema.",
    value: "—",
    status: "Sistema",
    note: "Disputa encerrada.",
  },
];

const timelineCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function timelineClock(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((unit) => String(unit).padStart(2, "0")).join(":");
}

/**
 * Roteiro integral de uma disputa para a demonstração interativa. Os eventos
 * seguem a cadência de uma sessão real, mas a tela os reproduz de forma
 * acelerada para que o histórico possa ser avaliado sem esperar horas.
 */
export const realtimeDisputeTimeline: TimelineEvent[] = (() => {
  const events: TimelineEvent[] = [
    {
      time: "09:59:55",
      event: "Sessão iniciada",
      kind: "Sessão",
      detail: "O portal abriu a fase competitiva do item 1.",
      value: "—",
      status: "Ao vivo",
      note: "Monitoramento e estratégia assistida ativados.",
    },
    {
      time: "10:00:02",
      event: "Nosso lance",
      kind: "Nosso lance",
      detail: "Lance inicial enviado automaticamente pelo bot.",
      value: "R$ 1.364.399,80",
      status: "Ganhando",
      note: "Melhor oferta assumida para o item 1.",
    },
    {
      time: "10:00:08",
      event: "Preço caiu",
      kind: "Preço caiu",
      detail: "Novo lance do concorrente identificado no portal.",
      value: "R$ 1.364.399,80",
      status: "Preço caiu",
      note: "de R$ 1.364.400,00",
    },
    {
      time: "10:00:13",
      event: "Monitorando",
      kind: "Monitorando",
      detail: "Verificações automáticas em andamento.",
      value: "2x verificações",
      status: "Ganhando",
      note: "Liderança confirmada após a leitura do portal.",
    },
    {
      time: "10:00:19",
      event: "Nosso lance",
      kind: "Nosso lance",
      detail: "Decremento configurado aplicado pela estratégia assistida.",
      value: "R$ 1.363.999,80",
      status: "Ganhando",
      note: "Resposta enviada dentro da janela de decisão.",
    },
    {
      time: "10:00:25",
      event: "Preço caiu",
      kind: "Preço caiu",
      detail: "Concorrente reduziu novamente a oferta.",
      value: "R$ 1.363.999,80",
      status: "Preço caiu",
      note: "de R$ 1.364.000,00",
    },
    {
      time: "10:00:31",
      event: "Monitorando",
      kind: "Monitorando",
      detail: "Verificações automáticas em andamento.",
      value: "7x verificações",
      status: "Ganhando",
      note: "Bot pronto para a próxima oportunidade de lance.",
    },
  ];

  const sessionStart = 10 * 60 * 60 + 2 * 60 + 11;
  const finalCompetitiveEvent = 11 * 60 * 60 + 31 * 60 + 47;
  // 425 registros no total: a mesma granularidade da sessão completa recebida
  // para esta demonstração, sem transformar a tela em uma lista resumida.
  const totalRounds = 204;
  const initialValue = 1_363_997;
  const finalValue = 956_000;
  const automaticBidRounds = new Set([0, 2, 5, 9, 14, 20, 27, 35]);

  for (let round = 0; round < totalRounds; round += 1) {
    const roundStart = Math.round(
      sessionStart + ((finalCompetitiveEvent - sessionStart) * round) / (totalRounds - 1),
    );
    const previousValue =
      round === 0
        ? 1_363_999.8
        : initialValue - ((initialValue - finalValue) * round) / totalRounds;
    const currentValue = initialValue - ((initialValue - finalValue) * (round + 1)) / totalRounds;
    const formattedCurrent = timelineCurrency.format(Math.max(currentValue, finalValue));
    const formattedPrevious = timelineCurrency.format(Math.max(previousValue, finalValue));
    const atFloor = round >= 44;

    events.push({
      time: timelineClock(roundStart),
      event: "Preço caiu",
      kind: "Preço caiu",
      detail: "Novo lance do concorrente identificado no portal.",
      value: formattedCurrent,
      status: "Preço caiu",
      note: `de ${formattedPrevious}`,
    });

    if (automaticBidRounds.has(round)) {
      const bidValue = Math.max(currentValue - 0.2, finalValue);
      events.push({
        time: timelineClock(roundStart + 6),
        event: "Nosso lance",
        kind: "Nosso lance",
        detail: "Lance calculado e enviado pela estratégia assistida.",
        value: timelineCurrency.format(bidValue),
        status: "Ganhando",
        note: "Decremento fixo respeitado na reação automática.",
      });
    }

    events.push({
      time: timelineClock(roundStart + (automaticBidRounds.has(round) ? 12 : 6)),
      event: "Monitorando",
      kind: "Monitorando",
      detail: "Verificações automáticas em andamento.",
      value: `${1 + ((round * 7) % 25)}x verificações`,
      status: atFloor ? "Piso" : round % 3 === 0 ? "Cooldown" : "Ganhando",
      note: atFloor
        ? "Preço piso atingido; o bot mantém somente o monitoramento."
        : "Leitura concluída; aguardando novo movimento do portal.",
    });
  }

  events.push(
    {
      time: "11:39:50",
      event: "Fim da disputa",
      kind: "Fase",
      detail: "O portal sinalizou o encerramento da etapa competitiva.",
      value: "—",
      status: "Sistema",
      note: "Aguardando a confirmação final da sessão.",
    },
    {
      time: "11:40:08",
      event: "Sessão encerrada",
      kind: "Sessão",
      detail: "Disputa encerrada pelo sistema do portal.",
      value: "—",
      status: "Finalizada",
      note: "Histórico completo disponível para conferência.",
    },
  );

  return events;
})();

/** Cria uma cadência completa usando os valores e o objeto da sala selecionada. */
export function createLiveSessionTimeline(session: LiveDisputeSession): TimelineEvent[] {
  let currentBid = session.marketBid;
  let checks = 2;

  return realtimeDisputeTimeline.map((event, index) => {
    if (event.kind === "Preço caiu") {
      currentBid = Math.max(currentBid - Math.max(session.marketBid * 0.00045, 0.2), 0);
      return {
        ...event,
        value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
          currentBid,
        ),
        detail: "Novo lance de concorrente identificado na leitura do portal.",
        note: `Disputa do item ${session.item.number} atualizada em ${session.portal}.`,
      };
    }

    if (event.kind === "Nosso lance") {
      currentBid = Math.max(currentBid - 0.2, 0);
      return {
        ...event,
        value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
          currentBid,
        ),
        detail: "Lance da Iridia registrado na sessão ativa.",
        note: "A estratégia assistida respondeu dentro do decremento configurado.",
      };
    }

    if (event.kind === "Monitorando") {
      checks = (checks % 9) + 1;
      return {
        ...event,
        value: `${checks}x verificações`,
        detail: `Leitura automática ativa em ${session.portal}.`,
      };
    }

    return event;
  });
}

export const monitoringWatchers = [
  {
    name: "Prefeitura Municipal de Guarulhos - SP",
    scope: "Pregão 845/2026 · Item 1",
    frequency: "20s",
    checks: "39x",
    state: "Monitorando" as const,
  },
  {
    name: "ESP-Centro de Energia Nuclear na Agricultura",
    scope: "Pregão 310/2026 · Item 1",
    frequency: "30s",
    checks: "18x",
    state: "Monitorando" as const,
  },
  {
    name: "Vitória Câmara Municipal",
    scope: "Pregão 077/2026 · Item 1",
    frequency: "60s",
    checks: "9x",
    state: "Pausado" as const,
  },
  {
    name: "Câmara Municipal de Jacareí - SP",
    scope: "Pregão 059/2026 · Item 1",
    frequency: "60s",
    checks: "4x",
    state: "Pausado" as const,
  },
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
  {
    id: "h-1",
    date: "05/08/2026",
    dispute: "Pregão 845/2026 · Guarulhos - SP",
    result: "Vencemos" as const,
    ourBid: "R$ 36.122,17",
    bids: 28,
  },
  {
    id: "h-2",
    date: "02/08/2026",
    dispute: "Pregão 310/2026 · CENA/USP",
    result: "Vencemos" as const,
    ourBid: "R$ 7.980,00",
    bids: 12,
  },
  {
    id: "h-3",
    date: "28/07/2026",
    dispute: "Pregão 018/2026 · Fiotec",
    result: "Perdemos" as const,
    ourBid: "R$ 14.870.000,00",
    bids: 9,
  },
  {
    id: "h-4",
    date: "21/07/2026",
    dispute: "Pregão 133/2026 · IFRS",
    result: "Vencemos" as const,
    ourBid: "R$ 1.089.440,00",
    bids: 34,
  },
  {
    id: "h-5",
    date: "14/07/2026",
    dispute: "Pregão 059/2026 · Jacareí - SP",
    result: "Cancelada" as const,
    ourBid: "—",
    bids: 3,
  },
];
