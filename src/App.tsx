import React from "react";
import "./App.css";
import Sticky from "./widgets/Sticky";
import {
  stickyFactory,
  Widget,
  StickyWidget,
  ArrowWidget,
  arrowFactory,
  Point,
} from "./types";
import Arrow from "./widgets/Arrow";

export const TOLERANCE = 10;
export const ARROW_MARGIN = 10;
export const TWO_SEGMENT_ARROW_MIN = 20;

interface State {
  cursor: React.CSSProperties["cursor"];
  dragging: string | null;
  initialId: string | null;
  initialX: number | null;
  initialY: number | null;
  lastX: number | null;
  lastY: number | null;
  selected: string | null;
  widgets: Record<string, Widget>;
}

class App extends React.Component<{}, State> {
  ref: HTMLDivElement | null = null;

  state: State = {
    cursor: "auto",
    dragging: null,
    initialId: null,
    initialX: null,
    initialY: null,
    lastX: null,
    lastY: null,
    selected: null,
    widgets: {},
  };

  cancelArrowCreation() {
      this.setState({
        initialId: null,
        cursor: "auto",
      });
  }
  
  handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => { 
    e.preventDefault();
    e.stopPropagation();

    if (this.state.initialId) {
      this.cancelArrowCreation();
    }
  }

  handleStickyRightClick = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // start arrow creation
    if (!this.state.initialId) {
      this.setState({
        initialId: id,
        cursor: "crosshair",
      });
      return;
    }

    if (this.state.initialId === id) {
      this.cancelArrowCreation();
      return;
    }

