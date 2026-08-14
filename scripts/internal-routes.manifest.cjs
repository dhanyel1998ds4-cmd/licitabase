module.exports = [
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
];
