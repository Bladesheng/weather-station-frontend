import { Storage } from "@utils/storage";

import React, { useState, useEffect, useRef } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Navbar from "@components/Navbar";
import OverviewTab from "@components/OverviewTab";
import HistoryTab from "@components/HistoryTab";
import OfflinePopup from "@components/OfflinePopup";
import Footer from "@components/Footer";

import { fetchReadingsRange, IReading } from "@api/api";

const initialReadings = await fetchReadingsRange();

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [readings, setReadings] = useState<IReading[]>(initialReadings);
  const [readingsHistory, setReadingsHistory] = useState<IReading[]>([]); // save the state here so it doesn't get deleted when switching tabs

  const readingsRef = useRef<IReading[]>(readings);
  useEffect(() => {
    readingsRef.current = readings; // make sure the ref is always up to date
  }, [readings]);

  const [listening, setListening] = useState(false);

  // for maintaining SSE connection
  useEffect(() => {
    // open new Server-Sent Events connection if you are online and not listening yet
    if (!listening && isOnline) {
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
        events.close(); // close the connection to prevent additional errors
        setListening(false);
        console.warn("EventSource failed:", error);
      };

      setListening(true);
    }
  }, [listening, readings, isOnline]);

  // listeners for when you go online / offline, that update state, fetch new readings, etc.
  useEffect(() => {
    window.addEventListener("online", () => {
      console.log("Going Online");
      setIsOnline(navigator.onLine);

      // Fetch latest readings after reconnecting to a network
      setTimeout(async () => {
        setReadings(await fetchReadingsRange());
        // Timeout is used because sometimes, the request is sent too fast after reconnecting to a network,
        // the DNS fails to resolve and as a result, the request for new readings also fails
        // (This could possibly be only VirtualBox issue, but better to be safe)
      }, 0);
    });

    window.addEventListener("offline", () => {
      console.log("Going Offline");
      setIsOnline(navigator.onLine);
    });
  }, []);

  // save all current readings in Local Storage whenever they change
  // (so they can be ready when you come back later in offline mode)
  useEffect(() => {
    Storage.readings = readings;
  }, [readings]);

  return (
    <HashRouter>
      <div className="app">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<OverviewTab readings={readings} />} />
            <Route
              path="historie"
              element={
                <HistoryTab
                  readingsHistory={readingsHistory}
                  setReadingsHistory={setReadingsHistory}
                />
              }
            />
            <Route path="predpoved" element={<h1>Předpověď WIP</h1>} />
            <Route path="info" element={<h1>O meteostanici WIP</h1>} />
          </Routes>
        </main>

        <OfflinePopup isOnline={isOnline} />
        <Footer />
      </div>
    </HashRouter>
  );
}
