import React from "react";

import { IReading } from "@api/api";

import { ChartPluginCrosshair, CrosshairOptions } from "@utils/chart-plugin-crosshair";

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

const gridColor = "rgb(50, 50, 50)";

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

  // extend options
  const options: ChartOptions<"line"> & { plugins: { crosshair: CrosshairOptions } } = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          displayFormats: { hour: "HH:mm" },
        },

        grid: {
          color: gridColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
      },
    },

    plugins: {
      crosshair: {
        horizontal: false,
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
      },
    ],
  };

  return <Line options={options} data={data} />;
}
