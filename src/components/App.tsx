import { Storage } from "@utils/storage";

import React, { useState } from "react";

import Dashboard from "@components/Dashboard";
import ChartTempHum from "@components/ChartTempHum";
import ChartPress from "@components/ChartPress";
import Footer from "@components/Footer";

import { fetchReadingsRange } from "@api/api";

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
      <main>
        <Dashboard readings={readings} />
        <div className="charts">
          <ChartTempHum readings={readings} />
          <ChartPress readings={readings} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
