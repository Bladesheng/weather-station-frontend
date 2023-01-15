import React from "react";

import { IReading } from "../api";

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
  TimeSeriesScale
);

const gridColor = "rgb(50, 50, 50)";

const options = {
  responsive: true,
  scales: {
    x: {
      type: "time" as const,
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
};

type IProps = {
  readings: IReading[];
};

export default function ReadingsChart(props: IProps) {
  const readings_temperature_BMP = props.readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.temperature_BMP,
    };
  });
  const readings_temperature_DHT = props.readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.temperature_DHT,
    };
  });
  const readings_pressure_BMP = props.readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.pressure_BMP,
    };
  });
  const readings_humidity_DHT = props.readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.humidity_DHT,
    };
  });

  const data = {
    labels: [],
    datasets: [
      {
        label: "Teplota (BMP)",
        data: readings_temperature_BMP,
        backgroundColor: "lightblue",
        borderColor: "lightblue",
      },
      {
        label: "Teplota (DHT)",
        data: readings_temperature_DHT,
        backgroundColor: "blue",
        borderColor: "blue",
      },
      {
        label: "Tlak",
        data: readings_pressure_BMP,
        backgroundColor: "red",
        borderColor: "purple",
        hidden: true,
      },
      {
        label: "Vlhkost",
        data: readings_humidity_DHT,
        backgroundColor: "cyan",
        borderColor: "blue",
        hidden: true,
      },
    ],
  };
  return <Line options={options} data={data} />;
}
