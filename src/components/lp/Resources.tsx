import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Layers, Package, Bookmark, ClipboardList, Kanban, Gavel, FileText, ScanSearch, Building2, Users2, Swords, BarChart3, UserCog, Plug, CreditCard, ArrowRight } from "lucide-react";
import { AppButton } from "./AppButton";

interface FeatureCard {
  icon: React.ElementType;
  title: string;
  text: string;
  detail: string;
}

interface FeatureArea {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  cards: FeatureCard[];
}

const FEATURE_AREAS: FeatureArea[] = [
  {
    id: "explorar",
    label: "Explorar Licitações",
    title: "Encontre oportunidades com mais precisão",
    subtitle: "Pesquise, organize e filtre licitações com inteligência para ganhar tempo e tomar decisões melhores.",
    cards: [
      {
        icon: Search,
        title: "Buscar licitações",
        text: "Pesquise oportunidades por produto, serviço, órgão, palavra-chave e filtros avançados.",
        detail: "Busque por produto, serviço, órgão ou palavra-chave.",
      },
      {
        icon: Layers,
        title: "Categorias de interesse",
        text: "Explore oportunidades organizadas pelas áreas mais relevantes para a atuação da sua empresa.",
        detail: "Acesse rapidamente os setores que você acompanha.",
      },
      {
        icon: Package,
        title: "Itens de licitação",
        text: "Consulte oportunidades a partir dos itens publicados nas licitações e encontre compras compatíveis com o que sua empresa fornece.",
        detail: "Pesquise um item para localizar oportunidades relacionadas.",
      },
      {
        icon: Bookmark,
        title: "Filtros salvos",
        text: "Salve combinações de filtros importantes e retome suas pesquisas sem configurar tudo novamente.",
        detail: "Seus critérios recorrentes, prontos para usar.",
      },
    ],
  },
  {
    id: "operacao",
    label: "Minha Operação",
    title: "Acompanhe sua operação em tempo real",
    subtitle: "Centralize oportunidades selecionadas, acompanhe cada etapa e mantenha as participações mais importantes sob controle.",
    cards: [
      {
        icon: ClipboardList,
        title: "Minhas Licitações",
        text: "Centralize as oportunidades que sua empresa decidiu acompanhar e tenha uma visão rápida do que exige atenção.",
        detail: "Acompanhe suas licitações em um só lugar.",
      },
      {
        icon: Kanban,
        title: "Pipeline",
        text: "Organize cada licitação por etapa, prioridade e responsável para deixar claro o próximo passo.",
        detail: "Em análise • Aprovada • Em disputa • Concluída",
      },
      {
        icon: Gavel,
        title: "Bot de Lances",
        text: "Configure sua estratégia, defina o piso permitido e deixe o bot executar lances dentro das regras estabelecidas por você.",
        detail: "Você define as regras. O bot respeita os limites.",
      },
      {
        icon: FileText,
        title: "Documentos",
        text: "Acesse os documentos vinculados à sua operação em um único ambiente.",
        detail: "Documentos importantes sempre ao alcance da equipe.",
      },
    ],
  },
  {
    id: "inteligencia",
    label: "Inteligência",
    title: "Dados e análises para sua estratégia",
    subtitle: "Aprofunde sua leitura de oportunidades, órgãos e concorrentes para priorizar melhor onde sua equipe deve concentrar esforço.",
    cards: [
      {
        icon: ScanSearch,
        title: "Raio-X",
        text: "Aprofunde a análise de uma licitação antes de decidir como avançar na oportunidade.",
        detail: "Uma visão mais completa antes da decisão.",
      },
      {
        icon: Building2,
        title: "Score dos Órgãos",
        text: "Consulte o score disponível para apoiar a leitura do perfil dos órgãos acompanhados.",
        detail: "Mais contexto sobre quem está comprando.",
      },
      {
        icon: Users2,
        title: "Empresas monitoradas",
        text: "Acompanhe empresas que fazem parte da sua análise competitiva e mantenha esses nomes organizados na plataforma.",
        detail: "Mantenha empresas relevantes no seu radar.",
      },
      {
        icon: Swords,
        title: "Concorrentes",
        text: "Veja quais empresas já venceram licitações do mesmo órgão, quantas vitórias tiveram e os valores médios contratados.",
        detail: "Entenda melhor quem disputa o mesmo mercado que você.",
      },
      {
        icon: BarChart3,
        title: "Relatórios",
        text: "Consolide informações da operação em visões de acompanhamento para apoiar análises internas.",
        detail: "Transforme dados da operação em uma visão mais clara.",
      },
    ],
  },
  {
    id: "gestao",
    label: "Gestão",
    title: "Controle total da sua conta e equipe",
    subtitle: "Gerencie acessos, integrações e informações da conta conforme sua operação evolui.",
    cards: [
      {
        icon: UserCog,
        title: "Equipe",
        text: "Organize os membros vinculados à conta de acordo com a capacidade disponível no seu plano.",
        detail: "Sua equipe trabalhando no mesmo ambiente.",
      },
      {
        icon: Plug,
        title: "Integrações",
        text: "Conecte ComprasNet, Licitanet e Portal de Compras Públicas para sincronizar participações com o Licitabase.",
        detail: "Menos alternância entre portais e controles paralelos.",
      },
      {
        icon: CreditCard,
        title: "Planos",
        text: "Consulte o nível atual da sua operação e as opções disponíveis conforme sua necessidade cresce.",
        detail: "Escolha os recursos adequados ao seu momento.",
      },
    ],
  },
];

