module.exports = [
  { path: "/categorias", file: "src/routes/categorias.tsx" },
  { path: "/categorias/:categoryId", file: "src/routes/categorias.$categoryId.tsx" },
  {
    path: "/categorias/:categoryId/estado/:stateId",
    file: "src/routes/categorias.$categoryId.estado.$stateId.tsx",
  },
  { path: "/itens", file: "src/routes/itens.tsx" },
  { path: "/onboarding", file: "src/routes/onboarding.tsx" },
  { path: "/dash2/licitacoes/buscar", file: "src/routes/dash2.licitacoes.buscar.tsx" },
  { path: "/dash2/licitacoes/:licitacaoId", file: "src/routes/dash2.licitacoes.$licitacaoId.tsx" },
  { path: "/dash2/oportunidades/favoritos", file: "src/routes/dash2.oportunidades.favoritos.tsx" },
  {
    path: "/dash2/operacao/minhas-licitacoes",
    file: "src/routes/dash2.operacao.minhas-licitacoes.tsx",
  },
  {
    path: "/dash2/operacao/minhas-licitacoes/:licitacaoId",
    file: "src/routes/dash2.operacao.minhas-licitacoes.$licitacaoId.tsx",
  },
  {
    path: "/dash2/operacao/minhas-licitacoes/:licitacaoId/proposta",
    file: "src/routes/dash2.operacao.minhas-licitacoes.$licitacaoId.proposta.tsx",
  },
  {
    path: "/dash2/operacao/minhas-licitacoes/:licitacaoId/disputa",
    file: "src/routes/dash2.operacao.minhas-licitacoes.$licitacaoId.disputa.tsx",
  },
  {
    path: "/dash2/operacao/anotacoes",
    file: "src/routes/dash2.operacao.anotacoes.tsx",
  },
  { path: "/dash2/configuracoes/perfil", file: "src/routes/dash2.configuracoes.perfil.tsx" },
  { path: "/dash2/configuracoes/empresa", file: "src/routes/dash2.configuracoes.empresa.tsx" },
  { path: "/dash2/configuracoes/equipe", file: "src/routes/dash2.configuracoes.equipe.tsx" },
  { path: "/dash2/configuracoes/plano", file: "src/routes/dash2.configuracoes.plano.tsx" },
  { path: "/dash2/configuracoes/seguranca", file: "src/routes/dash2.configuracoes.seguranca.tsx" },
  {
    path: "/dash2/configuracoes/notificacoes",
    file: "src/routes/dash2.configuracoes.notificacoes.tsx",
  },
  {
    path: "/dash2/configuracoes/faturas/:invoiceId",
    file: "src/routes/dash2.configuracoes.faturas.$invoiceId.tsx",
  },
  { path: "/dash2/ajuda", file: "src/routes/dash2.ajuda.tsx" },
  {
    path: "/dash2/gestao/templates-emails",
    file: "src/routes/dash2.gestao.templates-emails.tsx",
  },
];
