import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { ParticipationDetailsPage } from "@/components/operations/ParticipationPages";
import { BotPostDisputePage } from "@/components/operations/BotPostDisputePage";
import { disputes } from "@/lib/bid-bot-fixtures";

export const Route = createFileRoute("/dash2/operacao/minhas-licitacoes/$licitacaoId")({
  head: () => ({ meta: [{ title: "Participação — LicitaBase" }] }),
  component: ParticipationRoute,
});

function ParticipationRoute() {
  const location = useLocation();
  const { licitacaoId } = Route.useParams();
  const isDetails =
    !location.pathname.endsWith("/proposta") && !location.pathname.endsWith("/disputa");
  if (!isDetails) return <Outlet />;
  if (disputes.some((dispute) => dispute.id === licitacaoId)) {
    return <BotPostDisputePage disputeId={licitacaoId} />;
  }
  return <ParticipationDetailsPage licitacaoId={licitacaoId} />;
}
