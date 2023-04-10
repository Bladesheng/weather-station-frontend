// for the local storage API:
// @vitest-environment jsdom

import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchReadingsRange } from "@api/api";

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
      quality: {
        id: 2,
        status: "normal",
      },
      qualityId: 2,
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
