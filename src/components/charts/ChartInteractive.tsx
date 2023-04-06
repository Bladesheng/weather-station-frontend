import React, { useState, useEffect } from "react";

import { IReading } from "@api/api";
import { Storage } from "@api/storage";

import { labelCb, titleCb } from "@lib/chart-tooltip-callbacks";
import { ChartPluginCrosshair, CrosshairOptions } from "@lib/chart-plugin-crosshair";
import { CursorPositioner } from "@lib/chart-positioner-cursor";

import { chartColors } from "@config/colors";

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
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";

import { cs } from "date-fns/locale";

ChartJS.register(
  // line chart
  LineController,
  LineElement,
  PointElement,

  TimeScale, // x scale - point are not spread equidistantly
  LinearScale, // y scale

  ChartPluginCrosshair,
  Legend,
  Tooltip,
  zoomPlugin
);

type IProps = {
  readingsHistory: IReading[];
};

export default function ChartInteractive(props: IProps) {
  const [datasetHidden, setDatasetHidden] = useState(Storage.datasetHidden);
  const readings = props.readingsHistory;

  useEffect(() => {
    // save visibility preferences in local storage
    Storage.datasetHidden = datasetHidden;
  }, [datasetHidden]);

  const readings_temperature_avg = readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: (reading.temperature_BMP + reading.temperature_DHT) / 2, // average value of the 2 sensors
    };
  });
  const readings_temperature_BMP = readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.temperature_BMP,
    };
  });
  const readings_temperature_DHT = readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.temperature_DHT,
    };
  });
  const readings_humidity_DHT = readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.humidity_DHT,
    };
  });
  const readings_pressure_BMP = readings.map((reading) => {
    return {
      x: reading.createdAt,
      y: reading.pressure_BMP / 100, // unit conversion from Pa to hPa
    };
  });

  Tooltip.positioners.cursor = CursorPositioner;

  // extend options
  const options: ChartOptions<"line"> & { plugins: { crosshair: CrosshairOptions } } = {
    animation: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          minUnit: "hour",
          displayFormats: { hour: "HH:mm" },
        },
        adapters: {
          date: {
            locale: cs,
          },
        },

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
          text: "Relativní vlhkost [%]",
        },
      },
      y3: {
        display: "auto",
        grid: {
          drawOnChartArea: false,
        },
        position: "right",
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

      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          modifierKey: "ctrl",
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
          drag: {
            enabled: true,
          },

          pinch: {
            enabled: true,
          },
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

        backgroundColor: chartColors.lineRed,
        borderColor: chartColors.lineRed,

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.lineRed,
        pointHoverBorderColor: chartColors.lineRed,
      },
      {
        label: "Teplota BMP",
        data: readings_temperature_BMP,
        yAxisID: "y1",
        hidden: datasetHidden["Teplota BMP"],

        backgroundColor: chartColors.lineYellow,
        borderColor: chartColors.lineYellow,

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.lineYellow,
        pointHoverBorderColor: chartColors.lineYellow,
      },
      {
        label: "Teplota DHT",
        data: readings_temperature_DHT,
        yAxisID: "y1",
        hidden: datasetHidden["Teplota DHT"],

        backgroundColor: chartColors.lineOrange,
        borderColor: chartColors.lineOrange,

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.lineOrange,
        pointHoverBorderColor: chartColors.lineOrange,
      },
      {
        label: "Vlhkost",
        data: readings_humidity_DHT,
        yAxisID: "y2",
        hidden: datasetHidden["Vlhkost"],

        backgroundColor: chartColors.lineBlue,
        borderColor: chartColors.lineBlue,

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.lineBlue,
        pointHoverBorderColor: chartColors.lineBlue,
      },
      {
        label: "Tlak",
        data: readings_pressure_BMP,
        yAxisID: "y3",
        hidden: datasetHidden["Tlak"],

        backgroundColor: chartColors.linePurple,
        borderColor: chartColors.linePurple,

        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColors.linePurple,
        pointHoverBorderColor: chartColors.linePurple,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
