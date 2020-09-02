import React from "react";
import "./Sticky.css";
import { StickyWidget } from "../types";

interface PropTypes {
  cursor: React.CSSProperties["cursor"];
  onContextMenu: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  onDragStart: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
  selected: boolean;
  widget: StickyWidget;
}

class Sticky extends React.Component<PropTypes> {
  dragging: boolean = false;
  initialX: number = 0;
  initialY: number = 0;

  handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onContextMenu, widget } = this.props;

    onContextMenu(widget.id, e);
  };

  handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onDragStart, widget } = this.props;

    onDragStart(widget.id, e);
  };

  render() {
    const {
      cursor,
      selected,
      widget: { x, y },
    } = this.props;
    return (
      <div
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleDragStart}
        style={{
          top: y,
          left: x,
          cursor: cursor === "crosshair" ? "crosshair" : "pointer",
          border: selected ? "2px solid blue" : "none",
        }}
        className="Sticky"
      />
    );
  }
}

export default Sticky;
