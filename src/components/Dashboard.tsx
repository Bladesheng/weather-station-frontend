import React from "react";

import { IReading } from "@api/api";

type IProps = {
  readings: IReading[];
};

// round the number to certain number of decimal places
function round(originalNumber: number, decimalPlaces: number) {
  const x = 10 ** decimalPlaces;
  return Math.round(originalNumber * x) / x;
}

export default function Dashboard(props: IProps) {
  const { temperature_BMP, temperature_DHT, humidity_DHT } = props.readings[0];
  const temperature_avg = (temperature_BMP + temperature_DHT) / 2;
  const latestDate = props.readings[0].createdAt;

  return (
    <div className="dashboard">
      <p>Aktuální teplota</p>
      <p>{round(temperature_avg, 1)} ˚C</p>

      <p>Aktuální vlhkost</p>
      <p>{round(humidity_DHT, 0)} %</p>

      <p>Poslední aktualizace</p>
      <p>{latestDate.toLocaleString()}</p>
    </div>
  );
}
