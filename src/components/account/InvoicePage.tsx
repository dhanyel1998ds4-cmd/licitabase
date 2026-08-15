import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandMarks";
import { InternalPageState } from "@/components/dash2/InternalPageState";
import { Button } from "@/components/ui/button";
import { getAccountInvoice } from "@/lib/account-invoices";

export function InvoicePage({ invoiceId }: { invoiceId: string }) {
  const navigate = useNavigate();
  const invoice = getAccountInvoice(invoiceId);

  if (!invoice) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
        <InternalPageState
          state="error"
          title="Fatura não encontrada"
          description="Ela pode não estar mais disponível neste workspace."
          action={
            <Button
              type="button"
              onClick={() => void navigate({ to: "/dash2/configuracoes/plano" })}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white"
            >
              Voltar para faturamento
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="invoice-page-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      <style>{`
        @media print {
          @page { size: A4; margin: 10mm; }
          [data-app-shell] > aside, [data-app-shell] main > header, .invoice-page-actions, .invoice-page-back { display: none !important; }
          [data-app-shell], [data-app-shell] > div, [data-app-shell] > div > main, .invoice-page-scroll { display: block !important; height: auto !important; overflow: visible !important; background: #fff !important; padding: 0 !important; margin: 0 !important; }
          .invoice-print-sheet { max-width: none !important; border: 0 !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="mx-auto max-w-[960px] space-y-5 sm:space-y-6">
        <header className="invoice-page-actions flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/dash2/configuracoes/plano"
            className="invoice-page-back inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-2 text-[12px] font-bold text-slate-text transition-colors hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454]"
          >
            <ArrowLeft className="size-4" />
            Voltar para faturamento
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              className="min-h-11 rounded-xl border-hairline bg-white text-[12px] font-bold text-ink"
            >
              <a href={invoice.pdfFile} download>
                <Download className="size-4" />
                Baixar PDF
              </a>
            </Button>
            <Button
              type="button"
              onClick={() => window.print()}
              className="min-h-11 rounded-xl bg-[#18B849] text-[12px] font-extrabold text-white hover:bg-[#139e3e]"
            >
              <Printer className="size-4" />
              Imprimir / salvar PDF
            </Button>
          </div>
        </header>

        <article className="invoice-print-sheet overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden bg-[#06351E] px-5 py-6 sm:px-8 sm:py-8">
            <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full border-[28px] border-[#29C454]/15" />
            <BrandLogo variant="light" className="relative" />
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#7CF59E]">
                  Fatura demonstrativa
                </p>
                <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-white sm:text-[34px]">
                  {invoice.code}
                </h1>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#29C454]/20 px-3 py-1.5 text-[11px] font-extrabold text-[#A8F4BD] ring-1 ring-[#67E585]/30">
                <CheckCircle2 className="size-3.5" />
                Pagamento confirmado
              </span>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InvoiceParty
                title="Emitida por"
                name="LicitaBase"
                lines={[
                  "Plataforma de inteligência em licitações",
                  "Documento de cobrança do serviço",
                ]}
              />
              <InvoiceParty
                title="Cobrada de"
                name="Iridia Soluções"
                lines={["Workspace: Iridia Soluções", "Administradora: Jussefer"]}
                align="sm:text-right"
              />
            </div>

            <div className="grid gap-3 rounded-xl border border-hairline bg-[#F8FCF9] p-4 sm:grid-cols-3">
              <InvoiceDetail label="Referência" value={invoice.reference} />
              <InvoiceDetail label="Emitida em" value={invoice.issuedAt} />
              <InvoiceDetail label="Ciclo de cobrança" value={invoice.cycle} />
            </div>

            <InvoicePayment
              type={invoice.payment.type}
              method={invoice.payment.method}
              detail={invoice.payment.detail}
              confirmedAt={invoice.payment.confirmedAt}
              {...(invoice.payment.installments
                ? { installments: invoice.payment.installments }
                : {})}
            />

            <div className="overflow-hidden rounded-xl border border-hairline">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 bg-[#F6F8FA] px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.06em] text-slate-text sm:grid-cols-[minmax(0,1fr)_120px_140px]">
                <span>Descrição</span>
                <span className="hidden sm:block">Período</span>
                <span className="text-right">Valor</span>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_120px_140px]">
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold text-ink">LicitaBase {invoice.plan}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-text">
                    Acesso à plataforma, integrações e uso do Bot de Lances conforme os limites do
                    plano.
                  </p>
                </div>
                <p className="hidden text-[12px] font-semibold text-slate-text sm:block">
                  {invoice.reference}
                </p>
                <p className="whitespace-nowrap text-right text-[14px] font-extrabold text-ink">
                  {invoice.value}
                </p>
              </div>
            </div>

            <div className="ml-auto max-w-[330px] space-y-2 border-t border-hairline pt-4">
              <InvoiceTotal label="Subtotal" value={invoice.value} />
              <InvoiceTotal label="Impostos" value="Inclusos" muted />
              <div className="mt-3 flex items-baseline justify-between rounded-xl bg-[#ECF9F0] px-4 py-3">
                <span className="text-[12px] font-extrabold text-ink">Total pago</span>
                <strong className="whitespace-nowrap text-[20px] font-extrabold tracking-[-0.02em] text-brand-strong">
                  {invoice.value}
                </strong>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-hairline pt-5 text-[11px] text-slate-text sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-brand-strong" />
                Pagamento processado com segurança em {invoice.paidAt}.
              </div>
              <div className="flex items-center gap-2">
                <FileText className="size-4 shrink-0 text-brand-strong" />
                Este é um demonstrativo de cobrança e não substitui documento fiscal.
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function InvoiceParty({
  title,
  name,
  lines,
  align = "",
}: {
  title: string;
  name: string;
  lines: string[];
  align?: string;
}) {
  return (
    <div className={align}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-strong">
        {title}
      </p>
      <p className="mt-2 text-[15px] font-extrabold text-ink">{name}</p>
      {lines.map((line) => (
        <p key={line} className="mt-1 text-[11px] text-slate-text">
          {line}
        </p>
      ))}
    </div>
  );
}

function InvoiceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-slate-text">
        {label}
      </p>
      <p className="mt-1 text-[12px] font-extrabold text-ink">{value}</p>
    </div>
  );
}

function InvoicePayment({
  type,
  method,
  detail,
  installments,
  confirmedAt,
}: {
  type: "pix" | "credit-card";
  method: string;
  detail: string;
  installments?: string;
  confirmedAt: string;
}) {
  const PaymentIcon = type === "pix" ? QrCode : CreditCard;

  return (
    <div className="grid gap-4 rounded-xl border border-[#BDEEC9] bg-[#F5FCF7] p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#DDF8E5] text-brand-strong">
          <PaymentIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-brand-strong">
            Forma de pagamento
          </p>
          <p className="mt-1 text-[13px] font-extrabold text-ink">{method}</p>
          <p className="mt-0.5 text-[11px] text-slate-text">{detail}</p>
        </div>
      </div>
      {installments ? <InvoiceDetail label="Parcelamento" value={installments} /> : null}
      <InvoiceDetail label="Confirmado em" value={confirmedAt} />
    </div>
  );
}

function InvoiceTotal({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[12px]">
      <span className="font-semibold text-slate-text">{label}</span>
      <span className={muted ? "font-semibold text-slate-text" : "font-extrabold text-ink"}>
        {value}
      </span>
    </div>
  );
}
