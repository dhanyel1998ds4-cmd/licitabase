import { createFileRoute } from "@tanstack/react-router";
import { BotPageHeader } from "@/components/bot/BotPageHeader";
import { CardShell } from "@/components/shared/CardShell";
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
  return (
    <>
      <BotPageHeader
        title="Configurações"
        description="Parâmetros aplicados às disputas automatizadas da sua operação."
        actions={<Button size="sm">Salvar alterações</Button>}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CardShell eyebrow="Estratégia" title="Comportamento de lances">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="estrategia">Estratégia</Label>
              <Select defaultValue="decremento-fixo">
                <SelectTrigger id="estrategia">
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
              <Input id="decremento" defaultValue="R$ 0,20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intervalo">Intervalo entre lances (segundos)</Label>
              <Input id="intervalo" type="number" defaultValue={20} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-navy">Só dar lance quando perdendo</p>
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
              <Input id="piso" defaultValue="85%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-lances">Máximo de lances por item</Label>
              <Input id="max-lances" placeholder="Ilimitado" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-navy">Pausar ao atingir o piso</p>
                <p className="text-[12px] text-slate-text">
                  O bot para de dar lances e avisa a equipe.
                </p>
              </div>
              <Switch defaultChecked aria-label="Pausar ao atingir o piso" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <div>
                <p className="text-[13px] font-bold text-navy">Alertas de disputa</p>
                <p className="text-[12px] text-slate-text">
                  Notificar por e-mail em mudanças de posição.
                </p>
              </div>
              <Switch aria-label="Alertas de disputa" />
            </div>
          </div>
        </CardShell>
      </div>
    </>
  );
}
