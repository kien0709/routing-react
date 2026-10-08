import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

// onzichtbaar blokje onderaan een lijst komt het in beeld dan wordt de volgende pagina geladen
interface InfiniteScrollTriggerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
export default function InfiniteScrollTrigger({ hasNextPage, isFetchingNextPage, fetchNextPage }: InfiniteScrollTriggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasNextPage || isFetchingNextPage) return;

    // rootmargin zorgt dat we al 200px voordat je onderaan bent beginnen met laden
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <Flex justify="center" minH="32px" py={2} ref={ref}>
      {isFetchingNextPage && <Spinner color="var(--color-primary)" size="sm" />}
    </Flex>
  );
}
