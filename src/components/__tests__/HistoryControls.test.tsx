// @vitest-environment jsdom

import React from "react";

import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

import HistoryControls, { dateFrom } from "@components/HistoryControls";

describe.concurrent("HistoryControls suite", () => {
  afterEach(() => {
    cleanup();
  });

  it("Should fetch readings and save the selection to localstorage when button is clicked", async () => {
    vi.mock("@api/api", () => {
      return {
        fetchReadingsRange: vi.fn(),
      };
    });

    vi.mock("@api/storage", () => {
      const storageMock = {};

      Object.defineProperty(storageMock, "lastRange", {
        set: vi.fn(),
        get: vi.fn(() => ""),
      });

      return {
        Storage: storageMock,
      };
    });

    const setReadingsHistoryMock = vi.fn();

    const api = await import("@api/api");
    const storage = await import("@api/storage");

    render(<HistoryControls readingsHistory={[]} setReadingsHistory={setReadingsHistoryMock} />);

    const downloadBtn: HTMLButtonElement = screen.getByRole("button", {
      name: "12 hodin",
    });
    fireEvent.click(downloadBtn);
    await Promise.resolve(); // the click is asynchronous for some reason

    expect(api.fetchReadingsRange).toHaveBeenCalledTimes(1);
    expect(setReadingsHistoryMock).toHaveBeenCalledTimes(1);

    const setter = Object.getOwnPropertyDescriptor(storage.Storage, "lastRange")?.set;
    expect(setter).toHaveBeenCalledTimes(1);
  });

  it("Should create dropdown options for previous month and first month ever", () => {
    const setReadingsHistoryMock = vi.fn();
    render(<HistoryControls readingsHistory={[]} setReadingsHistory={setReadingsHistoryMock} />);

    const monthsDropdown: HTMLSelectElement = screen.getByRole("combobox");

    const monthNames = [
      "Leden",
      "Únor",
      "Březen",
      "Duben",
      "Květen",
      "Červen",
      "Červenec",
      "Srpen",
      "Září",
      "Říjen",
      "Listopad",
      "Prosinec",
    ];

    const previousMonth = monthNames[new Date().getMonth() - 1];
    const currentYear = new Date().getFullYear();

    const firstReadingDate = new Date(dateFrom);
    const firstMonth = monthNames[firstReadingDate.getMonth()];
    const firstYear = firstReadingDate.getFullYear();

    expect(monthsDropdown.textContent).to.contain(`${previousMonth} ${currentYear}`);
    expect(monthsDropdown.textContent).to.contain(`${firstMonth} ${firstYear}`);
  });
});
