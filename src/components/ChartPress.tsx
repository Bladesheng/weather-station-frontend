import React from "react";

import { IReading } from "@api/api";

import { labelCb, titleCb } from "@utils/chart-tooltip-callbacks";
import { ChartPluginCrosshair, CrosshairOptions } from "@utils/chart-plugin-crosshair";
import { CursorPositioner } from "@utils/chart-positioner-cursor";
import { chartColors } from "@utils/colors";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale,
  TimeSeriesScale,
  ChartPluginCrosshair
);

type IProps = {
  readings: IReading[];
};

export default function ReadingsChart(props: IProps) {
  const readings_pressure_BMP = props.readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.pressure_BMP / 100, // unit conversion from Pa to hPa
    };
  });

  Tooltip.positioners.cursor = CursorPositioner;

  // extend options
  const options: ChartOptions<"line"> & { plugins: { crosshair: CrosshairOptions } } = {
    animation: false,
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          displayFormats: { hour: "HH:mm" },
        },

        grid: {
          color: chartColors.grid,
        },
      },
      y: {
        grid: {
          color: chartColors.grid,
        },
        title: {
          display: true,
          text: "Tlak [hPa]",
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

      legend: {
        onHover: (event: any) => {
          event.native.target.style.cursor = "pointer";
        },
        onLeave: (event: any) => {
          event.native.target.style.cursor = "default";
        },
      },

      tooltip: {
        position: "cursor",
        callbacks: {
          label: labelCb,
          title: titleCb,
        },
      },
    },
  };

  const data = {
    labels: [],
    datasets: [
      {
        label: "Tlak",
        data: readings_pressure_BMP,

        backgroundColor: "purple",
        borderColor: "purple",

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "purple",
        pointHoverBorderColor: "purple",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
