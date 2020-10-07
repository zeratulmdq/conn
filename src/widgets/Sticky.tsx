import React from "react";
import "./Sticky.css";
import { StickyWidget } from "../types";

interface PropTypes {
  cursor: React.CSSProperties["cursor"];
  onClick: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
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

  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick, widget } = this.props;
    onClick(widget.id, e);
  };

  handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onDragStart, widget } = this.props;
    onDragStart(widget.id, e);
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
        onClick={this.handleClick}
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
      />
    );
  }
}

export default Sticky;
