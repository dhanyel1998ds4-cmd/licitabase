import { createFileRoute } from "@tanstack/react-router";
import { AccountSettingsPage } from "@/components/account/AccountSettingsPage";

export const Route = createFileRoute("/dash2/ajuda")({
  head: () => ({ meta: [{ title: "Ajuda e suporte — LicitaBase" }] }),
  component: () => <AccountSettingsPage section="ajuda" />,
});
