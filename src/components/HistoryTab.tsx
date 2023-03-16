import React, { useState } from "react";

import ChartInteractive from "@components/ChartInteractive";

import { fetchReadingsRange, IReading } from "@api/api";

export default function HistoryTab() {
  const [readings, setReadings] = useState<IReading[]>([]);

  const buttonTimes = {
    "120 minut": 120 * 60 * 1000,
    "12 hodin": 12 * 60 * 60 * 1000,
    "24 hodin": 24 * 60 * 60 * 1000,
    "2 dny": 2 * 24 * 60 * 60 * 1000,
    "7 dní": 7 * 24 * 60 * 60 * 1000,
    "30 dní": 30 * 24 * 60 * 60 * 1000,
  };

  async function clickHandlerTimeRange(e: React.MouseEvent) {
    const clickedButton = e.target as HTMLButtonElement;
    const buttonText = clickedButton.textContent as keyof typeof buttonTimes;

    const startTime = buttonTimes[buttonText];

    const initialReadings = await fetchReadingsRange(new Date(Date.now() - startTime));
    setReadings(initialReadings);
  }

  const buttonElements: JSX.Element[] = [];
  for (const buttonText in buttonTimes) {
    buttonElements.push(
      <button onClick={clickHandlerTimeRange} key={buttonText}>
        {buttonText}
      </button>
    );
  }

  return (
    <section className="historyTab">
      <h1>WIP</h1>

      <section className="controls">{buttonElements}</section>

      <div className="chartDiv">
        <ChartInteractive readings={readings} />
      </div>
    </section>
  );
}
