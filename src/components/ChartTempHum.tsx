import React, { useState, useEffect } from "react";

import { IReading } from "../api";

import { Storage } from "../Storage";

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
  LegendItem,
  ChartEvent,
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

type IProps = {
  readings: IReading[];
};

export default function ReadingsChart(props: IProps) {
  const [datasetHidden, setDatasetHidden] = useState(Storage.datasetHidden);

  useEffect(() => {
    // save visibility preferences in local storage
    Storage.datasetHidden = datasetHidden;
  }, [datasetHidden]);

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

  const gridColor = "rgb(50, 50, 50)";

  const options: ChartOptions<"line"> = {
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
      y1: {
        grid: {
          color: gridColor,
        },
        position: "left",
      },
      y2: {
        grid: {
          drawOnChartArea: false,
        },
        position: "right",
      },
    },

    plugins: {
      legend: {
        onClick: (e: ChartEvent, legendItem: LegendItem) => {
          // toggle visibility of the dataset on click and save the state
          const clickedDataset = legendItem.text as keyof typeof datasetHidden;
          const datasetHiddenCopy = structuredClone(datasetHidden);

          datasetHiddenCopy[clickedDataset] = !datasetHidden[clickedDataset];

          setDatasetHidden(datasetHiddenCopy);
        },
      },
    },
  };

  const data = {
    labels: [],
    datasets: [
      {
        label: "Teplota (Průměr)",
        data: readings_temperature_avg,
        backgroundColor: "brown",
        borderColor: "brown",
        hidden: datasetHidden["Teplota (Průměr)"],
        yAxisID: "y1",
      },
      {
        label: "Teplota (BMP)",
        data: readings_temperature_BMP,
        backgroundColor: "red",
        borderColor: "red",
        hidden: datasetHidden["Teplota (BMP)"],
        yAxisID: "y1",
      },
      {
        label: "Teplota (DHT)",
        data: readings_temperature_DHT,
        backgroundColor: "orange",
        borderColor: "orange",
        hidden: datasetHidden["Teplota (DHT)"],
        yAxisID: "y1",
      },
      {
        label: "Vlhkost (DHT)",
        data: readings_humidity_DHT,
        backgroundColor: "blue",
        borderColor: "blue",
        hidden: datasetHidden["Vlhkost (DHT)"],
        yAxisID: "y2",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
