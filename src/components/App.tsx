import React, { useState } from "react";
import ReadingsChart from "./ReadingsChart";
import Footer from "./Footer";

import { fetchReadingsRange } from "../api";

const startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000); // 24 hours ago in miliseconds
const endDate = new Date(); // up to now
const status = "dev";

const initialReadings = await fetchReadingsRange(startDate, endDate, status);

export default function App() {
  if (initialReadings === undefined) {
    throw new Error("Fetching readings failed");
  }

  const [readings, setReadings] = useState(initialReadings);

  return (
    <div className="app">
      <p>OMG, React, hi!!!</p>

      <ReadingsChart readings={readings} />

      <Footer />
    </div>
  );
}
