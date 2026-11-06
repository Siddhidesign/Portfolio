import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root")!;
const app = <StrictMode><App /></StrictMode>;
// The HTML is prerendered at build time; attach to it instead of replacing it.
if (root.hasChildNodes()) hydrateRoot(root, app); else createRoot(root).render(app);
