import React from "react";
import "./Sticky.css";
import { ArrowWidget, ChartBranch, Point } from "../types";

interface PropTypes {
  widget: ArrowWidget;
}

const pathGenerator = (points: Point[], chartBranch: ChartBranch | null) => {
  const start = points[0];
  const end = points[1];
  const isHorizontalStart = start.type === "right" || start.type === "left";
  const isHorizontalEnd = end.type === "right" || end.type === "left";

  // 1-segment straight line
  if((isHorizontalStart && start.y === end.y) ||
    (!isHorizontalStart && start.x === end.x)) {
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

  // 2-segments line
  if(isHorizontalStart !== isHorizontalEnd) {
    const p1 = `${start.x} ${start.y}`;
    const p2 = isHorizontalStart ? `${end.x} ${start.y}` : `${start.x} ${end.y}`;
    const p3 = `${end.x} ${end.y}`;
    
    const d1 = `M ${p1} L ${p2}`;
    const d2 = `M ${p2} L ${p3}`;
    return [
      <path d={d1} stroke="red" strokeWidth="2" fill="none" />,
      <path d={d2} stroke="red" strokeWidth="2" fill="none" />,
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
  const midDistance = isHorizontalStart ? (end.x - start.x) / 2 : (end.y - start.y) / 2;
  let segment2Position = isHorizontalStart ? start.x + midDistance: start.y + midDistance;
  if(chartBranch)
  {
    const convergenceTarget = chartBranch.type === "manyToOne" ? end : start;
    if(chartBranch.convergenceSide === convergenceTarget.type) {
      segment2Position = chartBranch.position;
    }
  }

  const p1 = `${start.x} ${start.y}`;
  const p2 = isHorizontalStart ? `${segment2Position} ${start.y}` : ` ${start.x} ${segment2Position}`;
  const p3 = isHorizontalStart ? `${segment2Position} ${end.y}` : ` ${end.x} ${segment2Position}`;
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
        {pathGenerator(this.props.widget.points, this.props.widget.chartBranch)}
      </svg>
    );
  }
}

export default Arrow;