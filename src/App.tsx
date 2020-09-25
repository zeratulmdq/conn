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
      const startWidget = prevState.widgets[prevState.initialId || ""];
      const endWidget = prevState.widgets[id];
      const points: Point[] = [];
      const isHorizontalConnection = Math.abs(
        (startWidget.x - endWidget.x) / (startWidget.y - endWidget.y)
      ) > 1;

      const arrow = {
        ...arrowFactory({ start: prevState.initialId, end: id }),
        points,
        initialIsHorizontal: isHorizontalConnection,
      };

      if (startWidget.x + startWidget.width + TOLERANCE < endWidget.x) {
        if (isHorizontalConnection) {
          points[0] = {
            x: startWidget.x + startWidget.width,
            y: startWidget.y + startWidget.height / 2,
            type: "right",
          };
          points[1] = {
            x: endWidget.x,
            y: endWidget.y + endWidget.height / 2,
            type: "left",
          };
        } else {
          if (startWidget.y + startWidget.height + TOLERANCE < endWidget.y) {
            points[0] = {
              x: startWidget.x + startWidget.width / 2,
              y: startWidget.y + startWidget.height,
              type: "bottom",
            };
            points[1] = {
              x: endWidget.x + endWidget.width / 2,
              y: endWidget.y,
              type: "top",
            };
          } else {
            points[0] = {
              x: startWidget.x + startWidget.width / 2,
              y: startWidget.y,
              type: "top",
            };
            points[1] = {
              x: endWidget.x + endWidget.width / 2,
              y: endWidget.y + endWidget.height,
              type: "bottom",
            };
          }
        }
      } else {
        if (isHorizontalConnection) {
          points[0] = {
            x: startWidget.x,
            y: startWidget.y + startWidget.height / 2,
            type: "left",
          };
          points[1] = {
            x: endWidget.x + endWidget.width,
            y: endWidget.y + endWidget.height / 2,
            type: "right",
          };
        } else {
          if (startWidget.y + startWidget.height + TOLERANCE < endWidget.y) {
            points[0] = {
              x: startWidget.x + startWidget.width / 2,
              y: startWidget.y + startWidget.height,
              type: "bottom",
            };
            points[1] = {
              x: endWidget.x + endWidget.width / 2,
              y: endWidget.y,
              type: "top",
            };
          } else {
            points[0] = {
              x: startWidget.x + startWidget.width / 2,
              y: startWidget.y,
              type: "top",
            };
            points[1] = {
              x: endWidget.x + endWidget.width / 2,
              y: endWidget.y + endWidget.height,
              type: "bottom",
            };
          }
        }
      }
      
      this.updateArrowChartBranch(arrow, prevState.widgets, true);

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
          this.updateArrow(arrow, prevState.widgets, prevState.dragging, dragged);

          this.updateArrowChartBranch(arrow, prevState.widgets, true);

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
          this.updateArrowChartSide(arrow, startWidget, endWidget);
          arrow.arrowType = "chartSide";
          // swap axis for new chartSide creation
          arrow.initialIsHorizontal = !arrow.initialIsHorizontal;
        }
        
        if(arrow.end === prevState.dragging) {
          this.updateArrowChartBranch(arrow, prevState.widgets, false);
        }

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

  updateArrowChartBranch(arrow: ArrowWidget, widgets: Record<string, Widget>, ignoreLoneSide: boolean) {
    // if(arrow.arrowType === "chartSide") return;

    // don't recalculate if chartBranchSide didn't change
    if(!arrow.chartBranchSide || arrow.chartBranchSide !== arrow.points[0].type) {
      
      const chartBranchArrow = this.getSharedChartBranch(arrow, widgets);
      // don't force chartBranching while dragging on a new side of the origin widget
      if(ignoreLoneSide && !chartBranchArrow) return;
        
      // console.log(`updateArrowChartBranch originType: ${arrow.points[0].type} chartBranchArrow: ${chartBranchArrow}  chartBranchPosition: ${chartBranchArrow?.chartBranchPosition}`)
      arrow.arrowType = "chartBranch";
      arrow.chartBranchSide = arrow.points[0].type;
      if(chartBranchArrow) {
        arrow.chartBranchPosition = chartBranchArrow.chartBranchPosition;
      } else {
        // fix 2nd segment position to X or Y depending on orientation of the arrow
        if(arrow.points[0].type === "left" || arrow.points[0].type === "right") {
          arrow.chartBranchPosition = arrow.points[0].x + ((arrow.points[1].x - arrow.points[0].x) / 2);
        } else {
          arrow.chartBranchPosition = arrow.points[0].y + ((arrow.points[1].y - arrow.points[0].y) / 2);
        }
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
      connectedArrow !== arrow &&
      connectedArrow.arrowType === "chartBranch" &&
      connectedArrow.points[0].type === arrow.points[0].type &&
      connectedArrow.chartBranchPosition);
  }
  
  // updates arrow points (start/end) in both position and type
  updateArrow(arrow: ArrowWidget, widgets: Record<string, Widget>, draggingWidgetId: string | null, draggingWidget: StickyWidget) {
    const startPoint = arrow.points[0];
    const endPoint = arrow.points[1];
    
    const startWidget = arrow.start === draggingWidgetId ? draggingWidget :
    widgets[arrow.start || ""] as StickyWidget;
    const endWidget = arrow.end === draggingWidgetId ? draggingWidget :
    widgets[arrow.end || ""] as StickyWidget;

    // initial dummy values
    let points: Point[] = [{type: startPoint.type, x: 0, y: 0}, {type: endPoint.type, x: 1, y: 0}];

    if (arrow.end === draggingWidgetId) {

      if (startPoint.type === "right") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x + TOLERANCE < endPoint.x) {
          points[1].type = "left";
          // Else, we check which point is higher so we can switch our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          points[0].type = "bottom";
          points[1].type = "top";
          // Final else, it's the only remaining option
        } else {
          points[0].type = "top";
          points[1].type = "bottom";
        }
      }

      if (startPoint.type === "left") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x - TOLERANCE < endPoint.x) {
          points[1].type = "right";
          // Else, we check which point is higher so we can swith our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          points[0].type = "bottom";
          points[1].type = "top";
          // Final else, it's the only remaining option
        } else {
          points[0].type = "top";
          points[1].type = "bottom";
        }
      }

      // If start point is bottom, it means endpoint is top, trust me.
      if (startPoint.type === "bottom") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y + TOLERANCE < endPoint.y) {
          points[1].type = "top";
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          points[0].type = "right";
          points[1].type = "left";
          // Finally, we know the start point is "righter" than the end one
        } else {
          points[0].type = "left";
          points[1].type = "right";
        }
      }

      if (startPoint.type === "top") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y - TOLERANCE > endPoint.y) {
          points[1].type = "bottom";
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          points[0].type = "right";
          points[1].type = "left";
          // Finally, we know the start point is "righter" than the end one
        } else {
          points[0].type = "left";
          points[1].type = "right";
        }
      }
    }

    if (arrow.start === draggingWidgetId) {

      if (startPoint.type === "right") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x + TOLERANCE < endPoint.x) {
          points[0].type = "right";
          // Else, we check which point is higher so we can swith our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          points[0].type = "bottom";
          points[1].type = "top";
          // Final else, it's the only remaining option
        } else {
          points[0].type = "top";
          points[1].type = "bottom";
        }
      }

      if (startPoint.type === "left") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x - TOLERANCE > endPoint.x) {
          points[0].type = "left";
          // Else, we check which point is higher so we can switch our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          points[0].type = "bottom";
          points[1].type = "top";
          // Final else, it's the only remaining option
        } else {
          points[0].type = "top";
          points[1].type = "bottom";
        }
      }

      // If start point is bottom, it means endpoint is top, trust me.
      if (startPoint.type === "bottom") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y + TOLERANCE < endPoint.y) {
          points[0].type = "bottom";
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          points[0].type = "right";
          points[1].type = "left";
          // Finally, we know the start point is "righter" than the end one
        } else {
          points[0].type = "left";
          points[1].type = "right";
        }
      }

      if (startPoint.type === "top") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y - TOLERANCE > endPoint.y) {
          points[0].type = "top";
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          points[0].type = "right";
          points[1].type = "left";
          // Finally, we know the start point is "righter" than the end one
        } else {
          points[0].type = "left";
          points[1].type = "right";
        }
      }
    }

    // chartBranch connector
    points[0] = this.getArrowPointMidPosition(points[0], startWidget);
    points[1] = this.getArrowPointMidPosition(points[1], endWidget);
    arrow.points = points;

    // charSide connector
    if(this.isChartSideArrow(arrow, widgets)) {
      this.updateArrowChartSide(arrow, startWidget, endWidget);
    }
  }

  isChartSideArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    // can't be chartSide if there is any chartBranch
    if(this.getSharedChartBranch(arrow, widgets)) return;

    // chartSide arrows can only be created from "initial" and "chartSide" arrows
    return ((arrow.initialIsHorizontal && (arrow.points[0].type === "top" || arrow.points[0].type === "bottom")) ||
    (!arrow.initialIsHorizontal && (arrow.points[0].type === "left" || arrow.points[0].type === "right")));
  }

  updateArrowChartSide(arrow: ArrowWidget, startWidget: StickyWidget, endWidget: StickyWidget) {
    // chartSide connector
    if(arrow.initialIsHorizontal) {
      const middleX = this.getIntersectionMiddle(startWidget.x, startWidget.width, endWidget.x, endWidget.width);
      if(middleX) {
        arrow.points[0].x = middleX;
        arrow.points[1].x = middleX;
      }
    } else {
      const middleY = this.getIntersectionMiddle(startWidget.y, startWidget.height, endWidget.y, endWidget.height);
      if(middleY) {
        arrow.points[0].y = middleY;
        arrow.points[1].y = middleY;
      }
    }
  }

  getIntersectionMiddle(min1: number, size1: number, min2: number, size2: number) {
    const max1 = min1 + size1;
    const max2 = min2 + size2;

    if(min1 === min2 && max1 === max2) {
      return 0;
    }

    // TODO: implement margin of 10
    if((min1 > min2 && min1 < max2)) {
      return min1 + ((max2 - min1) / 2);
    } else if(max1 > min2 && max1 < max2) {
      return max1 - ((max1 - min2) / 2);
    }

    // no intersection
    return null;
  }
  
  getArrowPointMidPosition(point: Point, widget: StickyWidget) {
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
