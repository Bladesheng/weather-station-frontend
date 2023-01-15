export async function fetchReadingsRange(start: Date, end: Date, status: string) {
  try {
    // DEV ONLY
    start = new Date("2022-11-27T12:30");
    end = new Date("2022-11-28T12:30");

    const url = `http://localhost:8080/api/readings/range?start=${start.toISOString()}&end=${end.toISOString()}&status=${status}`;

    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Network response was not OK");
    }

    const body = await res.json();
    console.log(body);
    return body;
  } catch (error) {
    console.error("There has been error with fetch request: ", error);
  }
}
