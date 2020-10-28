import React from "react";
import "./Sticky.css";
import { StickyWidget } from "../types";

const SNAPPING_POINT_WIDTH = 30;
const SNAPPING_POINT_CENTER = SNAPPING_POINT_WIDTH / 2;

interface PropTypes {
  cursor: React.CSSProperties["cursor"];
  onMouseDown: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseUp: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onDragStart: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseHover: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  selected: boolean;
  widget: StickyWidget;
}

class Sticky extends React.Component<PropTypes> {
  dragging: boolean = false;
  initialX: number = 0;
  initialY: number = 0;

  handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onDragStart, widget, cursor, onMouseDown } = this.props;
    if (cursor === 'crosshair') onMouseDown(widget.id, e);
    else onDragStart(widget.id, e);
  };

  handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseUp, cursor, widget } = this.props;
    if (cursor === 'crosshair') onMouseUp(widget.id, e);
  };
  
  handleMouseHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseHover, widget } = this.props;
    onMouseHover(widget.id, e);
  };

  handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseLeave, widget } = this.props;
    onMouseLeave(widget.id, e);
  };

  render() {
    const {
      cursor,
      selected,
      widget: { x, y , width, height},
    } = this.props;
    return (
      <div
        onMouseUp={this.handleMouseUp}
        onMouseDown={this.handleDragStart}
        onMouseMove={this.handleMouseHover}
        onMouseLeave={this.handleMouseLeave}
        style={{
          top: y,
          left: x,
          width: width,
          height: height,
          cursor: cursor === "crosshair" ? "crosshair" : "pointer",
          border: selected ? "2px solid blue" : "none",
        }}
        className="Sticky"
        >
        <div
          className="snapping-point top"
          style={{
            top: 0 - SNAPPING_POINT_CENTER,
            left: (width / 2) - SNAPPING_POINT_CENTER,
            width: SNAPPING_POINT_WIDTH,
            height: SNAPPING_POINT_WIDTH,
          }}
          id="top"
        ></div>
        <div
          className="snapping-point right"
          style={{
            top: (height / 2) - SNAPPING_POINT_CENTER,
            left: width - SNAPPING_POINT_CENTER,
            width: SNAPPING_POINT_WIDTH,
            height: SNAPPING_POINT_WIDTH,
          }}
          id="right"
        ></div>
        <div
          className="snapping-point bottom"
          style={{
            top: height - SNAPPING_POINT_CENTER,
            left: (width / 2) - SNAPPING_POINT_CENTER,
            width: SNAPPING_POINT_WIDTH,
            height: SNAPPING_POINT_WIDTH,
          }}
          id="bottom"
        ></div>
        <div
          className="snapping-point left"
          style={{
            top: (height / 2) - SNAPPING_POINT_CENTER,
            left: 0 - SNAPPING_POINT_CENTER,
            width: SNAPPING_POINT_WIDTH,
            height: SNAPPING_POINT_WIDTH,
          }}
          id="left"
        ></div>
        <svg className="auto-affordance">
        <circle
          cx={`${width / 2}`}
          cy={`${height / 2}`}
          r="5"
          stroke={'#1c7ff9'}
          fill='none'
          ></circle>
          </svg>
      </div>
    );
  }
}

export default Sticky;
