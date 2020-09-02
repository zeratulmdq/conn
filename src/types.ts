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

export type StickyWidget = W & { type: "sticky" };
export type ArrowWidget = W & {
  type: "arrow";
  points: Point[];
  start: string | null;
  end: string | null;
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
});
