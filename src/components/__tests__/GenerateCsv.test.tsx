// @vitest-environment jsdom

import React from "react";

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import GenerateCsv from "@components/GenerateCsv";

describe.concurrent("GenerateCsv suite", () => {
  if (typeof window.URL.createObjectURL === "undefined") {
    // createObjectURL is not yet implemented in jsdom
    window.URL.createObjectURL = vi.fn();
  }

  afterEach(() => {
    cleanup();
  });

  const readings = [
    {
      createdAt: new Date(),
      humidity_DHT: 56.123,
      id: 23,
      pressure_BMP: 98874.456,
      quality: {
        id: 2,
        status: "normal",
      },
      qualityId: 2,
      temperature_BMP: 22.00654,
      temperature_DHT: 22,
    },
  ];

  it("Should donwload the csv", () => {
    render(<GenerateCsv readingsHistory={readings} />);

    const anchorMock = {
      click: vi.fn(),
      href: undefined,
      download: undefined,
    } as unknown as HTMLAnchorElement;

    vi.spyOn(document, "createElement").mockImplementation(() => {
      return anchorMock;
    });

    const downloadBtn: HTMLButtonElement = screen.getByRole("button", {
      name: "CSV ↓",
    });
    fireEvent.click(downloadBtn);

    expect(anchorMock.click).toHaveBeenCalledTimes(1);
    expect(anchorMock.download).toEqual("data.csv");
    expect(anchorMock.href).toEqual("testUrl");
  });
});
