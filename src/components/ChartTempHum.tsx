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
    y1: {
      grid: {
        color: gridColor,
      },
      position: "left" as const,
    },
    y2: {
      grid: {
        drawOnChartArea: false,
      },
      position: "right" as const,
    },
  },
};

type IProps = {
  readings: IReading[];
};

export default function ReadingsChart(props: IProps) {
  const readings_temperature_avg = props.readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: (reading.temperature_BMP + reading.temperature_DHT) / 2, // average value of the 2 sensors
    };
  });

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
        label: "Teplota (Průměr)",
        data: readings_temperature_avg,
        backgroundColor: "brown",
        borderColor: "brown",
        yAxisID: "y1",
      },
      {
        label: "Teplota (BMP)",
        data: readings_temperature_BMP,
        backgroundColor: "red",
        borderColor: "red",
        hidden: true,
        yAxisID: "y1",
      },
      {
        label: "Teplota (DHT)",
        data: readings_temperature_DHT,
        backgroundColor: "orange",
        borderColor: "orange",
        hidden: true,
        yAxisID: "y1",
      },
      {
        label: "Vlhkost",
        data: readings_humidity_DHT,
        backgroundColor: "blue",
        borderColor: "blue",
        yAxisID: "y2",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
