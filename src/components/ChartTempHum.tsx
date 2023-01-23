import React, { useState, useEffect } from "react";

import { IReading } from "@api/api";

import { Storage } from "@utils/storage";
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
  TimeSeriesScale,
  ChartPluginCrosshair
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

  Tooltip.positioners.cursor = CursorPositioner;

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
          color: chartColors.grid,
        },
      },
      y1: {
        grid: {
          color: chartColors.grid,
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

    interaction: {
      intersect: false, // always show tooltip
      mode: "index", // show all datasets on tooltip
    },

    plugins: {
      crosshair: {
        horizontal: false,
      },

      legend: {
        onClick: (e: ChartEvent, legendItem: LegendItem) => {
          // toggle visibility of the dataset on click and save the state
          const clickedDataset = legendItem.text as keyof typeof datasetHidden;
          const datasetHiddenCopy = structuredClone(datasetHidden);

          datasetHiddenCopy[clickedDataset] = !datasetHidden[clickedDataset];

          setDatasetHidden(datasetHiddenCopy);
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
        label: "Teplota",
        data: readings_temperature_avg,
        backgroundColor: "brown",
        borderColor: "brown",
        hidden: datasetHidden["Teplota"],
        yAxisID: "y1",
      },
      {
        label: "Teplota BMP",
        data: readings_temperature_BMP,
        backgroundColor: "red",
        borderColor: "red",
        hidden: datasetHidden["Teplota BMP"],
        yAxisID: "y1",
      },
      {
        label: "Teplota DHT",
        data: readings_temperature_DHT,
        backgroundColor: "orange",
        borderColor: "orange",
        hidden: datasetHidden["Teplota DHT"],
        yAxisID: "y1",
      },
      {
        label: "Vlhkost",
        data: readings_humidity_DHT,
        backgroundColor: "blue",
        borderColor: "blue",
        hidden: datasetHidden["Vlhkost"],
        yAxisID: "y2",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
