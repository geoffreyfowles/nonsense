import { AnimatePresence, motion } from "framer-motion";
import classes from "./SVGCursor.module.css";
import { useWindowEvent } from "@mantine/hooks";
import { useRef, useState } from "react";

type Props = {
  x: number;
  y: number;
};

export default function SVGCursor({ x, y }: Props) {
  const [isScrolling, setIsScrolling] = useState(false);
  const initialPath = "M 0 4 C 0 0 2 -1 5 2 L 7 4 C 14 12 0 17 0 7";
  const scrollingPath = "M 0 3 C 0 -1 6 -1 6 3 L 6 12 C 6 16 0 16 0 12";
  let scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useWindowEvent("wheel", (e) => {
    clearTimeout(scrollTimeoutRef.current);

    setIsScrolling(true);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  });

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      className={classes.cursor}
      style={{ x, y }}
      initial={{
        width: 19,
        height: 29,
        viewBox: "0 0 9 12.5",
      }}
      animate={
        isScrolling
          ? { width: 18, height: 45, viewBox: "0 0 6 15" }
          : {
              width: 19,
              height: 29,
              viewBox: "0 0 9 12.5",
            }
      }
    >
      <motion.path
        d={initialPath}
        animate={isScrolling ? { d: scrollingPath } : { d: initialPath }}
        fill={"crimson"}
      />

      <AnimatePresence>
        {isScrolling && (
          <motion.path
            d={scrollingPath}
            fill={"white"}
            transform={"translate(1,2.5)"}
            initial={{ scale: 0 }}
            animate={{ scale: 0.75 }}
            exit={{ scale: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScrolling && (
          <motion.circle
            fill={"crimson"}
            transform={"translate(1,2.5)"}
            cx={2}
            initial={{ r: 0, cy: 4.9 }}
            animate={{ r: 1.5, cy: [1.9, 7.9, 1.9] }}
            transition={{ cy: { repeat: Infinity } }}
            exit={{ r: 0, cy: 4.9 }}
          />
        )}
      </AnimatePresence>
    </motion.svg>
  );
}
