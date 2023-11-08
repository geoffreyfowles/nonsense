import { useEffect, useRef, useState } from "react";

export function useVisibleElements(
  elements: Element[],
  observerOptions?: IntersectionObserverInit
) {
  const observerOptionsRef = useRef(observerOptions);

  const [visibleElements, setVisibleElements] = useState<Array<Element>>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const isElementVisible = new Map<Element, boolean>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        isElementVisible.set(entry.target, entry.isIntersecting)
      );

      setVisibleElements(
        [...isElementVisible.entries()]
          .filter(([, isVisible]) => isVisible)
          .map(([element]) => element)
      );
    }, observerOptionsRef.current);

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [elements]);

  return visibleElements;
}
