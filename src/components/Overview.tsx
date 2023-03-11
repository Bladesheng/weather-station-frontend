import React from "react";

import { IReading } from "@api/api";

import Dashboard from "@components/Dashboard";
import ChartTempHum from "@components/ChartTempHum";
import ChartPress from "@components/ChartPress";

type IProps = {
  readings: IReading[];
};

export default function Overview(props: IProps) {
  const { readings } = props;

  return (
    <section className="overview">
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
