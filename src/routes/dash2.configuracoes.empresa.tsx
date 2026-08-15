import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/configuracoes/empresa")({
  head: () => ({ meta: [{ title: "Empresa e workspace — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="empresa" />,
});
