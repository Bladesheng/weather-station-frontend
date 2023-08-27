// for the local storage API:
// @vitest-environment jsdom

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchForecast, fetchReadingsRange } from "@api/api";

describe.concurrent("fetchReadingsRange suite", () => {
  beforeAll(() => {
    // supress the console log
    global.console.log = vi.fn();
    global.console.warn = vi.fn();
    global.console.error = vi.fn();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  const readingsMock = [
    {
      createdAt: new Date().toISOString(),
      humidity_DHT: 54.123,
      id: 21,
      pressure_BMP: 99874.456,
      temperature_BMP: 22.00654,
      temperature_DHT: 22,
    },
  ];

  it("Should return the mocked reading", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => {
          return Promise.resolve(structuredClone(readingsMock));
        },
      });
    });

    const readings = await fetchReadingsRange();

    expect(readings).not.toEqual(readingsMock); // because the date was transformed
    expect(readings[0].temperature_BMP).toEqual(readingsMock[0].temperature_BMP);
  });

  it("Should return readings from localstorage if there is network error", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      throw "net::ERR_INTERNET_DISCONNECTED";
    });

    localStorage.setItem("readings", JSON.stringify(readingsMock));

    const readings = await fetchReadingsRange();

    expect(readings).not.toEqual(readingsMock); // because the date was transformed
    expect(readings[0].temperature_BMP).toEqual(readingsMock[0].temperature_BMP);
  });

  it("Should return empty array if there is network error (and localstorage is clear)", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      throw "net::ERR_INTERNET_DISCONNECTED";
    });

    const readings = await fetchReadingsRange();

    expect(readings).toEqual([]);
  });

  it("Should return empty array if there is server error (and localstorage is clear)", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        statusText: "Not found",
        ok: false,
        json: "rip",
      });
    });

    const readings = await fetchReadingsRange();

    expect(readings).toEqual([]);
  });
});

describe.concurrent("fetchForecast suite", () => {
  beforeAll(() => {
    // supress the console log
    global.console.log = vi.fn();
    global.console.warn = vi.fn();
    global.console.error = vi.fn();
  });

  const responseMock = {
    forecast: [
      {
        time: new Date().toISOString(),
        data: {
          instant: {
            details: {
              air_temperature: 7,
            },
          },
        },
      },
    ],

    sunrise: [
      {
        date: new Date().toISOString(),
        sunrise: {
          time: new Date().toISOString(),
        },
        sunset: {
          time: new Date().toISOString(),
        },
      },
    ],
  };

  it("Should return the mocked response", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => {
          return Promise.resolve(structuredClone(responseMock));
        },
      });
    });

    const { forecast, sunrise } = await fetchForecast();

    expect(forecast).not.toEqual(responseMock.forecast); // because dates were transformed
    expect(sunrise).not.toEqual(responseMock.sunrise);

    expect(forecast[0].data.instant.details.air_temperature).toEqual(7);
  });

  it("Should return empty array if there is network error", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      throw "net::ERR_INTERNET_DISCONNECTED";
    });

    const { forecast, sunrise } = await fetchForecast();

    expect(forecast).toEqual([]);
    expect(sunrise).toEqual([]);
  });

  it("Should return empty array if there is server error", async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        status: 404,
        statusText: "Not found",
        ok: false,
        json: "rip",
      });
    });

    const { forecast, sunrise } = await fetchForecast();

    expect(forecast).toEqual([]);
    expect(sunrise).toEqual([]);
  });
});
