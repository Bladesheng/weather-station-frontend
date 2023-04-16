// for the local storage API:
// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { Storage } from "@api/storage";

describe.concurrent("Storage suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("Should return default values when nothing is saved", () => {
    const { datasetHidden, readings, lastRange } = Storage;

    expect(datasetHidden).toEqual({
      Teplota: false,
      "Teplota BMP": true,
      "Teplota DHT": true,
      Vlhkost: false,
      Tlak: false,
    });
    expect(readings).toEqual([]);
    expect(lastRange).toEqual("");
  });

  it("Should return values", () => {
    localStorage.setItem("lastRange", JSON.stringify("12 hodin"));

    expect(Storage.lastRange).toEqual("12 hodin");
  });

  it("Should save values", () => {
    Storage.lastRange = "24 hodin";

    //@ts-ignore
    expect(JSON.parse(localStorage.getItem("lastRange"))).toEqual("24 hodin");
  });

  it("Should work both ways", () => {
    Storage.lastRange = "2 dny";

    const lastRange = Storage.lastRange;

    expect(lastRange).toEqual("2 dny");
  });
});
