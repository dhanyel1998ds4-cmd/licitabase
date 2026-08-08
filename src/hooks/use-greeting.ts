import { useEffect, useState } from "react";
import { getGreeting } from "@/lib/greeting";

/**
 * Saudação baseada na hora local do usuário.
 * O primeiro render (servidor e cliente) usa um valor neutro para evitar
 * divergência de hidratação; a hora local só é aplicada após a montagem.
 */
export function useGreeting() {
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setGreeting(getGreeting());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return greeting ?? "Olá";
}
