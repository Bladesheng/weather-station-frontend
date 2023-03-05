import { IReading } from "@api/api";

// Module for interfacing with Local Storage API
export const Storage = (() => {
  // default values
  let datasetHidden = {
    Teplota: false,
    "Teplota BMP": true,
    "Teplota DHT": true,
    Vlhkost: false,
  };
  let readings: IReading[] = [];

  // save everything to Local Storage
  function _save() {
    localStorage.setItem("datasetHidden", JSON.stringify(datasetHidden));
    localStorage.setItem("readings", JSON.stringify(readings));
  }

  // retrieve everything from Local Storage on startup
  function init() {
    const rawDatasetHidden = localStorage.getItem("datasetHidden");
    const rawReadings = localStorage.getItem("readings");

    // if there is something saved,
    // retrieve it instead of using the default values
    if (rawDatasetHidden !== null) {
      datasetHidden = JSON.parse(rawDatasetHidden);
    }
    if (rawReadings !== null) {
      readings = JSON.parse(rawReadings);
    }
  }

  return {
    init,

    set datasetHidden(newDatasetHidden: typeof datasetHidden) {
      datasetHidden = newDatasetHidden;
      _save();
    },
    get datasetHidden() {
      return datasetHidden;
    },

    set readings(newReadings: typeof readings) {
      readings = newReadings;
      _save();
    },
    get readings() {
      return readings;
    },
  };
})();
