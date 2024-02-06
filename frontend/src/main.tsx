import { render } from "preact";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { SocketProvider } from "./data/providers/SocketProvider";

render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <SocketProvider>
      <App />
    </SocketProvider>
  </ThemeProvider>,
  document.getElementById("app")!
);
