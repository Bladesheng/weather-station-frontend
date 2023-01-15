import React from "react";
import Footer from "./Footer";

import { fetchReadingsRange } from "../api";

const startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); // 24 hours ago in miliseconds
const endDate = new Date(); // up to now
const status = "dev";

fetchReadingsRange(startDate, endDate, status);

export default function App() {
  return (
    <div className="app">
      <p>OMG, React, hi!!!</p>
      <Footer></Footer>
    </div>
  );
}
