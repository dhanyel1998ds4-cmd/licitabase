import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppButton } from "./AppButton";
import {
  CircleHelp,
  FileText,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Headphones,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FaqItemData {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemData[] = [
  {
    id: "what-is-licitabase",
    question: "O que é o Licitabase?",
    answer:
      "O Licitabase é uma plataforma que monitora licitações públicas em todo o Brasil. Você recebe alertas personalizados, acompanha editais, analisa concorrentes e encontra oportunidades de negócio com mais agilidade e inteligência.",
  },
  {
    id: "data-source",
    question: "De onde vêm os dados das licitações?",
    answer:
      "As oportunidades são coletadas a partir de fontes oficiais, incluindo o Portal Nacional de Contratações Públicas, o PNCP. Os dados de busca são atualizados diariamente. Informações provenientes de plataformas conectadas seguem o fluxo de sincronização de cada integração.",
  },
  {
    id: "search-before-account",
    question: "Posso pesquisar antes de criar uma conta?",
    answer:
      "Sim. Você pode realizar uma busca e visualizar uma prévia dos resultados antes de se cadastrar. Para salvar filtros, criar alertas, organizar oportunidades e utilizar os demais recursos, será necessário criar uma conta.",
  },
  {
    id: "how-to-find-sector",
    question: "Como encontro licitações do meu setor?",
    answer:
      "Você pode pesquisar por palavras-chave ou utilizar filtros como categoria, estado, município, modalidade, valor, órgão e data da disputa. Também é possível salvar seus critérios e receber novas oportunidades compatíveis com o perfil da sua empresa.",
  },
  {
    id: "participation-support",
    question: "O Licitabase participa das licitações pela minha empresa?",
    answer:
      "O Licitabase oferece ferramentas para apoiar e automatizar partes da operação, incluindo o bot de lances nos planos elegíveis. A empresa usuária continua responsável pela análise da oportunidade, documentação, configuração da estratégia e decisões relacionadas à participação.",
  },
  {
    id: "free-to-start",
    question: "Preciso pagar para começar?",
    answer:
      "Não. A criação da conta é gratuita e permite iniciar a configuração do seu perfil e conhecer a plataforma. Os recursos disponíveis variam conforme o plano contratado.",
  },
  {
    id: "connected-platforms",
    question: "Quais plataformas podem ser conectadas?",
    answer:
      "Atualmente, o Licitabase trabalha com ComprasNet, Licitanet e Portal de Compras Públicas. As integrações com BNC Compras e BLL Compras estão previstas para uma etapa futura.",
  },
  {
    id: "bid-bot-limit",
    question: "O bot pode dar um lance abaixo do meu limite?",
    answer:
      "Não, desde que o piso tenha sido configurado corretamente. Antes da disputa, você define a estratégia e o valor mínimo permitido. O bot executa os lances dentro dessas regras.",
  },
];

const FAQ_BY_ID = new Map(FAQ_ITEMS.map((faq) => [faq.id, faq]));
const FAQ_COLUMNS = [
  ["what-is-licitabase", "participation-support", "bid-bot-limit", "connected-platforms"],
  ["data-source", "search-before-account", "free-to-start", "how-to-find-sector"],
].map((column) =>
  column.map((id) => FAQ_BY_ID.get(id)).filter((faq): faq is FaqItemData => Boolean(faq)),
);

export function FAQ() {
  return (
    <section id="faq" className="faq-section" aria-labelledby="faq-title">
      <div className="faq-section__container">
        <div className="faq-panel">
          <div className="faq-header">
            <Badge className="faq-header__badge">
              <CircleHelp className="w-4 h-4" aria-hidden="true" />
              <span>FAQ</span>
            </Badge>
            <h2 id="faq-title" className="text-center w-full">
              Perguntas frequentes
            </h2>
            <p className="text-center w-full mx-auto">
              Tudo o que você precisa saber para começar a monitorar licitações públicas.
            </p>
            <span className="faq-header__accent" />
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="what-is-licitabase"
            className="faq-grid"
          >
            <div className="faq-grid__column faq-grid__column--primary">
              {FAQ_COLUMNS[0]!.map((faq, index) => (
                <AccordionItem key={faq.id} value={faq.id} className="faq-item">
                  <AccordionTrigger className="faq-item__trigger">
                    <span className="faq-item__question">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="faq-item__body">
                    <div className="faq-item__content">
                      {faq.answer}
                      {index === 0 && (
                        <a href="#recursos" className="faq-item__action">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center size-5 rounded-md bg-primary/10">
                              <FileText className="size-3.5 text-primary" aria-hidden="true" />
                            </span>
                            <span className="text-[#29C454]">Saiba mais sobre o Licitabase</span>
                          </div>
                          <ChevronDown
                            className="-rotate-90 size-4 text-[#29C454]"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
            <div className="faq-grid__column faq-grid__column--secondary">
              {FAQ_COLUMNS[1]!.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="faq-item">
                  <AccordionTrigger className="faq-item__trigger">
                    <span className="faq-item__question">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="faq-item__body">
                    <div className="faq-item__content">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>

          <div className="faq-support">
            <div className="faq-support__identity">
              <div className="faq-support__icon-wrapper">
                <Headphones aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Ainda com dúvidas?</h3>
                <p className="text-[#29C454] font-medium">Fale com nossa equipe.</p>
              </div>
            </div>

            <div className="faq-support__benefits">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-[#29C454]" />
                <span>Atendimento rápido e especializado</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-[#29C454]" />
                <span>Tire dúvidas e veja o Licitabase na prática</span>
              </div>
            </div>

            <div className="faq-support__action">
              <AppButton
                variant="primary"
                iconLeft={<MessageCircle aria-hidden="true" className="w-4 h-4" />}
                className="w-full justify-center gap-2 !bg-[#29C454] !border-[#29C454]"
                onClick={() => (window.location.href = "/signup")}
              >
                Falar com um especialista
              </AppButton>
              <div className="mt-3 text-center">
                <a href="/signup" className="faq-support__secondary-action">
                  Ou envie uma mensagem <ArrowRight aria-hidden="true" className="size-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="faq-decoration faq-decoration--dots" aria-hidden="true" />
          <div className="faq-decoration faq-decoration--arcs" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
