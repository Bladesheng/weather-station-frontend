import React, { useState, useEffect } from "react";

import { IReading } from "@api/api";

import { Storage } from "@utils/storage";
import { labelCb, titleCb } from "@utils/chart-tooltip-callbacks";
import { ChartPluginCrosshair, CrosshairOptions } from "@utils/chart-plugin-crosshair";
import { CursorPositioner } from "@utils/chart-positioner-cursor";
import { chartColors } from "@utils/colors";

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Legend,
  Tooltip,
  ChartOptions,
  LegendItem,
  ChartEvent,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(
  // line chart
  LineController,
  LineElement,
  PointElement,

  TimeScale, // x scale - point are not spread equidistantly
  LinearScale, // y scale

  ChartPluginCrosshair,
  Legend,
  Tooltip
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
      y1: {
        grid: {
          color: chartColors.grid,
        },
        position: "left",
        title: {
          display: true,
          text: "Teplota [˚C]",
        },
      },
      y2: {
        grid: {
          drawOnChartArea: false,
        },
        position: "right",
        title: {
          display: true,
          text: "Relativní vlhkost [%]",
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
        onClick: (e: ChartEvent, legendItem: LegendItem) => {
          // toggle visibility of the dataset on click and save the state
          const clickedDataset = legendItem.text as keyof typeof datasetHidden;
          const datasetHiddenCopy = structuredClone(datasetHidden);

          datasetHiddenCopy[clickedDataset] = !datasetHidden[clickedDataset];

          setDatasetHidden(datasetHiddenCopy);
        },

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
        label: "Teplota",
        data: readings_temperature_avg,
        yAxisID: "y1",
        hidden: datasetHidden["Teplota"],

        backgroundColor: "brown",
        borderColor: "brown",

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "brown",
        pointHoverBorderColor: "brown",
      },
      {
        label: "Teplota BMP",
        data: readings_temperature_BMP,
        yAxisID: "y1",
        hidden: datasetHidden["Teplota BMP"],

        backgroundColor: "red",
        borderColor: "red",

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "red",
        pointHoverBorderColor: "red",
      },
      {
        label: "Teplota DHT",
        data: readings_temperature_DHT,
        yAxisID: "y1",
        hidden: datasetHidden["Teplota DHT"],

        backgroundColor: "orange",
        borderColor: "orange",

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "orange",
        pointHoverBorderColor: "orange",
      },
      {
        label: "Vlhkost",
        data: readings_humidity_DHT,
        yAxisID: "y2",
        hidden: datasetHidden["Vlhkost"],

        backgroundColor: "blue",
        borderColor: "blue",

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "blue",
      },
    ],
  };

  return <Line options={options} data={data} />;
}
