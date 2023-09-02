import type { Reading } from "@typesCustom/readings";
import type { Forecast, Sunrise } from "@typesCustom/forecast";

declare global {
  type IReading = Reading;
  type IForecast = Forecast;
  type ISunrise = Sunrise;
}
