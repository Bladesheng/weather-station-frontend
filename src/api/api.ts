export type IReading = {
  id: number;
  createdAt: string | Date;

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

export async function fetchReadingsRange(start: Date, end: Date, status: string) {
  try {
    // DEV ONLY
    //start = new Date("2022-11-27T12:30");
    //end = new Date("2022-11-28T12:30");
    //status = "dev";
    //const domain = "localhost:8080";

    const domain = "weather-station-backend.fly.dev";

    const url = `https://${domain}/api/readings/range?start=${start.toISOString()}&end=${end.toISOString()}&status=${status}`;

    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Network response was not OK");
    }

    const body: IReading[] = await res.json();

    for (const reading of body) {
      reading.createdAt = new Date(reading.createdAt); // convert string to date object for future use
    }

    console.log(body);
    return body;
  } catch (error) {
    console.error("There has been error with fetch request: ", error);
  }
}
