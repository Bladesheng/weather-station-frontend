import React from "react";

import HistoryControls from "@components/HistoryControls";
import ChartInteractive from "@components/ChartInteractive";

import { IReading } from "@api/api";

type IProps = {
  readingsHistory: IReading[];
  setReadingsHistory: (readings: IReading[]) => void;
};

export default function HistoryTab(props: IProps) {
  return (
    <section className="historyTab">
      <HistoryControls
        readingsHistory={props.readingsHistory}
        setReadingsHistory={props.setReadingsHistory}
      />

      <div className="chartDiv">
        <ChartInteractive readings={props.readingsHistory} />
      </div>
    </section>
  );
}
