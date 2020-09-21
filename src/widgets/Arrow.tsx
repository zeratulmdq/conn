import React from "react";
import "./Sticky.css";
import { ArrowWidget, Point, PointType } from "../types";

interface PropTypes {
  widget: ArrowWidget;
}

const pathGenerator = (points: Point[], chartBranchSide: PointType | null, chartBranchPosition: number | null) => {
  const start = points[0];
  const end = points[1];
  const isHorizontalConnection = start.type === "right" || start.type === "left";

  // straight line
  if((isHorizontalConnection && start.y === end.y) ||
    (!isHorizontalConnection && start.x === end.x)) {
      const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      return [
        <path d={d} stroke="red" strokeWidth="2" fill="none" />,
        <circle
          cx={`${end.x}`}
          cy={`${end.y}`}
          r="5"
          stroke="#5cb85c"
          fill="#5cb85c"
        ></circle>,
      ];
  }

  // 3-segments line
  const midDistance = isHorizontalConnection ? (end.x - start.x) / 2 : (end.y - start.y) / 2;
  let segment2Position = isHorizontalConnection ? start.x + midDistance: start.y + midDistance;
  if(chartBranchSide && chartBranchPosition && chartBranchSide === start.type) {
    segment2Position = chartBranchPosition;
  }

  const p1 = `${start.x} ${start.y}`;
  const p2 = isHorizontalConnection ? `${segment2Position} ${start.y}` : ` ${start.x} ${segment2Position}`;
  const p3 = isHorizontalConnection ? `${segment2Position} ${end.y}` : ` ${end.x} ${segment2Position}`;
  const p4 = `${end.x} ${end.y}`;

  const d1 = `M ${p1} L ${p2}`;
  const d2 = `M ${p2} L ${p3}`;
  const d3 = `M ${p3} L ${p4}`;

  return [
    <path d={d1} stroke="red" strokeWidth="2" fill="none" />,
    <path d={d2} stroke="red" strokeWidth="2" fill="none" />,
    <path d={d3} stroke="red" strokeWidth="2" fill="none" />,
    <circle
      cx={`${end.x}`}
      cy={`${end.y}`}
      r="5"
      stroke="#5cb85c"
      fill="#5cb85c"
    ></circle>,
  ];
};

class Arrow extends React.PureComponent<PropTypes> {
  render() {
    return (
      <svg
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        {pathGenerator(this.props.widget.points, this.props.widget.chartBranchSide, this.props.widget.chartBranchPosition)}
      </svg>
    );
  }
}

export default Arrow;
