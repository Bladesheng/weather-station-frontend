import React, { useEffect } from "react";

import { Storage } from "@api/storage";

import { fetchReadingsRange, IReading } from "@api/api";
import { largestTriangleThreeBuckets } from "@utils/lttb";

const buttonTimes = {
  "12 hodin": 12 * 60 * 60 * 1000,
  "24 hodin": 24 * 60 * 60 * 1000,
  "2 dny": 2 * 24 * 60 * 60 * 1000,
  "7 dní": 7 * 24 * 60 * 60 * 1000,
  "30 dní": 30 * 24 * 60 * 60 * 1000,
};

const monthNames = [
  "Leden",
  "Únor",
  "Březen",
  "Duben",
  "Květen",
  "Červen",
  "Červenec",
  "Srpen",
  "Září",
  "Říjen",
  "Listopad",
  "Prosinec",
];

// how many months are there between 2 dates
function monthDiff(dateFrom: Date, dateTo: Date) {
  return (
    dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
}

export const dateFrom = new Date("2022-07-02T20:00:00.000Z"); // date of first reading ever
const dateTo = new Date(); // up to now
const numberOfMonths = monthDiff(dateFrom, dateTo);

// array of first and last dates of each month
const firstLastDates: Date[][] = [];
for (let i = 0; i < numberOfMonths; i++) {
  const firstDay = new Date();
  firstDay.setMonth(new Date().getMonth() - i - 1);
  firstDay.setDate(1); // first day of that month

  const lastDay = new Date(firstDay);
  lastDay.setMonth(firstDay.getMonth() + 1); // the next month
  lastDay.setDate(0); // 0 will allways give you last day of the previous month

  firstLastDates[i] = [firstDay, lastDay];
}

const options = firstLastDates.map((firstAndLastDay, index) => {
  const firstDay = firstAndLastDay[0];

  const monthName = monthNames[firstDay.getMonth()];
  const year = firstDay.getFullYear();

  return (
    <option value={index} key={index}>
      {`${monthName} ${year}`}
    </option>
  );
});

type IProps = {
  readingsHistory: IReading[];
  setReadingsHistory: (readings: IReading[]) => void;
};

export default function HistoryControls(props: IProps) {
  useEffect(() => {
    // on component init: if there is no readings yet and something was already selected last time: select it again
    if (props.readingsHistory.length === 0 && Storage.lastRange !== "") {
      const rangeName = Storage.lastRange as keyof typeof buttonTimes;
      selectRange(rangeName);
    }
  }, []);

  // fetch readings for give rangeName, update state to display them on chart and remember the last selection (with localStorage)
  async function selectRange(rangeName: keyof typeof buttonTimes) {
    const startTime = buttonTimes[rangeName];
    const readings = await fetchReadingsRange(new Date(Date.now() - startTime));

    props.setReadingsHistory(readings);

    Storage.lastRange = rangeName; // remember the last selection to load it when you refresh page
  }

  async function clickSelectRange(e: React.MouseEvent) {
    const clickedButton = e.target as HTMLButtonElement;
    const buttonText = clickedButton.textContent as keyof typeof buttonTimes;

    selectRange(buttonText);
  }

  async function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "none") return; // the first preselected option

    const howManyMonthsAgo = parseInt(e.target.value);

    // first day and last day of the selected month
    const endDate = firstLastDates[howManyMonthsAgo][0];
    const startDate = firstLastDates[howManyMonthsAgo][1];

    const readings = await fetchReadingsRange(endDate, startDate);

    // lttb downsampling requires arrays of x and y value
    const temperatureInputs = readings.map((reading) => {
      return [reading.createdAt, reading.temperature_BMP];
    });
    const humidityInputs = readings.map((reading) => {
      return [reading.createdAt, reading.humidity_DHT];
    });
    const pressureInputs = readings.map((reading) => {
      return [reading.createdAt, reading.pressure_BMP];
    });

    // Downsampling - usually, there is arround 8000 readings per month.
    // With that many points, the browser usually starts to lag
    const downsampledCount = 1000; // 1000 seems to be ok compromise between browser lag and data resolution
    const temperatureTrimmed = largestTriangleThreeBuckets(temperatureInputs, downsampledCount);
    const humidityTrimmed = largestTriangleThreeBuckets(humidityInputs, downsampledCount);
    const pressureTrimmed = largestTriangleThreeBuckets(pressureInputs, downsampledCount);

    const newReadings: IReading[] = temperatureTrimmed.map((temperatureReading, i) => {
      const humidityReading = humidityTrimmed[i];
      const pressureReading = pressureTrimmed[i];

      return {
        // Unfortunately, due to how lttb works, you can downsample only 1 X and Y value at a time.
        // Lttb will select points from different dates (X value) from each dataset.
        // If you save the results into the same time point (X), some values will then be slightly shifted.
        // The alternative is to use different X axis for each dataset. But then the chart tooltip won't work properly...
        createdAt: temperatureReading[0] as Date,
        temperature_BMP: temperatureReading[1] as number,
        temperature_DHT: temperatureReading[1] as number,
        humidity_DHT: humidityReading[1] as number,
        pressure_BMP: pressureReading[1] as number,

        // gotta make something up, so that typescript is happy
        id: 1,
      };
    });

    console.log("Trimmed: ", newReadings);

    props.setReadingsHistory(newReadings);
  }

  // create button for each range entry in buttonTimes
  const buttonElements: JSX.Element[] = [];
  for (const buttonText in buttonTimes) {
    buttonElements.push(
      <button onClick={clickSelectRange} key={buttonText}>
        {buttonText}
      </button>
    );
  }

  return (
    <section className="historyControls">
      {buttonElements}
      <div className="monthSelection">
        <p>Historická data:ㅤ</p>
        <select onChange={handleSelectChange}>
          <option value="none">--Vyberte měsíc--</option>
          {options}
        </select>
      </div>
    </section>
  );
}
