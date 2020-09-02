import React from "react";
import "./Sticky.css";
import { StickyWidget } from "../types";

interface PropTypes {
  cursor: React.CSSProperties["cursor"];
  onContextMenu: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onDrag: (id: string, spec: Partial<StickyWidget>) => void;
  widget: StickyWidget;
}

class Sticky extends React.PureComponent<PropTypes> {
  dragging: boolean = false;
  initialX: number = 0;
  initialY: number = 0;

  handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onContextMenu, widget } = this.props;

    onContextMenu(widget.id, e);
  };

  handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    this.dragging = true;
    this.initialX = e.clientX;
    this.initialY = e.clientY;
  };

  handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.dragging) return;

    const { onDrag, widget } = this.props;

    onDrag(widget.id, {
      x: e.clientX - this.initialX + widget.x,
      y: e.clientY - this.initialY + widget.y,
    });

    this.initialX = e.clientX;
    this.initialY = e.clientY;
  };

  handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    this.dragging = false;
  };

  render() {
    const {
      cursor,
      widget: { x, y },
    } = this.props;
    return (
      <div
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleDragStart}
        onMouseMove={this.handleDragMove}
        onMouseUp={this.handleDragEnd}
        style={{
          top: y,
          left: x,
          cursor: cursor === "crosshair" ? "crosshair" : "pointer",
        }}
        className="Sticky"
      />
    );
  }
}

export default Sticky;
