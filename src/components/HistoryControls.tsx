import React, { useEffect } from "react";

import { Storage } from "@utils/storage";

import { fetchReadingsRange, IReading } from "@api/api";

const buttonTimes = {
  "12 hodin": 12 * 60 * 60 * 1000,
  "24 hodin": 24 * 60 * 60 * 1000,
  "2 dny": 2 * 24 * 60 * 60 * 1000,
  "7 dní": 7 * 24 * 60 * 60 * 1000,
  "30 dní": 30 * 24 * 60 * 60 * 1000,
};

type IProps = {
  readingsHistory: IReading[];
  setReadingsHistory: (readings: IReading[]) => void;
};

export default function HistoryControls(props: IProps) {
  useEffect(() => {
    // on component init: if there is no readings yet and something was already selected last time: select it again
    if (props.readingsHistory.length === 0 && Storage.lastRange !== "") {
      const rangeName = Storage.lastRange as keyof typeof buttonTimes;
      selectRange(rangeName);
    }
  }, []);

  // fetch readings for give rangeName, update state to display them on chart and remember the last selection (with localStorage)
  async function selectRange(rangeName: keyof typeof buttonTimes) {
    const startTime = buttonTimes[rangeName];
    const readings = await fetchReadingsRange(new Date(Date.now() - startTime));

    props.setReadingsHistory(readings);

    Storage.lastRange = rangeName; // remember the last selection to load it when you refresh page
  }

  async function clickSelectRange(e: React.MouseEvent) {
    const clickedButton = e.target as HTMLButtonElement;
    const buttonText = clickedButton.textContent as keyof typeof buttonTimes;

    selectRange(buttonText);
  }

  // create button for each range entry in buttonTimes
  const buttonElements: JSX.Element[] = [];
  for (const buttonText in buttonTimes) {
    buttonElements.push(
      <button onClick={clickSelectRange} key={buttonText}>
        {buttonText}
      </button>
    );
  }

  return <section className="historyControls">{buttonElements}</section>;
}
