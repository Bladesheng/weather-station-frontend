import { Storage } from "@api/storage";

export type IReading = {
  id: number;
  createdAt: Date;

  temperature_BMP: number;
  temperature_DHT: number;
  pressure_BMP: number;
  humidity_DHT: number;

  qualityId: number;
  quality: {
    id: number;
    status: string;
  };
};

export async function fetchReadingsRange(
  start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // from 24 hours ago (miliseconds)
  end = new Date(), // up until now
  status = "normal"
) {
  // DEV ONLY
  //start = new Date("2022-11-27T12:30");
  //end = new Date("2022-11-28T12:30");
  //status = "dev";
  //const domain = "localhost:8080";

  const domain = "weather-station-backend.fly.dev";
  const url = `https://${domain}/api/readings/range?start=${start.toISOString()}&end=${end.toISOString()}&status=${status}`;

  let readings: IReading[] = [];
  try {
    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
    }

    readings = await res.json();
  } catch (error) {
    // fetch throws errors for network errors (e.g., not connected to the internet)
    console.warn("There has been a network error with fetch request: ", error);

    readings = Storage.readings; // this will either return cached readings or empty array if nothing was cached
  }

  // convert date strings to date objects
  for (const reading of readings) {
    reading.createdAt = new Date(reading.createdAt);
  }

  console.log("Readings: ", readings);
  return readings;
}

export type IForecast = {
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number;
        air_temperature: number;
        cloud_area_fraction: number;
        relative_humidity: number;
        wind_from_direction: number;
        wind_speed: number;
      };
    };
    next_1_hours: {
      details: {
        precipitation_amount: number;
      };
      summary: {
        symbol_code: string;
      };
    };
    next_6_hours: {
      details: {
        precipitation_amount: number;
      };
      summary: {
        symbol_code: string;
      };
    };
  };

  time: Date;
};

export type ISunrise = {
  date: Date;
  sunrise: {
    desc: string;
    time: Date;
  };
  sunset: {
    desc: string;
    time: Date;
  };

  high_moon: object;
  low_moon: object;
  moonphase: object;
  moonposition: object;
  moonrise: object;
  moonset: object;
  moonshadow: object;
  solarmidnight: object;
  solarnoon: object;
};

export async function fetchForecast() {
  const domain = "weather-station-backend.fly.dev";
  //const domain = "localhost:8080";
  const url = `https://${domain}/api/forecast`;

  let forecast: IForecast[] = [];
  let sunrise: ISunrise[] = [];

  try {
    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    forecast = data.forecast;
    sunrise = data.sunrise;
  } catch (error) {
    // fetch throws errors for network errors (e.g., not connected to the internet)
    console.warn("There has been a network error with fetch request: ", error);
  }

  // delete the last day because it is sometimes missing some properties
  sunrise.pop();

  // convert date strings to date objects
  for (const timePoint of forecast) {
    timePoint.time = new Date(timePoint.time);
  }
  for (const day of sunrise) {
    day.date = new Date(day.date);
    day.sunrise.time = new Date(day.sunrise.time);
    day.sunset.time = new Date(day.sunset.time);
  }

  console.log("Forecast: ", forecast);
  console.log("Sunrise: ", sunrise);
  return { forecast, sunrise };
}
