import { Storage } from "../Storage";

import React, { useState } from "react";
import ChartTempHum from "./ChartTempHum";
import ChartPress from "./ChartPress";
import Footer from "./Footer";

import { fetchReadingsRange } from "../api";

Storage.init();

const startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); // 24 hours ago in miliseconds
const endDate = new Date(); // up to now
const status = "normal";

const initialReadings = await fetchReadingsRange(startDate, endDate, status);

export default function App() {
  if (initialReadings === undefined) {
    throw new Error("Fetching readings failed");
  }

  const [readings, setReadings] = useState(initialReadings);

  return (
    <div className="app">
      <p>OMG, React, hi!!!</p>

      <ChartTempHum readings={readings} />
      <ChartPress readings={readings} />

      <Footer />
    </div>
  );
}
