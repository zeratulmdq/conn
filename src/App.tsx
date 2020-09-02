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
  initialId: string | null;
  widgets: Record<string, Widget>;
}

class App extends React.PureComponent<{}, State> {
  ref: HTMLDivElement | null = null;

  state: State = {
    cursor: "auto",
    initialId: null,
    widgets: {},
  };

  constructor(props: any) {
    super(props);

    (window as any).sarlanga = this;
  }

  handleContextMenu = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.state.initialId) {
      this.setState({
        initialId: id,
        cursor: "crosshair",
      });
      return;
    }

    if (this.state.initialId === id) {
      this.setState({
        initialId: null,
        cursor: "auto",
      });
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
      widgets: {
        ...prevState.widgets,
        [s.id]: s,
      },
    }));
  };

  handleDrag = (draggingWidgetId: string, spec: Partial<StickyWidget>) => {
    this.setState((prevState) => {
      const dragged = {
        ...prevState.widgets[draggingWidgetId],
        ...spec,
      } as StickyWidget;

      const connected = Object.values(prevState.widgets)
        .filter(
          (w) =>
            w.type === "arrow" &&
            (w.start === draggingWidgetId || w.end === draggingWidgetId)
        )
        .reduce((acc, cur) => {
          const flecha = cur as ArrowWidget;
          const startWidget = prevState.widgets[
            flecha.start || ""
          ] as StickyWidget;

          const startPoint = flecha.points[0];
          const endPoint = flecha.points[1];

          if (flecha.end === draggingWidgetId) {
            if (startPoint.type === "right") {
              // If the start.x + tolerance is lower than end.x, we keep things
              // as they are
              if (startPoint.x + TOLERANCE < endPoint.x) {
                flecha.points[1] = {
                  type: "left",
                  x: dragged.x,
                  y: dragged.y + dragged.height / 2,
                };
                // Else, we check which point is higher so we can swith our point
                // types and re-order the connections
              } else if (startPoint.y + TOLERANCE < endPoint.y) {
                flecha.points[0] = {
                  type: "bottom",
                  x: startWidget.x + startWidget.width / 2,
                  y: startWidget.y + startWidget.height,
                };
                flecha.points[1] = {
                  type: "top",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y,
                };
                // Final else, it's the only remaining option
              } else {
                flecha.points[0] = {
                  type: "top",
                  x: startWidget.x + startWidget.width / 2,
                  y: startWidget.y,
                };
                flecha.points[1] = {
                  type: "bottom",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y + dragged.height,
                };
              }
            }

            if (startPoint.type === "left") {
              // If the start.x + tolerance is lower than end.x, we keep things
              // as they are
              if (startPoint.x - TOLERANCE < endPoint.x) {
                flecha.points[1] = {
                  type: "right",
                  x: dragged.x + dragged.width,
                  y: dragged.y + dragged.height / 2,
                };
                // Else, we check which point is higher so we can swith our point
                // types and re-order the connections
              } else if (startPoint.y + TOLERANCE < endPoint.y) {
                flecha.points[0] = {
                  type: "bottom",
                  x: startWidget.x + startWidget.width / 2,
                  y: startWidget.y + startWidget.height,
                };
                flecha.points[1] = {
                  type: "top",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y,
                };
                // Final else, it's the only remaining option
              } else {
                flecha.points[0] = {
                  type: "top",
                  x: startWidget.x + startWidget.width / 2,
                  y: startWidget.y,
                };
                flecha.points[1] = {
                  type: "bottom",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y + dragged.height,
                };
              }
            }

            // If start point is bottom, it means endpoint is top, trust me.
            if (startPoint.type === "bottom") {
              // If the start.y + tolerance is lower than end.y, we keep things
              // as they are
              if (startPoint.y + TOLERANCE < endPoint.y) {
                flecha.points[1] = {
                  type: "top",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y,
                };
                // Else, we check if the start point is "lefter" than the end
                // point
              } else if (startPoint.x + TOLERANCE < endPoint.x) {
                flecha.points[0] = {
                  type: "right",
                  x: startWidget.x + startWidget.width,
                  y: startWidget.y + startWidget.height / 2,
                };
                flecha.points[1] = {
                  type: "left",
                  x: dragged.x,
                  y: dragged.y + dragged.height / 2,
                };
                // Finally, we know the start point is "righter" than the end one
              } else {
                flecha.points[0] = {
                  type: "left",
                  x: startWidget.x,
                  y: startWidget.y + startWidget.width / 2,
                };
                flecha.points[1] = {
                  type: "right",
                  x: dragged.x + dragged.width,
                  y: dragged.y + dragged.height / 2,
                };
              }
            }

            if (startPoint.type === "top") {
              // If the start.y + tolerance is lower than end.y, we keep things
              // as they are
              if (startPoint.y - TOLERANCE > endPoint.y) {
                flecha.points[1] = {
                  type: "bottom",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y + dragged.height,
                };
                // Else, we check if the start point is "lefter" than the end
                // point
              } else if (startPoint.x + TOLERANCE < endPoint.x) {
                flecha.points[0] = {
                  type: "right",
                  x: startWidget.x + startWidget.width,
                  y: startWidget.y + startWidget.height / 2,
                };
                flecha.points[1] = {
                  type: "left",
                  x: dragged.x,
                  y: dragged.y + dragged.height / 2,
                };
                // Finally, we know the start point is "righter" than the end one
              } else {
                flecha.points[0] = {
                  type: "left",
                  x: startWidget.x,
                  y: startWidget.y + startWidget.width / 2,
                };
                flecha.points[1] = {
                  type: "right",
                  x: dragged.x + dragged.width,
                  y: dragged.y + dragged.height / 2,
                };
              }
            }
          }

          if (flecha.start === draggingWidgetId) {
            const endWidget = prevState.widgets[
              flecha.end || ""
            ] as StickyWidget;

            if (startPoint.type === "right") {
              // If the start.x + tolerance is lower than end.x, we keep things
              // as they are
              if (startPoint.x + TOLERANCE < endPoint.x) {
                flecha.points[0] = {
                  type: "right",
                  x: dragged.x + dragged.width,
                  y: dragged.y + dragged.height / 2,
                };
                // Else, we check which point is higher so we can swith our point
                // types and re-order the connections
              } else if (startPoint.y + TOLERANCE < endPoint.y) {
                flecha.points[0] = {
                  type: "bottom",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y + dragged.height,
                };
                flecha.points[1] = {
                  type: "top",
                  x: endWidget.x + endWidget.width / 2,
                  y: endWidget.y,
                };
                // Final else, it's the only remaining option
              } else {
                flecha.points[0] = {
                  type: "top",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y,
                };
                flecha.points[1] = {
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
                flecha.points[0] = {
                  type: "left",
                  x: dragged.x,
                  y: dragged.y + dragged.height / 2,
                };
                // Else, we check which point is higher so we can swith our point
                // types and re-order the connections
              } else if (startPoint.y + TOLERANCE < endPoint.y) {
                flecha.points[0] = {
                  type: "bottom",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y + dragged.height,
                };
                flecha.points[1] = {
                  type: "top",
                  x: endWidget.x + endWidget.width / 2,
                  y: endWidget.y,
                };
                // Final else, it's the only remaining option
              } else {
                flecha.points[0] = {
                  type: "top",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y,
                };
                flecha.points[1] = {
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
                flecha.points[0] = {
                  type: "bottom",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y + dragged.height,
                };
                // Else, we check if the start point is "lefter" than the end
                // point
              } else if (startPoint.x + TOLERANCE < endPoint.x) {
                flecha.points[0] = {
                  type: "right",
                  x: dragged.x + dragged.width,
                  y: dragged.y + dragged.height / 2,
                };
                flecha.points[1] = {
                  type: "left",
                  x: endWidget.x,
                  y: endWidget.y + endWidget.height / 2,
                };
                // Finally, we know the start point is "righter" than the end one
              } else {
                flecha.points[0] = {
                  type: "left",
                  x: dragged.x,
                  y: dragged.y + dragged.width / 2,
                };
                flecha.points[1] = {
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
                flecha.points[0] = {
                  type: "top",
                  x: dragged.x + dragged.width / 2,
                  y: dragged.y,
                };
                // Else, we check if the start point is "lefter" than the end
                // point
              } else if (startPoint.x + TOLERANCE < endPoint.x) {
                flecha.points[0] = {
                  type: "right",
                  x: dragged.x + dragged.width,
                  y: dragged.y + dragged.height / 2,
                };
                flecha.points[1] = {
                  type: "left",
                  x: endWidget.x,
                  y: endWidget.y + endWidget.height / 2,
                };
                // Finally, we know the start point is "righter" than the end one
              } else {
                flecha.points[0] = {
                  type: "left",
                  x: dragged.x,
                  y: dragged.y + dragged.width / 2,
                };
                flecha.points[1] = {
                  type: "right",
                  x: endWidget.x + endWidget.width,
                  y: endWidget.y + endWidget.height / 2,
                };
              }
            }
          }

          return {
            ...acc,
            [flecha.id]: {
              ...flecha,
            },
          };
        }, {} as Record<string, Widget>);

      return {
        widgets: {
          ...prevState.widgets,
          [draggingWidgetId]: dragged,
          ...connected,
        },
      };
    });
  };

  handleRef = (ref: HTMLDivElement) => (this.ref = ref);

  render() {
    const { cursor, widgets } = this.state;
    return (
      <div
        style={{ cursor }}
        className="App"
        onDoubleClick={this.handleDoubleClick}
        ref={this.handleRef}
      >
        {Object.values(widgets).map((w) => {
          if (w.type === "sticky") {
            return (
              <Sticky
                cursor={cursor}
                onContextMenu={this.handleContextMenu}
                onDrag={this.handleDrag}
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
