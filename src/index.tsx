import "./styles/style.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

const icon = require.context("./styles/", false, /\.ico$/); // use webpack to load favicon.ico

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App></App>);
