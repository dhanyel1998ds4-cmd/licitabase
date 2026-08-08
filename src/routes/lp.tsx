import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router';
import { Header } from '@/components/lp/Header';
import { Hero } from '@/components/lp/Hero';
import { ValueProof } from '@/components/lp/ValueProof';
import { HowItWorks } from '@/components/lp/HowItWorks';

import { BidBot } from '@/components/lp/BidBot';
import { Resources } from '@/components/lp/Resources';
import { Benefits } from '@/components/lp/Benefits';
import { Pricing } from '@/components/lp/Pricing';
import { SearchFilters } from '@/components/lp/SearchFilters';
import { Categories } from '@/components/lp/Categories';
import { FAQ } from '@/components/lp/FAQ';

import { Footer } from '@/components/lp/Footer';

export const Route = createFileRoute('/lp')({
  head: () => ({
    title: 'Licitabase | Encontre, analise e monitore licitações públicas',
    meta: [
      {
        name: 'description',
        content: 'Encontre licitações públicas em todo o Brasil, receba alertas, analise editais, compare preços, acompanhe concorrentes e automatize lances com o Licitabase.',
      },
      { property: 'og:title', content: 'Licitabase | Encontre, analise e monitore licitações públicas' },
      { property: 'og:description', content: 'Encontre licitações públicas em todo o Brasil, receba alertas, analise editais, compare preços, acompanhe concorrentes e automatize lances com o Licitabase.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const location = useLocation();
  const isBaseLp = location.pathname === '/lp' || location.pathname === '/lp/';

  if (!isBaseLp) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col w-full font-manrope bg-white">
      <Header />
      <main>
        <Hero />
        <ValueProof />
        <HowItWorks />
        <Benefits />
        <BidBot />
        <Resources />
        <Pricing />
        <SearchFilters />
        <Categories />
        <FAQ />
        
      </main>
      <Footer />
    </div>
  );
}
