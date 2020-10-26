import React from "react";
import "./Sticky.css";
import { ArrowWidget, ChartBranch, Point } from "../types";

type Direction = 'horizontal' | 'vertical' | 'other';

// const MIN_SEGMENT_DISTANCE = 200;

interface PropTypes {
  widget: ArrowWidget;
}

interface State {
  direction: Direction;
  pointerEventsEnabled: boolean;
  x?: number;
  y?: number;
}

const pathGenerator = (
  points: Point[],
  chartBranch: ChartBranch | null,
  enablePointerEvents: () => void,
  x: number | undefined,
  y: number | undefined
) => {
  const start = points[0];
  const end = points[1];
  const isHorizontalStart = start.type === "right" || start.type === "left";
  const isHorizontalEnd = end.type === "right" || end.type === "left";

  // 1-segment straight line
  if((isHorizontalStart && start.y === end.y) ||
    (!isHorizontalStart && start.x === end.x)) {
      const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      return [
        <path d={d} stroke="red" strokeWidth="2" fill="none" key="1" />,
        <circle
          key="2"
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
      <path d={d1} stroke="red" strokeWidth="2" fill="none" key="1" />,
      <path d={d2} stroke="red" strokeWidth="2" fill="none" key="2" />,
      <circle
        key="3"
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
  let segment2Position = isHorizontalStart && x
    ? x
    : !isHorizontalStart && y
    ? y
    : isHorizontalStart
    ? start.x + midDistance
    : start.y + midDistance;

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

  const cursor = isHorizontalStart ? 'ew-resize' : 'ns-resize'

  return [
    <path d={d1} stroke="red" strokeWidth="2" fill="none" key="1" />,
    <path
      key="2"
      d={d2}
      stroke="red"
      strokeWidth="2"
      fill="none"
      style={{
        cursor,
        pointerEvents: 'auto'
      }}
      onMouseDown={enablePointerEvents}
    />,
    <path d={d3} stroke="red" strokeWidth="2" fill="none" key="3" />,
    <circle
      key="4"
      cx={`${end.x}`}
      cy={`${end.y}`}
      r="5"
      stroke="#5cb85c"
      fill="#5cb85c"
    ></circle>,
  ];
};

class Arrow extends React.Component<PropTypes, State> {
  state: State = { direction: 'other', pointerEventsEnabled: false };

  componentDidMount() {
    this.setDirection();
  }

  setDirection = () => {
    const { start, end } = this.getPoints();
    const isHorizontalStart = start.type === "right" || start.type === "left";
    const isHorizontalEnd = end.type === "right" || end.type === "left";

    if (isHorizontalStart !== isHorizontalEnd) this.setState({ direction: 'other' });

    this.setState({ direction: isHorizontalStart ? 'vertical' : 'horizontal' })
  }

  getPoints = () => {
    const { points } = this.props.widget;
    const start = points[0];
    const end = points[1];

    return { start, end }
  }

  enablePointerEvents = () => {
    if (this.state.pointerEventsEnabled) return;

    console.log('enable pointer events')

    this.setState({ pointerEventsEnabled: true})
  }

  disablePointerEvents = () => {
    if (!this.state.pointerEventsEnabled) return;

    console.log('disable pointer events')

    this.setState({ pointerEventsEnabled: false})
  }

  handleMouseMove = ({ clientX, clientY }: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    this.setDirection();

    if(!this.state.pointerEventsEnabled || this.state.direction === 'other') return;

    if (this.state.direction === 'vertical') {
      this.setState({ x: clientX });
      return;
    }


    this.setState({ y: clientY });
  }

  render() {
    const path = pathGenerator(
      this.props.widget.points,
      this.props.widget.chartBranch,
      this.enablePointerEvents,
      this.state.x,
      this.state.y
    );
    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: this.state.pointerEventsEnabled ? "auto" : "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        onMouseUp={this.disablePointerEvents}
        onMouseMove={this.handleMouseMove}
      >
        { path }
      </svg>
    );
  }
}

export default Arrow;