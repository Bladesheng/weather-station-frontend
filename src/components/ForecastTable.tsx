import React from "react";

import { IForecast, ISunrise } from "@api/api";
import ForecastCard from "./ForecastCard";

type IProps = {
  forecast: IForecast[];
  sunrise: ISunrise[];
};

// split forecast into subarrays of timepoints grouped by days
function splitByDays(forecast: IForecast[]) {
  let currentDay = forecast[0].time.getDate();
  const days: IForecast[][] = [[]];

  for (const timePoint of forecast) {
    if (timePoint.time.getDate() !== currentDay) {
      currentDay = timePoint.time.getDate();
      days.push([]); // create new day subarray
    }

    // add the timepoint to the last subarray
    days[days.length - 1].push(timePoint);
  }

  return days;
}

export default function ForecastTable(props: IProps) {
  if (props.forecast.length === 0) {
    return <p>Načítání...</p>;
  }

  const days = splitByDays(props.forecast);
  console.log("Days: ", days);

  const dayCards = days.map((day, index) => {
    if (index === 0) {
      // add sunrise time only to today's card
      return <ForecastCard key={index} day={day} sunrise={props.sunrise} />;
    } else {
      return <ForecastCard key={index} day={day} />;
    }
  });

  return <section className="forecastTable">{dayCards}</section>;
}
