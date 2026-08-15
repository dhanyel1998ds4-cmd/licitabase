from pathlib import Path
from shutil import copyfile

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "licitabase-fatura-ago-2026.pdf"
PUBLIC_COPY = ROOT / "public" / "faturas" / "licitabase-fatura-ago-2026.pdf"
ICON = ROOT / "public" / "licitabase-icon.webp"

INK = HexColor("#0B132B")
SLATE = HexColor("#64748B")
GREEN = HexColor("#29C454")
DARK_GREEN = HexColor("#06351E")
SOFT_GREEN = HexColor("#ECF9F0")
LINE = HexColor("#E5EAF0")
LIGHT = HexColor("#F6F8FA")


def label(pdf, x, y, text):
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(x, y, text.upper())


def body(pdf, x, y, text, font="Helvetica", size=9, color=SLATE):
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    pdf.drawString(x, y, text)


def draw_logo(pdf, x, y):
    if ICON.exists():
        pdf.drawImage(str(ICON), x, y - 30, width=30, height=30, mask="auto")
    pdf.setFont("Helvetica-Bold", 19)
    pdf.setFillColor(white)
    pdf.drawString(x + 39, y - 18, "licita")
    pdf.setFillColor(GREEN)
    pdf.drawString(x + 83, y - 18, "base")
    pdf.setFont("Helvetica-Bold", 5.5)
    pdf.setFillColor(HexColor("#A8F4BD"))
    pdf.drawString(x + 40, y - 29, "INTELIGENCIA EM LICITACOES PUBLICAS")


