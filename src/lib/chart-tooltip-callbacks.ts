import { TooltipItem } from "chart.js";

import { padDate } from "@utils/formatDate";

export function labelCb(context: TooltipItem<"line">) {
  const datasetName = context.dataset.label;

  let label = datasetName || "";

  if (label) {
    label += ": ";
  }

  if (context.parsed.y !== null) {
    // label += new Intl.NumberFormat("en-US", {
    //   style: "currency",
    //   currency: "USD",
    // }).format(context.parsed.y);

    label += context.parsed.y.toFixed(1); // the numeric value itself. 2 decimal positions

    switch (datasetName) {
      case "Teplota":
      case "Teplota BMP":
      case "Teplota DHT":
        label += " ˚C";
        break;
      case "Vlhkost":
        label += " %";
        break;
      case "Tlak":
        label += " hPa";
        break;
      case "Srážky":
        label += " mm";
        break;
    }
  }

  return label;
}

export function titleCb(datasets: TooltipItem<"line">[]) {
  const date = new Date(datasets[0].parsed.x);

  const { hours, minutes, seconds, dayOfMonth, month, year } = padDate(date);

  return `${hours}:${minutes}    ${dayOfMonth}.${month}.${year}`;
}
