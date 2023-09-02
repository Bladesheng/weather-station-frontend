import React from "react";

type IProps = {
  readingsHistory: IReading[];
};

export default function GenerateCsv(props: IProps) {
  function downloadCsv() {
    // keep only usefull values
    const readings = props.readingsHistory.map((r) => {
      return {
        createdAt: r.createdAt.toISOString(),
        id: r.id,
        temperature_BMP: r.temperature_BMP,
        pressure_BMP: r.pressure_BMP,
        temperature_DHT: r.temperature_DHT,
        humidity_DHT: r.humidity_DHT,
      };
    });

    let csv = "";
    readings.forEach((row, i) => {
      const keysAmount = Object.keys(row).length;
      let keysCounter = 0; // for iterating over all the keys

      // if this is the first row, generate the headings
      if (i === 0) {
        for (const key in row) {
          csv += key + (keysCounter + 1 < keysAmount ? "," : "\r\n"); // don't add a comma at the last cell
          keysCounter++;
        }
      } else {
        for (const value of Object.values(row)) {
          csv += value + (keysCounter + 1 < keysAmount ? "," : "\r\n");
          keysCounter++;
        }
      }
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url !== undefined ? url : "testUrl"; // because window.URL.createObjectURL() is not yet implemented in jsdom, so it will return undefined during testing
    a.download = "data.csv";
    a.click(); // trigger the download
  }

  return (
    <button onClick={downloadCsv} className="csv">
      CSV ↓
    </button>
  );
}
