import React from "react";

import Countdown from "@components/Countdown";

import { IReading } from "@api/api";

import { padDate } from "@utils/formatDate";

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

type IProps = {
  readings: IReading[];
};

export default function Dashboard(props: IProps) {
  // if you don't have any readings available yet (probably because you are offline)
  if (props.readings.length === 0) {
    // to prevent TypeErrors bellow
    return <h1>Načítání...</h1>;
  }

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
    <section className="dashboard">
      <div className="widget">
        <h3>Aktuální teplota</h3>
        <p role="temperature">{round(temperature_avg, 1)} ˚C</p>
      </div>

      <div className="widget">
        <h3>Aktuální vlhkost</h3>
        <p role="humidity">{round(humidity_DHT, 0)} %</p>
      </div>

      <div className="widget">
        <h3>Poslední aktualizace</h3>
        <p role="lastReadingDate">
          {hours}:{minutes} ({dayOfMonth}.{month}.{year})
        </p>
      </div>

      <div className="widget">
        <h3>Další aktualizace za</h3>
        <Countdown targetDate={nextReadingDate} />
      </div>

      <div className="widget">
        <h3>Min / max teplota (24 h)</h3>
        <p role="minMaxTemp">
          {round(min, 1)} / {round(max, 1)} ˚C
        </p>
      </div>
    </section>
  );
}
