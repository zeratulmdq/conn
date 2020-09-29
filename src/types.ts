import * as uuid from "uuid";

interface W {
  height: number;
  width: number;
  id: string;
  x: number;
  y: number;
}

export type PointType = "bottom" | "top" | "left" | "right";

export interface Point {
  x: number;
  y: number;
  type: PointType;
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
  end: string | null;
  arrowType: ArrowType;
  chartBranchSide: PointType | null;  // side of the origin widget where the branch starts
  chartBranchPosition: number | null; // fix position where arrows share the 2nd branch segment
  initialIsHorizontal: boolean;
};

export type Widget = StickyWidget | ArrowWidget;

export const stickyFactory = (spec: Partial<StickyWidget>): StickyWidget => ({
  id: uuid.v4(),
  height: 100,
  width: 100,
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
  arrowType: "initial",
  chartBranchSide: null,
  chartBranchPosition: null,
  initialIsHorizontal: true,
});
