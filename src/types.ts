import * as uuid from "uuid";

interface W {
  height: number;
  width: number;
  id: string;
  x: number;
  y: number;
}

export type PointType = "bottom" | "top" | "left" | "right";
export type Orientation = "horizontal" | "vertical";
export type ChartBranchType = "oneToOne" | "oneToMany" | "manyToOne";

export interface Point {
  x: number;
  y: number;
  type: PointType;
}

export interface Position {
  x: number;
  y: number;
}

export interface ChartBranch {
  position: number; // fixed position where arrows share the 2nd branch segment
  convergenceSide: PointType;  // side of the widget where the arrows converge (might be start or end widget depending of ChartBranchType)
  type: ChartBranchType;
}

// initial: initial simple arrow, centered to the connected widgets on both ends, bent into 3 segments having the same length in both parallel segments.
// chartBranch: created from an 'initial' arrow, centered to the connected widgets on both ends, bent into 3 segments, can share inital segment with other 'chartBranch' arrows, 1st segment size stays put.
// chartSide: created from an 'initial' arrow, moved to the side of a group of 'chartBranch' arrows and can be on any point of both connected widgets.
export type ArrowType = "initial" | "chartBranch" | "chartSide";

export type StickyWidget = W & { type: "sticky" };
export type ArrowWidget = W & {
  type: "arrow";
  points: Point[];
  start: string | null;
  startPoint?: 'top' | 'right' | 'bottom' | 'left' | null;
  endPoint?: 'top' | 'right' | 'bottom' | 'left' | null;
  end: string | null;
  arrowType: ArrowType;
  chartBranch: ChartBranch | null;
  initialIsHorizontal: boolean;
};

export type Widget = StickyWidget | ArrowWidget;

export const stickyFactory = (spec: Partial<StickyWidget>): StickyWidget => ({
  id: uuid.v4(),
  height: spec.height ?? 100,
  width: spec.width ?? 100,
  type: "sticky",
  x: (spec.x || 0) - 50,
  y: (spec.y || 0) - 50,
});

export const arrowFactory = (spec: Partial<ArrowWidget>): ArrowWidget => ({
  id: uuid.v4(),
  height: 0,
  width: 0,
  type: "arrow",
  x: (spec.x || 0) - 25,
  y: (spec.y || 0) - 25,
  start: spec.start || null,
  end: spec.end || null,
  points: [],
  arrowType: spec.arrowType || "initial",
  chartBranch: null,
  initialIsHorizontal: spec.initialIsHorizontal || true,
});

export const toOrientation = (type: PointType) : Orientation => {
  return type === "left" || type === "right" ? "horizontal" : "vertical";
}
