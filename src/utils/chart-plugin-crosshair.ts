// https://github.com/Mazzzoni/b4bstats
// https://github.com/Mazzzoni/b4bstats/blob/68409eeff2445cd459b468608717d2b44b4a73ab/src/utils/chart-plugin-crosshair.ts

// plugin for drawing crosshair bars at the current cursor position in chart

import { Chart as ChartJS } from "chart.js";

interface Chart extends ChartJS {
  crosshair: {
    x: number;
    y: number;
    draw?: boolean;
  };
}

export type CrosshairOptions = {
  horizontal?: boolean;
  vertical?: boolean;
  color?: string;
  dash?: number[];
  width?: number;
};

const defaults = {
  horizontal: true,
  vertical: true,
  color: "red",
  dash: [5],
  width: 1,
};

export const ChartPluginCrosshair = {
  id: "crosshair",

  defaults,

  afterInit: (chart: Chart) => {
    chart.crosshair = {
      x: 0,
      y: 0,
    };
  },

  afterEvent: (chart: Chart, args: any) => {
    const { inChartArea } = args; // check if cursor is inside chart
    const { x, y } = args.event; // x y position of cursor

    chart.crosshair = { x, y, draw: inChartArea };
    chart.draw();
  },

  afterDraw: (chart: Chart, args: any, opts: typeof defaults) => {
    const { ctx } = chart;
    const { top, bottom, left, right } = chart.chartArea;
    const { x, y, draw } = chart.crosshair;

    if (!draw) return;

    ctx.strokeStyle = opts.color;
    ctx.setLineDash(opts.dash);
    ctx.lineWidth = opts.width;

    ctx.save();
    ctx.beginPath();

    if (opts.vertical) {
      ctx.moveTo(x, bottom);
      ctx.lineTo(x, top);
    }

    if (opts.horizontal) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }

    ctx.stroke();
    ctx.restore();
  },
};
