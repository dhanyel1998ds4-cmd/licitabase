export type AccountInvoice = {
  id: string;
  code: string;
  reference: string;
  issuedAt: string;
  paidAt: string;
  value: string;
  plan: string;
  cycle: string;
  payment: {
    type: "pix" | "credit-card";
    method: string;
    detail: string;
    installments?: string;
    confirmedAt: string;
  };
  pdfFile: string;
};

export const accountInvoices: AccountInvoice[] = [
  {
    id: "ago-2026",
    code: "LB-2026-08-0001",
    reference: "Agosto de 2026",
    issuedAt: "14 ago 2026",
    paidAt: "14 ago 2026",
    value: "R$ 299,00",
    plan: "Profissional",
    cycle: "Mensal",
    payment: {
      type: "credit-card",
      method: "Cartão de crédito",
      detail: "Mastercard final 4821",
      installments: "1x de R$ 299,00",
      confirmedAt: "14 ago 2026 às 10:32",
    },
    pdfFile: "/faturas/licitabase-fatura-ago-2026.pdf",
  },
];

export function getAccountInvoice(invoiceId: string) {
  return accountInvoices.find((invoice) => invoice.id === invoiceId);
}
