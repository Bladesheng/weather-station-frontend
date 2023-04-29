// @vitest-environment jsdom

import React from "react";

import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

import ForecastTable from "@components/ForecastTable";

import { IForecast, ISunrise } from "@api/api";

describe.concurrent("ForecastTable suite", () => {
  beforeAll(() => {
    // supress console log
    global.console.log = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  const forecastNow = [
    {
      time: new Date("2023-04-29T13:00:00.000Z"),
      data: {
        instant: {
          details: {
            air_pressure_at_sea_level: 1013.2,
            air_temperature: 14.3,
            cloud_area_fraction: 44.5,
            relative_humidity: 75.5,
            wind_from_direction: 302,
            wind_speed: 4.8,
          },
        },
        next_1_hours: {
          summary: {
            symbol_code: "partlycloudy_day",
          },
          details: {
            precipitation_amount: 0.2,
          },
        },
        next_6_hours: {
          summary: {
            symbol_code: "partlycloudy_day",
          },
          details: {
            precipitation_amount: 0.4,
          },
        },
      },
    },
  ] as IForecast[];

  const forecastLater = [
    {
      time: new Date("2023-05-08T13:00:00.000Z"),
      data: {
        instant: {
          details: {
            air_pressure_at_sea_level: 1021,
            air_temperature: 3.3,
            cloud_area_fraction: 95.3,
            relative_humidity: 90.8,
            wind_from_direction: 113.1,
            wind_speed: 1.6,
          },
        },
        next_6_hours: {
          summary: {
            symbol_code: "cloudy",
          },
          details: {
            precipitation_amount: 0,
          },
        },
      },
    },
  ] as IForecast[];

  const sunrise = [
    {
      date: new Date("2023-04-29T00:00:00.000Z"),
      sunrise: {
        desc: "LOCAL DIURNAL SUN RISE",
        time: new Date("2023-04-29T03:39:31.000Z"),
      },
      sunset: {
        desc: "LOCAL DIURNAL SUN SET",
        time: new Date("2023-04-29T18:17:08.000Z"),
      },
    },
    {
      date: new Date("2023-04-30T00:00:00.000Z"),
      sunrise: {
        desc: "LOCAL DIURNAL SUN RISE",
        time: new Date("2023-04-30T03:37:40.000Z"),
      },
      sunset: {
        desc: "LOCAL DIURNAL SUN SET",
        time: new Date("2023-04-30T18:18:43.000Z"),
      },
    },
  ] as ISunrise[];

  it("Should display one card for each day of forecast data", () => {
    render(<ForecastTable forecast={[...forecastNow, ...forecastLater]} sunrise={sunrise} />);

    expect(screen.getAllByRole("forecastCard").length).toEqual(2);
  });

  it("Should display correct values in card", () => {
    // to have the same output regardless of where or when you run the test
    vi.spyOn(Date.prototype, "getHours").mockReturnValue(15);

    render(<ForecastTable forecast={forecastNow} sunrise={sunrise} />);

    expect(screen.getByRole("heading").textContent).toEqual("Sobota 29.4.");

    expect(screen.getByRole("hours").textContent).toEqual("15");
    expect(screen.getByRole("temperature").textContent).toEqual("14˚");
    expect(screen.getByRole("precipitation").textContent).toEqual("0.2");
    expect(screen.getByRole("cloud").textContent).toEqual("45");
    expect(screen.getByRole("weatherIcon").attributes.item(2)?.value).toEqual(
      "./icons/weathericons/partlycloudy_day.svg"
    );
  });

  it("Should display correct sunrise time", () => {
    // to have the same output regardless of where or when you run the test
    vi.spyOn(Date.prototype, "getHours").mockReturnValue(5);

    render(<ForecastTable forecast={forecastNow} sunrise={sunrise} />);

    expect(screen.getByRole("sunriseTime").textContent).toEqual("05:39");
  });

  it("Should display hours in correct format when hourly data isn't available", () => {
    // to have the same output regardless of where or when you run the test
    vi.spyOn(Date.prototype, "getHours").mockReturnValue(15);

    render(<ForecastTable forecast={forecastLater} sunrise={sunrise} />);

    expect(screen.getByRole("hours").textContent).toEqual("15—21");
  });
});
