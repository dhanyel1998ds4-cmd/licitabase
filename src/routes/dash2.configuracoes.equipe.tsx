import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/configuracoes/equipe")({
  head: () => ({ meta: [{ title: "Equipe e permissões — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="equipe" />,
});
