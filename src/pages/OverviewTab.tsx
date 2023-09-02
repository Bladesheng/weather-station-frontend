import React from "react";

import Dashboard from "@components/Dashboard";
import ChartTempHum from "@components/charts/ChartTempHum";
import ChartPress from "@components/charts/ChartPress";

type IProps = {
  readings: IReading[];
};

export default function OverviewTab(props: IProps) {
  const { readings } = props;

  return (
    <section className="overviewTab">
      <Dashboard readings={readings} />
      <section className="charts">
        <div className="chartDiv">
          <ChartTempHum readings={readings} />
        </div>
        <div className="chartDiv">
          <ChartPress readings={readings} />
        </div>
      </section>
    </section>
  );
}
