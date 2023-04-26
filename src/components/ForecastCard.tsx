import React from "react";

import { IForecast, ISunrise } from "@api/api";
import { padWithZeroes, padDate } from "@utils/formatDate";

const dayNames = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];

type IProps = {
  day: IForecast[];
  sunrise?: ISunrise[];
};

export default function ForecastCard(props: IProps) {
  const rows = props.day.map((timePoint, index) => {
    const precipitation1hr = timePoint.data?.next_1_hours?.details?.precipitation_amount;
    const precipitation6hr = timePoint.data?.next_6_hours?.details?.precipitation_amount;
    const icon1hr = timePoint.data?.next_1_hours?.summary?.symbol_code;
    const icon6hr = timePoint.data?.next_6_hours?.summary?.symbol_code;

    // Preferably use the 1 hour data. If not available, use the 6 hour data.
    let precipitation = precipitation1hr !== undefined ? precipitation1hr : precipitation6hr;
    let iconCode = icon1hr !== undefined ? icon1hr : icon6hr;

    // if 1hr and 6hr variables are undefined, then the result will be undefined too
    if (precipitation === undefined || iconCode === undefined) {
      console.warn("Precipitation or icon is missing for: ", timePoint);
      precipitation = 0;
      iconCode = "heavysnowshowersandthunder_day";
    }

    let hours = timePoint.time.getHours();
    let hoursText = padWithZeroes(hours);
    // if the timepoint doesn't have data for the next hour, it applies to the next 6 hours
    if (precipitation1hr === undefined) {
      const hoursStart = padWithZeroes(hours);

      // day has only 24 hours, so move the clock if it would overflow into the next day
      if (hours + 6 > 23) {
        hours = hours - 24;
      }
      const hoursEnd = padWithZeroes(hours + 6);

      hoursText = `${hoursStart}-${hoursEnd}`;
    }

    return (
      <tr key={index}>
        <td>{hoursText}</td>
        <td className="temperature">
          {Math.round(timePoint.data.instant.details.air_temperature)}
        </td>
        <td>
          <img className="weatherIcon" src={`./icons/weathericons/${iconCode}.svg`} />
        </td>
        <td className="precipitation">{precipitation === 0 ? "" : precipitation}</td>
        <td>{Math.round(timePoint.data.instant.details.cloud_area_fraction)}</td>
      </tr>
    );
  });

  let sunrise = "";
  let sunset = "";
  if (props.sunrise !== undefined) {
    {
      const { hours, minutes } = padDate(props.sunrise[0].sunrise.time);
      sunrise = `${hours}:${minutes}`;
    }
    {
      const { hours, minutes } = padDate(props.sunrise[0].sunset.time);
      sunset = `${hours}:${minutes}`;
    }
  }

  return (
    <div className="forecastCard">
      <p>{`${dayNames[props.day[0].time.getDay()]} ${props.day[0].time.getDate()}.${
        props.day[0].time.getMonth() + 1
      }`}</p>

      <table>
        <thead>
          <tr>
            <td>Čas</td>
            <td>Teplota [˚C]</td>
            <td></td>
            <td>Srážky [mm]</td>
            <td>Oblačnost [%]</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      {props.sunrise !== undefined && (
        <div className="sunriseSunset">
          <img className="sunrise" src="./icons/sunrise.svg" />
          <p>{sunrise}</p>
          <img className="sunrise" src="./icons/sunset.svg" />
          <p>{sunset}</p>
        </div>
      )}
    </div>
  );
}
