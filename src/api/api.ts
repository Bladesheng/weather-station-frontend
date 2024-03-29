import { Storage } from "@api/storage";

const API_URL = "https://weather-station-backend.fly.dev";

export class ReadingsAPI {
  public static async fetchRange(
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

  public static async fetchLast24h() {
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

  public static async fetchMonth(year: number | string, month: number | string) {
    const url = `${API_URL}/api/readings/month/decimated?year=${year}&month=${month}`;

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
}

export class ForecastAPI {
  public static async fetchForecast() {
    try {
      const url = `${API_URL}/api/forecast`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Network response was not OK: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const forecast: IForecast[] = data.forecast;
      const sunriseSunset: ISunrise = data.sunrise;

      // convert date strings to date objects
      for (const timePoint of forecast) {
        timePoint.time = new Date(timePoint.time);
      }
      sunriseSunset.sunrise = new Date(sunriseSunset.sunrise);
      sunriseSunset.sunset = new Date(sunriseSunset.sunset);

      console.log("Forecast: ", forecast);
      console.log("Sunrise: ", sunriseSunset);
      return { forecast, sunriseSunset };
    } catch (error) {
      // fetch throws errors for network errors (e.g., not connected to the internet)
      console.warn("There has been a network error with fetch request: ", error);
    }
  }
}
