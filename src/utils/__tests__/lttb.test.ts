import { describe, expect, it } from "vitest";

import { largestTriangleThreeBuckets } from "@utils/lttb";

describe.concurrent("Largets-Triangle-Three-Buckets suite", () => {
  it("Should downsample data with numbers on x-axis", () => {
    const dummyDataSeries = [
      [1, 2],
      [2, 2],
      [3, 3],
      [4, 3],
      [5, 6],
      [6, 3],
      [7, 3],
      [8, 5],
      [9, 4],
      [10, 4],
      [11, 1],
      [12, 2],
    ];

    const downsampledSeries = largestTriangleThreeBuckets(dummyDataSeries, 3);

    expect(downsampledSeries).toEqual([
      [1, 2],
      [5, 6],
      [12, 2],
    ]);
  });

  it("Should downsample data with dates on x-axis ", () => {
    const dummyDataSeries = [
      [new Date("2023-05-08T13:50:15.208Z"), 2],
      [new Date("2023-05-09T13:50:15.208Z"), 2],
      [new Date("2023-05-10T13:50:15.208Z"), 3],
      [new Date("2023-05-11T13:50:15.208Z"), 3],
      [new Date("2023-05-12T13:50:15.208Z"), 6],
      [new Date("2023-05-13T13:50:15.208Z"), 3],
      [new Date("2023-05-14T13:50:15.208Z"), 3],
      [new Date("2023-05-15T13:50:15.208Z"), 5],
      [new Date("2023-05-16T13:50:15.208Z"), 4],
      [new Date("2023-05-17T13:50:15.208Z"), 4],
      [new Date("2023-05-18T13:50:15.208Z"), 1],
      [new Date("2023-05-19T13:50:15.208Z"), 2],
    ];

    const downsampledSeries = largestTriangleThreeBuckets(dummyDataSeries, 3);

    expect(downsampledSeries).toEqual([
      [new Date("2023-05-08T13:50:15.208Z"), 2],
      [new Date("2023-05-12T13:50:15.208Z"), 6],
      [new Date("2023-05-19T13:50:15.208Z"), 2],
    ]);
  });
});
