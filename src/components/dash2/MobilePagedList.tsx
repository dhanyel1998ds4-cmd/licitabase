import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

function chunkItems<Item>(items: Item[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  );
}

export function MobilePagedList<Item>({
  items,
  renderItem,
  getKey,
  ariaLabel,
  pageHasAttention,
  pageClassName,
}: {
  items: Item[];
  renderItem: (item: Item) => ReactNode;
  getKey: (item: Item) => string;
  ariaLabel: string;
  pageHasAttention?: (items: Item[]) => boolean;
  pageClassName?: string;
}) {
  const pages = useMemo(() => chunkItems(items, 2), [items]);
  const [api, setApi] = useState<CarouselApi>();
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (!api) return;
    const syncPage = () => setCurrentPage(api.selectedScrollSnap());
    syncPage();
    api.on("select", syncPage);
    api.on("reInit", syncPage);
    return () => {
      api.off("select", syncPage);
      api.off("reInit", syncPage);
    };
  }, [api]);

  return (
    <div className="min-w-0 md:hidden" data-mobile-paged-list={ariaLabel}>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", containScroll: false, loop: false, slidesToScroll: 1 }}
        aria-label={ariaLabel}
        className="w-full min-w-0"
      >
        <CarouselContent className="ml-0 w-full min-w-0">
          {pages.map((page, pageIndex) => (
            <CarouselItem
              key={pageIndex}
              data-mobile-page={pageIndex + 1}
              className="w-full min-w-0 basis-full pl-0"
            >
              <div
                className={cn(
                  "min-h-[286px] w-full min-w-0 max-w-full divide-y divide-hairline",
                  pageClassName,
                )}
              >
                {page.map((item) => (
                  <div key={getKey(item)} className="min-w-0 max-w-full">
                    {renderItem(item)}
                  </div>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {pages.length > 1 ? (
        <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
          <button
            type="button"
            onClick={() => api?.scrollPrev(true)}
            disabled={!api?.canScrollPrev()}
            aria-label={`Página anterior de ${ariaLabel}`}
            className="grid size-11 place-items-center rounded-xl border border-hairline bg-white text-ink shadow-sm transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-3" aria-live="polite" aria-atomic="true">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {pages.map((page, index) => (
                <button
                  key={index}
                  type="button"
                  tabIndex={-1}
                  onClick={() => api?.scrollTo(index, true)}
                  className={cn(
                    "relative size-2.5 rounded-full transition-colors",
                    index === currentPage ? "bg-[#29C454]" : "bg-slate-200",
                  )}
                >
                  {pageHasAttention?.(page) ? (
                    <span className="absolute -right-1 -top-1 size-1.5 rounded-full border border-white bg-orange-500" />
                  ) : null}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-extrabold tabular-nums text-slate-text">
              {currentPage + 1} de {pages.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => api?.scrollNext(true)}
            disabled={!api?.canScrollNext()}
            aria-label={`Próxima página de ${ariaLabel}`}
            className="grid size-11 place-items-center rounded-xl border border-hairline bg-white text-ink shadow-sm transition-colors hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29C454] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
