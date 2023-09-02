import React, { useState, useEffect } from "react";

import { ForecastAPI } from "@api/api";

import ChartForecast from "@components/charts/ChartForecast";

import ForecastTable from "@components/ForecastTable";

export default function HistoryTab() {
  const [forecast, setForecast] = useState<IForecast[]>([]);
  const [sunrise, setSunrise] = useState<ISunrise[]>([]);

  // fetch forecast data after loading
  useEffect(() => {
    (async () => {
      const { forecast, sunrise } = await ForecastAPI.fetchForecast();
      setForecast(forecast);
      setSunrise(sunrise);
    })();
  }, []);

  return (
    <section className="forecastTab">
      <div className="chartDiv">
        <ChartForecast forecast={forecast} />
      </div>

      <ForecastTable forecast={forecast} sunrise={sunrise} />

      <footer className="footer">
        <span>Zdroj dat pro předpověď: </span>
        <a href="https://api.met.no/">Met.no API</a>
      </footer>
    </section>
  );
}
