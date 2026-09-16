export type BlogSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  checklist?: readonly string[];
};

export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  modifiedAt: string;
  sections: readonly BlogSection[];
  relatedSlugs: readonly string[];
};

export const blogHubArticle = {
  slug: "como-participar-de-licitacao",
  title: "Como participar de licitação: guia prático para empresas",
  description:
    "Entenda as etapas, os documentos e como encontrar oportunidades compatíveis antes de enviar uma proposta.",
  category: "Começar em licitações",
  image: "/images/blog/como-participar-de-licitacao.png",
  imageAlt: "Ilustração de documentos, checklist e calculadora para participação em licitações",
  publishedAt: "2026-08-31T12:00:00-03:00",
  modifiedAt: "2026-08-31T12:00:00-03:00",
  href: "/blog/como-participar-de-licitacao",
};

export const blogArticles = [
  {
    slug: "documentos-necessarios-para-licitacao",
    title: "Documentos necessários para participar de uma licitação",
    description:
      "Saiba quais documentos costumam aparecer nos editais e como manter certidões, declarações e anexos organizados.",
    category: "Documentação",
    image: "/images/blog/documentos-necessarios-para-licitacao.png",
    imageAlt: "Ilustração de documentos organizados, certificados e calendário",
    publishedAt: "2026-08-31T12:00:00-03:00",
    modifiedAt: "2026-08-31T12:00:00-03:00",
    sections: [
      {
        id: "o-que-muda",
        title: "Os documentos mudam conforme o edital",
        paragraphs: [
          "Não existe uma lista única que garanta habilitação em toda licitação. O edital define as exigências para aquele órgão, objeto e modalidade; por isso, a leitura da seção de habilitação precisa acontecer antes de qualquer envio.",
          "Mesmo assim, uma empresa preparada mantém os documentos recorrentes organizados, com responsável, validade e versão. Isso reduz o risco de descobrir uma pendência quando o prazo já está curto.",
        ],
      },
      {
        id: "categorias",
        title: "Quais grupos de documentos costumam ser exigidos",
        paragraphs: [
          "A maior parte dos editais combina documentos cadastrais, regularidade fiscal, qualificação técnica, capacidade econômico-financeira, declarações e a própria proposta comercial.",
          "A exigência só é atendida quando o documento correto está válido, pertence à empresa participante e foi enviado no formato solicitado. Nomear arquivos e registrar a origem evita versões duplicadas e difíceis de conferir.",
        ],
        checklist: [
          "Dados cadastrais e atos constitutivos atualizados",
          "Certidões fiscais, trabalhistas e de regularidade válidas",
          "Atestados, registros ou documentos de qualificação técnica",
          "Declarações pedidas especificamente pelo edital",
          "Anexos comerciais e proposta na versão aprovada pela equipe",
        ],
      },
      {
        id: "rotina",
        title: "Crie uma rotina de conferência antes da proposta",
        paragraphs: [
          "Organize uma biblioteca com data de validade, titularidade e contexto de uso. Quando uma oportunidade entrar em análise, compare a lista do edital com o que já está disponível e abra uma pendência para cada lacuna.",
          "A conferência final deve identificar quem revisou, qual versão foi aprovada e quais documentos seguem anexados à proposta. Essa rastreabilidade protege a equipe mesmo após a sessão de disputa.",
        ],
      },
    ],
    relatedSlugs: ["como-ler-edital-licitacao", "como-montar-proposta-precos-licitacao"],
  },
  {
    slug: "como-encontrar-licitacoes-abertas",
    title: "Como encontrar licitações abertas para sua empresa",
    description:
      "Aprenda a buscar editais com critérios de produto, região e prazo para não perder tempo com oportunidades sem aderência.",
    category: "Encontrar oportunidades",
    image: "/images/blog/como-encontrar-licitacoes-abertas.png",
    imageAlt: "Ilustração de mapa, bússola e lupa para encontrar oportunidades",
    publishedAt: "2026-08-31T12:00:00-03:00",
    modifiedAt: "2026-08-31T12:00:00-03:00",
    sections: [
      {
        id: "criterios",
        title: "Comece pelos critérios da sua operação",
        paragraphs: [
          "Buscar por qualquer termo amplo gera uma lista grande, mas pouco útil. O ponto de partida é registrar produtos ou serviços fornecidos, regiões atendidas, capacidade de entrega e documentos que a empresa já possui.",
          "Esses critérios funcionam como uma triagem inicial. Eles não substituem a análise do edital, mas ajudam a equipe a priorizar o que merece leitura primeiro.",
        ],
      },
      {
        id: "fontes",
        title: "Combine fontes oficiais com monitoramento",
        paragraphs: [
          "Os portais de compras e diários oficiais são a fonte do processo. Um monitoramento organizado centraliza as buscas e avisa quando surgem oportunidades dentro dos filtros acompanhados.",
          "Ao encontrar uma licitação, registre imediatamente o órgão, a plataforma, o prazo, o objeto e o link de origem. Assim, a próxima pessoa da equipe não precisa refazer a descoberta.",
        ],
        checklist: [
          "Use termos do catálogo de produtos e também sinônimos usados pelos órgãos",
          "Filtre por estados, municípios ou regiões que a operação realmente atende",
          "Defina uma antecedência mínima para preparar documentação e proposta",
          "Salve buscas que representam um segmento ou linha de fornecimento",
        ],
      },
      {
        id: "priorizacao",
        title: "Priorize antes de abrir todos os editais",
        paragraphs: [
          "Uma oportunidade é mais forte quando o objeto tem aderência, o prazo é viável e a documentação necessária está disponível. Valor estimado e histórico do órgão complementam a decisão, mas não resolvem sozinhos a viabilidade.",
          "Depois da triagem, envie apenas os processos selecionados para uma análise de edital. Isso mantém o pipeline enxuto e evita que alertas se transformem em uma lista sem decisão.",
        ],
      },
    ],
    relatedSlugs: ["como-ler-edital-licitacao", "como-participar-pregao-eletronico"],
  },
  {
    slug: "como-ler-edital-licitacao",
    title: "Como ler um edital de licitação antes de decidir participar",
    description:
      "Veja o que conferir no edital: objeto, prazos, habilitação, critérios de julgamento, anexos e riscos para a operação.",
    category: "Análise de edital",
    image: "/images/blog/como-ler-edital-licitacao.png",
    imageAlt: "Ilustração de edital aberto, lupa e marcadores de análise",
    publishedAt: "2026-08-31T12:00:00-03:00",
    modifiedAt: "2026-08-31T12:00:00-03:00",
    sections: [
      {
        id: "leitura-inicial",
        title: "Faça uma leitura de viabilidade primeiro",
        paragraphs: [
          "A primeira leitura não precisa resolver cada detalhe técnico. Ela serve para responder se o objeto é compatível, se o prazo permite preparação e se há uma exigência que inviabiliza a participação.",
          "Comece pelo aviso, termo de referência, datas e anexos. Em seguida, marque pontos que exigem validação técnica, comercial ou documental com as pessoas responsáveis.",
        ],
      },
      {
        id: "pontos-criticos",
        title: "Pontos críticos para conferir no edital",
        paragraphs: [
          "O objeto e os itens definem o que será entregue. Já os critérios de julgamento e as regras de proposta definem como a empresa será comparada. Os dois lados precisam fazer sentido juntos.",
          "Também acompanhe exigências de amostra, visita técnica, garantia, prazo de entrega e documentos específicos. São detalhes que podem alterar o custo ou o risco da proposta.",
        ],
        checklist: [
          "Objeto, itens, quantidades e unidade de fornecimento",
          "Datas de esclarecimento, impugnação, proposta e sessão",
          "Regras de habilitação e documentos obrigatórios",
          "Critério de julgamento, lances e condições de pagamento",
          "Anexos, termo de referência e especificações técnicas",
        ],
      },
      {
        id: "decisao",
        title: "Transforme a leitura em uma decisão rastreável",
        paragraphs: [
          "Ao terminar a análise, registre a decisão, as evidências consultadas e as pendências que impedem o avanço. Assim, a equipe entende por que escolheu participar, monitorar ou descartar aquela oportunidade.",
          "Se a oportunidade avançar, conecte o edital aos documentos da empresa, à proposta e às próximas ações. A informação deixa de ficar dispersa em mensagens e planilhas.",
        ],
      },
    ],
    relatedSlugs: [
      "documentos-necessarios-para-licitacao",
      "como-montar-proposta-precos-licitacao",
    ],
  },
  {
    slug: "como-montar-proposta-precos-licitacao",
    title: "Como montar uma proposta de preços para licitação",
    description:
      "Organize itens, quantidades, valores, condições e anexos para preparar uma proposta de preços consistente antes do envio.",
    category: "Proposta comercial",
    image: "/images/blog/como-montar-proposta-precos-licitacao.png",
    imageAlt: "Ilustração de calculadora, etiquetas e itens para proposta de preços",
    publishedAt: "2026-08-31T12:00:00-03:00",
    modifiedAt: "2026-08-31T12:00:00-03:00",
    sections: [
      {
        id: "composicao",
        title: "Entenda a composição solicitada",
        paragraphs: [
          "Uma proposta não é apenas um valor final. O edital pode pedir preço unitário, total por item, lote, marca, prazo de entrega, validade da proposta, impostos e declarações anexas.",
          "Antes de preencher a planilha, confirme quais itens serão ofertados e se as quantidades estão corretas. Um valor aparentemente competitivo pode se tornar inviável quando a quantidade ou a condição logística é ignorada.",
        ],
      },
      {
        id: "precos",
        title: "Calcule preço com contexto operacional",
        paragraphs: [
          "Considere custo do produto ou serviço, tributos, frete, garantia, equipe, prazo de recebimento e risco de execução. A regra comercial precisa ser conhecida por quem aprova o valor antes da sessão.",
          "Para processos com vários itens, mantenha o valor unitário e o total claramente separados. Isso evita que uma decisão sobre um item distorça a leitura do valor global da proposta.",
        ],
        checklist: [
          "Confirme unidade, quantidade e valor unitário de cada item",
          "Registre impostos, frete e condições incluídas no preço",
          "Valide a margem e o limite de redução com o responsável comercial",
          "Anexe a versão revisada e registre quem aprovou o envio",
        ],
      },
      {
        id: "revisao",
        title: "Revise antes do protocolo",
        paragraphs: [
          "A revisão final compara a proposta com a planilha e com as exigências do edital. Use uma lista de verificação, especialmente para anexos, assinaturas e campos obrigatórios da plataforma.",
          "Depois do envio, salve o comprovante e a versão enviada. Esse registro é essencial para acompanhar diligências, sessão de disputa e resultado.",
        ],
      },
    ],
    relatedSlugs: ["documentos-necessarios-para-licitacao", "como-participar-pregao-eletronico"],
  },
  {
    slug: "como-participar-pregao-eletronico",
    title: "Como participar de pregão eletrônico: etapas da sessão",
    description:
      "Entenda como funciona o pregão eletrônico, o envio da proposta, os lances, a classificação e os cuidados durante a sessão.",
    category: "Pregão eletrônico",
    image: "/images/blog/como-participar-pregao-eletronico.png",
    imageAlt: "Ilustração de laptop, martelo e marcadores de uma disputa eletrônica",
    publishedAt: "2026-08-31T12:00:00-03:00",
    modifiedAt: "2026-08-31T12:00:00-03:00",
    sections: [
      {
        id: "antes-da-sessao",
        title: "O trabalho começa antes da sessão",
        paragraphs: [
          "No pregão eletrônico, a proposta inicial, o credenciamento e os documentos precisam estar prontos conforme as regras da plataforma e do edital. Não é seguro deixar validações essenciais para os minutos anteriores à abertura.",
          "Defina responsáveis, limite comercial, itens que serão acompanhados e a forma de comunicação da equipe. A estratégia precisa estar clara antes de os lances começarem.",
        ],
      },
      {
        id: "lances",
        title: "Durante os lances, acompanhe cada item",
        paragraphs: [
          "A dinâmica varia conforme o edital e a plataforma, mas a leitura deve considerar posição, tempo, valor unitário, valor total e os limites de cada item. Uma redução não deve comprometer a margem ou uma condição de entrega assumida.",
          "Registre decisões manuais, alterações relevantes e comunicações oficiais do pregoeiro. O histórico ajuda a equipe a justificar o que fez e a entender a situação após a sessão.",
        ],
        checklist: [
          "Acompanhe a situação de cada item ou lote ativo",
          "Diferencie valor unitário, total do item e total da proposta",
          "Observe mensagens, avisos e prazos da plataforma oficial",
          "Registre decisões e responsáveis no contexto da disputa",
        ],
      },
      {
        id: "apos",
        title: "A sessão não encerra toda a participação",
        paragraphs: [
          "Depois dos lances, ainda podem existir negociação, habilitação, diligências, recursos e homologação. A empresa deve continuar acompanhando as comunicações e os prazos oficiais.",
          "Centralize comprovantes, documentos enviados e decisões da equipe no processo. Isso prepara a operação para responder rapidamente a uma solicitação posterior.",
        ],
      },
    ],
    relatedSlugs: ["como-montar-proposta-precos-licitacao", "como-ler-edital-licitacao"],
  },
  {
    slug: "como-cadastrar-empresa-para-licitacao",
    title: "Como cadastrar uma empresa para participar de licitação",
    description:
      "Veja como preparar o cadastro da empresa, identificar requisitos da plataforma e evitar pendências antes de uma licitação.",
    category: "Cadastro da empresa",
    image: "/images/blog/como-cadastrar-empresa-para-licitacao.png",
    imageAlt: "Ilustração de empresa, chave e selo de verificação para cadastro",
    publishedAt: "2026-08-31T12:00:00-03:00",
    modifiedAt: "2026-08-31T12:00:00-03:00",
    sections: [
      {
        id: "cadastro",
        title: "O cadastro depende do portal e da modalidade",
        paragraphs: [
          "Não há um único cadastro que substitua todas as etapas. Cada plataforma pode ter credenciamento, perfis de acesso e procedimentos próprios, enquanto o edital define as condições para aquele processo específico.",
          "Por isso, a empresa deve identificar com antecedência qual portal será usado e quais dados, certificados ou autorizações são necessários para operar nele.",
        ],
      },
      {
        id: "preparo",
        title: "Prepare os dados antes de precisar enviar uma proposta",
        paragraphs: [
          "Dados cadastrais, representantes, contatos e documentos recorrentes precisam estar consistentes. Uma divergência simples de razão social, CNPJ ou representante pode gerar retrabalho em um momento crítico.",
          "Além do acesso ao portal, organize uma rotina para revisar validade de certidões e poderes de representação. O objetivo é não descobrir uma pendência quando a oportunidade já está aberta.",
        ],
        checklist: [
          "Confirme razão social, CNPJ e dados de contato da empresa",
          "Defina usuários, responsáveis e permissões de acesso",
          "Valide requisitos do portal indicado no edital",
          "Mantenha documentos de habilitação organizados e atualizados",
        ],
      },
      {
        id: "seguranca",
        title: "Mantenha acesso e responsabilidade rastreáveis",
        paragraphs: [
          "Credenciais devem pertencer a pessoas identificadas e não podem ficar espalhadas entre canais informais. Registre quem enviou uma proposta, quem acompanhou a sessão e quem aprovou decisões comerciais.",
          "Com uma estrutura de operação clara, o cadastro deixa de ser uma tarefa isolada e passa a apoiar a participação com mais segurança e previsibilidade.",
        ],
      },
    ],
    relatedSlugs: ["documentos-necessarios-para-licitacao", "como-encontrar-licitacoes-abertas"],
  },
] as const satisfies readonly BlogArticle[];

export function getBlogArticle(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

export function blogHref(slug: string) {
  return `/blog/${slug}`;
}

export function formatPublicationDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
