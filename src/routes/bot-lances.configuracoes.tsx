import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BotPageHeader,
  BotPanel as CardShell,
  botInputClassName,
} from "@/components/dash2/BotPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/bot-lances/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações do Bot de Lances | LicitaBase" },
      {
        name: "description",
        content:
          "Defina estratégia, decremento, preço piso e limites de segurança do seu bot de lances.",
      },
      { property: "og:title", content: "Configurações do Bot de Lances | LicitaBase" },
      { property: "og:description", content: "Parâmetros de automação de lances." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
    }

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [hasUnsavedChanges]);

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasUnsavedChanges(false);
  }

  return (
    <form
      onSubmit={saveSettings}
      onChange={() => setHasUnsavedChanges(true)}
      className="space-y-5 sm:space-y-6"
    >
      <BotPageHeader
        title="Configurações"
        description="Parâmetros aplicados às disputas automatizadas da sua operação."
        guide={{
          title: "Defina limites seguros antes de automatizar lances",
          description:
            "A estratégia só entra em ação dentro das regras que você configurou. Revise cada limite e salve quando a política estiver pronta.",
          steps: [
            {
              title: "Escolha a estratégia",
              description: "Defina como o bot reage a uma mudança de preço.",
            },
            {
              title: "Configure proteções",
              description: "Estabeleça decremento, piso e limites por item.",
            },
            {
              title: "Salve e acompanhe",
              description: "Aplique a configuração e monitore as sessões ativas.",
            },
          ],
        }}
        actions={
          <Button
            type="submit"
            size="sm"
            className="hidden rounded-xl bg-[#29C454] shadow-none hover:bg-[#22ad49] sm:inline-flex"
            disabled={!hasUnsavedChanges}
          >
            Salvar alterações
          </Button>
        }
      />

      {hasUnsavedChanges && (
        <p role="status" className="text-[13px] font-semibold text-orange-600 sm:text-right">
          Existem alterações ainda não salvas.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2 sm:gap-5">
        <CardShell eyebrow="Estratégia" title="Comportamento de lances">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="estrategia">Estratégia</Label>
              <Select defaultValue="decremento-fixo">
                <SelectTrigger id="estrategia" className={botInputClassName}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decremento-fixo">Decremento fixo</SelectItem>
                  <SelectItem value="decremento-percentual">Decremento percentual</SelectItem>
                  <SelectItem value="agressiva">Agressiva (mínimo permitido)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decremento">Decremento por lance</Label>
              <Input
                id="decremento"
                className={botInputClassName}
                defaultValue="R$ 0,20"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intervalo">Intervalo entre lances (segundos)</Label>
              <Input id="intervalo" className={botInputClassName} type="number" defaultValue={20} />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-slate-50/50 px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-ink">Só dar lance quando perdendo</p>
                <p className="text-[12px] text-slate-text">
                  Evita lances desnecessários na liderança.
                </p>
              </div>
              <Switch defaultChecked aria-label="Só dar lance quando perdendo" />
            </div>
          </div>
        </CardShell>

        <CardShell eyebrow="Segurança" title="Limites e proteções">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="piso">Preço piso (% do valor orçado)</Label>
              <Input
                id="piso"
                className={botInputClassName}
                defaultValue="85%"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-lances">Máximo de lances por item</Label>
              <Input id="max-lances" className={botInputClassName} placeholder="Ilimitado" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-slate-50/50 px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-ink">Pausar ao atingir o piso</p>
                <p className="text-[12px] text-slate-text">
                  O bot para de dar lances e avisa a equipe.
                </p>
              </div>
              <Switch defaultChecked aria-label="Pausar ao atingir o piso" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-slate-50/50 px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-ink">Alertas de disputa</p>
                <p className="text-[12px] text-slate-text">
                  Notificar por e-mail em mudanças de posição.
                </p>
              </div>
              <Switch aria-label="Alertas de disputa" />
            </div>
          </div>
        </CardShell>
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-hairline bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <Button
          type="submit"
          className="min-h-12 w-full rounded-xl bg-[#29C454] shadow-none hover:bg-[#22ad49]"
          disabled={!hasUnsavedChanges}
        >
          {hasUnsavedChanges ? "Salvar alterações" : "Configurações salvas"}
        </Button>
      </div>
    </form>
  );
}
