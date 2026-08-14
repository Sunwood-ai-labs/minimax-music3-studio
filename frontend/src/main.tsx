import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LocaleProvider } from "./i18n/LocaleProvider";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/forge.css";
import "./styles/music3.css";
import "./styles/mcp.css";
import "./styles/states.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LocaleProvider>
        <App />
      </LocaleProvider>
    </BrowserRouter>
  </StrictMode>,
);
