export const Storage = (() => {
  // default values
  let datasetHidden = {
    "Teplota (Průměr)": false,
    "Teplota (BMP)": true,
    "Teplota (DHT)": true,
    "Vlhkost (DHT)": false,
  };

  // save everything to local storage
  function _save() {
    localStorage.setItem("datasetHidden", JSON.stringify(datasetHidden));
  }

  // retrieve everything from local storage
  function init() {
    const retrievedDatasetHidden = localStorage.getItem("datasetHidden");

    // if there is something saved,
    if (retrievedDatasetHidden !== null) {
      // retrieve it instead of using the default values
      datasetHidden = JSON.parse(retrievedDatasetHidden);
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
  };
})();
