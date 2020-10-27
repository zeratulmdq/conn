import React from "react";
import "./Sticky.css";
import "./Arrow.css";
import { ArrowWidget, ChartBranch, Point } from "../types";

type Direction = 'horizontal' | 'vertical' | 'other';

const MIN_SEGMENT_DISTANCE = 10;

interface PropTypes {
  widget: ArrowWidget;
  onDragPointStart: (id: string, e: React.MouseEvent, isStart: boolean) => void;
}

interface State {
  direction: Direction;
  pointerEventsEnabled: boolean;
  x?: number;
  y?: number;
}

class Arrow extends React.PureComponent<PropTypes, State> {
  state: State = { direction: 'other', pointerEventsEnabled: false };

  componentDidMount() {
    this.setDirection();
  }

  componentDidUpdate() {
    const { start, end } = this.getPoints();

    if (this.state.x && this.state.direction === 'vertical') {
      const diffStartX = this.state.x - start.x
      const diffEndX = this.state.x - end.x;
      if ((diffStartX > 0 && diffEndX > 0) || (diffStartX < 0 && diffEndX < 0)) {
        this.setState({ x: undefined });
      }
    }

    if (this.state.y && this.state.direction === 'horizontal') {
      const diffStartY = this.state.y - start.y
      const diffEndY = this.state.y - end.y;
      if ((diffStartY > 0 && diffEndY > 0) || (diffStartY < 0 && diffEndY < 0)) {
        this.setState({ y: undefined });
      }
    }
  }

  setDirection = () => {
    const { start, end } = this.getPoints();
    const isHorizontalStart = start.type === "right" || start.type === "left";
    const isHorizontalEnd = end.type === "right" || end.type === "left";

    if (isHorizontalStart !== isHorizontalEnd) this.setState({ direction: 'other' });

    this.setState({ direction: isHorizontalStart ? 'vertical' : 'horizontal' });
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

  connectionDot = (x: number, y: number, key: string, isStart?: boolean) => {
    const handleDragPointStart = (e: React.MouseEvent) => {
      const { onDragPointStart, widget } = this.props;
      onDragPointStart(widget.id, e, !!isStart);
    }
    return <circle
      key={key}
      cx={`${x}`}
      cy={`${y}`}
      r="5"
      stroke={isStart ? 'black' : '#1c7ff9'}
      fill={isStart ? 'white' : '#1c7ff9'}
      onMouseDown={handleDragPointStart}
      ></circle>
  };

  handleMouseMove = ({ clientX, clientY }: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    this.setDirection();

    if(!this.state.pointerEventsEnabled || this.state.direction === 'other') return;

    const { start, end } = this.getPoints();

    if (this.state.direction === 'vertical') {
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);

      const limitStart = minX < clientX - MIN_SEGMENT_DISTANCE;
      const limitEnd = maxX > clientX + MIN_SEGMENT_DISTANCE;

      if (limitStart && limitEnd && this.state.x !== clientX)
        this.setState({ x: clientX })

      return;
    }

    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    const limitStart = minY < clientY - MIN_SEGMENT_DISTANCE;
    const limitEnd = maxY > clientY + MIN_SEGMENT_DISTANCE;

    if (limitStart && limitEnd && this.state.y !== clientY)
      this.setState({ y: clientY });
  }

  pathGenerator = (
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
          this.connectionDot(start.x, start.y, '0', true),
          <path d={d} stroke="black" strokeWidth="2" fill="none" key="1" />,
          this.connectionDot(end.x, end.y, '2'),
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
        this.connectionDot(start.x, start.y, '0', true),
        <path d={d1} stroke="black" strokeWidth="2" fill="none" key="1" />,
        <path d={d2} stroke="black" strokeWidth="2" fill="none" key="2" />,
        this.connectionDot(end.x, end.y, '3'),
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
        segment2Position = isHorizontalStart && x
          ? x
          : !isHorizontalStart && y
          ? y
          : chartBranch.position;
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
      this.connectionDot(start.x, start.y, '0', true),
      <path d={d1} stroke="black" strokeWidth="2" fill="none" key="1" />,
      <path
        key="2"
        d={d2}
        stroke="black"
        strokeWidth="2"
        fill="none"
        style={{
          cursor,
          pointerEvents: 'auto'
        }}
        onMouseDown={enablePointerEvents}
      />,
      <path d={d3} stroke="black" strokeWidth="2" fill="none" key="3" />,
      this.connectionDot(end.x, end.y, '4'),
    ];
  };

  render() {
    const path = this.pathGenerator(
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
        className="Arrow"
        onMouseUp={this.disablePointerEvents}
        onMouseMove={this.handleMouseMove}
      >
        { path }
      </svg>
    );
  }
}

export default Arrow;