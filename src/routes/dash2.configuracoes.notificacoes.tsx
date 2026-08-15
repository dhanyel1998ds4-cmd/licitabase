import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/configuracoes/notificacoes")({
  head: () => ({ meta: [{ title: "Preferências de notificações — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="notificacoes" />,
});
