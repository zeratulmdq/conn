import { Widget } from "./types";

const widgets: Record<string, Widget> = {
  s1: {
    type: "sticky",
    id: "s1",
    x: 100,
    y: 100,
    height: 100,
    width: 100,
  },
  s2: {
    type: "sticky",
    id: "s2",
    x: 400,
    y: 100,
    height: 100,
    width: 100,
  },
  s3: {
    type: "sticky",
    id: "s3",
    x: 400,
    y: 300,
    height: 100,
    width: 100,
  },
  a1: {
    type: "arrow",
    id: "a1",
    x: 200,
    y: 200,
    points: [
      { x: 200, y: 150, type: "right" },
      { x: 400, y: 150, type: "left" },
    ],
    start: "s1",
    end: "s2",
    height: 0,
    width: 0,
    chartBranchSide: null,
    chartBranchPosition: null,
    arrowType: "initial",
  },
  a2: {
    type: "arrow",
    id: "a2",
    x: 200,
    y: 200,
    points: [
      { x: 200, y: 150, type: "right" },
      { x: 400, y: 350, type: "left" },
    ],
    start: "s1",
    end: "s3",
    height: 0,
    width: 0,
    chartBranchSide: null,
    chartBranchPosition: null,
    arrowType: "initial",
  },
};

export default widgets;
