// @vitest-environment jsdom

import React from "react";

import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import Dashboard from "@components/Dashboard";

describe.concurrent("Dashboard suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
  });

  const readings = [
    {
      createdAt: new Date(Date.now() - 3 * 60 * 1000 + 100), // 3 minutes ago
      humidity_DHT: 56.123,
      id: 23,
      pressure_BMP: 98874.456,
      temperature_BMP: 22.00654,
      temperature_DHT: 22,
    },
    {
      createdAt: new Date(Date.now() - 8 * 60 * 1000 + 100), // 8 minutes ago
      humidity_DHT: 52.123,
      id: 22,
      pressure_BMP: 97874.456,
      temperature_BMP: 23.00654,
      temperature_DHT: 23,
    },
    {
      createdAt: new Date(Date.now() - 13 * 60 * 1000 + 100), // 13 minutes ago
      humidity_DHT: 54.123,
      id: 21,
      pressure_BMP: 99874.456,
      temperature_BMP: 21.00654,
      temperature_DHT: 21,
    },
  ];
  const newReading = {
    createdAt: new Date(Date.now() - 1 * 60 * 1000 + 100), // 1 minute ago
    humidity_DHT: 62.123,
    id: 23,
    pressure_BMP: 94874.456,
    temperature_BMP: 19.00654,
    temperature_DHT: 19,
  };

  const readingsStatic = [
    {
      createdAt: new Date("2023-04-11T16:45:15.103Z"),
      humidity_DHT: 56.123,
      id: 23,
      pressure_BMP: 98874.456,
      temperature_BMP: 22.00654,
      temperature_DHT: 22,
    },
    {
      createdAt: new Date("2023-04-11T16:40:15.103Z"),
      humidity_DHT: 57.123,
      id: 22,
      pressure_BMP: 97874.456,
      temperature_BMP: 21.00654,
      temperature_DHT: 21,
    },
  ];
  const newReadingStatic = {
    createdAt: new Date("2023-04-11T16:50:15.103Z"),
    humidity_DHT: 62.123,
    id: 23,
    pressure_BMP: 94874.456,
    temperature_BMP: 19.00654,
    temperature_DHT: 19,
  };

  it("Should always display temperature and humidity of last reading + min / max of last 24 h", () => {
    const { rerender } = render(<Dashboard readings={readings} />);

    expect(screen.getByRole("temperature").textContent).toEqual("22 ˚C");
    expect(screen.getByRole("humidity").textContent).toEqual("56 %");
    expect(screen.getByRole("minMaxTemp").textContent).toEqual("21 / 23 ˚C");

    // add new reading
    const newReadings = [newReading, ...readings];
    rerender(<Dashboard readings={newReadings} />);

    expect(screen.getByRole("temperature").textContent).toEqual("19 ˚C");
    expect(screen.getByRole("humidity").textContent).toEqual("62 %");
    expect(screen.getByRole("minMaxTemp").textContent).toEqual("19 / 23 ˚C");
  });

  it("Should always display date of last reading", () => {
    // to have the same output regardless of where or when you run the test
    vi.spyOn(Date.prototype, "getHours").mockReturnValue(16);

    const { rerender } = render(<Dashboard readings={readingsStatic} />);

    expect(screen.getByRole("lastReadingDate").textContent).toEqual("16:45 (11.04.2023)");

    // add new reading
    const newReadingsStatic = [newReadingStatic, ...readingsStatic];
    rerender(<Dashboard readings={newReadingsStatic} />);

    expect(screen.getByRole("lastReadingDate").textContent).toEqual("16:50 (11.04.2023)");
  });

  it("Should display updating timer with time left until next reading", () => {
    const { rerender } = render(<Dashboard readings={readings} />);

    expect(screen.getByRole("timer").textContent).toEqual("02:00");

    setTimeout(() => {
      rerender(<Dashboard readings={readings} />);
      expect(screen.getByRole("timer").textContent).toEqual("01:55");
    }, 5000);
    vi.advanceTimersByTime(5000);

    // add new reading
    const newReadings = [newReading, ...readings];
    cleanup();
    render(<Dashboard readings={newReadings} />);

    expect(screen.getByRole("timer").textContent).toEqual("02:55");
  });
});
