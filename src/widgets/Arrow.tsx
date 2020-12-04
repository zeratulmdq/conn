import React from "react";
import "./Sticky.css";
import "./Arrow.css";
import { ArrowWidget, Point, PointType, Position } from "../types";

type Direction = "horizontal" | "vertical" | "other";

declare const window: any;

interface PropTypes {
  widget: ArrowWidget;
  onDragPointStart: (id: string, e: React.MouseEvent, isStart: boolean) => void;
  onDragSegmentEnd: (id: string, index: number, position?: number) => void;
  onDragSegment: (id: string, index: number, position: Position) => void;
  onDragSegmentStart: (id: string, index: number, position: Position) => void;
  showLabels: boolean;
}

interface State {
  draggingSegment: boolean;
  draggingSegmentNumber: number; // indicates which segment is being dragged
  position?: number;
  editing: boolean;
  label: {
    segment: number;
    text: string;
    pos: number;
  };
}

class Arrow extends React.PureComponent<PropTypes, State> {
  state: State = {
    draggingSegment: false,
    draggingSegmentNumber: -1,
    editing: false,
    label: {
      segment: -1,
      text: "label",
      pos: -1,
    },
  };
  ref: SVGTextElement | null = null;

  getPoints = () => {
    const { points } = this.props.widget;
    const start = points[0];
    const end = points[points.length - 1];

    return { start, end };
  };

  handleSegmentDragStart = (e: React.MouseEvent, index: number) => {
    if (this.state.draggingSegment) return;
    this.props.onDragSegmentStart(this.props.widget.id, index, {
      x: e.clientX,
      y: e.clientY,
    });
    const normalizedIndex = index === 0 ? 1 : index;
    this.setState({
      draggingSegment: true,
      draggingSegmentNumber: normalizedIndex,
    });
  };

  handleSegmentDragEnd = () => {
    console.log("handleSegmentDragEnd");
    if (!this.state.draggingSegment) return;
    // Create chart branch after dragging middle segment
    const pos = this.state.position;
    this.props.onDragSegmentEnd(
      this.props.widget.id,
      this.state.draggingSegmentNumber,
      pos
    );
    this.setState({
      draggingSegment: false,
      draggingSegmentNumber: -1,
      position: undefined,
    });
  };

  handleMouseMove = ({
    clientX,
    clientY,
  }: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const { draggingSegmentNumber } = this.state;
    if (!this.state.draggingSegment) return;

    const { start } = this.getPoints();

    if (
      (start.type === "right" || start.type === "left") &&
      draggingSegmentNumber % 2 !== 0
    ) {
      this.setState({ position: clientX });
    } else {
      this.setState({ position: clientY });
    }
    this.props.onDragSegment(this.props.widget.id, draggingSegmentNumber, {
      x: clientX,
      y: clientY,
    });
  };

  connectionDot = (
    x: number,
    y: number,
    key: string,
    direction?: PointType
  ) => {
    const handleDragPointStart = (e: React.MouseEvent) => {
      const { onDragPointStart, widget } = this.props;
      onDragPointStart(widget.id, e, !direction);
    };
    if (!direction) {
      return (
        <circle
          key={key}
          cx={`${x}`}
          cy={`${y}`}
          r="2"
          stroke="transparent"
          fill="black"
          strokeWidth="6"
          onMouseDown={handleDragPointStart}
        ></circle>
      );
    } else {
      return (
        <path
          key={key}
          className="connectionDot"
          stroke="#000"
          fill="#000"
          d={`M${x} ${y} L${x - 8} ${y + 3}V${y - 3}z`}
          fillRule="evenodd"
          style={{
            transform: `rotate(${this.getRotation(direction)}deg)`,
            transformOrigin: `${x}px ${y}px`,
          }}
          onMouseDown={handleDragPointStart}
        />
      );
    }
  };
  getRotation = (dir: PointType) => {
    switch (dir) {
      case "right":
        return 180;
      case "left":
        return 0;
      case "top":
        return 90;
      case "bottom":
        return -90;
    }
  };

