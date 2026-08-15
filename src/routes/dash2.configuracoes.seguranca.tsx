import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/configuracoes/seguranca")({
  head: () => ({ meta: [{ title: "Segurança e acesso — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="seguranca" />,
});
