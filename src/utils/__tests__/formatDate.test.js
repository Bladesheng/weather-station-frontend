import { describe, expect, it } from "vitest";

import { padWithZeroes, padDate } from "@utils/formatDate";

describe.concurrent("padWithZeroes suite", () => {
  it("Should return number padded with zeroes", () => {
    expect(padWithZeroes(2)).toEqual("02");
    expect(padWithZeroes(22)).toEqual("22");
  });
});

describe.concurrent("padDate suite", () => {
  it("Should return padded strings from date", () => {
    const date = new Date("2023-04-07T07:05:09.907Z");
    const { hours, minutes, seconds, dayOfMonth, month, year } = padDate(date);

    expect(seconds).toEqual("09");
    expect(minutes).toEqual("05");
    expect(hours).toEqual("07");

    expect(dayOfMonth).toEqual("07");
    expect(month).toEqual("04");
    expect(year).toBe("2023");
  });
});
