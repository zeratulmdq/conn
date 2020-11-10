(this.webpackJsonpdiagraming=this.webpackJsonpdiagraming||[]).push([[0],[,,,,,,,,,function(t,e,n){},,function(t,e,n){t.exports=n(19)},,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);var i=n(1),o=n.n(i),a=n(10),r=n.n(a),s=(n(16),n(3)),c=n(2),l=n(0),g=n(4),d=n(5),h=n(7),p=n(6),u=(n(17),n(9),function(t){Object(h.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,o=new Array(i),a=0;a<i;a++)o[a]=arguments[a];return(t=e.call.apply(e,[this].concat(o))).dragging=!1,t.initialX=0,t.initialY=0,t.handleDragStart=function(e){var n=t.props,i=n.onDragStart,o=n.widget,a=n.cursor,r=n.onMouseDown;"crosshair"===a?r(o.id,e):i(o.id,e)},t.handleMouseUp=function(e){var n=t.props,i=n.onMouseUp,o=n.cursor,a=n.widget;"crosshair"===o&&i(a.id,e)},t.handleMouseHover=function(e){var n=t.props;(0,n.onMouseHover)(n.widget.id,e)},t.handleMouseLeave=function(e){var n=t.props;(0,n.onMouseLeave)(n.widget.id,e)},t}return Object(d.a)(n,[{key:"render",value:function(){var t=this.props,e=t.cursor,n=t.selected,i=t.widget,a=i.x,r=i.y,s=i.width,c=i.height;return o.a.createElement("div",{onMouseUp:this.handleMouseUp,onMouseDown:this.handleDragStart,onMouseMove:this.handleMouseHover,onMouseLeave:this.handleMouseLeave,style:{top:r,left:a,width:s,height:c,cursor:"crosshair"===e?"crosshair":"pointer",border:n?"2px solid blue":"none"},className:"Sticky"},o.a.createElement("div",{className:"snapping-point top",style:{top:-15,left:s/2-15,width:30,height:30},id:"top"}),o.a.createElement("div",{className:"snapping-point right",style:{top:c/2-15,left:s-15,width:30,height:30},id:"right"}),o.a.createElement("div",{className:"snapping-point bottom",style:{top:c-15,left:s/2-15,width:30,height:30},id:"bottom"}),o.a.createElement("div",{className:"snapping-point left",style:{top:c/2-15,left:-15,width:30,height:30},id:"left"}))}}]),n}(o.a.Component)),y=(n(18),function(t){Object(h.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).state={draggingSegment:!1,draggingSegmentNumber:-1},t.getPoints=function(){var e=t.props.widget.points;return{start:e[0],end:e[e.length-1]}},t.handleSegmentDragStart=function(e,n){if(!t.state.draggingSegment){t.props.onDragSegmentStart(t.props.widget.id,n,{x:e.clientX,y:e.clientY});var i=0===n?1:n;t.setState({draggingSegment:!0,draggingSegmentNumber:i})}},t.handleSegmentDragEnd=function(){if(t.state.draggingSegment){var e=t.state.position;t.props.onDragSegmentEnd(t.props.widget.id,t.state.draggingSegmentNumber,e),t.setState({draggingSegment:!1,draggingSegmentNumber:-1,position:void 0})}},t.connectionDot=function(e,n,i,a){return o.a.createElement("circle",{key:i,cx:"".concat(e),cy:"".concat(n),r:"5",stroke:a?"black":"#1c7ff9",fill:a?"white":"#1c7ff9",onMouseDown:function(e){var n=t.props;(0,n.onDragPointStart)(n.widget.id,e,!!a)}})},t.handleMouseMove=function(e){var n=e.clientX,i=e.clientY,o=t.state.draggingSegmentNumber;if(t.state.draggingSegment){var a=t.getPoints().start;"right"!==a.type&&"left"!==a.type||o%2===0?t.setState({position:i}):t.setState({position:n}),t.props.onDragSegment(t.props.widget.id,o,{x:n,y:i})}},t.pathGenerator=function(){var e=t.props.widget.points,n=e[0],i=e[e.length-1],a="right"===n.type||"left"===n.type,r=function(t){return a&&t%2!==0||!a&&t%2===0?"ew-resize":"ns-resize"},c=[];return e.forEach((function(n,i){var a=e[i+1];a&&c.push(o.a.createElement("path",{key:i+1,d:"M ".concat(n.x," ").concat(n.y," L ").concat(a.x," ").concat(a.y),stroke:"black",strokeWidth:"2",fill:"none",style:{cursor:r(i),pointerEvents:"auto"},onMouseDown:function(e){return t.handleSegmentDragStart(e,i)}}))})),function(e){return[t.connectionDot(n.x,n.y,"0",!0)].concat(Object(s.a)(e),[t.connectionDot(i.x,i.y,"100")])}([].concat(c))},t}return Object(d.a)(n,[{key:"render",value:function(){var t=this.pathGenerator();return o.a.createElement("svg",{style:{position:"absolute",top:0,left:0,pointerEvents:this.state.draggingSegment?"auto":"none"},xmlns:"http://www.w3.org/2000/svg",version:"1.1",className:"Arrow",onMouseUp:this.handleSegmentDragEnd,onMouseMove:this.handleMouseMove},t)}}]),n}(o.a.PureComponent)),f=function(t){Object(h.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,o=new Array(i),a=0;a<i;a++)o[a]=arguments[a];return(t=e.call.apply(e,[this].concat(o))).state={checked:!1},t.handleOnChange=function(e){t.setState((function(e){var n=!e.checked;return t.props.onCheckedChange(n),{checked:n}}))},t}return Object(d.a)(n,[{key:"render",value:function(){return o.a.createElement("div",{style:{height:"auto"}},o.a.createElement("label",null,o.a.createElement("input",{type:"checkbox",style:{width:15,height:15},onChange:this.handleOnChange,defaultChecked:this.state.checked}),this.props.label))}}]),n}(o.a.PureComponent),b=n(21),v=function(t){var e,n;return{id:b.a(),height:null!==(e=t.height)&&void 0!==e?e:100,width:null!==(n=t.width)&&void 0!==n?n:100,type:"sticky",x:t.x||0,y:t.y||0}},w=function(t){return{id:b.a(),height:0,width:0,type:"arrow",x:(t.x||0)-25,y:(t.y||0)-25,start:t.start||null,end:t.end||null,points:[],arrowType:t.arrowType||"initial",chartBranch:null,initialIsHorizontal:t.initialIsHorizontal||!0}},x=function(t){return"left"===t||"right"===t?"horizontal":"vertical"},O=function(t){return"left"===t.points[0].type||"right"===t.points[0].type},j={position:"absolute",top:0,width:"auto",height:"auto",borderStyle:"solid",backgroundColor:"lightgray",padding:10},S=function(t){Object(h.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,o=new Array(i),a=0;a<i;a++)o[a]=arguments[a];return(t=e.call.apply(e,[this].concat(o))).ref=null,t.state={settings:{stickToConvergentWidgetSide:!1},cursor:"auto",dragging:null,initialId:null,endId:null,selected:null,widgets:{}},t.mousePosition=null,t.mouseOverSticky=!1,t.handleArrowPointDragStart=function(e,n,i){if(i){var o=t.state.widgets[e].end;t.setState((function(t){return Object(l.a)(Object(l.a)({},t),{},{cursor:"crosshair",dragging:[e],endId:o,initialId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},e,Object(l.a)(Object(l.a)({},t.widgets[e]),{},{start:null,startPoint:null,initialIsHorizontal:O(t.widgets[e])})))})}))}else{var a=t.state.widgets[e].start;t.setState((function(t){return Object(l.a)(Object(l.a)({},t),{},{cursor:"crosshair",dragging:[e],initialId:a,endId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},e,Object(l.a)(Object(l.a)({},t.widgets[e]),{},{end:null,endPoint:null,initialIsHorizontal:O(t.widgets[e])})))})}))}},t.handleStickyMouseDown=function(e,n){if("crosshair"===t.state.cursor)if(t.state.dragging);else{var i={x:n.clientX,y:n.clientY};t.setState((function(n){var o=Object(l.a)({},w({start:e,end:null}));return t.updateArrow(o,i),Object(l.a)(Object(l.a)({},n),{},{initialId:e,endId:null,widgets:Object(l.a)(Object(l.a)({},n.widgets),{},Object(c.a)({},o.id,o)),dragging:[o.id]})}))}},t.handleStickyMouseUp=function(e,n){n.stopPropagation(),t.state.initialId!==e&&t.state.endId!==e?"crosshair"===t.state.cursor&&t.setState((function(n){var i,o;if(!n.dragging)return Object(l.a)({},n);var a=Object(l.a)({},n.widgets[n.dragging[0]]),r=n.widgets[null!==(i=a.start)&&void 0!==i?i:e],s=n.widgets[null!==(o=a.end)&&void 0!==o?o:e];return a.start=r.id,a.end=s.id,a.initialIsHorizontal=O(a),t.setArrowChartBranch(a,t.state.widgets,!1),Object(l.a)(Object(l.a)({},n),{},{cursor:"auto",dragging:null,initialId:null,endId:null,widgets:Object(l.a)(Object(l.a)({},n.widgets),{},Object(c.a)({},a.id,a))})})):t.cancelArrowCreation()},t.handleDoubleClick=function(e){var n=e.ctrlKey||e.metaKey?150:100,i=v({x:e.clientX-n/2,y:e.clientY-50,width:n});t.setState((function(t){return{selected:[i.id],widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},i.id,i))}}))},t.handleDrag=function(e){var n=t.mousePosition?e.clientX-t.mousePosition.x:e.clientX,i=t.mousePosition?e.clientY-t.mousePosition.y:e.clientY;t.mousePosition={x:e.clientX,y:e.clientY};var o=t.state,a=o.dragging,r=o.widgets;if(a){var s=a.map((function(t){return r[t]}));if(s.length>1||"sticky"===s[0].type){var g=Object.values(r).filter((function(t){return"arrow"===t.type})),d=Object.values(r).filter((function(t){return"arrow"===t.type&&a&&(t.start&&a.includes(t.start)||t.end&&a.includes(t.end))})).reduce((function(e,o){var r=o;return t.updateArrow(r),a&&r.start&&a.includes(r.start)&&r.end&&a.includes(r.end)&&r.chartBranch&&("oneToOne"===r.chartBranch.type?r.chartBranch.position=r.chartBranch.position+(O(r)?n:i):g.forEach((function(t){var e,o;if(t.chartBranch&&(null===(e=t.chartBranch)||void 0===e?void 0:e.position)===(null===(o=r.chartBranch)||void 0===o?void 0:o.position)){if(t.end&&!a.includes(t.end)||t.start&&!a.includes(t.start))return;r.chartBranch.position=r.chartBranch.position+(O(r)?n:i)}}))),Object(l.a)(Object(l.a)({},e),{},Object(c.a)({},r.id,Object(l.a)({},r)))}),{}),h=s.reduce((function(t,e){return Object(l.a)(Object(l.a)({},t),{},Object(c.a)({},e.id,Object(l.a)(Object(l.a)({},e),{},{x:e.x+n,y:e.y+i})))}),{});t.setState({widgets:Object(l.a)(Object(l.a)(Object(l.a)({},r),h),d)})}else if("arrow"===s[0].type&&!t.mouseOverSticky){var p=Object(l.a)({},s[0]);p.end&&p.start||t.updateArrow(p,t.mousePosition),t.setState({widgets:Object(l.a)(Object(l.a)({},r),{},Object(c.a)({},p.id,p))})}}},t.handleMouseHoverSticky=function(e,n){t.mouseOverSticky=!0;var i=n.target.id||null,o=t.state,a=o.dragging,r=o.widgets;if(a){var s=a.map((function(t){return r[t]}));if(1===s.length&&"arrow"===s[0].type){var g=Object(l.a)({},s[0]),d=!!t.state.endId,h=d?g.startPoint!==i&&g.start===e:g.endPoint!==i&&g.end===e;if(g.start!==e&&g.end!==e||h){var p,u;g.start=null!==(p=g.start)&&void 0!==p?p:e,g.end=null!==(u=g.end)&&void 0!==u?u:e,d?(g.startPoint="auto"!==i?i:null,g.arrowType="initial",g.chartBranch=null):(g.endPoint="auto"!==i?i:null,g.arrowType="initial",g.chartBranch=null),t.updateArrow(g);var y=Object(l.a)(Object(l.a)({},r),{},Object(c.a)({},g.id,g));t.setState({widgets:y})}}}},t.handleMouseLeaveSticky=function(e,n){t.mouseOverSticky=!1;var i=t.state,o=i.dragging,a=i.widgets;if(o){var r=o.map((function(t){return a[t]}));if(1===r.length&&"arrow"===r[0].type&&r[0].start&&r[0].end&&(r[0].start===e||r[0].end===e)){var s=Object(l.a)({},r[0]);s.startPoint=s.start===e?null:s.startPoint,s.endPoint=s.end===e?null:s.endPoint,s.start=s.start===e?null:s.start,s.end=s.end===e?null:s.end,t.setState({widgets:Object(l.a)(Object(l.a)({},a),{},Object(c.a)({},s.id,s))})}if(1===r.length&&"arrow"===r[0].type&&(r[0].start===e&&!r[0].end||r[0].end===e&&!r[0].start)){var g=Object(l.a)({},r[0]),d=t.state.widgets[e],h=n.clientY>d.y&&n.clientY<d.y+d.height;t.setState({widgets:Object(l.a)(Object(l.a)({},a),{},Object(c.a)({},g.id,Object(l.a)(Object(l.a)({},g),{},{initialIsHorizontal:h})))})}}},t.handleWidgetDragStart=function(e,n){var i=n.shiftKey;if(n.stopPropagation(),0===n.button&&!t.state.dragging){var o=t.state.selected&&(t.state.selected.includes(e)||i)?t.state.selected.includes(e)?t.state.selected:[].concat(Object(s.a)(t.state.selected),[e]):[e],a=t.state.selected&&t.state.selected.includes(e)?t.state.selected:[e];t.setState({dragging:a,selected:o})}},t.handleKeyDown=function(e){if("c"===e.key||"C"===e.key){var n="auto"===t.state.cursor?"crosshair":"auto";"auto"===n?t.cancelArrowCreation():t.setState({cursor:n})}"Backspace"!==e.key&&"Delete"!==e.key||!t.state.selected||t.setState((function(t){var e=t.selected||null,n=t.widgets;return null===e||void 0===e||e.forEach((function(t){Object.values(n).forEach((function(e){"arrow"!==e.type||e.start!==t&&e.end!==t||delete n[e.id]})),delete n[t]})),Object(l.a)(Object(l.a)({},t),{},{selected:null,widgets:Object(l.a)({},n)})}))},t.handleMouseDown=function(){t.setState({selected:null})},t.isDraggingArrow=function(){var e=t.state.dragging&&t.state.dragging.map((function(e){return t.state.widgets[e]}));return e&&1===e.length&&"arrow"===e[0].type},t.getConnectedStickyPos=function(t,e){var n={x:0,y:0};switch(t.type){case"top":n.x=t.x-e/2,n.y=t.y;break;case"right":n.x=t.x-e,n.y=t.y-50;break;case"bottom":n.x=t.x-e/2,n.y=t.y-100;break;case"left":n.x=t.x,n.y=t.y-e/2}return n},t.handleMouseUp=function(e){if(t.isDraggingArrow()){if(t.state.initialId||t.state.endId){if(t.state.endId)return void t.cancelArrowCreation();var n=e.ctrlKey||e.metaKey?150:100,i=t.state.dragging&&t.state.dragging.map((function(e){return t.state.widgets[e]})),o=i&&Object(l.a)({},i[0]),a=o&&o.points[o.points.length-1];if(!a||!o)return;var r,s=t.getConnectedStickyPos(a,n),g=v(Object(l.a)(Object(l.a)({},s),{},{width:n}));if(o.end=g.id,o.initialIsHorizontal=O(o),t.setArrowChartBranch(o,t.state.widgets,!1),o)t.setState({selected:[g.id],dragging:null,initialId:null,endId:null,cursor:"auto",widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},(r={},Object(c.a)(r,g.id,g),Object(c.a)(r,o.id,Object(l.a)({},o)),r))})}}else t.setState((function(e){if(!e.dragging)return Object(l.a)({},e);var n=Object.values(e.widgets).filter((function(t){var n,i;return"arrow"===t.type&&(t.start&&(null===(n=e.dragging)||void 0===n?void 0:n.includes(t.start))||t.end&&(null===(i=e.dragging)||void 0===i?void 0:i.includes(t.end)))})).map((function(t){return t})).reduce((function(n,i){if(!e.settings.stickToConvergentWidgetSide||"chartBranch"!==i.arrowType){if(t.isChartSideArrow(i,e.widgets)){var o=e.widgets[i.start||""],a=e.widgets[i.end||""];t.updateArrowChartSide(i,o,a)&&(i.arrowType="chartSide")}t.setArrowChartBranch(i,e.widgets,!1)}return i.initialIsHorizontal=O(i),Object(l.a)(Object(l.a)({},n),{},Object(c.a)({},i.id,Object(l.a)({},i)))}),{});return{dragging:null,widgets:Object(l.a)(Object(l.a)({},e.widgets),n)}}))},t.handleRef=function(e){t.ref=e,t.ref&&t.ref.focus()},t.getStartPointType=function(t){if(!(t.length<2)){var e=t[0],n=t[1];return console.log("first: ",e),console.log("second: ",n),e.x<n.x?"right":e.x>n.x?"left":e.y<n.y?"bottom":"top"}},t.getEndPointType=function(e){var n=Object(s.a)(e).reverse();return t.getStartPointType(n)},t.handleDragSegmentEnd=function(e,n,i){var o=t.state.widgets[e],a=o.points,r=t.getStartPointType(a),s=t.getEndPointType(a);1===n?(o.points[0].type=r,o.startPoint=r,3===a.length&&(o.points[a.length-1].type=s,o.endPoint=s)):n===a.length-3&&(o.points[a.length-1].type=s,o.endPoint=s),(O(o)?n%2!==0:n%2===0)?(console.log("horizontalDrag"),o.points[n].x===o.points[n-1].x?o.points.splice(n,2):o.points[n+1].x===o.points[n+2].x&&(console.log("iqual to next"),console.log(o.points[n]),console.log(o.points[n+1]),console.log(n),o.points.splice(n+1,2))):(console.log("not horizontalDrag"),o.points[n].y===o.points[n-1].y?o.points.splice(n,2):o.points[n+1].y===o.points[n+2].y&&o.points.splice(n+1,2)),t.setState({widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},Object(c.a)({},e,o))}),1===n&&t.setArrowChartBranch(o,t.state.widgets,!1,i)},t.handleDragSementStart=function(e,n,i){var o=t.state.widgets[e],a=O(o)?n%2!==0:n%2===0,r=0===n,g=n===o.points.length-2;if(0===n||n===o.points.length-2){if(r&&g){console.log("IS FIRST && IS LAST");var d=o.points[0],h=o.points[1];if(a){var p={x:i.x,y:d.y},u={x:i.x,y:h.y};o.points=[Object(l.a)(Object(l.a)({},d),{},{type:"right"}),p,u,Object(l.a)(Object(l.a)({},h),{},{type:"right"})],o.startPoint="right",o.endPoint="right"}else{var y={x:d.x,y:i.y},f={x:h.x,y:i.y};o.points=[Object(l.a)(Object(l.a)({},d),{},{type:"top"}),y,f,Object(l.a)(Object(l.a)({},h),{},{type:"top"})],o.startPoint="top",o.endPoint="top"}}else if(r){console.log("IS FIRST");var b=o.points.slice(2),v=o.points[0];if(a){var w={x:i.x,y:v.y},x={x:i.x,y:o.points[1].y};o.points=[Object(l.a)(Object(l.a)({},v),{},{type:"right"}),w,x].concat(Object(s.a)(b)),o.startPoint="right"}else{var j={x:v.x,y:i.y},S={x:o.points[1].x,y:i.y};o.points=[Object(l.a)(Object(l.a)({},v),{},{type:"top"}),j,S].concat(Object(s.a)(b)),o.startPoint="top"}}else if(g){console.log("IS LAST");var m=o.points.slice(0,o.points.length-2),k=o.points[o.points.length-1];if("right"===k.type||"left"===k.type){var P={x:k.x,y:i.y},M={x:o.points[o.points.length-2].x,y:i.y};o.points=[].concat(Object(s.a)(m),[M,P,Object(l.a)(Object(l.a)({},k),{},{type:"top"})]),o.endPoint="top"}else{var B={x:i.x,y:k.y},D={x:i.x,y:o.points[o.points.length-2].y};o.points=[].concat(Object(s.a)(m),[D,B,Object(l.a)(Object(l.a)({},k),{},{type:"right"})]),o.endPoint="right"}}t.setState({widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},Object(c.a)({},e,o))})}},t.handleDragSegment=function(e,n,i){var o=t.state.widgets[e],a=O(o)?n%2!==0:n%2===0;0!==n&&n!==o.points.length-1&&(a?(o.points[n].x=i.x,o.points[n+1].x=i.x):(o.points[n].y=i.y,o.points[n+1].y=i.y),t.setState({widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},Object(c.a)({},e,o))}))},t.setIntermidiatePoints=function(t){var e=t.points,n=e[0],i=e[e.length-1],o="right"===n.type||"left"===n.type,a="right"===i.type||"left"===i.type;console.log("end: ",i);var r=o?(i.x-n.x)/2:(i.y-n.y)/2;if(o&&n.y===i.y||!o&&n.x===i.x)e.length<5&&(t.points=[n,i]);else{var c,l,g;if(o!==a&&e.length<5)if(!(o?"bottom"===i.type&&i.y>n.y||"top"===i.type&&i.y<n.y:"right"===i.type&&i.x>n.x||"left"===i.type&&i.x<n.x)){var d=o?{x:i.x,y:n.y}:{x:n.x,y:i.y};return void(t.points=[n,d,i])}if(o!==a&&e.length<5)return c=o?{x:n.x+r,y:n.y}:{x:n.x,y:n.y+r},"bottom"===i.type||"right"===i.type?(l=o?{x:n.x+r,y:i.y+20}:{x:i.x+20,y:n.y+r},g=o?{x:i.x,y:i.y+20}:{x:i.x+20,y:i.y}):(l=o?{x:n.x+r,y:i.y-20}:{x:i.x-20,y:n.y+r},g=o?{x:i.x,y:i.y-20}:{x:i.x-20,y:i.y}),void(t.points=[n,c,l,g,i]);if(e.length>=5){console.log("AAAAAAAAAA"),console.log("isHorizontalStart: ",o),c=o?{x:e[1].x,y:n.y}:{x:n.x,y:e[1].y},console.log("p2: ",c),g=a?{x:e[e.length-2].x,y:i.y}:{x:i.x,y:e[e.length-2].y};var h=e.slice(2,e.length-2);t.points=[n,c].concat(Object(s.a)(h),[g,i])}else{console.log("SECOND CASE");var p=o?n.x+r:n.y+r;if(t.chartBranch){var u="manyToOne"===t.chartBranch.type?i:n;t.chartBranch.convergenceSide===u.type&&(p=t.chartBranch.position)}c=o?{x:p,y:n.y}:{x:n.x,y:p},l=o?{x:p,y:i.y}:{x:i.x,y:p},t.points=[n,c,l,i]}}},t}return Object(d.a)(n,[{key:"cancelArrowCreation",value:function(){this.setState((function(t){if(t.dragging&&t.dragging.length){var e=Object(l.a)({},t.widgets[t.dragging[0]]);if("arrow"===e.type){var n=t.widgets;return delete n[e.id],Object(l.a)(Object(l.a)({},t),{},{dragging:null,initialId:null,endId:null,cursor:"auto",widgets:Object(l.a)({},n)})}}return Object(l.a)(Object(l.a)({},t),{},{dragging:null,initialId:null,endId:null,cursor:"auto"})}))}},{key:"setArrowChartBranch",value:function(t,e,n,i){if(!this.state.settings.stickToConvergentWidgetSide&&t.chartBranch&&(("manyToOne"===t.chartBranch.type?t.points[t.points.length-1]:t.points[0]).type===t.chartBranch.convergenceSide&&(!i||t.chartBranch.position===i)))return void console.log("not recalculating chart branch");var o=this.getSharedChartBranchArrow(t,e);if(n&&!o)return t.chartBranch=null,void console.log("setting chart branch null");if(t.arrowType="chartBranch",o&&o.chartBranch&&!i)console.log("become part of an existing chartBranch"),"oneToOne"===o.chartBranch.type&&(o.start===t.start?(o.chartBranch.type="oneToMany",o.chartBranch.convergenceSide=t.points[0].type):(o.chartBranch.type="manyToOne",o.chartBranch.convergenceSide=t.points[t.points.length-1].type)),t.chartBranch=Object.assign({},o.chartBranch);else if(!t.startPoint&&!t.endPoint||i){console.log("new lonely charBranch arrow");var a={position:i||0,convergenceSide:t.points[0].type,type:"oneToOne"};i||(console.log("convergenceSide: ",a.convergenceSide),"horizontal"===x(a.convergenceSide||"right")?a.position=t.points[0].x+(t.points[t.points.length-1].x-t.points[0].x)/2:a.position=t.points[0].y+(t.points[t.points.length-1].y-t.points[0].y)/2),t.chartBranch=a}}},{key:"getSharedChartBranchArrow",value:function(t,e){var n=Object.values(e).filter((function(e){return"arrow"===e.type&&e.id!==t.id&&"chartBranch"===e.arrowType&&e.chartBranch&&(e.start===t.start&&e.points[0].type===t.points[0].type||e.end===t.end&&e.points[e.points.length-1].type===t.points[t.points.length-1].type)})).map((function(t){return t}));return n.length>0?n[0]:null}},{key:"updateArrow",value:function(t,e){var n=this.state.widgets,i=n[t.start||""],o=n[t.end||""],a=!!e,r=i||o;if(r){var s=[{type:"right",x:0,y:0},{type:"left",x:1,y:0}];if(t.points.length>=2&&(console.log("asigning points"),s=t.points),!this.state.settings.stickToConvergentWidgetSide||"chartBranch"!==t.arrowType){var c=e?e.x:o.x,g=e?e.y:o.y,d=e?0:o.width;if(r.x+r.width+10<c?(s[0].type=t.startPoint||(i?"right":"left"),s[s.length-1].type=t.endPoint||(i?"left":"right")):c+d+10<r.x?(s[0].type=t.startPoint||(i?"left":"right"),s[s.length-1].type=t.endPoint||(i?"right":"left")):g>r.y+r.height+10?(s[0].type=t.startPoint||(i?"bottom":"top"),s[s.length-1].type=t.endPoint||(i?"top":"bottom")):(s[0].type=t.startPoint||(i?"top":"bottom"),s[s.length-1].type=t.endPoint||(i?"bottom":"top")),s[0]=i?this.getWidgetSideMidPosition(s[0],i):Object(l.a)(Object(l.a)({},s[0]),{},{x:e.x,y:e.y}),s[s.length-1]=o?this.getWidgetSideMidPosition(s[s.length-1],o):Object(l.a)(Object(l.a)({},s[s.length-1]),{},{x:e.x,y:e.y}),t.points=s,console.log(t.points),this.isChartSideArrow(t,n)&&(a?this.updateArrowChartSide(t,r,o,e,!!o):this.updateArrowChartSide(t,i,o)),a&&t.points.length<5){var h=t.points;"left"===h[0].type||"right"===h[0].type?h[h.length-1].y<=h[0].y+10&&h[h.length-1].y>=h[0].y-10&&(h[h.length-1].y=h[0].y):"top"!==h[0].type&&"bottom"!==h[0].type||h[h.length-1].x<=h[0].x+10&&h[h.length-1].x>=h[0].x-10&&(h[h.length-1].x=h[0].x)}this.setArrowChartBranch(t,n,!0)}if(t.chartBranch&&i&&o&&!t.startPoint&&!t.endPoint){var p="manyToOne"===t.chartBranch.type,u=p?t.points[t.points.length-1]:t.points[0],y=p?t.points[0]:t.points[t.points.length-1],f=p?o:i,b=p?i:o;u=this.getWidgetSideMidPosition(u,f),y=this.getWidgetSideMidPosition(y,b),"horizontal"===x(t.chartBranch.convergenceSide||"right")?t.chartBranch.position>=b.x&&t.chartBranch.position<=b.x+b.width?(y.x=t.chartBranch.position,y.y=b.y+b.height/2>u.y?b.y:b.y+b.height):(y.type=t.chartBranch.position<b.x?"left":"right",y=this.getWidgetSideMidPosition(y,b)):t.chartBranch.position>=b.y&&t.chartBranch.position<=b.y+b.height?(y.x=b.x+b.width/2>u.x?b.x:b.x+b.width,y.y=t.chartBranch.position):(y.type=t.chartBranch.position<b.y?"top":"bottom",y=this.getWidgetSideMidPosition(y,b)),t.points[0]=p?y:u,t.points[t.points.length-1]=p?u:y}this.setIntermidiatePoints(t)}}},{key:"isChartSideArrow",value:function(t,e){return!this.getSharedChartBranchArrow(t,e)&&(!t.startPoint&&!t.endPoint&&(t.initialIsHorizontal&&("top"===t.points[0].type||"bottom"===t.points[0].type)||!t.initialIsHorizontal&&("left"===t.points[0].type||"right"===t.points[0].type)))}},{key:"updateArrowChartSide",value:function(t,e,n,i,o){var a=i?i.x:n.x,r=i?i.y:n.y,s=i?0:n.width,c=i?0:n.height;if(t.initialIsHorizontal){var g=this.getIntersectionMiddle(e.x,e.width,a,s);if(g)return t.points=[Object(l.a)(Object(l.a)({},t.points[0]),{},{x:g}),Object(l.a)(Object(l.a)({},t.points[t.points.length-1]),{},{x:g})],!0}else{var d=this.getIntersectionMiddle(e.y,e.height,r,c);if(d)return t.points=[Object(l.a)(Object(l.a)({},t.points[0]),{},{y:d}),Object(l.a)(Object(l.a)({},t.points[t.points.length-1]),{},{y:d})],!0}o&&i?(t.initialIsHorizontal?t.points[t.points.length-1].type=a>e.x+e.width/2?"right":"left":t.points[t.points.length-1].type=r>e.y+e.height/2?"bottom":"top",t.points[t.points.length-1]=this.getWidgetSideMidPosition(t.points[t.points.length-1],e)):(t.initialIsHorizontal?t.points[0].type=a>e.x+e.width/2?"right":"left":t.points[0].type=r>e.y+e.height/2?"bottom":"top",t.points[0]=this.getWidgetSideMidPosition(t.points[0],e));var h=e.x+e.width/2,p=e.y+e.height/2,u=a+s/2,y=r+c/2,f=Math.abs(h-u)-(e.width/2+s/2),b=Math.abs(p-y)-(e.height/2+c/2);if(t.initialIsHorizontal?f<=10:b<=10)if(o)if(t.initialIsHorizontal){t.points[0].type=r>t.points[t.points.length-1].y?"top":"bottom";var v=e.width/2+Math.max(f+10,20);t.points[0].x=h+("right"===t.points[t.points.length-1].type?v:-v),t.points[0].y="top"===t.points[0].type?r:r+c}else{t.points[0].type=a>t.points[t.points.length-1].x?"left":"right";var w=e.height/2+Math.max(b+10,20);t.points[0].x="left"===t.points[t.points.length-1].type?a:a+s,t.points[0].y=p+("bottom"===t.points[t.points.length-1].type?w:-w)}else if(t.initialIsHorizontal){t.points[t.points.length-1].type=r>t.points[0].y?"top":"bottom";var x=e.width/2+Math.max(f+10,20);t.points[t.points.length-1].x=h+("right"===t.points[0].type?x:-x),t.points[t.points.length-1].y="top"===t.points[t.points.length-1].type?r:r+c}else{t.points[t.points.length-1].type=a>t.points[0].x?"left":"right";var O=e.height/2+Math.max(b+10,20);t.points[t.points.length-1].x="left"===t.points[t.points.length-1].type?a:a+s,t.points[t.points.length-1].y=p+("bottom"===t.points[0].type?O:-O)}else o?(t.initialIsHorizontal?t.points[0].type="right"===t.points[t.points.length-1].type?"left":"right":t.points[0].type="bottom"===t.points[t.points.length-1].type?"top":"bottom",t.points[0]=i?Object(l.a)(Object(l.a)({},t.points[0]),{},{x:i.x,y:i.y}):this.getWidgetSideMidPosition(t.points[0],n)):(t.initialIsHorizontal?t.points[t.points.length-1].type="right"===t.points[0].type?"left":"right":t.points[t.points.length-1].type="bottom"===t.points[0].type?"top":"bottom",t.points[t.points.length-1]=i?Object(l.a)(Object(l.a)({},t.points[t.points.length-1]),{},{x:i.x,y:i.y}):this.getWidgetSideMidPosition(t.points[t.points.length-1],n));return!1}},{key:"getIntersectionMiddle",value:function(t,e,n,i){var o=t+e,a=n+i;if(0===i)return n>=t&&n<=o?n:null;if(t===n&&o===a||t>n&&t<a){var r=a-t;return r<=20?null:t+r/2}if(o>n&&o<a){var s=o-n;return s<=20?null:o-s/2}return null}},{key:"between",value:function(t,e,n){return t>e&&t<n}},{key:"getWidgetSideMidPosition",value:function(t,e){var n={type:t.type,x:0,y:0};switch(t.type){case"top":n.x=e.x+e.width/2,n.y=e.y;break;case"right":n.x=e.x+e.width,n.y=e.y+e.height/2;break;case"bottom":n.x=e.x+e.width/2,n.y=e.y+e.height;break;case"left":n.x=e.x,n.y=e.y+e.height/2}return n}},{key:"render",value:function(){var t=this,e=this.state,n=e.cursor,i=e.selected,a=e.widgets;return o.a.createElement("div",null,o.a.createElement("div",{id:"canvas",style:{cursor:n},className:"App ".concat("crosshair"===n?"connector-mode":""),tabIndex:1,onDoubleClick:this.handleDoubleClick,onKeyDown:this.handleKeyDown,onMouseMove:this.handleDrag,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,ref:this.handleRef},Object.values(a).map((function(e){return"sticky"===e.type?o.a.createElement(u,{cursor:n,onMouseDown:t.handleStickyMouseDown,onMouseUp:t.handleStickyMouseUp,onDragStart:t.handleWidgetDragStart,onMouseHover:t.handleMouseHoverSticky,onMouseLeave:t.handleMouseLeaveSticky,selected:!!(null===i||void 0===i?void 0:i.includes(e.id)),widget:e,key:e.id}):"arrow"===e.type?o.a.createElement(y,{widget:e,key:e.id,onDragPointStart:t.handleArrowPointDragStart,onDragSegmentEnd:t.handleDragSegmentEnd,onDragSegment:t.handleDragSegment,onDragSegmentStart:t.handleDragSementStart}):null}))),o.a.createElement("div",{id:"settings",style:j},o.a.createElement(f,{label:"Stick To Convergent Widget Side",onCheckedChange:function(e){return t.setState({settings:{stickToConvergentWidgetSide:e}})}})))}}]),n}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(S,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.667300c7.chunk.js.map