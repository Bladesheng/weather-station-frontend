import { Storage } from "@utils/storage";

import React, { useState, useEffect } from "react";

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
  const [listening, setListening] = useState(false);

  useEffect(() => {
    // open new Server-sent events connection if not listening yet
    if (!listening) {
      const events = new EventSource("https://weather-station-backend.fly.dev/api/readings/events");
      //const events = new EventSource("http://localhost:8080/api/readings/events");

      // update current readings with newly received readings
      events.onmessage = (event) => {
        const newReading = JSON.parse(event.data);
        newReading.createdAt = new Date(newReading.createdAt); // convert string to date object!
        console.log("new reading: ", newReading);

        // update readings
        setReadings([newReading, ...readings]);
      };

      events.onerror = (error) => {
        setListening(false);
        console.error("EventSource failed:", error);
      };

      setListening(true);
    }
  }, [listening, readings]);

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
