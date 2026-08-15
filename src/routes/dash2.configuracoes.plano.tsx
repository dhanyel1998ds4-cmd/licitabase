import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/configuracoes/plano")({
  head: () => ({ meta: [{ title: "Plano e faturamento — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="plano" />,
});
