import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import AgricultureTables from "./AgricultureTables";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <AgricultureTables />
    </MantineProvider>
  );
}