    this.setState((prevState) => {
      // create Arrow
      const startWidget = prevState.widgets[prevState.initialId || ""];
      const endWidget = prevState.widgets[id];
      const isHorizontalConnection = Math.abs((startWidget.x - endWidget.x) / (startWidget.y - endWidget.y)) > 1;
      const arrow = {
        ...arrowFactory({ start: prevState.initialId, end: id }),
        initialIsHorizontal: isHorizontalConnection,
      };

      this.updateArrow(arrow, prevState.widgets);

      return {
        ...prevState,
        cursor: "auto",
        initialId: null,
        widgets: {
          ...prevState.widgets,
          [arrow.id]: arrow,
        },
      };
    });
  };



  handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const s = stickyFactory({ x: e.clientX, y: e.clientY });
    this.setState((prevState) => ({
      selected: s.id,
      widgets: {
        ...prevState.widgets,
        [s.id]: s,
      },
    }));
  };

  handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    this.setState((prevState) => {
      if (!prevState.dragging || !prevState.lastX || !prevState.lastY)
        return { ...prevState };
      const dragged = {
        ...prevState.widgets[prevState.dragging],
      } as StickyWidget;

      dragged.x = dragged.x + clientX - prevState.lastX;
      dragged.y = dragged.y + clientY - prevState.lastY;

      const connectedArrows = Object.values(prevState.widgets)
        .filter(
          (w) =>
            w.type === "arrow" &&
            (w.start === prevState.dragging || w.end === prevState.dragging)
        )
        .reduce((acc, cur) => {
          const arrow = cur as ArrowWidget;
          this.updateArrow(arrow, prevState.widgets);

          return {
            ...acc,
            [arrow.id]: {
              ...arrow,
            },
          };
        }, {} as Record<string, Widget>);

      return {
        lastX: clientX,
        lastY: clientY,
        widgets: {
          ...prevState.widgets,
          [dragged.id]: dragged,
          ...connectedArrows,
        },
      };
    });
  };

  handleDragStart = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: initialX, clientY: initialY } = e;
    e.stopPropagation();

    if (e.button !== 0) return;

    this.setState({
      dragging: id,
      selected: id,
      initialX: initialX,
      initialY: initialY,
      lastX: initialX,
      lastY: initialY,
    });
  };

  handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Backspace" || e.key === "Delete") && this.state.selected) {
      this.setState((prevState) => {
        const id = prevState.selected || "";
        const prevWidgets = prevState.widgets;
        delete prevWidgets[id];

        Object.values(prevWidgets).forEach((w) => {
          if (w.type === "arrow" && (w.start === id || w.end === id))
            delete prevWidgets[w.id];
        });
        return {
          ...prevState,
          selected: null,
          widgets: { ...prevWidgets },
        };
      });
    }
  };

  handleMouseDown = () => {
    this.setState({ selected: null });
  };

  handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState((prevState) => {
      
      if (!prevState.dragging)
        return { ...prevState };
      
      const connectedArrows = Object.values(prevState.widgets)
      .filter(
        (w) =>
          w.type === "arrow" &&
          (w.start === prevState.dragging || w.end === prevState.dragging)
      ).map(w=> w as ArrowWidget)
      .reduce((acc, arrow) => {

        if(this.isChartSideArrow(arrow, prevState.widgets)) {
          const startWidget = prevState.widgets[arrow.start || ""] as StickyWidget;
          const endWidget = prevState.widgets[arrow.end || ""] as StickyWidget;
          if(this.updateArrowChartSide(arrow, startWidget, endWidget)) {
            arrow.arrowType = "chartSide";
          }
        }
        
        if(arrow.end === prevState.dragging) {
          this.setArrowChartBranch(arrow, prevState.widgets, false);
        }
        
        // update initial axis
        arrow.initialIsHorizontal = arrow.points[0].type === "left" || arrow.points[0].type === "right";

        return {
          ...acc,
          [arrow.id]: {
            ...arrow,
          },
        };
      }, {} as Record<string, Widget>);
      
      return {
        dragging: null,
        widgets: {
          ...prevState.widgets,
          ...connectedArrows,
        },
      };
    });
  };

  handleRef = (ref: HTMLDivElement) => (this.ref = ref);

  // finds if this side of the startWidget should be a branchChart and sets the corresponding chartBranchPosition
  setArrowChartBranch(arrow: ArrowWidget, widgets: Record<string, Widget>, ignoreEmptySide: boolean) {
    // don't recalculate if chartBranchSide didn't change
    if(arrow.chartBranchSide && arrow.points[0].type === arrow.chartBranchSide)
      return;
      
    const chartBranchArrow = this.getSharedChartBranch(arrow, widgets);
    // don't force chartBranching while dragging on an empty side of the origin widget
    if(ignoreEmptySide && !chartBranchArrow) return;
      
    arrow.arrowType = "chartBranch";
    arrow.chartBranchSide = arrow.points[0].type;
    if(chartBranchArrow) {
      arrow.chartBranchPosition = chartBranchArrow.chartBranchPosition;
    } else {
      // on new branch, set 2nd segment position to half the distance in X or Y depending on the orientation of the arrow
      if(arrow.points[0].type === "left" || arrow.points[0].type === "right") {
        arrow.chartBranchPosition = arrow.points[0].x + ((arrow.points[1].x - arrow.points[0].x) / 2);
      } else {
        arrow.chartBranchPosition = arrow.points[0].y + ((arrow.points[1].y - arrow.points[0].y) / 2);
      }
    }
    
  }

  // find another arrow that share same origin point and already has chartBranchPosition fixed
  getSharedChartBranch(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    // all arrows connected to "start" widget
    const originArrows = Object.values(widgets)
    .filter(
      (w) =>
        w.type === "arrow" &&
        (w.start === arrow.start)
    ).map(w=> w as ArrowWidget);

    return originArrows.find(connectedArrow =>
      connectedArrow.id !== arrow.id &&
      connectedArrow.arrowType === "chartBranch" &&
      connectedArrow.points[0].type === arrow.points[0].type &&
      connectedArrow.chartBranchPosition);
  }

  // updates arrow points (start/end) in both position and type
  updateArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    const startWidget = widgets[arrow.start || ""];
    const endWidget = widgets[arrow.end || ""];
    const isHorizontalStart = Math.abs((startWidget.x - endWidget.x) / (startWidget.y - endWidget.y)) > 1;

    // initial dummy values
    let points: Point[] = [{type: "right", x: 0, y: 0}, {type: "left", x: 1, y: 0}];

    if(isHorizontalStart) {
      if (startWidget.x + startWidget.width + TOLERANCE < endWidget.x) {
        points[0].type = "right";
        points[1].type = "left";
      } else {
        points[0].type = "left";
        points[1].type = "right";
      }
    } else {
      if (startWidget.y + startWidget.height + TOLERANCE < endWidget.y) {
        points[0].type = "bottom";
        points[1].type = "top";
      } else {
        points[0].type = "top";
        points[1].type = "bottom";
      }
    }

    // chartBranch connector
    points[0] = this.getWidgetSideMidPosition(points[0], startWidget);
    points[1] = this.getWidgetSideMidPosition(points[1], endWidget);
    arrow.points = points;

    // charSide connector
    if(this.isChartSideArrow(arrow, widgets)) {
      this.updateArrowChartSide(arrow, startWidget, endWidget);
    }
    
    // update chart branches state
    this.setArrowChartBranch(arrow, widgets, true);
    
    // update endWidget side and position for branches that require it
    // this is mainly used for a branched arrow whose widget is "behind" the branch fixed position 
    if(arrow.chartBranchPosition && arrow.points[0].type === arrow.chartBranchSide) {
      if(arrow.chartBranchSide === "left" || arrow.chartBranchSide === "right") {
        // if inside endWidget, use 2-segment arrow
        if(arrow.chartBranchPosition >= endWidget.x && arrow.chartBranchPosition <= endWidget.x + endWidget.width) {
          arrow.points[1].x = arrow.chartBranchPosition;
          arrow.points[1].y = (endWidget.y + endWidget.height/2) > arrow.points[0].y ? endWidget.y : endWidget.y + endWidget.height;
        // otherwise use regular 3-segment arrow but make sure it connects to the right side
        } else {
          arrow.points[1].type = arrow.chartBranchPosition < endWidget.x ? "left" : "right";
          points[1] = this.getWidgetSideMidPosition(points[1], endWidget);
        }
      } else {  // vertical
        if(arrow.chartBranchPosition >= endWidget.y && arrow.chartBranchPosition <= endWidget.y + endWidget.height) {
          // if inside endWidget, use 2-segment arrow
          arrow.points[1].x = (endWidget.x + endWidget.width/2) > arrow.points[0].x ? endWidget.x : endWidget.x + endWidget.width;
          arrow.points[1].y = arrow.chartBranchPosition;
        // otherwise use regular 3-segment arrow but make sure it connects to the right side
        } else {
          arrow.points[1].type = arrow.chartBranchPosition < endWidget.y ? "top" : "bottom";
          points[1] = this.getWidgetSideMidPosition(points[1], endWidget);
        }
      }
    }
  }
  
  isChartSideArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    // can't be chartSide if there is any chartBranch on current side
    if(this.getSharedChartBranch(arrow, widgets)) return;

    return ((arrow.initialIsHorizontal && (arrow.points[0].type === "top" || arrow.points[0].type === "bottom")) ||
    (!arrow.initialIsHorizontal && (arrow.points[0].type === "left" || arrow.points[0].type === "right")));
  }

  // returns true if using intersection chartSide
  updateArrowChartSide(arrow: ArrowWidget, startWidget: Widget, endWidget: Widget) {
    // if widgets limits are intersecting, use chartSide connector
    if(arrow.initialIsHorizontal) {
      const middleX = this.getIntersectionMiddle(startWidget.x, startWidget.width, endWidget.x, endWidget.width);
      if(middleX) {
        arrow.points[0].x = middleX;
        arrow.points[1].x = middleX;
        return true;
      }
    } else {
      const middleY = this.getIntersectionMiddle(startWidget.y, startWidget.height, endWidget.y, endWidget.height);
      if(middleY) {
        arrow.points[0].y = middleY;
        arrow.points[1].y = middleY;
        return true;
      }
    }

    // if there is no intersection, use original axis side
    if(arrow.initialIsHorizontal) {
      arrow.points[0].type = endWidget.x > startWidget.x + (startWidget.width / 2) ? "right" : "left";
    } else {
      arrow.points[0].type = endWidget.y > startWidget.y + (startWidget.height / 2) ? "bottom" : "top";
    }
    arrow.points[0] = this.getWidgetSideMidPosition(arrow.points[0], startWidget);
    
    const startWidgetCenter = {x: startWidget.x + (startWidget.width/2), y: startWidget.y + (startWidget.height/2)};
    const endWidgetCenter = {x: endWidget.x + (endWidget.width/2), y: endWidget.y + (endWidget.height/2)};
    const distX = Math.abs(startWidgetCenter.x - endWidgetCenter.x) - (startWidget.width/2 + endWidget.width/2);
    const distY = Math.abs(startWidgetCenter.y - endWidgetCenter.y) - (startWidget.height/2 + endWidget.height/2);
    const widgetsTooClose = arrow.initialIsHorizontal ? distX <= ARROW_MARGIN : distY <= ARROW_MARGIN;
    
    // if widgets are too close, use 2-segments arrow
    if(widgetsTooClose) {
      // never closer than 20px from origin and never less than 10px from target side
      if(arrow.initialIsHorizontal) {
        arrow.points[1].type = endWidget.y > arrow.points[0].y ? "top" : "bottom";
        let distXToCenter = startWidget.width/2 + Math.max(distX + ARROW_MARGIN, TWO_SEGMENT_ARROW_MIN);
        arrow.points[1].x = startWidgetCenter.x + (arrow.points[0].type === "right" ? distXToCenter : -distXToCenter);
        arrow.points[1].y = arrow.points[1].type === "top" ? endWidget.y : endWidget.y + endWidget.height;
      } else {
        arrow.points[1].type = endWidget.x > arrow.points[0].x ? "left" : "right";
        let distYToCenter = startWidget.height/2 + Math.max(distY + ARROW_MARGIN, TWO_SEGMENT_ARROW_MIN);
        arrow.points[1].x = arrow.points[1].type === "left" ? endWidget.x : endWidget.x + endWidget.width;
        arrow.points[1].y = startWidgetCenter.y + (arrow.points[0].type === "bottom" ? distYToCenter : -distYToCenter);
      }
    // otherwise use regular 3-segments arrow
    } else {
      if(arrow.initialIsHorizontal) {
        	arrow.points[1].type = arrow.points[0].type === "right" ? "left" : "right";
      } else {
        arrow.points[1].type = arrow.points[0].type === "bottom" ? "top" : "bottom";
      }
      arrow.points[1] = this.getWidgetSideMidPosition(arrow.points[1], endWidget);
    }

    return false;
  }

  // returns if any widgets are at "distance" or lower in the requested axis
  widgetsTooClose(a: Widget, b: Widget, distance: number, horizontal: boolean) {
    const aCenter = {x: a.x + (a.width/2), y: a.y + (a.height/2)};
    const bCenter = {x: b.x + (b.width/2), y: b.y + (b.height/2)};
    if(horizontal) {
      const distX = Math.abs(aCenter.x - bCenter.x) - (a.width/2 + b.width/2);
      return distX <= distance;
    }
    const distY = Math.abs(aCenter.y - bCenter.y) - (a.height/2 + b.height/2);
    return distY <= distance;
  }

  getIntersectionMiddle(min1: number, size1: number, min2: number, size2: number) {
    const max1 = min1 + size1;
    const max2 = min2 + size2;

    if((min1 === min2 && max1 === max2) ||
      (min1 > min2 && min1 < max2)) {
      const intersection = max2 - min1;
      if(intersection <= ARROW_MARGIN * 2) return null;
      
      return min1 + (intersection / 2);
    } else if(max1 > min2 && max1 < max2) {
      const intersection = max1 - min2;
      if(intersection <= ARROW_MARGIN * 2) return null;

      return max1 - (intersection / 2);
    }

    // no intersection
    return null;
  }
  
  getWidgetSideMidPosition(point: Point, widget: Widget) {
    let newPoint: Point = {type: point.type, x: 0, y: 0};
    switch(point.type) {
      case "top":
        newPoint.x = widget.x + widget.width / 2;
        newPoint.y = widget.y;
        break;
      case "right":
        newPoint.x = widget.x + widget.width;
        newPoint.y = widget.y + widget.height / 2;
        break;
      case "bottom":
        newPoint.x = widget.x + widget.width / 2;
        newPoint.y = widget.y + widget.height;
        break;
      case "left":
        newPoint.x = widget.x;
        newPoint.y = widget.y + widget.width / 2;
        break;
    }

    return newPoint;
  }

  render() {
    const { cursor, selected, widgets } = this.state;
    return (
      <div
        style={{ cursor }}
        className="App"
        tabIndex={1}
        onContextMenu={this.handleRightClick}
        onDoubleClick={this.handleDoubleClick}
        onKeyDown={this.handleKeyDown}
        onMouseMove={this.handleDrag}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        ref={this.handleRef}
      >
        {Object.values(widgets).map((w) => {
          if (w.type === "sticky") {
            return (
              <Sticky
                cursor={cursor}
                onRightClick={this.handleStickyRightClick}
                onDragStart={this.handleDragStart}
                selected={selected === w.id}
                widget={w}
                key={w.id}
              />
            );
          }

          if (w.type === "arrow") {
            return <Arrow widget={w} key={w.id} />;
          }

          return null;
        })}
      </div>
    );
  }
}

export default App;
