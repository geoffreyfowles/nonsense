import { Box, Divider } from "@mantine/core";
import classes from "./page.module.css";
import AnchorNav from "@/components/AnchorNav";

export default function AnchorNavPage() {
  const anchors = [...Array(10).keys()].map((i) => ({
    title: `Section ${(i + 1) ** (2 * i) % 6 ** 10}`,
    id: `section-${(i + 1) ** (2 * i) % 6 ** 10}`,
  }));

  return (
    <Box className={classes.page}>
      <Box component="header" className={classes.header}>
        Header
      </Box>

      <Box component="main">
        <AnchorNav anchors={anchors} />

        {anchors.map((anchor) => (
          <Box key={anchor.id} id={anchor.id} className={classes.section}>
            <Divider />

            {anchor.title}
          </Box>
        ))}

        <Divider />
      </Box>

      <Box component="footer" className={classes.footer}>
        Footer
      </Box>
    </Box>
  );
}
