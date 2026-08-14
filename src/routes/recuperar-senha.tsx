import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowPage } from "@/components/auth/AuthFlowPage";
export const Route = createFileRoute("/recuperar-senha")({
  component: () => <AuthFlowPage flow="recover" />,
});
