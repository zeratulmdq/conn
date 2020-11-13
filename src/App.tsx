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
  PointType,
} from "./types";

export const SNAPPING_DISTANCE = 10;
export const TOLERANCE = 10;
export const ARROW_MARGIN = 10;
export const TWO_SEGMENT_ARROW_MIN = 20;
export const STICKY_HEIGHT = 100;

const arrowIsHorizontal = (arrow: ArrowWidget) =>
  arrow.points[0].type === 'left' || arrow.points[0].type === 'right';

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
  endId: string | null;
  selected: string[] | null;
  widgets: Record<string, Widget>;
  newSegment: boolean;
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
    endId: null,
    selected: null,
    widgets: {},
    newSegment: false,
  };
  mousePosition: Position | null = null;
  mouseOverSticky: boolean = false;

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
            endId: null,
            cursor: "auto",
            widgets: { ...prevWidgets },
          }
        }
      }

      return {
        ...prevState,
        dragging: null,
        initialId: null,
        endId: null,
        cursor: "auto",
      }
    });
  }

  handleArrowPointDragStart = (id: string, e: React.MouseEvent, isStart: boolean) => {
    if (isStart) {
      const end = (this.state.widgets[id] as ArrowWidget).end;
      this.setState((prevState) => (
        {
          ...prevState,
          cursor: 'crosshair',
          dragging: [id],
          endId: end,
          initialId: null,
          widgets: {
            ...prevState.widgets,
            [id]: {
              ...prevState.widgets[id],
              start: null,
              startPoint: null,
              initialIsHorizontal: arrowIsHorizontal(prevState.widgets[id] as ArrowWidget),
            }
          }
        }
      ));
    } else {
      const initial = (this.state.widgets[id] as ArrowWidget).start;
      this.setState((prevState) => (
        {
          ...prevState,
          cursor: 'crosshair',
          dragging: [id],
          initialId: initial,
          endId: null,
          widgets: {
            ...prevState.widgets,
            [id]: {
              ...prevState.widgets[id],
              end: null,
              endPoint: null,
              initialIsHorizontal: arrowIsHorizontal(prevState.widgets[id] as ArrowWidget),
            }
          }
        }
      ));
    }
  }

  handleStickyMouseDown = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (this.state.cursor !== "crosshair")
      return;
    // start arrow creation
    if (!this.state.dragging) {
      // create Arrow for dragging without end widget
      this.setState((prevState) => {
        const arrow = {
          ...arrowFactory({ start: id, end: null }),
        };

        return {
          ...prevState,
          initialId: id,
          endId: null,
          widgets: {
            ...prevState.widgets,
            [arrow.id]: arrow,
          },
          dragging: [arrow.id],
        };
      });

      return;
    }
  }

  handleStickyMouseUp = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // avoid executing `handleMouseUp`
    if (this.state.initialId === id || this.state.endId === id) {
      this.cancelArrowCreation();
      return;
    }

    if (this.state.cursor !== "crosshair")
      return;
    
    this.setState((prevState) => {
      if (!prevState.dragging)
        return { ...prevState };
      
      const draggingArrow = { ...prevState.widgets[prevState.dragging[0]] } as ArrowWidget;
      const startWidget = prevState.widgets[draggingArrow.start ?? id];
      const endWidget = prevState.widgets[draggingArrow.end ?? id];
      
      // update Arrow start/end and connect it to both widgets
      draggingArrow.start = startWidget.id;
      draggingArrow.end = endWidget.id;
      draggingArrow.initialIsHorizontal = arrowIsHorizontal(draggingArrow);
      // update chart branches state (for both start and end arrows)
      this.setArrowChartBranch(draggingArrow as ArrowWidget, this.state.widgets, false);

      return {
        ...prevState,
        cursor: "auto",
        dragging: null,
        initialId: null,
        endId: null,
        widgets: {
          ...prevState.widgets,
          [draggingArrow.id]: draggingArrow,
        },
      };
    });
  };

  handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // create rectangular stickies while holding CTRL down
    const stickyWidth = (e.ctrlKey || e.metaKey) ? 150 : 100;
    const s = stickyFactory({ x: e.clientX - (stickyWidth / 2), y: e.clientY - 50, width: stickyWidth });
    this.setState((prevState) => ({
      selected: [s.id],
      widgets: {
        ...prevState.widgets,
        [s.id]: s,
      },
    }));
  };

  handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const deltaX = this.mousePosition ? e.clientX - this.mousePosition.x : e.clientX;
    const deltaY = this.mousePosition ? e.clientY - this.mousePosition.y : e.clientY;
    this.mousePosition = {x: e.clientX, y: e.clientY };
    const { dragging, widgets } = this.state;

    if (!dragging)
      return;
    const draggingWidgets = dragging.map(id => widgets[id]);
    if(draggingWidgets.length > 1 || draggingWidgets[0].type === "sticky") {
      const arrows = Object.values(widgets).filter(w => w.type === "arrow") as ArrowWidget[];
      // update connected arrows
      const connectedArrows = Object.values(widgets)
      .filter(
        (w) =>
          w.type === "arrow" &&
          dragging &&
          ((w.start && dragging.includes(w.start)) ||
          (w.end && dragging.includes(w.end))))
      .reduce((acc, cur) => {
        const arrow = cur as ArrowWidget;
        this.updateArrow(arrow);
        if (dragging &&
          ((arrow.start && dragging.includes(arrow.start)) &&
          (arrow.end && dragging.includes(arrow.end))) &&
          arrow.chartBranch) {
            if (arrow.chartBranch.type === 'oneToOne') {
              arrow.chartBranch.position = arrow.chartBranch.position + (arrowIsHorizontal(arrow) ? deltaX : deltaY);
            } else {
              arrows.forEach(a => {
                if (a.chartBranch && a.chartBranch?.position === arrow.chartBranch?.position) {
                  if ((a.end && !dragging.includes(a.end)) || (a.start && !dragging.includes(a.start))) {
                    return;
                  } else {
                    arrow.chartBranch.position = arrow.chartBranch.position + (arrowIsHorizontal(arrow) ? deltaX : deltaY);
                  }
                }
              })
            }
          }
        
        return {
          ...acc,
          [arrow.id]: {
            ...arrow,
          },
        };
      }, {} as Record<string, Widget>);
  
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
      this.setState({
        widgets: {
          ...widgets,
          ...movedWidgets,
          ...connectedArrows,
        }
      });
    } else if (draggingWidgets[0].type === "arrow" && !this.mouseOverSticky) {
      const draggingArrow = { ...draggingWidgets[0] };
      // update arrow dragged end
      if (!draggingArrow.end || !draggingArrow.start)
        this.updateArrow(draggingArrow, this.mousePosition);
      
      this.setState({
        widgets: {
          ...widgets,
          [draggingArrow.id]: draggingArrow,
        },
      });
    }
  };

  handleMouseHoverSticky = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    this.mouseOverSticky = true;
    const target = (e.target as Element).id || null;
    const { dragging, widgets } = this.state;
    if (!dragging) return;
    // stick to widget when hovering while dragging
    const draggingWidgets = dragging.map(id => widgets[id]);
    if(draggingWidgets.length === 1 &&
      draggingWidgets[0].type === "arrow") {
        const draggingArrow = { ...draggingWidgets[0] };
        // update Arrow start/end and connect it to both widgets
        const isStart = !!this.state.endId;
        const targetChanged = isStart
          ? draggingArrow.startPoint !== target && draggingArrow.start === id
          : draggingArrow.endPoint !== target && draggingArrow.end === id;
        if ((draggingArrow.start !== id &&
          draggingArrow.end !== id) || targetChanged)
          {
            // connect to widget and update arrow
            draggingArrow.start = draggingArrow.start ?? id;
            draggingArrow.end = draggingArrow.end ?? id;
            if (isStart) {
              draggingArrow.startPoint = target !== "auto" ? target as PointType : null;
              draggingArrow.arrowType = 'initial';
              draggingArrow.chartBranch = null;
            } else {
              draggingArrow.endPoint = target !== "auto" ? target as PointType : null;
              draggingArrow.arrowType = 'initial';
              draggingArrow.chartBranch = null;
            }
            this.updateArrow(draggingArrow);
            const newWidgets = { ...widgets, [draggingArrow.id]: draggingArrow };
            this.setState({
              widgets: newWidgets,
            });
          }
    };
  }

  opositePoint = (point: PointType) => {
    switch (point) {
      case 'top': return 'bottom';
      case 'bottom': return 'top';
      case 'right': return 'left';
      case 'left': return 'right';
    }
  }

  handleMouseLeaveSticky = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    this.mouseOverSticky = false;
    const { dragging, widgets } = this.state;
    if (!dragging) return;
    const draggingWidgets = dragging.map(id => widgets[id]);
    if (draggingWidgets.length === 1 &&
      draggingWidgets[0].type === "arrow" &&
      draggingWidgets[0].start && draggingWidgets[0].end &&
      (draggingWidgets[0].start === id ||
      draggingWidgets[0].end === id)) {
      // disconnect from widget and update arrow
      const draggingArrow = { ...draggingWidgets[0] };
      draggingArrow.startPoint = draggingArrow.start === id ? null : draggingArrow.startPoint;
      draggingArrow.endPoint = draggingArrow.end === id ? null : draggingArrow.endPoint;
      draggingArrow.start = draggingArrow.start === id ? null : draggingArrow.start;
      draggingArrow.end = draggingArrow.end === id ? null : draggingArrow.end;
      
      this.setState({
        widgets: {
          ...widgets,
          [draggingArrow.id]: draggingArrow,
        },
      });
    }
    if (draggingWidgets.length === 1 && draggingWidgets[0].type === "arrow" && ((draggingWidgets[0].start === id && !draggingWidgets[0].end) || (draggingWidgets[0].end === id && !draggingWidgets[0].start))) {
      const draggingArrow = { ...draggingWidgets[0] };
      const widget = this.state.widgets[id];
      const x = e.clientX;
      const y = e.clientY;
      const isHorizontalStart = y > widget.y && y < widget.y + widget.height;
      const startPoint = isHorizontalStart
        ? x <= widget.x
          ? 'left'
          : 'right'
        : y <= widget.y
          ? 'top'
          : 'bottom';
      const endPoint = this.opositePoint(startPoint);

      // set initial points
      this.setState({
        widgets: {
          ...widgets,
          [draggingArrow.id]: {
            ...draggingArrow,
            points: [{ x, y, type: startPoint }, { x, y, type: endPoint }],
            initialIsHorizontal: isHorizontalStart,
          },
        },
      });
    }
  }

  handleWidgetDragStart = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const { shiftKey } = e;
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
    });
  };

  handleKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === "c" || e.key === "C") {
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

  // true when creating an arrow, or when dragging arrow point
  isDraggingArrow = () => {
    const draggingWidgets = this.state.dragging && this.state.dragging.map(id => this.state.widgets[id]);
    return draggingWidgets && draggingWidgets.length === 1 && draggingWidgets[0].type === "arrow";
  }

  getConnectedStickyPos = (point: Point, stickyWidth: number) => {
    let coords = { x: 0, y: 0 };
    switch(point.type) {
      case "top":
        coords.x = point.x - stickyWidth / 2;
        coords.y = point.y;
        break;
      case "right":
        coords.x = point.x - stickyWidth;
        coords.y = point.y - STICKY_HEIGHT / 2;
        break;
      case "bottom":
        coords.x = point.x - stickyWidth / 2;
        coords.y = point.y - STICKY_HEIGHT;
        break;
      case "left":
        coords.x = point.x;
        coords.y = point.y - stickyWidth / 2;
        break;
    }

    return coords;
  }

  handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if(this.isDraggingArrow()) {
      if (this.state.initialId || this.state.endId) {
        if (this.state.endId) {
          this.cancelArrowCreation();
          return;
        }
        // sticky auto-creation after dropping an arrow in the canvas
        const stickyWidth = (e.ctrlKey || e.metaKey) ? 150 : 100;
        const draggingWidgets = this.state.dragging && this.state.dragging.map(id => this.state.widgets[id]);
        const draggingArrow = draggingWidgets && { ...draggingWidgets[0] as ArrowWidget };
        const draggingPoint = draggingArrow && draggingArrow.points[draggingArrow.points.length - 1];
        if (!draggingPoint || !draggingArrow) return;
        const pos = this.getConnectedStickyPos(draggingPoint, stickyWidth);
        const s = stickyFactory({ ...pos, width: stickyWidth });
        draggingArrow.end = s.id;
        draggingArrow.initialIsHorizontal = arrowIsHorizontal(draggingArrow);
        // update chart branches state (for both start and end arrows)
        this.setArrowChartBranch(draggingArrow as ArrowWidget, this.state.widgets, false);
        if (draggingArrow) {
          this.setState({
            selected: [s.id],
            dragging: null,
            initialId: null,
            endId: null,
            cursor: "auto",
            widgets: {
              ...this.state.widgets,
              [s.id]: s,
              [draggingArrow.id]: {
                ...draggingArrow,
              }
            },
          });
        }
      }
      return;
    }
    this.setState((prevState) => {
      
      if (!prevState.dragging)
        return { ...prevState };
      
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
        arrow.initialIsHorizontal = arrowIsHorizontal(arrow);

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

  getStartPointType = (points: Point[]) => {
    if (points.length < 2) return undefined;
    const first = points[0];
    const second = points[1];
    if (first.x < second.x) return 'right';
    if (first.x > second.x) return 'left';
    if (first.y < second.y) return 'bottom';
    return 'top';
  }

  getEndPointType = (points: Point[]) => {
    const reverse = [...points].reverse();
    return this.getStartPointType(reverse);
  }

  handleDragSementStart = (arrowId: string, index: number, pos: Position) => {
    const arrow = this.state.widgets[arrowId] as ArrowWidget;
    const horizontalDrag = arrowIsHorizontal(arrow)
      ? index % 2 !== 0
      : index % 2 === 0;
    const isFirst = index === 0;
    const isLast = index === arrow.points.length - 2;
    // if it's the first or last segment, create a new node
    if (index === 0 || index === arrow.points.length - 2) {

      if (isFirst && isLast) {
        const first = arrow.points[0];
        const last = arrow.points[1];
        if (horizontalDrag) {
          const second = { x: pos.x, y: first.y };
          const third = { x: pos.x, y: last.y };
          arrow.points = [{ ...first, type: 'right' }, second, third, { ...last, type: 'right' }];
          // arrow.startPoint = 'right';
          // arrow.endPoint = 'right';
        } else {
          const second = { x: first.x, y: pos.y };
          const third = { x: last.x, y: pos.y };
          arrow.points = [{ ...first, type: 'top' }, second, third, { ...last, type: 'top' }];
          // arrow.startPoint = 'top';
          // arrow.endPoint = 'top';
        }
      } else if (isFirst) {
        const unalteredEndPoints = arrow.points.slice(2);
        const first = arrow.points[0];
        if (horizontalDrag) {
          const second = { x: pos.x, y: first.y };
          const third = { x: pos.x, y: arrow.points[1].y };
          arrow.points = [{ ...first, type: 'right' }, second, third, ...unalteredEndPoints];
          // arrow.startPoint = 'right';
        } else {
          const second = { x: first.x, y: pos.y };
          const third = { x: arrow.points[1].x, y: pos.y };
          arrow.points = [{ ...first, type: 'top' }, second, third, ...unalteredEndPoints];
          // arrow.startPoint = 'top';
        }
      } else if (isLast) {
        const unalteredPoints = arrow.points.slice(0, arrow.points.length - 2);
        const last = arrow.points[arrow.points.length - 1];
        if (last.type === 'right' || last.type === 'left') {
          const second = { x: last.x, y: pos.y };
          const third = { x: arrow.points[arrow.points.length - 2].x, y: pos.y };
          arrow.points = [...unalteredPoints, third, second, { ...last, type: 'top' }];
          // arrow.endPoint = 'top';
        } else {
          const second = { x: pos.x, y: last.y };
          const third = { x: pos.x, y: arrow.points[arrow.points.length - 2].y };
          arrow.points = [...unalteredPoints, third, second, { ...last, type: 'right' }];
          // arrow.endPoint = 'right';
        }
      }
      this.setState({ widgets: { ...this.state.widgets, [arrowId]: arrow}, newSegment: isFirst || isLast });
    }
  }

  handleDragSegment = (arrowId: string, index: number, pos: Position) => {
    const arrow = this.state.widgets[arrowId] as ArrowWidget;
    const horizontalDrag = arrowIsHorizontal(arrow)
      ? index % 2 !== 0
      : index % 2 === 0;
    // if it's the first or last segment, create a new node
    if (index === 0 || index === arrow.points.length - 1) {
      return;
    } else {
      if (horizontalDrag) {
        arrow.points[index].x = pos.x;
        arrow.points[index + 1].x = pos.x;
      } else {
        arrow.points[index].y = pos.y;
        arrow.points[index + 1].y = pos.y;
      }
    }
    this.setState({ widgets: { ...this.state.widgets, [arrowId]: arrow} });
  }

  handleDragSegmentEnd = (arrowId: string, index: number, position?: number) => {
    const arrow = this.state.widgets[arrowId] as ArrowWidget;
    const { points } = arrow;
    const horizontalDrag = arrowIsHorizontal(arrow)
      ? index % 2 !== 0
      : index % 2 === 0;
    // merge segments if they are in the same axis
    if (horizontalDrag) {
      if (arrow.points[index].x === arrow.points[index - 1].x) {
        arrow.points.splice(index, 2);
      } else if (arrow.points[index + 1].x === arrow.points[index + 2].x) {
        arrow.points.splice(index + 1, 2);
      }
    } else {
      if (arrow.points[index].y === arrow.points[index - 1].y) {
        arrow.points.splice(index, 2);
      } else if (arrow.points[index + 1].y === arrow.points[index + 2].y) {
        arrow.points.splice(index + 1, 2);
      }
    }
    const startType = this.getStartPointType(points);
    const endType = this.getEndPointType(points);
    arrow.points[0].type = startType;
    arrow.points[points.length - 1].type = endType;
    if (index === 1) this.setArrowChartBranch(arrow, this.state.widgets, false, position);
    if (this.state.newSegment) {
      arrow.startPoint = startType;
      arrow.endPoint = endType;
      this.updateArrow(arrow);
    }
    this.setState({ widgets: { ...this.state.widgets, [arrowId]: arrow}, newSegment: false });
  }

  // finds if this arrow should be a part of a branchChart
  setArrowChartBranch(arrow: ArrowWidget, widgets: Record<string, Widget>, dragging: boolean, position?: number) {
    if(!this.state.settings.stickToConvergentWidgetSide && arrow.chartBranch) {
      // don't recalculate if chartBranchSide and position didn't change
      let convergencePoint = arrow.chartBranch.type === "manyToOne" ? arrow.points[arrow.points.length - 1] : arrow.points[0];
      if(convergencePoint.type === arrow.chartBranch.convergenceSide && (!position || arrow.chartBranch.position === position)) {
        console.log('not recalculating chart branch');
        return;
      }
    }
    
    const chartBranchArrow = this.getSharedChartBranchArrow(arrow, widgets);
    // don't force chartBranching while dragging on an empty side of the origin/end widget
    // or if arrow has explicitly set start or end point
    if((dragging && !chartBranchArrow) || arrow.points.length === 2) {
      arrow.arrowType = 'initial';
      arrow.chartBranch = null;
      console.log('setting chart branch null');
      return;
    }

    arrow.arrowType = "chartBranch";
    
    if(chartBranchArrow && chartBranchArrow.chartBranch && !position) {
      console.log('become part of an existing chartBranch');
      // become part of an existing chartBranch
      if(chartBranchArrow.chartBranch.type === "oneToOne") {
        // if we are just adding the 2nd arrow to this chartBranch, update type and convergenceSide beforehand
        if(chartBranchArrow.start === arrow.start ){
          chartBranchArrow.chartBranch.type = "oneToMany";
          chartBranchArrow.chartBranch.convergenceSide = arrow.points[0].type;
        } else {
          chartBranchArrow.chartBranch.type = "manyToOne";
          chartBranchArrow.chartBranch.convergenceSide = arrow.points[arrow.points.length - 1].type;
        }
      }
      arrow.chartBranch = Object.assign({}, chartBranchArrow.chartBranch);
    } else if ((!arrow.startPoint && !arrow.endPoint) || position) {
      // new lonely charBranch arrow
      console.log('new lonely charBranch arrow');
      let chartBranch: ChartBranch = {
        position: position || 0,
        convergenceSide: arrow.points[0].type,
        type: "oneToOne"
      };
      // on new branch, set 2nd segment position to half the distance in X or Y depending on orientation
      // unless explicit position is passed as parameter
      if (!position) {
        console.log('convergenceSide: ', chartBranch.convergenceSide);
        if(toOrientation(chartBranch.convergenceSide || 'right') === "horizontal") {
          chartBranch.position = arrow.points[0].x + ((arrow.points[arrow.points.length - 1].x - arrow.points[0].x) / 2);
        } else {
          chartBranch.position = arrow.points[0].y + ((arrow.points[arrow.points.length - 1].y - arrow.points[0].y) / 2);
        }
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
       (w.end === arrow.end && w.points[w.points.length - 1].type === arrow.points[arrow.points.length - 1].type))
    ).map(w => w as ArrowWidget);
    
    return chartBranchArrows.length > 0 ? chartBranchArrows[0] : null;
  }

  // updates arrow points (start/end) in both position and type
  // draggingPosition is undefined when the arrow is connected to a start and
  // end widget
  // if it's not undefined, it means it's a disconnected arrow
  updateArrow(arrow: ArrowWidget, draggingPosition?: Position) {
    const { widgets } = this.state;
    const startWidget = widgets[arrow.start || ""];
    const endWidget = widgets[arrow.end || ""];
    const isDisconnectedArrow = !!draggingPosition;

    const connectedWidget = startWidget ? startWidget : endWidget;
    if (!connectedWidget) return;

    const points = [...arrow.points];

    // stick to your branch side
    if(!this.state.settings.stickToConvergentWidgetSide || arrow.arrowType !== "chartBranch") {
      // change connections depending on positioning
      const draggingX = draggingPosition ? draggingPosition.x : endWidget.x;
      const draggingY = draggingPosition ? draggingPosition.y : endWidget.y;
      const draggingWidth = draggingPosition ? 0 : endWidget.width;
      const draggingHeight = draggingPosition ? 0 : endWidget.height;
      if (points.length < 5) {
        if (arrow.initialIsHorizontal) {
          if (connectedWidget.x + connectedWidget.width + TOLERANCE < draggingX) {
            points[0].type = startWidget ? "right" : "left";
            points[points.length - 1].type = startWidget ? "left" : "right";
          } else if (draggingX + draggingWidth + TOLERANCE < connectedWidget.x) {
            points[0].type = startWidget ? "left" : "right";
            points[points.length - 1].type = startWidget ? "right" : "left";
          } else if (draggingY > connectedWidget.y + connectedWidget.height) {
            points[0].type = startWidget ? "bottom" : "top";
            points[points.length - 1].type = startWidget ? "top" : "bottom";
          } else {
            points[0].type = startWidget ? "top" : "bottom";
            points[points.length - 1].type = startWidget ? "bottom" : "top";
          }
        } else {
          if (connectedWidget.y + connectedWidget.height + TOLERANCE < draggingY) {
            points[0].type = startWidget ? "bottom" : "top";
            points[points.length - 1].type = startWidget ? "top" : "bottom";
          } else if (draggingY + draggingHeight + TOLERANCE < connectedWidget.y) {
            points[0].type = startWidget ? "top" : "bottom";
            points[points.length - 1].type = startWidget ? "bottom" : "top";
          } else if (draggingX > connectedWidget.x + connectedWidget.width) {
            points[0].type = startWidget ? "right" : "left";
            points[points.length - 1].type = startWidget ? "left" : "right";
          } else {
            points[0].type = startWidget ? "left" : "right";
            points[points.length - 1].type = startWidget ? "right" : "left";
          }
        }
        // it the connector starts / ends where it should automatically,
        // don't force startPoint / endPoint any more
        if (arrow.startPoint) {
          if (arrow.startPoint === points[0].type) {
            arrow.startPoint = null;
          } else {
            points[0].type = arrow.startPoint;
          }
        }
        if (arrow.endPoint) {
          if (arrow.endPoint === points[points.length - 1].type) {
            arrow.endPoint = null;
          } else {
            points[points.length - 1].type = arrow.endPoint;
          }
        }
      }


      points[0] = startWidget ? this.getWidgetSideMidPosition(points[0], startWidget) : {...points[0], x: (draggingPosition as Position).x, y: (draggingPosition as Position).y};
      points[points.length - 1] = endWidget ? this.getWidgetSideMidPosition(points[points.length - 1], endWidget) : {...points[points.length - 1], x: (draggingPosition as Position).x, y: (draggingPosition as Position).y};
      arrow.points = points;
      
      // check if being a chartSide arrow
      if(this.isChartSideArrow(arrow, widgets) && points.length < 5) {
        console.log('IS CHART SIDE ARROW');
        if (isDisconnectedArrow) {
          this.updateArrowChartSide(arrow, connectedWidget, endWidget, draggingPosition, !!endWidget);
        } else {
          this.updateArrowChartSide(arrow, startWidget, endWidget);
        }
      }

      // snap the two points while creating an arrow
      if (isDisconnectedArrow && arrow.points.length < 5) {
        const points = arrow.points;
        if (points[0].type === 'left' || points[0].type === 'right') {
          if (points[points.length - 1].y <= points[0].y + SNAPPING_DISTANCE && points[points.length - 1].y >= points[0].y - SNAPPING_DISTANCE) {
            points[points.length - 1].y = points[0].y;
          }
        } else if (points[0].type === 'top' || points[0].type === 'bottom') {
          if (points[points.length - 1].x <= points[0].x + SNAPPING_DISTANCE && points[points.length - 1].x >= points[0].x - SNAPPING_DISTANCE) {
            points[points.length - 1].x = points[0].x;
          }
        }
      }
      
      // check if being part of a chartBranch
      this.setArrowChartBranch(arrow, widgets, true);
    }
    
    // update chartBranch arrows
    // this is mainly used for a branched arrow whose widget is "behind" the branch fixed position 
    if(arrow.chartBranch && startWidget && endWidget && points.length < 5) {
      // on "oneOnOne" we consider the start widget as the convergent one
      const convergesOnEnd = arrow.chartBranch.type === "manyToOne"; 
      let convergencePoint = convergesOnEnd ? arrow.points[arrow.points.length - 1] : arrow.points[0];
      let nonConvergencePoint = convergesOnEnd ? arrow.points[0] : arrow.points[arrow.points.length - 1];
      const convergentWidget = convergesOnEnd ? endWidget : startWidget;
      const nonConvergentWidget = convergesOnEnd ? startWidget : endWidget;
      
      convergencePoint = this.getWidgetSideMidPosition(convergencePoint, convergentWidget);
      nonConvergencePoint = this.getWidgetSideMidPosition(nonConvergencePoint, nonConvergentWidget);
    
      if(toOrientation(arrow.chartBranch.convergenceSide || 'right') === "horizontal") {
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
      arrow.points[arrow.points.length - 1] = convergesOnEnd ? convergencePoint : nonConvergencePoint;
    }
    this.setIntermidiatePoints(arrow);
  }

  setIntermidiatePoints = (arrow: ArrowWidget) => {
    const { points } = arrow;
    const start = points[0];
    const end = points[points.length - 1];
    const isHorizontalStart = start.type === "right" || start.type === "left";
    const isHorizontalEnd = end.type === "right" || end.type === "left";
    const midDistance = isHorizontalStart ? (end.x - start.x) / 2 : (end.y - start.y) / 2;
    // 1-segment straight line
    if((isHorizontalStart && start.y === end.y) || (!isHorizontalStart && start.x === end.x)) {
      if (points.length < 5) {
        arrow.points = [start, end];
        arrow.arrowType = 'initial';
        arrow.chartBranch = null;
        return;
      }
    }
    let p2, p3, p4;
    // 2-segments line
    if (isHorizontalStart !== isHorizontalEnd && points.length < 5) {
      const willCoverContent = isHorizontalStart
        ? (end.type === "bottom" && end.y > start.y) || (end.type === "top" && end.y < start.y)
        : (end.type === "right" && end.x > start.x) || (end.type === "left" && end.x < start.x);
      if (!willCoverContent) {
        const middlePoint = isHorizontalStart
          ? { x: end.x, y: start.y }
          : { x: start.x, y: end.y };
        arrow.points = [start, middlePoint, end];
        return;
      } else { // 4-segments line
        p2 = isHorizontalStart
        ? { x: start.x + midDistance, y: start.y }
        : { x: start.x, y: start.y + midDistance };
      if (end.type === "bottom" || end.type === "right") {
        p3 = isHorizontalStart
          ? { x: start.x + midDistance, y: end.y + 20 }
          : { x: end.x + 20, y: start.y + midDistance };
        p4 = isHorizontalStart
          ? { x: end.x, y: end.y + 20 }
          : { x: end.x + 20, y: end.y };
      } else {
        p3 = isHorizontalStart
          ? { x: start.x + midDistance, y: end.y - 20 }
          : { x: end.x - 20, y: start.y + midDistance };
        p4 = isHorizontalStart
          ? { x: end.x, y: end.y - 20 }
          : { x: end.x - 20, y: end.y };
      }
      arrow.points = [start, p2, p3, p4, end];
      return;
      }
    }
    // 4+ segments line
    if (points.length >= 5) {
      p2 = isHorizontalStart
        ? { x: points[1].x, y: start.y }
        : { x: start.x, y: points[1].y };
      p4 = isHorizontalEnd
        ? { x: points[points.length - 2].x, y: end.y }
        : { x: end.x, y: points[points.length - 2].y };
      const unalteredPoints = points.slice(2, points.length - 2);
      arrow.points = [start, p2, ...unalteredPoints, p4, end];
      return;
    }
    // const willCoverContent = isHorizontalStart
    //   ? (end.type === "right" && end.x > start.x) || (end.type === "left" && end.x < start.x)
    //   : (end.type === "bottom" && end.y > start.y) || (end.type === "top" && end.y < start.y);
    //   // 3-segments line
    //   if (willCoverContent && !arrow.chartBranch && points.length < 5) {
    //     if (end.type === "bottom" || end.type === "right") {
    //       p2 = isHorizontalStart
    //         ? {x: end.x + 20, y: start.y}
    //         : {x: start.x, y: end.y + 20};
    //       p3 = isHorizontalStart
    //         ? {x: end.x + 20, y: end.y}
    //         : {x: end.x, y: end.y + 20};
    //     } else {
    //       p2 = isHorizontalStart
    //         ? {x: end.x - 20, y: start.y}
    //         :  {x: start.x, y: end.y - 20};
    //       p3 = isHorizontalStart
    //         ? {x: end.x - 20, y: end.y}
    //         :  {x: end.x, y: end.y - 20};
    //     }
    //     arrow.points = [start, p2, p3, end];
    //     return;
    //   }

    // 3 segments line
    let segment2Position = isHorizontalStart
      ? start.x + midDistance
      : start.y + midDistance;

    if(arrow.chartBranch) {
      const convergenceTarget = arrow.chartBranch.type === "manyToOne" ? end : start;
      if(arrow.chartBranch.convergenceSide === convergenceTarget.type) {
        segment2Position = arrow.chartBranch.position;
      }
    }

    p2 = isHorizontalStart
      ? { x: segment2Position, y: start.y}
      : { x: start.x, y: segment2Position};
    p3 = isHorizontalStart
      ? { x: segment2Position, y: end.y}
      : { x: end.x, y: segment2Position};

    arrow.points = [start, p2, p3, end];
    return;
  }
  
  isChartSideArrow(arrow: ArrowWidget, widgets: Record<string, Widget>) {
    // can't be chartSide if there is any chartBranch on current side
    if(this.getSharedChartBranchArrow(arrow, widgets)) return false;
    // can't be chartSide if their point were intentionally positioned
    if (arrow.startPoint || arrow.endPoint) return false;
    console.log('initialIsHorizontal: ', arrow.initialIsHorizontal);
    return ((arrow.initialIsHorizontal && (arrow.points[0].type === "top" || arrow.points[0].type === "bottom")) ||
    (!arrow.initialIsHorizontal && (arrow.points[0].type === "left" || arrow.points[0].type === "right")));
  }

  // returns true if using intersection chartSide
  updateArrowChartSide(arrow: ArrowWidget, startWidget: Widget, endWidget: Widget, draggingPosition?: Position, isStart?: boolean) {
    if (arrow.points.length >= 5) return;
    const draggingX = draggingPosition ? draggingPosition.x : endWidget.x;
    const draggingY = draggingPosition ? draggingPosition.y : endWidget.y;
    const draggingWidth = draggingPosition ? 0 : endWidget.width;
    const draggingHeight = draggingPosition ? 0 : endWidget.height;
    // if widgets limits are intersecting, use chartSide connector
    if(arrow.initialIsHorizontal) {
      console.log('CASE 1');
      const middleX = this.getIntersectionMiddle(startWidget.x, startWidget.width, draggingX, draggingWidth);
      if(middleX) {
        arrow.points = [{ ...arrow.points[0], x: middleX }, {...arrow.points[arrow.points.length - 1], x: middleX }]
        return true;
      }
    } else {
      console.log('CASE 2');
      const middleY = this.getIntersectionMiddle(startWidget.y, startWidget.height, draggingY, draggingHeight);
      if(middleY) {
        arrow.points = [{ ...arrow.points[0], y: middleY }, {...arrow.points[arrow.points.length - 1], y: middleY }]
        return true;
      }
    }

    // if there is no intersection, use original axis side
    if (isStart && draggingPosition) {
      if(arrow.initialIsHorizontal) {
        arrow.points[arrow.points.length - 1].type = draggingX > startWidget.x + (startWidget.width / 2) ? "right" : "left";
      } else {
        arrow.points[arrow.points.length - 1].type = draggingY > startWidget.y + (startWidget.height / 2) ? "bottom" : "top";
      }
      arrow.points[arrow.points.length - 1] = this.getWidgetSideMidPosition(arrow.points[arrow.points.length - 1], startWidget);
    } else {
      if(arrow.initialIsHorizontal) {
        arrow.points[0].type = draggingX > startWidget.x + (startWidget.width / 2) ? "right" : "left";
      } else {
        arrow.points[0].type = draggingY > startWidget.y + (startWidget.height / 2) ? "bottom" : "top";
      }
      arrow.points[0] = this.getWidgetSideMidPosition(arrow.points[0], startWidget);
    }
    
    const startWidgetCenter = {x: startWidget.x + (startWidget.width/2), y: startWidget.y + (startWidget.height/2)};
    const endWidgetCenter = {x: draggingX + (draggingWidth/2), y: draggingY + (draggingHeight/2)};
    const distX = Math.abs(startWidgetCenter.x - endWidgetCenter.x) - (startWidget.width/2 + draggingWidth/2);
    const distY = Math.abs(startWidgetCenter.y - endWidgetCenter.y) - (startWidget.height/2 + draggingHeight/2);
    const widgetsTooClose = arrow.initialIsHorizontal ? distX <= ARROW_MARGIN : distY <= ARROW_MARGIN;
    
    // if widgets are too close, use 2-segments arrow
    if(widgetsTooClose) {
      // never closer than 20px from origin and never less than 10px from target side
      if (isStart) {
        if(arrow.initialIsHorizontal) {
          arrow.points[0].type = draggingY > arrow.points[arrow.points.length - 1].y ? "top" : "bottom";
          let distXToCenter = startWidget.width/2 + Math.max(distX + ARROW_MARGIN, TWO_SEGMENT_ARROW_MIN);
          arrow.points[0].x = startWidgetCenter.x + (arrow.points[arrow.points.length - 1].type === "right" ? distXToCenter : -distXToCenter);
          arrow.points[0].y = arrow.points[0].type === "top" ? draggingY : draggingY + draggingHeight;
        } else {
          arrow.points[0].type = draggingX > arrow.points[arrow.points.length - 1].x ? "left" : "right";
          let distYToCenter = startWidget.height/2 + Math.max(distY + ARROW_MARGIN, TWO_SEGMENT_ARROW_MIN);
          arrow.points[0].x = arrow.points[arrow.points.length - 1].type === "left" ? draggingX : draggingX + draggingWidth;
          arrow.points[0].y = startWidgetCenter.y + (arrow.points[arrow.points.length - 1].type === "bottom" ? distYToCenter : -distYToCenter);
        }
      } else {
        if(arrow.initialIsHorizontal) {
          arrow.points[arrow.points.length - 1].type = draggingY > arrow.points[0].y ? "top" : "bottom";
          let distXToCenter = startWidget.width/2 + Math.max(distX + ARROW_MARGIN, TWO_SEGMENT_ARROW_MIN);
          arrow.points[arrow.points.length - 1].x = startWidgetCenter.x + (arrow.points[0].type === "right" ? distXToCenter : -distXToCenter);
          arrow.points[arrow.points.length - 1].y = arrow.points[arrow.points.length - 1].type === "top" ? draggingY : draggingY + draggingHeight;
        } else {
          arrow.points[arrow.points.length - 1].type = draggingX > arrow.points[0].x ? "left" : "right";
          let distYToCenter = startWidget.height/2 + Math.max(distY + ARROW_MARGIN, TWO_SEGMENT_ARROW_MIN);
          arrow.points[arrow.points.length - 1].x = arrow.points[arrow.points.length - 1].type === "left" ? draggingX : draggingX + draggingWidth;
          arrow.points[arrow.points.length - 1].y = startWidgetCenter.y + (arrow.points[0].type === "bottom" ? distYToCenter : -distYToCenter);
        }
      }
    // otherwise use regular 3-segments arrow
    } else {
      if (isStart) {
        if(arrow.initialIsHorizontal) {
          arrow.points[0].type = arrow.points[arrow.points.length - 1].type === "right" ? "left" : "right";
        } else {
          arrow.points[0].type = arrow.points[arrow.points.length - 1].type === "bottom" ? "top" : "bottom";
        }
        arrow.points[0] = draggingPosition ? {...arrow.points[0], x: draggingPosition.x, y: draggingPosition.y} : this.getWidgetSideMidPosition(arrow.points[0], endWidget);
      } else {
        if(arrow.initialIsHorizontal) {
            arrow.points[arrow.points.length - 1].type = arrow.points[0].type === "right" ? "left" : "right";
        } else {
          arrow.points[arrow.points.length - 1].type = arrow.points[0].type === "bottom" ? "top" : "bottom";
        }
        arrow.points[arrow.points.length - 1] = draggingPosition ? {...arrow.points[arrow.points.length - 1], x: draggingPosition.x, y: draggingPosition.y} : this.getWidgetSideMidPosition(arrow.points[arrow.points.length - 1], endWidget);
      }
    }

    return false;
  }

  // returns the middle point of an intersection
  getIntersectionMiddle(min1: number, size1: number, min2: number, size2: number) {
    const max1 = min1 + size1;
    const max2 = min2 + size2;
    if (size2 === 0) return min2 >= min1 && min2 <= max1 ? min2 : null;

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
          className={`App ${cursor === 'crosshair' ? 'connector-mode' : ''}`}
          tabIndex={1}
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
                  onMouseDown={this.handleStickyMouseDown}
                  onMouseUp={this.handleStickyMouseUp}
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
              return <Arrow
                widget={w} key={w.id}
                onDragPointStart={this.handleArrowPointDragStart}
                onDragSegmentEnd={this.handleDragSegmentEnd}
                onDragSegment={this.handleDragSegment}
                onDragSegmentStart={this.handleDragSementStart}
              />;
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
