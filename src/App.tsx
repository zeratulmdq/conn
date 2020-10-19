import React, { CSSProperties } from "react";
import "./App.css";
import Sticky from "./widgets/Sticky";
import Arrow from "./widgets/Arrow";
import Checkbox from "./settings/Checkbox";
import {
  stickyFactory,
  Widget,
  StickyWidget,
  ArrowWidget,
  arrowFactory,
  Point,
  Position,
  toOrientation,
  ChartBranch,
} from "./types";

export const TOLERANCE = 10;
export const ARROW_MARGIN = 10;
export const TWO_SEGMENT_ARROW_MIN = 20;

export const settingsStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  width:"auto",
  height: "auto",
  borderStyle: "solid",
  backgroundColor: "lightgray",
  padding: 10,
};

interface State {
  settings:{
    stickToConvergentWidgetSide: boolean;
  };
  cursor: React.CSSProperties["cursor"];
  dragging: string[] | null;
  initialId: string | null;
  initialX: number | null;
  initialY: number | null;
  lastX: number | null;
  lastY: number | null;
  selected: string[] | null;
  widgets: Record<string, Widget>;
}

class App extends React.Component<{}, State> {
  ref: HTMLDivElement | null = null;

  state: State = {
    settings :{
      stickToConvergentWidgetSide: false,
    },
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
    this.setState((prevState) => {
      if(prevState.dragging && prevState.dragging.length) {
        // delete dragging arrow if any
        const draggingWidget = { ...prevState.widgets[prevState.dragging[0]] };
        if(draggingWidget.type === "arrow") {
          const prevWidgets = prevState.widgets;
          delete prevWidgets[draggingWidget.id];
          return {
            ...prevState,
            dragging: null,
            initialId: null,
            cursor: "auto",
            widgets: { ...prevWidgets },
          }
        }
      }

      return {
        ...prevState,
        dragging: null,
        initialId: null,
        cursor: "auto",
      }
    });
  }
  
  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.initialId) {
      this.cancelArrowCreation();
    }
  }

  handleStickyClick = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.state.initialId === id) {
      this.cancelArrowCreation();
      return;
    }

    if (this.state.cursor !== "crosshair")
      return;

    // start arrow creation
    if (!this.state.initialId) {
      const mousePosition: Position = {x: e.clientX, y: e.clientY };
      // this.setState({initialId: id});

      // create Arrow for dragging without end widget
      this.setState((prevState) => {
        const arrow = {
          ...arrowFactory({ start: id, end: null }),
        };

        this.updateDisconnectedArrow(arrow, prevState.widgets, mousePosition);

        return {
          ...prevState,
          initialId: id,
          widgets: {
            ...prevState.widgets,
            [arrow.id]: arrow,
          },
          dragging: [arrow.id],
          initialX: mousePosition.x,
          initialY: mousePosition.y,
          lastX: mousePosition.x,
          lastY: mousePosition.y,
        };
      });

      return;
    }
    
    this.setState((prevState) => {
      if (!prevState.dragging)
        return { ...prevState };
      
      const draggingArrow = { ...prevState.widgets[prevState.dragging[0]] } as ArrowWidget;
      const startWidget = prevState.widgets[draggingArrow.start ?? id];
      const endWidget = prevState.widgets[draggingArrow.end ?? id];

      // avoid duplicate arrow (same start and end)
      const duplicateArrow = Object.values(prevState.widgets).find(w => w.type==="arrow" && w.id !== draggingArrow.id && w.start === startWidget.id && w.end === endWidget.id);
      if(duplicateArrow) {
        return { ...prevState }
      }
      
      // update Arrow start/end and connect it to both widgets
      const isHorizontalConnection = Math.abs((startWidget.x - endWidget.x) / (startWidget.y - endWidget.y)) > 1;
      draggingArrow.start = startWidget.id;
      draggingArrow.end = endWidget.id;
      draggingArrow.initialIsHorizontal = isHorizontalConnection;

      this.updateArrow(draggingArrow, prevState.widgets);

      return {
        ...prevState,
        cursor: "auto",
        dragging: null,
        initialId: null,
        widgets: {
          ...prevState.widgets,
          [draggingArrow.id]: draggingArrow,
        },
      };
    });
  };

  handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // create rectangular stickies while holding CTRL down
    const stickyWidth = e.ctrlKey ? 150 : 100;
    const s = stickyFactory({ x: e.clientX, y: e.clientY, width: stickyWidth });
    this.setState((prevState) => ({
      selected: [s.id],
      widgets: {
        ...prevState.widgets,
        [s.id]: s,
      },
    }));
  };

  handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const mousePosition: Position = {x: e.clientX, y: e.clientY };

    this.setState((prevState) => {
      if (!prevState.dragging || !prevState.lastX || !prevState.lastY)
        return { ...prevState };
      
      const draggingWidgets = prevState.dragging.map(id => prevState.widgets[id]);
      if(draggingWidgets.length > 1 || draggingWidgets[0].type === "sticky") {
        console.log(draggingWidgets);
        const deltaX = mousePosition.x - prevState.lastX;
        const deltaY = mousePosition.y - prevState.lastY;

        // update connected arrows
        const connectedArrows = Object.values(prevState.widgets)
        .filter(
          (w) =>
            w.type === "arrow" &&
            prevState.dragging &&
            ((w.start && prevState.dragging.includes(w.start)) ||
            (w.end && prevState.dragging.includes(w.end))))
        .reduce((acc, cur) => {
          const arrow = cur as ArrowWidget;
          this.updateArrow(arrow, prevState.widgets);
          if (prevState.dragging &&
            ((arrow.start && prevState.dragging.includes(arrow.start)) &&
            (arrow.end && prevState.dragging.includes(arrow.end))) &&
            arrow.chartBranch && arrow.chartBranch.type === 'oneToOne') {
              arrow.chartBranch.position = arrow.chartBranch.position + (arrow.initialIsHorizontal ? deltaX / 2 : deltaY / 2);
            }
          
          return {
            ...acc,
            [arrow.id]: {
              ...arrow,
            },
          };
        }, {} as Record<string, Widget>);
        console.log({ connectedArrows });
    
        const movedWidgets: Record<string, Widget> = draggingWidgets.reduce((acc, cur) => {
          return {
            ...acc,
            [cur.id]: {
              ...cur,
              x: cur.x + deltaX,
              y: cur.y + deltaY,
            }
          };
        }, {});
        return {
          ...prevState,
          lastX: mousePosition.x,
          lastY: mousePosition.y,
          widgets: {
            ...prevState.widgets,
            ...movedWidgets,
            ...connectedArrows,
          }
        };
      } else if(draggingWidgets[0].type === "arrow") {
        const draggingArrow = { ...draggingWidgets[0] };
        // update arrow dragged end
        this.updateDisconnectedArrow(draggingArrow, prevState.widgets, mousePosition);
        
        return {
          lastX: mousePosition.x,
          lastY: mousePosition.y,
          widgets: {
            ...prevState.widgets,
            [draggingArrow.id]: draggingArrow,
          },
        };
      }

      return { ...prevState };
    });
  };

  handleMouseHoverSticky = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const mousePosition: Position = {x: e.clientX, y: e.clientY };
    
    this.setState((prevState) => {
      if (!prevState.dragging || !prevState.lastX || !prevState.lastY)
        return { ...prevState };
      
      // stick to widget when hovering while dragging
      const draggingWidgets = prevState.dragging.map(id => prevState.widgets[id]);
      if(draggingWidgets.length === 1 &&
        draggingWidgets[0].type === "arrow" &&
        draggingWidgets[0].start !== id &&
        draggingWidgets[0].end !== id) {
        const draggingArrow = { ...draggingWidgets[0] };
        // connect to widget and update arrow
        draggingArrow.start = draggingArrow.start ?? id;
        draggingArrow.end = draggingArrow.end ?? id;
        this.updateArrow(draggingArrow, prevState.widgets);
        
        return {
          lastX: mousePosition.x,
          lastY: mousePosition.y,
          widgets: {
            ...prevState.widgets,
            [draggingArrow.id]: draggingArrow,
          },
        };
      }
      return { ...prevState };
    });
  }

  handleMouseLeaveSticky = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const mousePosition: Position = {x: e.clientX, y: e.clientY };
    
    this.setState((prevState) => {
      if (!prevState.dragging || !prevState.lastX || !prevState.lastY)
        return { ...prevState };
      
        const draggingWidgets = prevState.dragging.map(id => prevState.widgets[id]);
        if(draggingWidgets.length === 1 &&
          draggingWidgets[0].type === "arrow" &&
          draggingWidgets[0].start && draggingWidgets[0].end &&
          (draggingWidgets[0].start === id ||
          draggingWidgets[0].end === id)) {
        // disconnect from widget and update arrow
        const draggingArrow = { ...draggingWidgets[0] };
        draggingArrow.start = draggingArrow.start === id ? null : draggingArrow.start;
        draggingArrow.end = draggingArrow.end === id ? null : draggingArrow.end;
        this.updateDisconnectedArrow(draggingArrow, prevState.widgets, mousePosition);
        
        return {
          lastX: mousePosition.x,
          lastY: mousePosition.y,
          widgets: {
            ...prevState.widgets,
            [draggingArrow.id]: draggingArrow,
          },
        };
      }
      return { ...prevState };
    });
  }

  handleWidgetDragStart = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX: initialX, clientY: initialY, shiftKey } = e;
    e.stopPropagation();

    if (e.button !== 0)
      return;

    if(this.state.dragging)
      return;

    const selected = (this.state.selected && (this.state.selected.includes(id) || shiftKey))
    ? !this.state.selected.includes(id)
      ? [...this.state.selected, id]
      : this.state.selected
    : [id];
    const dragging = (this.state.selected && this.state.selected.includes(id)) ? this.state.selected : [id];

    this.setState({
      dragging,
      selected,
      initialX: initialX,
      initialY: initialY,
      lastX: initialX,
      lastY: initialY,
    });
  };

  handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "c") {
      const newCursor = this.state.cursor === "auto" ? "crosshair" : "auto";
      if(newCursor === "auto") {
        this.cancelArrowCreation();
      } else {
        this.setState({
          cursor: newCursor,
        });
      }
    }

    if ((e.key === "Backspace" || e.key === "Delete") && !!this.state.selected) {
      this.setState((prevState) => {
        const selectedWidgetsId = prevState.selected || null;
        const prevWidgets = prevState.widgets;
        selectedWidgetsId?.forEach(id => {
          Object.values(prevWidgets).forEach((w) => {
            if (w.type === "arrow" && (w.start === id || w.end === id))
              delete prevWidgets[w.id];
          });
          delete prevWidgets[id]
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
      
      // ignore MouseUp when dragging arrows
      const draggingWidgets = prevState.dragging.map(id => prevState.widgets[id]);
      if(draggingWidgets.length === 1 && draggingWidgets[0].type === "arrow") {
        return { ...prevState };
      }
      
      const connectedArrows = Object.values(prevState.widgets)
      .filter(
        (w) =>
          w.type === "arrow" &&
          (((w.start && prevState.dragging?.includes(w.start)) || (w.end && prevState.dragging?.includes(w.end))))
      ).map(w=> w as ArrowWidget)
      .reduce((acc, arrow) => {

        // stick to your branch side
        if(!prevState.settings.stickToConvergentWidgetSide || arrow.arrowType !== "chartBranch") {
          if(this.isChartSideArrow(arrow, prevState.widgets)) {
            const startWidget = prevState.widgets[arrow.start || ""] as StickyWidget;
            const endWidget = prevState.widgets[arrow.end || ""] as StickyWidget;
            if(this.updateArrowChartSide(arrow, startWidget, endWidget)) {
              arrow.arrowType = "chartSide";
            }
          }
          
          // update chart branches state (for both start and end arrows)
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

  handleRef = (ref: HTMLDivElement) => {
    this.ref = ref;
    // start focused to listen for key presses
    if(this.ref) {
      this.ref.focus();
    }
  }

  // finds if this arrow should be a part of a branchChart
  setArrowChartBranch(arrow: ArrowWidget, widgets: Record<string, Widget>, dragging: boolean) {
    if(!this.state.settings.stickToConvergentWidgetSide && arrow.chartBranch) {
      // don't recalculate if chartBranchSide didn't change
      let convergencePoint = arrow.chartBranch.type === "manyToOne" ? arrow.points[1] : arrow.points[0];
      if(convergencePoint.type === arrow.chartBranch.convergenceSide)
      return;
    }
    
    const chartBranchArrow = this.getSharedChartBranchArrow(arrow, widgets);
    // don't force chartBranching while dragging on an empty side of the origin/end widget
    if(dragging && !chartBranchArrow) {
      arrow.chartBranch = null;
      return;
    }
  
    // don't set arrowType while dragging (wait until mouseUp)
    if(!dragging) {
      arrow.arrowType = "chartBranch";
    }
    
    if(chartBranchArrow && chartBranchArrow.chartBranch) {
      // become part of an existing chartBranch
      if(chartBranchArrow.chartBranch.type === "oneToOne") {
        // if we are just adding the 2nd arrow to this chartBranch, update type and convergenceSide beforehand
        if(chartBranchArrow.start === arrow.start ){
          chartBranchArrow.chartBranch.type = "oneToMany";
          chartBranchArrow.chartBranch.convergenceSide = arrow.points[0].type;
        } else {
          chartBranchArrow.chartBranch.type = "manyToOne";
          chartBranchArrow.chartBranch.convergenceSide = arrow.points[1].type;
        }
      }
      arrow.chartBranch = Object.assign({}, chartBranchArrow.chartBranch);
    } else {
      // new lonely charBranch arrow
      let chartBranch: ChartBranch = {
        position: 0,
        convergenceSide: arrow.points[0].type,
        type: "oneToOne"
      };
      // on new branch, set 2nd segment position to half the distance in X or Y depending on orientation 
      if(toOrientation(chartBranch.convergenceSide) === "horizontal") {
        chartBranch.position = arrow.points[0].x + ((arrow.points[1].x - arrow.points[0].x) / 2);
      } else {
        chartBranch.position = arrow.points[0].y + ((arrow.points[1].y - arrow.points[0].y) / 2);
      }
      arrow.chartBranch = chartBranch;
    }
  }

  // find another arrow that share same origin or end point and already has chartBranch defined
  getSharedChartBranchArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    const chartBranchArrows = Object.values(widgets)
    .filter(
      (w) =>
      w.type === "arrow" &&
      w.id !== arrow.id &&
      w.arrowType === "chartBranch" &&
      w.chartBranch &&
      ((w.start === arrow.start && w.points[0].type === arrow.points[0].type) ||
       (w.end === arrow.end && w.points[1].type === arrow.points[1].type))
    ).map(w => w as ArrowWidget);
    
    return chartBranchArrows.length > 0 ? chartBranchArrows[0] : null;
  }

  // used when dragging an arrow point that is connected to only one widget 
  updateDisconnectedArrow(arrow: ArrowWidget, widgets: Record<string, Widget>, draggingPosition: Position) {
    const startWidget = widgets[arrow.start || ""];
    const endWidget = widgets[arrow.end || ""];
    
    const connectedWidget = startWidget ? startWidget : endWidget;

    const startPosition: Position = startWidget ? {x: startWidget.x, y: startWidget.y } : draggingPosition;
    const endPosition: Position = endWidget ? {x: endWidget.x, y: endWidget.y } : draggingPosition;

    // initial dummy values
    let points: Point[] = [{type: "right", x: 0, y: 0}, {type: "left", x: 1, y: 0}];

    const isHorizontalStart = Math.abs((startPosition.x - endPosition.x) / (startPosition.y - endPosition.y)) > 1;
    // change connections depending on positioning (and wich side is the connectedWidget)
    if(isHorizontalStart) {
      if(connectedWidget.x + connectedWidget.width + TOLERANCE < draggingPosition.x) {
        points[0].type = startWidget ? "right" : "left";
        points[1].type = startWidget ? "left" : "right";
      } else {
        points[0].type = startWidget ? "left" : "right";
        points[1].type = startWidget ? "right" : "left";
      }
    } else {
      if (connectedWidget.y + connectedWidget.height + TOLERANCE < draggingPosition.y) {
        points[0].type = startWidget ? "bottom" : "top";
        points[1].type = startWidget ? "top" : "bottom";
      } else {
        points[0].type = startWidget ? "top" : "bottom";
        points[1].type = startWidget ? "bottom" : "top";
      }
    }
    points[0] = startWidget ? this.getWidgetSideMidPosition(points[0], startWidget) : {...points[0], x: draggingPosition.x, y: draggingPosition.y};
    points[1] = endWidget ? this.getWidgetSideMidPosition(points[1], endWidget) : {...points[1], x: draggingPosition.x, y: draggingPosition.y};
    arrow.points = points;
  }

  // updates arrow points (start/end) in both position and type
  updateArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    const startWidget = widgets[arrow.start || ""];
    const endWidget = widgets[arrow.end || ""];
    
    // initial dummy values
    let points: Point[] = [{type: "right", x: 0, y: 0}, {type: "left", x: 1, y: 0}];
    
    if(arrow.points.length === 2) {
      points = arrow.points;
    }
    
    // stick to your branch side
    if(!this.state.settings.stickToConvergentWidgetSide || arrow.arrowType !== "chartBranch") {
      const isHorizontalStart = Math.abs((startWidget.x - endWidget.x) / (startWidget.y - endWidget.y)) > 1;
      // change connections depending on positioning
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
      points[0] = this.getWidgetSideMidPosition(points[0], startWidget);
      points[1] = this.getWidgetSideMidPosition(points[1], endWidget);
      arrow.points = points;
      
      // check if being a chartSide arrow
      if(this.isChartSideArrow(arrow, widgets)) {
        this.updateArrowChartSide(arrow, startWidget, endWidget);
      }
      
      // check if being part of a chartBranch
      this.setArrowChartBranch(arrow, widgets, true);
    }
    
    // update chartBranch arrows
    // this is mainly used for a branched arrow whose widget is "behind" the branch fixed position 
    if(arrow.chartBranch) {
      // on "oneOnOne" we consider the start widget as the convergent one
      const convergesOnEnd = arrow.chartBranch.type === "manyToOne"; 
      let convergencePoint = convergesOnEnd ? arrow.points[1] : arrow.points[0];
      let nonConvergencePoint = convergesOnEnd ? arrow.points[0] : arrow.points[1];
      const convergentWidget = convergesOnEnd ? endWidget : startWidget;
      const nonConvergentWidget = convergesOnEnd ? startWidget : endWidget;
      
      convergencePoint = this.getWidgetSideMidPosition(convergencePoint, convergentWidget);
      nonConvergencePoint = this.getWidgetSideMidPosition(nonConvergencePoint, nonConvergentWidget);
    
      if(toOrientation(arrow.chartBranch.convergenceSide) === "horizontal") {
        // if inside, use 2-segment arrow
        if(arrow.chartBranch.position >= nonConvergentWidget.x && arrow.chartBranch.position <= nonConvergentWidget.x + nonConvergentWidget.width) {
          nonConvergencePoint.x = arrow.chartBranch.position;
          nonConvergencePoint.y = (nonConvergentWidget.y + nonConvergentWidget.height/2) > convergencePoint.y ? nonConvergentWidget.y : nonConvergentWidget.y + nonConvergentWidget.height;
        // otherwise use regular 3-segment arrow but make sure it connects to the correct side
        } else {
          nonConvergencePoint.type = arrow.chartBranch.position < nonConvergentWidget.x ? "left" : "right";
          nonConvergencePoint = this.getWidgetSideMidPosition(nonConvergencePoint, nonConvergentWidget);
        }
      } else {  // vertical
        // if inside, use 2-segment arrow
        if(arrow.chartBranch.position >= nonConvergentWidget.y && arrow.chartBranch.position <= nonConvergentWidget.y + nonConvergentWidget.height) {
          nonConvergencePoint.x = (nonConvergentWidget.x + nonConvergentWidget.width/2) > convergencePoint.x ? nonConvergentWidget.x : nonConvergentWidget.x + nonConvergentWidget.width;
          nonConvergencePoint.y = arrow.chartBranch.position;
        // otherwise use regular 3-segment arrow but make sure it connects to the correct side
        } else {
          nonConvergencePoint.type = arrow.chartBranch.position < nonConvergentWidget.y ? "top" : "bottom";
          nonConvergencePoint = this.getWidgetSideMidPosition(nonConvergencePoint, nonConvergentWidget);
        }
      }

      arrow.points[0] = convergesOnEnd ? nonConvergencePoint : convergencePoint;
      arrow.points[1] = convergesOnEnd ? convergencePoint : nonConvergencePoint;
    }
  }
  
  isChartSideArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    // can't be chartSide if there is any chartBranch on current side
    if(this.getSharedChartBranchArrow(arrow, widgets)) return;

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

  // returns the middle point of an intersection
  getIntersectionMiddle(min1: number, size1: number, min2: number, size2: number) {
    const max1 = min1 + size1;
    const max2 = min2 + size2;

    // TODO: none of this works when moving endWidget
    // TODO: make sure this works with different shaped widgets
    // if((this.between(min1, min2, max2) && this.between(max1, min2, max2)) ||
    //    (this.between(min2, min1, max1) && this.between(max2, min1, max1))) {
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

  between(value: number, min: number, max: number) {
    return value>min && value<max;
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
        newPoint.y = widget.y + widget.height / 2;
        break;
    }

    return newPoint;
  }

  render() {
    const { cursor, selected, widgets } = this.state;
    return (
      <div>
        <div
          id="canvas"
          style={{ cursor }}
          className="App"
          tabIndex={1}
          onClick={this.handleClick}
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
                onClick={this.handleStickyClick}
                onDragStart={this.handleWidgetDragStart}
                onMouseHover={this.handleMouseHoverSticky}
                onMouseLeave={this.handleMouseLeaveSticky}
                selected={!!selected?.includes(w.id)}
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
        <div id="settings" style={settingsStyle}>
          <Checkbox
            label="Stick To Convergent Widget Side"
            onCheckedChange={(checked) => this.setState({settings: { stickToConvergentWidgetSide: checked }})} />
        </div>
      </div>
    );
  }
}

export default App;
