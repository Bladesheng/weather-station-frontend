import { Storage } from "@api/storage";

const API_URL = "https://weather-station-backend.fly.dev";

export async function fetchReadingsRange(
  start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // from 24 hours ago (miliseconds)
  end = new Date() // up until now
) {
  // DEVEL
  //start = new Date("2022-11-27T12:30");
  //end = new Date("2022-11-28T12:30");
  //const API_URL = "localhost:8080";

  const url = `${API_URL}/api/readings/range?start=${start.toISOString()}&end=${end.toISOString()}`;

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

export async function fetchLast24h() {
  const url = `${API_URL}/api/readings/24h`;

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

export async function fetchMonth(year: number | string, month: number | string) {
  const url = `${API_URL}/api/readings/month?year=${year}&month=${month}`;

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
    console.warn("There has been a network error with fetch request: ", error);
  }

  // convert date strings to date objects
  for (const reading of readings) {
    reading.createdAt = new Date(reading.createdAt);
  }

  console.log("Readings: ", readings);
  return readings;
}

export async function fetchForecast() {
  const url = `${API_URL}/api/forecast`;

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