export function Resources() {
  const [activeTab, setActiveTab] = useState("explorar");
  const activeArea = FEATURE_AREAS.find((area) => area.id === activeTab)!;


  return (
    <section
      id="recursos"
      className="features-section"
      aria-labelledby="features-title"
    >
      <div className="features-section__ambient" aria-hidden="true" />
      
      <div className="features-section__container">
        <header className="features-section__header">
          <span className="features-section__eyebrow">
            FUNCIONALIDADES
          </span>
          <h2 id="features-title" className="text-navy">
            Tudo o que sua operação precisa para trabalhar licitações com mais controle
          </h2>
          <p className="text-slate-text">
            Explore os recursos do Licitabase para encontrar oportunidades,
            organizar participações, analisar o mercado e gerenciar sua
            operação em um só lugar.
          </p>
        </header>

        <div className="features-tabs-container">
          <div
            className="features-tabs"
            role="tablist"
            aria-label="Áreas do Licitabase"
          >
            {FEATURE_AREAS.map((area) => (
              <button
                key={area.id}
                role="tab"
                aria-selected={activeTab === area.id}
                aria-controls={`panel-${area.id}`}
                id={`tab-${area.id}`}
                className={cn(
                  "features-tab",
                  activeTab === area.id && "features-tab--active"
                )}
                onClick={() => setActiveTab(area.id)}
              >
                {area.id === "explorar" && <Search className="features-tab__icon" />}
                {area.id === "operacao" && <ClipboardList className="features-tab__icon" />}
                {area.id === "inteligencia" && <ScanSearch className="features-tab__icon" />}
                {area.id === "gestao" && <UserCog className="features-tab__icon" />}
                <span>{area.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className="features-panel"
          role="tabpanel"
          id={`panel-${activeArea.id}`}
          aria-labelledby={`tab-${activeArea.id}`}
        >
          <div className="features-panel__header">
            <h3>{activeArea.title}</h3>
            <p>{activeArea.subtitle}</p>
          </div>

          <div className="features-grid">
            {activeArea.cards.map((card, index) => (
              <div 
                key={`${activeArea.id}-${index}`} 
                className="feature-card group"
              >

                <div className="feature-card__icon">
                  <card.icon size={24} />
                </div>
                <div className="feature-card__content">
                  <h4>{card.title}</h4>
                  <p>{card.text}</p>
                </div>
                <div className="feature-card__footer">
                  <div className="feature-card__dot" />
                  <span>{card.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-section__actions">
          <AppButton
            variant="secondary"
            size="md"
            className="min-w-[200px]"
            onClick={() => window.location.href = '/signup'}
          >
            Criar conta grátis
          </AppButton>
          <AppButton
            variant="ghost"
            size="md"
            iconRight={<ArrowRight className="app-button__icon app-button__icon--right" />}
            className="min-w-[220px] text-navy/70 hover:text-navy"
            onClick={() => window.location.href = '#bot-de-lances'}
          >
            Conhecer o bot de lances
          </AppButton>
        </div>
      </div>
    </section>
  );
}
