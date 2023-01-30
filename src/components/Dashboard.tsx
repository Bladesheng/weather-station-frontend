import React from "react";

import Countdown from "@components/Countdown";

import { IReading } from "@api/api";

import { padDate } from "@utils/formatDate";

type IProps = {
  readings: IReading[];
};

// round the number to certain number of decimal places
function round(originalNumber: number, decimalPlaces: number) {
  const x = 10 ** decimalPlaces;
  return Math.round(originalNumber * x) / x;
}

// returns average time (delay) between all readings
function getAvgDelay(readings: IReading[]) {
  const delays: number[] = [];

  for (let i = 0; i < readings.length - 1; i++) {
    const delay = readings[i].createdAt.getTime() - readings[i + 1].createdAt.getTime();
    delays.push(delay);
  }

  const avgDelay =
    delays.reduce((prev, curr) => {
      return prev + curr;
    }) / delays.length;

  return avgDelay;
}

export default function Dashboard(props: IProps) {
  const { temperature_BMP, temperature_DHT, humidity_DHT } = props.readings[0];
  const temperature_avg = (temperature_BMP + temperature_DHT) / 2;

  const latestDate = props.readings[0].createdAt; // date of the last reading
  const { hours, minutes, seconds, dayOfMonth, month, year } = padDate(latestDate);

  const avgDelay = getAvgDelay(props.readings);
  const nextReadingDate = new Date(latestDate.getTime() + avgDelay); // expected date of the next reading

  // min and max temperature (average) values in the past 24h
  const { min, max } = props.readings.reduce(
    (minMax, reading) => {
      return {
        min: Math.min(minMax.min, (reading.temperature_BMP + reading.temperature_DHT) / 2),
        max: Math.max(minMax.max, (reading.temperature_BMP + reading.temperature_DHT) / 2),
      };
    },
    { min: Infinity, max: -Infinity }
  );

  return (
    <div className="dashboard">
      <p>Aktuální teplota</p>
      <p>{round(temperature_avg, 1)} ˚C</p>

      <p>Aktuální vlhkost</p>
      <p>{round(humidity_DHT, 0)} %</p>

      <p>Poslední aktualizace</p>
      <p>
        {hours}:{minutes} ({dayOfMonth}.{month}.{year})
      </p>

      <p>Další aktualizace za</p>
      <Countdown targetDate={nextReadingDate} />

      <p>Min / max teplota (24 h)</p>
      <p>
        {round(min, 1)} / {round(max, 1)} ˚C
      </p>
    </div>
  );
}
