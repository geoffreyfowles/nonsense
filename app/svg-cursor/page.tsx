"use client";

import { Box } from "@mantine/core";
import classes from "./page.module.css";
import { useMouse } from "@mantine/hooks";
import SVGCursor from "@/components/SVGCursor";

export default function SVGCursorPage() {
  const { ref, x, y } = useMouse();

  return (
    <Box className={classes.page}>
      <Box className={classes.cursorContainer} ref={ref}>
        <SVGCursor x={x} y={y} />
      </Box>
    </Box>
  );
}
