import { TooltipItem } from "chart.js";

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

    label += context.parsed.y.toFixed(2); // the numeric value itself. 2 decimal positions

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
    }
  }

  return label;
}

function padWithZeroes(originalNumber: number) {
  return String(originalNumber).padStart(2, "0");
}

export function titleCb(datasets: TooltipItem<"line">[]) {
  const date = new Date(datasets[0].parsed.x);

  const hours = padWithZeroes(date.getHours());
  const minutes = padWithZeroes(date.getMinutes());
  const dayOfMonth = padWithZeroes(date.getDate());
  const month = padWithZeroes(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes}    ${dayOfMonth}.${month}.${year}`;
}
