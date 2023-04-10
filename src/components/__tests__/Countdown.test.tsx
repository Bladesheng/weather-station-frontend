// @vitest-environment jsdom

import React from "react";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import Countdown from "@components/Countdown";

describe.concurrent("Countdown suite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("Should display time left", () => {
    const date = new Date(Date.now() + 3 * 60 * 1000 + 100); // 3 minutes from now

    const { rerender } = render(<Countdown targetDate={date} />);

    expect(screen.getByRole("timer").textContent).toEqual("03:00");

    setTimeout(() => {
      rerender(<Countdown targetDate={date} />);
      expect(screen.getByRole("timer").textContent).toEqual("02:55");
    }, 5000);
    vi.advanceTimersByTime(5000);
  });
});
