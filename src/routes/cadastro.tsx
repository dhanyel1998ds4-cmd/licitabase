import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowPage } from "@/components/auth/AuthFlowPage";
export const Route = createFileRoute("/cadastro")({
  component: () => <AuthFlowPage flow="signup" />,
});
