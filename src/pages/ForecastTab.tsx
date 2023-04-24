import React, { useState, useEffect } from "react";

import { fetchForecast } from "@api/api";
import { IForecast, ISunrise } from "@api/api";

import ChartForecast from "@components/charts/ChartForecast";

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

  return (
    <section className="forecastTab">
      <div className="chartDiv">
        <ChartForecast forecast={forecast} />
      </div>
    </section>
  );
}
