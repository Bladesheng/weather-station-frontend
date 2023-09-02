// Module for interfacing with Local Storage API
export const Storage = (() => {
  type IdatasetHidden = {
    Teplota: boolean;
    "Teplota BMP": boolean;
    "Teplota DHT": boolean;
    Vlhkost: boolean;
    Tlak: boolean;
  };

  return {
    set datasetHidden(newData: IdatasetHidden) {
      localStorage.setItem("datasetHidden", JSON.stringify(newData));
    },
    get datasetHidden() {
      const raw = localStorage.getItem("datasetHidden");
      if (raw === null) {
        return {
          Teplota: false,
          "Teplota BMP": true,
          "Teplota DHT": true,
          Vlhkost: false,
          Tlak: false,
        };
      } else {
        return JSON.parse(raw) as IdatasetHidden;
      }
    },

    set readings(newData: IReading[]) {
      localStorage.setItem("readings", JSON.stringify(newData));
    },
    get readings() {
      const raw = localStorage.getItem("readings");
      if (raw === null) {
        return [];
      } else {
        return JSON.parse(raw) as IReading[];
      }
    },

    set lastRange(newData: number) {
      localStorage.setItem("lastRange", JSON.stringify(newData));
    },
    get lastRange() {
      const raw = localStorage.getItem("lastRange");
      if (raw === null) {
        return 0;
      } else {
        return JSON.parse(raw) as number;
      }
    },
  };
})();
