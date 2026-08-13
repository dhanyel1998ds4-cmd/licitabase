export const OPEN_ALICITANTE_EVENT = "licitabase:open-alicitante";

export type OpenAlicitanteDetail = {
  draft?: string;
};

export function openAlicitanteAssistant(draft = "") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<OpenAlicitanteDetail>(OPEN_ALICITANTE_EVENT, {
      detail: { draft },
    }),
  );
}
