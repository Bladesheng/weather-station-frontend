import "@styles/style.scss";

import "@assets/manifest.webmanifest";

import "@assets/icons/favicons/favicon.ico";
import "@assets/icons/favicons/apple-touch-icon.png";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "@components/App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App></App>);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}
