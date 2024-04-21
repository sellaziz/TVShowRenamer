import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import TopStrip from "./TopStrip";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TopStrip />
    <App />
  </React.StrictMode>,
);
