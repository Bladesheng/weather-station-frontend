import { describe, expect, it } from "vitest";

describe.concurrent("suite", () => {
  it("should output 2", () => {
    expect(1 + 1).toEqual(2);
  });
});
