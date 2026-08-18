import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type ResizableColumn = {
  id: string;
  width: number;
  min: number;
  max: number;
};

type ResizeSession = { id: string; startX: number; startWidth: number };

/**
 * Mantém a largura de colunas desktop por tela. A interação ocorre direto na
 * divisória entre colunas; não há menu paralelo de configuração.
 */
export function useResizableColumns({
  storageKey,
  columns,
  leadingColumn = "minmax(0, 1fr)",
}: {
  storageKey: string;
  columns: ResizableColumn[];
  leadingColumn?: string;
}) {
  const defaults = useMemo(
    () =>
      Object.fromEntries(columns.map((column) => [column.id, column.width])) as Record<
        string,
        number
      >,
    [columns],
  );
  const [widths, setWidths] = useState<Record<string, number>>(defaults);
  const [hasLoadedStoredWidths, setHasLoadedStoredWidths] = useState(false);
  const resizeSession = useRef<ResizeSession | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Record<string, number>;
      const next = Object.fromEntries(
        columns.map((column) => {
          const candidate = parsed[column.id];
          const width = typeof candidate === "number" ? candidate : column.width;
          return [column.id, Math.min(column.max, Math.max(column.min, width))];
        }),
      ) as Record<string, number>;
      setWidths(next);
    } catch {
      setWidths(defaults);
    } finally {
      setHasLoadedStoredWidths(true);
    }
  }, [columns, defaults, storageKey]);

  useEffect(() => {
    if (!hasLoadedStoredWidths) return;
    window.localStorage.setItem(storageKey, JSON.stringify(widths));
  }, [hasLoadedStoredWidths, storageKey, widths]);

  const updateWidth = useCallback(
    (id: string, nextWidth: number) => {
      const column = columns.find((item) => item.id === id);
      if (!column) return;
      setWidths((current) => ({
        ...current,
        [id]: Math.min(column.max, Math.max(column.min, Math.round(nextWidth))),
      }));
    },
    [columns],
  );

  const getResizeHandleProps = useCallback(
    (id: string) => ({
      type: "button" as const,
      className: cn(
        "absolute right-0 top-0 z-10 hidden h-full w-3 translate-x-1/2 cursor-col-resize touch-none lg:block",
        "before:absolute before:inset-y-2 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-transparent",
        "hover:before:bg-brand-strong/35 focus-visible:before:bg-brand-strong focus-visible:outline-none",
      ),
      "aria-label": `Redimensionar largura da coluna ${id}`,
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        resizeSession.current = { id, startX: event.clientX, startWidth: widths[id] ?? 0 };
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
      },
      onPointerMove: (event: PointerEvent<HTMLButtonElement>) => {
        const session = resizeSession.current;
        if (!session || session.id !== id) return;
        updateWidth(id, session.startWidth + event.clientX - session.startX);
      },
      onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        resizeSession.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      },
      onPointerCancel: () => {
        resizeSession.current = null;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        updateWidth(id, (widths[id] ?? 0) + (event.key === "ArrowRight" ? 16 : -16));
      },
    }),
    [updateWidth, widths],
  );

  return {
    gridTemplateColumns: `${leadingColumn} ${columns.map((column) => `${widths[column.id] ?? column.width}px`).join(" ")}`,
    getColumnWidth: (id: string) =>
      widths[id] ?? columns.find((column) => column.id === id)?.width ?? 0,
    getResizeHandleProps,
  };
}
