import "../styles/style.scss";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "@components/App";

import { registerSW } from "virtual:pwa-register";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

registerSW({
  immediate: true,

  onOfflineReady() {
    console.log("[SW] Offline version is ready");
  },
});
