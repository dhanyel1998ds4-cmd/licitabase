import { createFileRoute } from "@tanstack/react-router";
import { AuthFlowPage } from "@/components/auth/AuthFlowPage";
export const Route = createFileRoute("/redefinir-senha")({
  component: () => <AuthFlowPage flow="reset" />,
});
