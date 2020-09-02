import React from "react";
import "./Sticky.css";
import { ArrowWidget, Point } from "../types";

interface PropTypes {
  widget: ArrowWidget;
}

const pathGenerator = (points: Point[]) => {
  const start = points[0];
  const end = points[1];

  if (start.type === "right" || start.type === "left") {
    if (start.y === end.y) {
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

    const midDistanceX = (end.x - start.x) / 2;

    const d1 = `M ${start.x} ${start.y} L ${start.x + midDistanceX} ${start.y}`;
    const d2 = `M ${start.x + midDistanceX} ${start.y} L ${
      start.x + midDistanceX
    } ${end.y}`;
    const d3 = `M ${start.x + midDistanceX} ${end.y} L ${end.x} ${end.y}`;

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
  }

  if (start.x === end.x) {
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

  const midDistanceY = (end.y - start.y) / 2;

  const d1 = `M ${start.x} ${start.y} L ${start.x} ${start.y + midDistanceY}`;
  const d2 = `M ${start.x} ${start.y + midDistanceY} L ${end.x} ${
    start.y + midDistanceY
  }`;
  const d3 = `M ${end.x} ${start.y + midDistanceY} L ${end.x} ${end.y}`;

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
        {pathGenerator(this.props.widget.points)}
      </svg>
    );
  }
}

export default Arrow;
