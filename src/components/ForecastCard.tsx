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

      hoursText = `${hoursStart}—${hoursEnd}`;
    }

    return (
      <tr key={index}>
        <td role="hours">{hoursText}</td>
        <td className="icon">
          <img
            role="weatherIcon"
            className="weatherIcon"
            src={`./icons/weathericons/${iconCode}.svg`}
          />
        </td>
        <td role="temperature" className="temperature">
          {`${Math.round(timePoint.data.instant.details.air_temperature)}˚`}
        </td>
        <td role="precipitation" className="precipitation">
          {precipitation === 0 ? "" : precipitation}
        </td>
        <td role="cloud">{Math.round(timePoint.data.instant.details.cloud_area_fraction)}</td>
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
    <div role="forecastCard" className="forecastCard">
      <h2>{`${dayNames[props.day[0].time.getDay()]} ${props.day[0].time.getDate()}.${
        props.day[0].time.getMonth() + 1
      }.`}</h2>

      <table>
        <thead>
          <tr>
            <td>Čas</td>
            <td></td>
            <td>Teplota</td>
            <td>Srážky</td>
            <td>Oblačnost [%]</td>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>

      {props.sunrise !== undefined && (
        <div className="sunriseSunset">
          <div>
            <p>Východ</p>
            <img className="sunriseIcon" src="./icons/sunrise.svg" />
            <span role="sunriseTime">{sunrise}</span>
          </div>
          <div>
            <p>Západ</p>
            <img className="sunriseIcon" src="./icons/sunset.svg" />
            <span role="sunsetTime">{sunset}</span>
          </div>
        </div>
      )}
    </div>
  );
}
