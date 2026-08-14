import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowPage } from "@/components/auth/AuthFlowPage";
export const Route = createFileRoute("/convite/$token")({ component: InviteRoute });
function InviteRoute() {
  return <AuthFlowPage flow="invite" token={Route.useParams().token} />;
}
