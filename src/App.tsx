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
      const arrow = {
        ...arrowFactory({ start: prevState.initialId, end: id }),
        points,
      };
      // relation > 1 horizontal line
      const relation = Math.abs(
        (startWidget.x - endWidget.x) / (startWidget.y - endWidget.y)
      );

      if (startWidget.x + startWidget.width + TOLERANCE < endWidget.x) {
        if (relation > 1) {
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
        if (relation > 1) {
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
    if(arrow.arrowType === "chartSide") return;

    // don't recalculate if chartSide didn't change
    if(!arrow.chartBranchSide || arrow.chartBranchSide !== arrow.points[0].type) {

      // all arrows connected to "start" widget
      const originArrows = Object.values(widgets)
      .filter(
        (w) =>
          w.type === "arrow" &&
          (w.start === arrow.start)
      ).map(w=> w as ArrowWidget);
      
      // find another arrow that share same origin point and already has chartBranchPosition fixed
      const chartBranchArrow = originArrows.find(connectedArrow =>
        connectedArrow !== arrow &&
        connectedArrow.arrowType === "chartBranch" &&
        connectedArrow.points[0].type === arrow.points[0].type &&
        connectedArrow.chartBranchPosition);

      // don't force chartBranching while dragging on a new side of the origin widget
      if(ignoreLoneSide && !chartBranchArrow) return;
        
      console.log(`updateArrowChartBranch originType: ${arrow.points[0].type} chartBranchArrow: ${chartBranchArrow}  chartBranchPosition: ${chartBranchArrow?.chartBranchPosition}`)
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
  
  // updates arrow points (start/end), both position and type
  updateArrow(arrow: ArrowWidget, widgets: Record<string, Widget>, draggingWidgetId: string | null, draggedWidget: StickyWidget) {
    const startPoint = arrow.points[0];
    const endPoint = arrow.points[1];

    if (arrow.end === draggingWidgetId) {
      const startWidget = widgets[
        arrow.start || ""
      ] as StickyWidget;

      if (startPoint.type === "right") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x + TOLERANCE < endPoint.x) {
          arrow.points[1] = {
            type: "left",
            x: draggedWidget.x,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          // Else, we check which point is higher so we can switch our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          arrow.points[0] = {
            type: "bottom",
            x: startWidget.x + startWidget.width / 2,
            y: startWidget.y + startWidget.height,
          };
          arrow.points[1] = {
            type: "top",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y,
          };
          // Final else, it's the only remaining option
        } else {
          arrow.points[0] = {
            type: "top",
            x: startWidget.x + startWidget.width / 2,
            y: startWidget.y,
          };
          arrow.points[1] = {
            type: "bottom",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y + draggedWidget.height,
          };
        }
      }

      if (startPoint.type === "left") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x - TOLERANCE < endPoint.x) {
          arrow.points[1] = {
            type: "right",
            x: draggedWidget.x + draggedWidget.width,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          // Else, we check which point is higher so we can swith our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          arrow.points[0] = {
            type: "bottom",
            x: startWidget.x + startWidget.width / 2,
            y: startWidget.y + startWidget.height,
          };
          arrow.points[1] = {
            type: "top",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y,
          };
          // Final else, it's the only remaining option
        } else {
          arrow.points[0] = {
            type: "top",
            x: startWidget.x + startWidget.width / 2,
            y: startWidget.y,
          };
          arrow.points[1] = {
            type: "bottom",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y + draggedWidget.height,
          };
        }
      }

      // If start point is bottom, it means endpoint is top, trust me.
      if (startPoint.type === "bottom") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y + TOLERANCE < endPoint.y) {
          arrow.points[1] = {
            type: "top",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y,
          };
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          arrow.points[0] = {
            type: "right",
            x: startWidget.x + startWidget.width,
            y: startWidget.y + startWidget.height / 2,
          };
          arrow.points[1] = {
            type: "left",
            x: draggedWidget.x,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          // Finally, we know the start point is "righter" than the end one
        } else {
          arrow.points[0] = {
            type: "left",
            x: startWidget.x,
            y: startWidget.y + startWidget.width / 2,
          };
          arrow.points[1] = {
            type: "right",
            x: draggedWidget.x + draggedWidget.width,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
        }
      }

      if (startPoint.type === "top") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y - TOLERANCE > endPoint.y) {
          arrow.points[1] = {
            type: "bottom",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y + draggedWidget.height,
          };
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          arrow.points[0] = {
            type: "right",
            x: startWidget.x + startWidget.width,
            y: startWidget.y + startWidget.height / 2,
          };
          arrow.points[1] = {
            type: "left",
            x: draggedWidget.x,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          // Finally, we know the start point is "righter" than the end one
        } else {
          arrow.points[0] = {
            type: "left",
            x: startWidget.x,
            y: startWidget.y + startWidget.width / 2,
          };
          arrow.points[1] = {
            type: "right",
            x: draggedWidget.x + draggedWidget.width,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
        }
      }
    }

    if (arrow.start === draggingWidgetId) {
      const endWidget = widgets[
        arrow.end || ""
      ] as StickyWidget;

      if (startPoint.type === "right") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x + TOLERANCE < endPoint.x) {
          arrow.points[0] = {
            type: "right",
            x: draggedWidget.x + draggedWidget.width,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          // Else, we check which point is higher so we can swith our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          arrow.points[0] = {
            type: "bottom",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y + draggedWidget.height,
          };
          arrow.points[1] = {
            type: "top",
            x: endWidget.x + endWidget.width / 2,
            y: endWidget.y,
          };
          // Final else, it's the only remaining option
        } else {
          arrow.points[0] = {
            type: "top",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y,
          };
          arrow.points[1] = {
            type: "bottom",
            x: endWidget.x + endWidget.width / 2,
            y: endWidget.y + endWidget.height,
          };
        }
      }

      if (startPoint.type === "left") {
        // If the start.x + tolerance is lower than end.x, we keep things
        // as they are
        if (startPoint.x - TOLERANCE > endPoint.x) {
          arrow.points[0] = {
            type: "left",
            x: draggedWidget.x,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          // Else, we check which point is higher so we can switch our point
          // types and re-order the connections
        } else if (startPoint.y + TOLERANCE < endPoint.y) {
          arrow.points[0] = {
            type: "bottom",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y + draggedWidget.height,
          };
          arrow.points[1] = {
            type: "top",
            x: endWidget.x + endWidget.width / 2,
            y: endWidget.y,
          };
          // Final else, it's the only remaining option
        } else {
          arrow.points[0] = {
            type: "top",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y,
          };
          arrow.points[1] = {
            type: "bottom",
            x: endWidget.x + endWidget.width / 2,
            y: endWidget.y + endWidget.height,
          };
        }
      }

      // If start point is bottom, it means endpoint is top, trust me.
      if (startPoint.type === "bottom") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y + TOLERANCE < endPoint.y) {
          arrow.points[0] = {
            type: "bottom",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y + draggedWidget.height,
          };
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          arrow.points[0] = {
            type: "right",
            x: draggedWidget.x + draggedWidget.width,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          arrow.points[1] = {
            type: "left",
            x: endWidget.x,
            y: endWidget.y + endWidget.height / 2,
          };
          // Finally, we know the start point is "righter" than the end one
        } else {
          arrow.points[0] = {
            type: "left",
            x: draggedWidget.x,
            y: draggedWidget.y + draggedWidget.width / 2,
          };
          arrow.points[1] = {
            type: "right",
            x: endWidget.x + endWidget.width,
            y: endWidget.y + endWidget.height / 2,
          };
        }
      }

      if (startPoint.type === "top") {
        // If the start.y + tolerance is lower than end.y, we keep things
        // as they are
        if (startPoint.y - TOLERANCE > endPoint.y) {
          arrow.points[0] = {
            type: "top",
            x: draggedWidget.x + draggedWidget.width / 2,
            y: draggedWidget.y,
          };
          // Else, we check if the start point is "lefter" than the end
          // point
        } else if (startPoint.x + TOLERANCE < endPoint.x) {
          arrow.points[0] = {
            type: "right",
            x: draggedWidget.x + draggedWidget.width,
            y: draggedWidget.y + draggedWidget.height / 2,
          };
          arrow.points[1] = {
            type: "left",
            x: endWidget.x,
            y: endWidget.y + endWidget.height / 2,
          };
          // Finally, we know the start point is "righter" than the end one
        } else {
          arrow.points[0] = {
            type: "left",
            x: draggedWidget.x,
            y: draggedWidget.y + draggedWidget.width / 2,
          };
          arrow.points[1] = {
            type: "right",
            x: endWidget.x + endWidget.width,
            y: endWidget.y + endWidget.height / 2,
          };
        }
      }
    }
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