def draw_divider(pdf, y):
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.7)
    pdf.line(48, y, 547, y)


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    width, height = A4
    pdf.setTitle("Fatura demonstrativa LB-2026-08-0001 - LicitaBase")
    pdf.setAuthor("LicitaBase")

    pdf.setFillColor(white)
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    pdf.setFillColor(DARK_GREEN)
    pdf.rect(0, height - 172, width, 172, fill=1, stroke=0)
    pdf.setFillColor(HexColor("#1B8040"))
    pdf.circle(width - 26, height - 28, 80, fill=0, stroke=1)
    pdf.setLineWidth(20)
    pdf.setStrokeColor(HexColor("#19823D"))
    pdf.circle(width - 26, height - 28, 80, fill=0, stroke=1)

    draw_logo(pdf, 48, height - 46)
    pdf.setFillColor(HexColor("#7CF59E"))
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(48, height - 108, "FATURA DEMONSTRATIVA")
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 22)
    pdf.drawString(48, height - 132, "LB-2026-08-0001")
    pdf.setFillColor(HexColor("#A8F4BD"))
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawRightString(width - 48, height - 126, "PAGAMENTO CONFIRMADO")

    label(pdf, 48, height - 207, "Emitida por")
    body(pdf, 48, height - 225, "LicitaBase", "Helvetica-Bold", 12, INK)
    body(pdf, 48, height - 240, "Plataforma de inteligencia em licitacoes", size=8.5)
    body(pdf, 48, height - 253, "Documento de cobranca do servico", size=8.5)

    right = width - 48
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawRightString(right, height - 207, "COBRADA DE")
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawRightString(right, height - 225, "Iridia Solucoes")
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica", 8.5)
    pdf.drawRightString(right, height - 240, "Workspace: Iridia Solucoes")
    pdf.drawRightString(right, height - 253, "Administradora: Jussefer")

    pdf.setFillColor(SOFT_GREEN)
    pdf.roundRect(48, height - 327, 499, 48, 8, fill=1, stroke=0)
    details = [("REFERENCIA", "Agosto de 2026"), ("EMITIDA EM", "14 ago 2026"), ("CICLO DE COBRANCA", "Mensal")]
    for index, (title, value) in enumerate(details):
        x = 64 + index * 164
        label(pdf, x, height - 300, title)
        body(pdf, x, height - 316, value, "Helvetica-Bold", 9, INK)

    payment_top = height - 350
    pdf.setFillColor(HexColor("#F5FCF7"))
    pdf.roundRect(48, payment_top - 60, 499, 60, 8, fill=1, stroke=0)
    pdf.setStrokeColor(HexColor("#BDEEC9"))
    pdf.setLineWidth(0.8)
    pdf.roundRect(48, payment_top - 60, 499, 60, 8, fill=0, stroke=1)
    label(pdf, 64, payment_top - 20, "Forma de pagamento")
    body(pdf, 64, payment_top - 37, "Cartao de credito", "Helvetica-Bold", 10, INK)
    body(pdf, 64, payment_top - 50, "Mastercard final 4821", size=8.5)
    label(pdf, 288, payment_top - 20, "Parcelamento")
    body(pdf, 288, payment_top - 38, "1x de R$ 299,00", "Helvetica-Bold", 9, INK)
    label(pdf, 412, payment_top - 20, "Confirmado em")
    body(pdf, 412, payment_top - 38, "14 ago 2026", "Helvetica-Bold", 9, INK)
    body(pdf, 412, payment_top - 50, "as 10:32", size=8.5)

    table_top = height - 438
    pdf.setFillColor(LIGHT)
    pdf.roundRect(48, table_top - 28, 499, 28, 5, fill=1, stroke=0)
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica-Bold", 8)
    pdf.drawString(64, table_top - 18, "DESCRICAO")
    pdf.drawString(385, table_top - 18, "PERIODO")
    pdf.drawRightString(531, table_top - 18, "VALOR")

    body(pdf, 64, table_top - 53, "LicitaBase Profissional", "Helvetica-Bold", 10, INK)
    body(pdf, 64, table_top - 69, "Acesso a plataforma, integracoes e uso do Bot de Lances", size=8.5)
    body(pdf, 64, table_top - 81, "conforme os limites do plano.", size=8.5)
    body(pdf, 385, table_top - 53, "Agosto de 2026", "Helvetica-Bold", 8.5, SLATE)
    body(pdf, 483, table_top - 53, "R$ 299,00", "Helvetica-Bold", 10, INK)
    draw_divider(pdf, table_top - 99)

    subtotal_y = table_top - 132
    body(pdf, 372, subtotal_y, "Subtotal", "Helvetica-Bold", 9, SLATE)
    body(pdf, 479, subtotal_y, "R$ 299,00", "Helvetica-Bold", 9, INK)
    body(pdf, 372, subtotal_y - 19, "Impostos", "Helvetica-Bold", 9, SLATE)
    body(pdf, 497, subtotal_y - 19, "Inclusos", "Helvetica-Bold", 9, SLATE)
    pdf.setFillColor(SOFT_GREEN)
    pdf.roundRect(349, subtotal_y - 65, 198, 40, 7, fill=1, stroke=0)
    body(pdf, 365, subtotal_y - 42, "Total pago", "Helvetica-Bold", 10, INK)
    body(pdf, 456, subtotal_y - 44, "R$ 299,00", "Helvetica-Bold", 15, GREEN)

    draw_divider(pdf, 143)
    body(pdf, 48, 122, "Pagamento processado com seguranca em 14 ago 2026.", "Helvetica-Bold", 8.5, SLATE)
    body(pdf, 48, 108, "Este e um demonstrativo de cobranca e nao substitui documento fiscal.", size=8.5)
    pdf.setFillColor(GREEN)
    pdf.rect(48, 75, 499, 2, fill=1, stroke=0)
    body(pdf, 48, 55, "LicitaBase - inteligencia para licitacoes publicas", "Helvetica-Bold", 8, SLATE)
    body(pdf, 48, 41, "Fatura demonstrativa gerada para visualizacao no ambiente LicitaBase.", size=7.5)
    pdf.setFont("Helvetica", 7.5)
    pdf.drawRightString(547, 41, "Pagina 1 de 1")

    pdf.showPage()
    pdf.save()
    PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)
    copyfile(OUTPUT, PUBLIC_COPY)
    print(OUTPUT)


if __name__ == "__main__":
    main()
