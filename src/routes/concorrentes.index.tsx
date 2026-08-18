import { createFileRoute } from "@tanstack/react-router";
import { CompetitorsHomePage } from "@/components/intelligence/CompetitorsPages";

export const Route = createFileRoute("/concorrentes/")({ component: CompetitorsHomePage });
