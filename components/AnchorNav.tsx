"use client";

import { useVisibleElements } from "@/hooks/useVisibleElements";
import { Anchor, Box, Paper, px } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import classes from "./AnchorNav.module.css";
import { useRouter } from "next/navigation";

type Props = {
  anchors: Array<{
    title: string;
    id: string;
  }>;
};

/**
 * Features:
 * Auto-scroll active tab to center
 * Accommodates tabs of varying sizes
 * Active tab highlight rectangle with "stretch" animation
 */
export default function AnchorNav({ anchors }: Props) {
  const router = useRouter();
  const [anchorElements, setAnchorElements] = useState<Array<Element>>([]);
  const visibleElements = useVisibleElements(anchorElements, {
    rootMargin: `-${px("3rem")}px 0px 0px 0px`,
  });
  const [activeAnchorIndex, setActiveAnchorIndex] = useState(-1);
  const anchorLinkRefs = useRef<Array<Element>>([]);
  const { ref: containerRef, width: containerWidth } = useElementSize();
  let isScrollingRef = useRef(false);
  let prevActiveAnchorIndexRef = useRef(-1);

  const anchorLinkAbsolutePosition = useCallback(
    (anchorIdx: number) => {
      try {
        const firstAnchorLinkRect =
          anchorLinkRefs.current[0].getBoundingClientRect();
        const activeAnchorLinkRect =
          anchorLinkRefs.current[anchorIdx].getBoundingClientRect();

        return {
          left: activeAnchorLinkRect.left - firstAnchorLinkRect.left,
          right:
            -activeAnchorLinkRect.right +
            firstAnchorLinkRect.left +
            containerWidth,
        };
      } catch (error) {
        return { left: 0, right: 0 };
      }
    },
    [containerWidth]
  );

  const scrollAnchorLinkIntoView = useCallback(
    (anchorIdx: number) => {
      const activeAnchorLinkRect =
        anchorLinkRefs.current[anchorIdx].getBoundingClientRect();

      containerRef.current.scrollLeft =
        anchorLinkAbsolutePosition(anchorIdx).left -
        containerWidth / 2 +
        (activeAnchorLinkRect.right - activeAnchorLinkRect.left) / 2;
    },
    [anchorLinkAbsolutePosition, containerRef, containerWidth]
  );

  const scrollAnchorElementIntoView = useCallback(
    (anchorIdx: number) => {
      anchorElements[anchorIdx].scrollIntoView({ behavior: "smooth" });
    },
    [anchorElements]
  );

  useEffect(() => {
    setAnchorElements(
      anchors
        .map((anchor) => document.querySelector(`#${anchor.id}`)!)
        .filter(Boolean)
    );
  }, [anchors]);

  useEffect(() => {
    if (!isScrollingRef.current) {
      prevActiveAnchorIndexRef.current = activeAnchorIndex;
      setActiveAnchorIndex(anchorElements.indexOf(visibleElements[0]));

      if (activeAnchorIndex >= 0 && containerRef.current) {
        scrollAnchorLinkIntoView(activeAnchorIndex);
      }
    }
  }, [
    visibleElements,
    anchorElements,
    containerRef,
    containerWidth,
    activeAnchorIndex,
    scrollAnchorLinkIntoView,
  ]);

  useEffect(() => {
    function handleScrollEnd(e: Event) {
      if (e.target !== containerRef.current) {
        isScrollingRef.current = false;
      }
    }

    window.addEventListener("scrollend", handleScrollEnd, true);

    return () => window.removeEventListener("scrollend", handleScrollEnd, true);
  }, [containerRef, scrollAnchorLinkIntoView]);

  return (
    <Paper className={classes.background} shadow="xl">
      <Box ref={containerRef} className={classes.container}>
        <Box
          className={classes.activeHighlight}
          left={anchorLinkAbsolutePosition(activeAnchorIndex).left + 8}
          right={
            activeAnchorIndex >= 0
              ? anchorLinkAbsolutePosition(activeAnchorIndex).right + 8
              : anchorLinkAbsolutePosition(anchorElements.length - 1).right + 8
          }
          style={{
            transitionDelay:
              activeAnchorIndex > prevActiveAnchorIndexRef.current
                ? "75ms, 0ms"
                : "0ms, 75ms",
          }}
        ></Box>

        {anchors.map((anchor, anchorIndex) => (
          <Anchor
            className={classes.anchorLink}
            key={anchor.id}
            // href={`#${anchor.id}`} // use programmatic scrolling due to weird smooth scroll behaviour on firefox
            underline="never"
            ref={(el) => anchorLinkRefs.current.push(el!)}
            c={anchorIndex === activeAnchorIndex ? "blue" : "inherit"}
            onClick={() => {
              router.push(`#${anchor.id}`, { scroll: false });
              isScrollingRef.current = true;
              prevActiveAnchorIndexRef.current = activeAnchorIndex;
              setActiveAnchorIndex(anchorIndex);
              scrollAnchorLinkIntoView(anchorIndex);
              scrollAnchorElementIntoView(anchorIndex);
            }}
          >
            {anchor.title}
          </Anchor>
        ))}
      </Box>
    </Paper>
  );
}
