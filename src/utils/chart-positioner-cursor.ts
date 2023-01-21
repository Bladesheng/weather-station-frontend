declare module "chart.js" {
  interface TooltipPositionerMap {
    cursor: (elements: any, eventPosition: { x: number; y: number }) => { x: number; y: number };
  }
}

// custom tooltip positioner that follows cursor position
export function CursorPositioner(elements: any, eventPosition: { x: number; y: number }) {
  return eventPosition;
}
