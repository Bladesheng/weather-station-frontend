import { Storage } from "@utils/storage";

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
    status: "string";
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
      throw new Error("Network response was not OK");
    }

    readings = await res.json();
  } catch (error) {
    // fetch throws errors for network errors (e.g., not connected to the internet)
    console.warn("There has been a network error with fetch request: ", error);

    readings = Storage.readings; // this will either return cached readings or empty array if nothing was cached
  }

  // converts date strings to date objects
  for (const reading of readings) {
    reading.createdAt = new Date(reading.createdAt);
  }

  console.log(readings);
  return readings;
}
