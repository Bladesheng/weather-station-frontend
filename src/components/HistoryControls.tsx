import React, { useEffect } from "react";
import { subMonths } from "date-fns";
import { Storage } from "@api/storage";
import { fetchReadingsRange, fetchMonth } from "@api/api";
import { largestTriangleThreeBuckets } from "@utils/lttb";

const BUTTON_TIMES = {
  "12 hodin": 12 * 60 * 60 * 1000,
  "24 hodin": 24 * 60 * 60 * 1000,
  "2 dny": 2 * 24 * 60 * 60 * 1000,
  "7 dní": 7 * 24 * 60 * 60 * 1000,
};

const MONTH_NAMES = [
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

/**
 * Returns how many months are there between 2 dates
 */
function monthDiff(dateFrom: Date, dateTo: Date) {
  return (
    dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear())
  );
}

export const FIRST_READING_EVER = new Date("2022-07-02T20:00:00.000Z");
const numberOfMonths = monthDiff(FIRST_READING_EVER, new Date());
// array of months between now and first reading ever
const months: Date[] = [];
for (let i = 0; i <= numberOfMonths; i++) {
  const lastMonthDate = subMonths(new Date(), i);
  months[i] = lastMonthDate;
}

const options = months.map((date, index) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = MONTH_NAMES[month];

  return (
    <option value={`${year}-${month + 1}`} key={index}>
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
    if (props.readingsHistory.length === 0 && Storage.lastRange !== 0) {
      selectRange(Storage.lastRange);
    }
  }, []);

  /**
   * Display readings from given time untill now
   */
  async function selectRange(startTime: number) {
    const readings = await fetchReadingsRange(new Date(Date.now() - startTime));

    props.setReadingsHistory(readings);

    // remember the last selection to load it when you refresh page
    Storage.lastRange = startTime;
  }

  /**
   * Display readings from selected month
   */
  async function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.value === "none") return; // the first preselected option

    const [year, month] = e.currentTarget.value.split("-");

    const readings = await fetchMonth(year, month);

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

  // create button for each range entry in BUTTON_TIMES
  const buttonElements = Object.entries(BUTTON_TIMES).map<JSX.Element>(([buttonText, time]) => {
    return (
      <button
        onClick={() => {
          selectRange(time);
        }}
        key={buttonText}
      >
        {buttonText}
      </button>
    );
  });

  return (
    <section className="historyControls">
      {buttonElements}
      <div className="monthSelection">
        <p>Historická data:&nbsp;</p>
        <select onChange={handleSelectChange}>
          <option value="none">--Vyberte měsíc--</option>
          {options}
        </select>
      </div>
    </section>
  );
}
