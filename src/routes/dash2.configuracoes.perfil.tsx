import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/configuracoes/perfil")({
  head: () => ({ meta: [{ title: "Meu perfil — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="perfil" />,
});
