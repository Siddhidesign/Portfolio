// Renders the page to HTML at build time, so every number and every run is in
// index.html before any script runs (no-JS visitors, crawlers, link previews, screen readers).
import { renderToString } from "react-dom/server";
import App from "./App";

export const render = () => renderToString(<App />);
