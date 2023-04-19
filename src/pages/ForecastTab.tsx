import React, { useState, useEffect } from "react";

import { fetchForecast } from "@api/api";
import { IForecast, ISunrise } from "@api/api";

export default function HistoryTab() {
  const [forecast, setForecast] = useState<IForecast[]>([]);
  const [sunrise, setSunrise] = useState<ISunrise[]>([]);

  // fetch forecast data after loading
  useEffect(() => {
    (async () => {
      const { forecast, sunrise } = await fetchForecast();
      setForecast(forecast);
      setSunrise(sunrise);
    })();
  }, []);

  // if you don't have any forecast data available yet (network or server error)
  // todo: move this to children components
  if (forecast.length === 0) {
    return <h1>Načítání...</h1>;
  }

  return (
    <section className="forecastTab">
      <h1>Předpověď WIP</h1>
      <p>{forecast[0].time.toISOString()}</p>
      <p>{sunrise[0].date.toISOString()}</p>
    </section>
  );
}