  pathGenerator = () => {
    const { points } = this.props.widget;
    const { showLabels } = this.props;
    if (points.length < 2) return null;

    const start = points[0];
    const end = points[points.length - 1];
    const withConnectionDot = (arrowPath: JSX.Element[]) => [
      this.connectionDot(start.x, start.y, "0"),
      ...arrowPath,
      this.connectionDot(end.x, end.y, "100", end.type),
    ];
    const isHorizontalStart = start.type === "right" || start.type === "left";
    const cursor = (index: number) =>
      (isHorizontalStart && index % 2 !== 0) ||
      (!isHorizontalStart && index % 2 === 0)
        ? "ew-resize"
        : "ns-resize";
    const arrowPath: JSX.Element[] = [];
    points.forEach((point, index) => {
      const onDragStart = (e: React.MouseEvent) =>
        this.handleSegmentDragStart(e, index);
      const next = points[index + 1];
      if (!next) return;
      arrowPath.push(
        <path
          key={index + 1} // 0 is the first circle
          id={`path-${index}`}
          d={`M ${point.x} ${point.y} L ${next.x} ${next.y}`}
          stroke="black"
          strokeWidth="2"
          fill="none"
          style={{
            cursor: cursor(index),
            pointerEvents: "auto",
          }}
          onMouseDown={onDragStart}
          onDoubleClick={this.handleDoubleClick}
        />
      );
    });

    const paths = arrowPath;
    if (showLabels) {
      const label = this.createLabel(points);
      if (label) paths.push(label);
    }
    return withConnectionDot(paths);
  };

  createLabel = (points: Point[]) => {
    const { label } = this.state;
    if (label.segment === -1) return null;

    // super hacky sizing method
    const labelSize = { width: 8 * label.text.length, height: 18 };
    let point = points[label.segment];
    let nextPoint = points[label.segment + 1];
    if (points.length === 2) {
      point = points[0];
      nextPoint = points[1];
    }
    const center = {
      x: point.x + (nextPoint.x - point.x) / 2 - labelSize.width / 2,
      y: point.y + (nextPoint.y - point.y) / 2 + labelSize.height / 3,
    };

    return (
      <text
        key="label"
        transform={`matrix(1 0 0 1 ${center.x} ${center.y})`}
        style={{
          cursor: this.state.editing ? "auto" : "pointer",
          pointerEvents: "auto",
        }}
        tabIndex={0}
        onClick={this.handleTextClick}
        ref={this.handleRef}
      >
        {label.text}
      </text>
    );
  };

  handleRef = (ref: SVGTextElement) => {
    this.ref = ref;
  };

  handleTextClick = () => {
    if (this.state.editing) return;

    // hacky hack to prevent 'c' shortcut to screw up typing
    window.editingLabel = true;
    this.setState({ editing: true });
    document.addEventListener("click", this.handleDocClick);
  };

  handleDocClick = (e: any) => {
    if (!this.ref) return;
    const b = this.ref.getBoundingClientRect();
    const okH = e.clientX > b.left && e.clientX < b.left + b.width;
    const okV = e.clientY > b.top && e.clientY < b.top + b.height;
    const inside = okH && okV;
    if (!inside) {
      window.editingLabel = false;
      this.setState({
        editing: false,
        label: {
          segment: -1,
          text: this.ref.textContent || "",
          pos: -1,
        },
      });
      document.removeEventListener("click", this.handleDocClick);
    }
  };

  handleDoubleClick = (e: any) => {
    e.stopPropagation();
    console.log(e.target.id);
    const pathID = Number(e.target.id.replace("path-", ""));
    console.log("handleDoubleClick", pathID);
    this.setState({ label: { ...this.state.label, segment: pathID } });
  };

  render() {
    const path = this.pathGenerator();
    if (!path) return null;
    const { editing, draggingSegment } = this.state;

    return (
      <div contentEditable={editing} suppressContentEditableWarning>
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: draggingSegment ? "auto" : "none",
          }}
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="Arrow"
          onMouseUp={this.handleSegmentDragEnd}
          onMouseMove={this.handleMouseMove}
        >
          {path}
        </svg>
      </div>
    );
  }
}

export default Arrow;
