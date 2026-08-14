# Plano de Padronização Visual da Landing Page (/lp)

O objetivo é consolidar a hierarquia visual, tipografia, cores e espaçamentos em toda a página `/lp`, garantindo consistência entre todas as seções.

## 1. Padronização de Design Tokens (src/styles.css)

Revisar e consolidar as variáveis no `@theme` e `@layer base` para assegurar que:
- **Tipografia**: 
  - Títulos (`h1` a `h6`): **Poppins** (Extrabold/Bold), com `letter-spacing` negativo para o look B2B SaaS.
  - Corpo de texto: **Manrope**, com pesos 400 (regular), 500 (medium) e 600 (semibold).
- **Cores Semânticas**:
  - Primária: `#29C454` (Licitabase Green).
  - Texto Principal: `#0f172a` (Navy).
  - Texto Secundário/Muted: `#64748b` (Slate).
  - Backgrounds: Alternância entre `#ffffff` (White), `#f8fafc` (Off-white) e `#010103` (Dark sections).
- **Espaçamento**: Padronizar paddings de seção para `clamp(80px, 10vw, 140px)` vertical.

## 2. Ajustes nos Componentes de Seção

### Header (src/components/lp/Header.tsx)
- Garantir que a tipografia do menu use `text-sm` e `font-medium`.
- Sincronizar as cores de hover com o novo sistema.

### Hero (src/components/lp/Hero.tsx)
- Ajustar pesos do `h1` e `p` para usar as variáveis globais.
- Padronizar o "tender-search-panel" para usar tokens de borda e sombra definidos no CSS.

### Benefícios e Recursos (src/components/lp/Benefits.tsx, src/components/lp/Resources.tsx)
- Unificar o estilo do "eyebrow" (o pequeno badge acima do título).
- Padronizar os tamanhos de fonte dos cards (Título do card: `text-xl` ou `text-lg`, texto: `text-base`).

### FAQ (src/components/lp/FAQ.tsx)
- Garantir que o `h2` e a descrição sigam exatamente os mesmos tokens do Hero e HowItWorks.

## 3. Limpeza de Estilos Inline e Overrides

- Remover estilos `<style dangerouslySetInnerHTML>` específicos de componentes e movê-los para utilitários ou classes no `src/styles.css`.
- Substituir hardcoded colors (ex: `text-gray-400`) por tokens semânticos (ex: `text-muted-foreground`) onde apropriado, ou manter classes Tailwind consistentes.

---

I'll start by consolidating the global theme variables in `src/styles.css` and then apply the font/color standard to the main layout and specific section headers.
