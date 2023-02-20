import "@styles/style.scss";
import "@assets/favicon.ico";
import "@assets/manifest.webmanifest";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "@components/App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App></App>);
