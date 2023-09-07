import React from "react";

import { labelCb, titleCb } from "@lib/chart-tooltip-callbacks";
import { ChartPluginCrosshair, CrosshairOptions } from "@lib/chart-plugin-crosshair";
import { CursorPositioner } from "@lib/chart-positioner-cursor";

import { chartColors } from "@config/colors";

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  TimeScale,
  LinearScale,
  Legend,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart } from "react-chartjs-2";

import { cs } from "date-fns/locale";

ChartJS.register(
  // line chart
  LineController,
  LineElement,
  PointElement,

  BarController,
  BarElement,

  TimeScale, // x scale - point are not spread equidistantly
  LinearScale, // y scale

  ChartPluginCrosshair,
  Legend,
  Tooltip,
  zoomPlugin
);

type IProps = {
  forecast: IForecast[] | undefined;
};

export default function ChartForecast(props: IProps) {
  const forecast = props.forecast ?? [];

  const forecast_temperatures = forecast.map((forecastTimePoint) => {
    return {
      x: forecastTimePoint.time,
      y: forecastTimePoint.data.instant.details.air_temperature,
    };
  });
  const forecast_precipitation = forecast.map((forecastTimePoint) => {
    const precipitation1hr = forecastTimePoint.data?.next_1_hours?.details?.precipitation_amount;
    const precipitation6hr = forecastTimePoint.data?.next_6_hours?.details?.precipitation_amount;

    // Preferably use the 1 hour precipitation data. Otherwise use the 6 hour data.
    let precipitation = precipitation1hr !== undefined ? precipitation1hr : precipitation6hr;

    if (precipitation === undefined) {
      // if 1hr and 6hr are undefined, "precipitation" will be undefined too
      console.warn("No precipitation data found for: ", forecastTimePoint);
      precipitation = 0;
    }

    return {
      x: forecastTimePoint.time,
      y: precipitation,
    };
  });

  Tooltip.positioners.cursor = CursorPositioner;

  // extend options
  const options: ChartOptions<"line" | "bar"> & { plugins: { crosshair: CrosshairOptions } } = {
    animation: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          minUnit: "hour",
          displayFormats: { hour: "HH" },
        },
        adapters: {
          date: {
            locale: cs,
          },
        },

        offset: false, // no extra whitespace at start and end of x axis
        grid: {
          color: chartColors.greyBorder,
        },
      },

      y1: {
        display: "auto",
        grid: {
          color: chartColors.greyBorder,
        },
        position: "left",
        title: {
          display: true,
          text: "Teplota [˚C]",
        },
      },
      y2: {
        display: "auto",
        grid: {
          drawOnChartArea: false,
        },
        position: "right",
        title: {
          display: true,
          text: "Srážky [mm]",
        },
      },
    },

    interaction: {
      intersect: false, // always show tooltip
      mode: "index", // show all datasets on tooltip
    },

    plugins: {
      crosshair: {
        horizontal: false,
      },

      tooltip: {
        position: "cursor",
        callbacks: {
          label: labelCb,
          title: titleCb,
        },
      },

      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },

        limits: {
          x: {
            min: "original",
            max: "original",
          },
          y: {
            min: "original",
            max: "original",
          },
        },

        zoom: {
          mode: "x",
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
        },
      },
    },
  };

  const data: ChartData<"line" | "bar", { x: Date; y: number }[]> = {
    labels: [],
    datasets: [
      {
        type: "line",

        label: "Teplota",
        data: forecast_temperatures,
        yAxisID: "y1",

        backgroundColor: chartColors.lineRed,
        borderColor: chartColors.lineRed,

        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.lineRed,
        pointHoverBorderColor: chartColors.lineRed,
      },
      {
        type: "bar",

        label: "Srážky",
        data: forecast_precipitation,
        yAxisID: "y2",

        barThickness: "flex",
        categoryPercentage: 1,
        barPercentage: 1,

        backgroundColor: chartColors.lineBlue,
        borderColor: chartColors.lineBlue,
      },
    ],
  };

  return <Chart type="bar" options={options} data={data} />;
}
