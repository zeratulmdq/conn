import React from "react";
import "./Sticky.css";
import "./Arrow.css";
import { ArrowWidget, Point, PointType, Position } from "../types";

type Direction = 'horizontal' | 'vertical' | 'other';

interface PropTypes {
  widget: ArrowWidget;
  onDragPointStart: (id: string, e: React.MouseEvent, isStart: boolean) => void;
  onDragSegmentEnd: (id: string, index: number, position?: number) => void;
  onDragSegment: (id: string, index: number, position: Position) => void;
  onDragSegmentStart: (id: string, index: number, position: Position) => void;
  label: string;
}

interface State {
  draggingSegment: boolean;
  draggingSegmentNumber: number; // indicates which segment is being dragged
  position?: number;
}

class Arrow extends React.PureComponent<PropTypes, State> {
  state: State = { draggingSegment: false, draggingSegmentNumber: -1 };

  getPoints = () => {
    const { points } = this.props.widget;
    const start = points[0];
    const end = points[points.length - 1];

    return { start, end }
  }

  handleSegmentDragStart = (e: React.MouseEvent, index: number) => {
    if (this.state.draggingSegment) return;
    this.props.onDragSegmentStart(this.props.widget.id, index, { x: e.clientX, y: e.clientY })
    const normalizedIndex = index === 0
      ? 1
      : index;
    this.setState({ draggingSegment: true, draggingSegmentNumber: normalizedIndex })
  }

  handleSegmentDragEnd = () => {
    if (!this.state.draggingSegment) return;
    // Create chart branch after dragging middle segment
    const pos = this.state.position;
    this.props.onDragSegmentEnd(this.props.widget.id, this.state.draggingSegmentNumber, pos);
    this.setState({ draggingSegment: false, draggingSegmentNumber: -1, position: undefined })
  }

  handleMouseMove = ({ clientX, clientY }: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const { draggingSegmentNumber } = this.state;
    if(!this.state.draggingSegment) return;

    const { start } = this.getPoints();
    
    if ((start.type === 'right' || start.type === 'left') && draggingSegmentNumber % 2 !== 0 ) {
      this.setState({ position: clientX });
    } else {
      this.setState({ position: clientY });
    }
    this.props.onDragSegment(this.props.widget.id, draggingSegmentNumber, { x: clientX, y: clientY });
  }

  connectionDot = (x: number, y: number, key: string, direction?: PointType) => {
    const handleDragPointStart = (e: React.MouseEvent) => {
      const { onDragPointStart, widget } = this.props;
      onDragPointStart(widget.id, e, !direction);
    }
    if (!direction) {
      return <circle
        key={key}
        cx={`${x}`}
        cy={`${y}`}
        r="2"
        stroke='transparent'
        fill='black'
        strokeWidth="6"
        onMouseDown={handleDragPointStart}
        ></circle>
    } else {
      return <path
        key={key}
        className='connectionDot'
        stroke="#000"
        fill="#000"
        d={`M${x} ${y} L${x - 8} ${y + 3}V${y - 3}z`}
        fillRule="evenodd"
        style={{ transform: `rotate(${this.getRotation(direction)}deg)`, transformOrigin: `${x}px ${y}px` }}
        onMouseDown={handleDragPointStart}
      />;
    }
  };
  getRotation = (dir: PointType) => {
    switch (dir) {
      case 'right': return 180;
      case 'left': return 0;
      case 'top': return 90;
      case 'bottom': return -90;
    }
  }

  pathGenerator = () => {
    const { points } = this.props.widget;
    if (points.length < 2) return null;
    // const { position } = this.state;
    const start = points[0];
    const end = points[points.length - 1];
    const withConnectionDot = (arrowPath: JSX.Element[]) => [
      this.connectionDot(start.x, start.y, '0'),
      ...arrowPath,
      this.connectionDot(end.x, end.y, '100', end.type),
    ];
    const isHorizontalStart = start.type === "right" || start.type === "left";
    const cursor = (index: number) => (isHorizontalStart && index % 2 !== 0) || (!isHorizontalStart && index % 2 === 0) ? 'ew-resize' : 'ns-resize'
    const arrowPath: JSX.Element[] = [];
    points.forEach((point, index) => {
      const onDragStart = (e: React.MouseEvent) => this.handleSegmentDragStart(e, index);
      const next = points[index + 1];
      if (!next) return;
      arrowPath.push(<path
        key={index + 1} // 0 is the first circle
        d={`M ${point.x} ${point.y} L ${next.x} ${next.y}`}
        stroke="black"
        strokeWidth="2"
        fill="none"
        style={{
          cursor: cursor(index),
          pointerEvents: 'auto'
        }}
        onMouseDown={onDragStart}
      />)
    })
    return withConnectionDot([
      ...arrowPath,
      this.createLabel(points),
    ]);
  };

  createLabel = (points: Point[]) => {
    const { label } = this.props;
    // super hacky sizing method
    const labelSize = { width: 8.5 * label.length, height: 18 };
    const middlePointIndex = Math.ceil(points.length / 2);
    const middlePoint = points[middlePointIndex - 1];
    const nextMiddlePoint = points[middlePointIndex];
    const center = {
      x:
        middlePoint.x +
        (nextMiddlePoint.x - middlePoint.x) / 2 -
        labelSize.width / 2,
      y:
        middlePoint.y +
        (nextMiddlePoint.y - middlePoint.y) / 2 +
        labelSize.height / 4,
    };
    return (
      <text key="label" transform={`matrix(1 0 0 1 ${center.x} ${center.y})`}>
        {label}
      </text>
    );
  };


  render() {
    const path = this.pathGenerator();
    if (!path) return null;

    return (
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: this.state.draggingSegment ? "auto" : "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="Arrow"
        onMouseUp={this.handleSegmentDragEnd}
        onMouseMove={this.handleMouseMove}
      >
        { path }
      </svg>
    );
  }
}

export default Arrow;
