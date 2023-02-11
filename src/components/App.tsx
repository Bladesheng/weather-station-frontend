import { Storage } from "@utils/storage";

import React, { useState, useEffect, useRef } from "react";

import Dashboard from "@components/Dashboard";
import ChartTempHum from "@components/ChartTempHum";
import ChartPress from "@components/ChartPress";
import Footer from "@components/Footer";

import { fetchReadingsRange, IReading } from "@api/api";

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
  const readingsRef = useRef<IReading[]>(readings);
  useEffect(() => {
    readingsRef.current = readings; // make sure the ref is always up to date
  }, [readings]);

  const [listening, setListening] = useState(false);

  useEffect(() => {
    // open new Server-sent events connection if not listening yet
    if (!listening) {
      const events = new EventSource("https://weather-station-backend.fly.dev/api/readings/events");
      //const events = new EventSource("http://localhost:8080/api/readings/events");

      // update current readings with newly received readings
      events.onmessage = (event) => {
        const newReading: IReading = JSON.parse(event.data);
        newReading.createdAt = new Date(newReading.createdAt); // convert string (because json) to date object
        console.log("new reading: ", newReading);

        // ref is needed because this whole callback doesn't get updated when state changes
        // which means this callback can't acces updated state without using ref
        const readingsCopy = [...readingsRef.current];

        // remove the last reading to not stretch out the chart too much
        readingsCopy.pop();

        // update readings
        setReadings([newReading, ...readingsCopy]);
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
        <section className="charts">
          <div className="chartDiv">
            <ChartTempHum readings={readings} />
          </div>
          <div className="chartDiv">
            <ChartPress readings={readings} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
