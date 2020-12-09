(this.webpackJsonpdiagraming=this.webpackJsonpdiagraming||[]).push([[0],[,,,,,,,,,function(t,e,n){},,function(t,e,n){t.exports=n(19)},,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);var i=n(1),a=n.n(i),o=n(10),r=n.n(o),s=(n(16),n(3)),c=n(2),l=n(0),g=n(4),h=n(5),d=n(7),p=n(6),u=(n(17),n(9),function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))).dragging=!1,t.initialX=0,t.initialY=0,t.handleDragStart=function(e){var n=t.props,i=n.onDragStart,a=n.widget,o=n.cursor,r=n.onMouseDown;"crosshair"===o?r(a.id,e):i(a.id,e)},t.handleMouseUp=function(e){var n=t.props,i=n.onMouseUp,a=n.cursor,o=n.widget;"crosshair"===a&&i(o.id,e)},t.handleMouseHover=function(e){var n=t.props;(0,n.onMouseHover)(n.widget.id,e)},t.handleMouseLeave=function(e){var n=t.props;(0,n.onMouseLeave)(n.widget.id,e)},t}return Object(h.a)(n,[{key:"render",value:function(){var t=this.props,e=t.cursor,n=t.selected,i=t.widget,o=i.x,r=i.y,s=i.width,c=i.height;return a.a.createElement("div",{onMouseUp:this.handleMouseUp,onMouseDown:this.handleDragStart,onMouseMove:this.handleMouseHover,onMouseLeave:this.handleMouseLeave,style:{top:r,left:o,width:s,height:c,cursor:"crosshair"===e?"crosshair":"pointer",border:n?"2px solid blue":"none"},className:"Sticky"},a.a.createElement("div",{className:"snapping-point top",style:{top:-15,left:s/2-15,width:30,height:30},id:"top"}),a.a.createElement("div",{className:"snapping-point right",style:{top:c/2-15,left:s-15,width:30,height:30},id:"right"}),a.a.createElement("div",{className:"snapping-point bottom",style:{top:c-15,left:s/2-15,width:30,height:30},id:"bottom"}),a.a.createElement("div",{className:"snapping-point left",style:{top:c/2-15,left:-15,width:30,height:30},id:"left"}))}}]),n}(a.a.Component)),y=(n(18),function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,o=new Array(i),r=0;r<i;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))).state={draggingSegment:!1,draggingSegmentNumber:-1,editing:!1,label:"label"},t.ref=null,t.getPoints=function(){var e=t.props.widget.points;return{start:e[0],end:e[e.length-1]}},t.handleSegmentDragStart=function(e,n){if(!t.state.draggingSegment){t.props.onDragSegmentStart(t.props.widget.id,n,{x:e.clientX,y:e.clientY});var i=0===n?1:n;t.setState({draggingSegment:!0,draggingSegmentNumber:i})}},t.handleSegmentDragEnd=function(){if(console.log("handleSegmentDragEnd"),t.state.draggingSegment){var e=t.state.position;t.props.onDragSegmentEnd(t.props.widget.id,t.state.draggingSegmentNumber,e),t.setState({draggingSegment:!1,draggingSegmentNumber:-1,position:void 0})}},t.handleMouseMove=function(e){var n=e.clientX,i=e.clientY,a=t.state.draggingSegmentNumber;if(t.state.draggingSegment){var o=t.getPoints().start;"right"!==o.type&&"left"!==o.type||a%2===0?t.setState({position:i}):t.setState({position:n}),t.props.onDragSegment(t.props.widget.id,a,{x:n,y:i})}},t.connectionDot=function(e,n,i,o){var r=function(e){var n=t.props;(0,n.onDragPointStart)(n.widget.id,e,!o)};return o?a.a.createElement("path",{key:i,className:"connectionDot",stroke:"#000",fill:"#000",d:"M".concat(e," ").concat(n," L").concat(e-8," ").concat(n+3,"V").concat(n-3,"z"),fillRule:"evenodd",style:{transform:"rotate(".concat(t.getRotation(o),"deg)"),transformOrigin:"".concat(e,"px ").concat(n,"px")},onMouseDown:r}):a.a.createElement("circle",{key:i,cx:"".concat(e),cy:"".concat(n),r:"2",stroke:"transparent",fill:"black",strokeWidth:"6",onMouseDown:r})},t.getRotation=function(t){switch(t){case"right":return 180;case"left":return 0;case"top":return 90;case"bottom":return-90}},t.pathGenerator=function(){var e=t.props.widget.points,n=t.props.showLabels;if(e.length<2)return null;var i=e[0],o=e[e.length-1],r="right"===i.type||"left"===i.type,c=function(t){return r&&t%2!==0||!r&&t%2===0?"ew-resize":"ns-resize"},l=[];e.forEach((function(n,i){var o=e[i+1];o&&l.push(a.a.createElement("path",{key:i+1,d:"M ".concat(n.x," ").concat(n.y," L ").concat(o.x," ").concat(o.y),stroke:"black",strokeWidth:"2",fill:"none",style:{cursor:c(i),pointerEvents:"auto"},onMouseDown:function(e){return t.handleSegmentDragStart(e,i)}}))}));var g=l;return n&&g.push(t.createLabel(e)),function(e){return[t.connectionDot(i.x,i.y,"0")].concat(Object(s.a)(e),[t.connectionDot(o.x,o.y,"100",o.type)])}(g)},t.createLabel=function(e){var n=t.state.label,i=8.5*n.length,o=18,r=Math.floor(e.length/2),s=e[r-1],c=e[r],l={x:s.x+(c.x-s.x)/2-i/2,y:s.y+(c.y-s.y)/2+o/4};return a.a.createElement("text",{key:"label",transform:"matrix(1 0 0 1 ".concat(l.x," ").concat(l.y,")"),style:{cursor:t.state.editing?"auto":"pointer",pointerEvents:"auto"},tabIndex:0,onClick:t.handleTextClick,ref:t.handleRef},n)},t.handleRef=function(e){t.ref=e},t.handleTextClick=function(){t.state.editing||(window.editingLabel=!0,t.setState({editing:!0}),document.addEventListener("click",t.handleDocClick))},t.handleDocClick=function(e){if(t.ref){var n=t.ref.getBoundingClientRect(),i=e.clientX>n.left&&e.clientX<n.left+n.width,a=e.clientY>n.top&&e.clientY<n.top+n.height;i&&a||(window.editingLabel=!1,t.setState({editing:!1,label:t.ref.textContent||""}),document.removeEventListener("click",t.handleDocClick))}},t}return Object(h.a)(n,[{key:"render",value:function(){var t=this.pathGenerator();if(!t)return null;var e=this.state,n=e.editing,i=e.draggingSegment;return a.a.createElement("div",{contentEditable:n,suppressContentEditableWarning:!0},a.a.createElement("svg",{style:{position:"absolute",top:0,left:0,pointerEvents:i?"auto":"none"},xmlns:"http://www.w3.org/2000/svg",version:"1.1",className:"Arrow",onMouseUp:this.handleSegmentDragEnd,onMouseMove:this.handleMouseMove},t))}}]),n}(a.a.PureComponent)),b=function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))).state={checked:!1},t.handleOnChange=function(e){t.setState((function(e){var n=!e.checked;return t.props.onCheckedChange(n),{checked:n}}))},t}return Object(h.a)(n,[{key:"render",value:function(){return a.a.createElement("div",{style:{height:"auto"}},a.a.createElement("label",null,a.a.createElement("input",{type:"checkbox",style:{width:15,height:15},onChange:this.handleOnChange,defaultChecked:this.state.checked}),this.props.label))}}]),n}(a.a.PureComponent),f=n(21),v=function(t){var e,n;return{id:f.a(),height:null!==(e=t.height)&&void 0!==e?e:100,width:null!==(n=t.width)&&void 0!==n?n:100,type:"sticky",x:t.x||0,y:t.y||0}},w=function(t){return{id:f.a(),height:0,width:0,type:"arrow",x:(t.x||0)-25,y:(t.y||0)-25,start:t.start||null,end:t.end||null,points:[],arrowType:t.arrowType||"initial",chartBranch:null,initialIsHorizontal:t.initialIsHorizontal||!0,showLabels:t.showLabels||!1}},x=function(t){return"left"===t||"right"===t?"horizontal":"vertical"},O=function(t){return"left"===t.points[0].type||"right"===t.points[0].type},j={position:"absolute",top:0,width:"auto",height:"auto",borderStyle:"solid",backgroundColor:"lightgray",padding:10},m=function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(g.a)(this,n);for(var i=arguments.length,a=new Array(i),o=0;o<i;o++)a[o]=arguments[o];return(t=e.call.apply(e,[this].concat(a))).ref=null,t.state={settings:{stickToConvergentWidgetSide:!1,showLabels:!1},cursor:"auto",dragging:null,initialId:null,endId:null,selected:null,widgets:{},newSegment:!1},t.mousePosition=null,t.mouseOverSticky=!1,t.handleArrowPointDragStart=function(e,n,i){if(i){var a=t.state.widgets[e].end;t.setState((function(t){return Object(l.a)(Object(l.a)({},t),{},{cursor:"crosshair",dragging:[e],endId:a,initialId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},e,Object(l.a)(Object(l.a)({},t.widgets[e]),{},{start:null,startPoint:null,initialIsHorizontal:O(t.widgets[e])})))})}))}else{var o=t.state.widgets[e].start;t.setState((function(t){return Object(l.a)(Object(l.a)({},t),{},{cursor:"crosshair",dragging:[e],initialId:o,endId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},e,Object(l.a)(Object(l.a)({},t.widgets[e]),{},{end:null,endPoint:null,initialIsHorizontal:O(t.widgets[e])})))})}))}},t.handleStickyMouseDown=function(e,n){"crosshair"===t.state.cursor&&(t.state.dragging||t.setState((function(t){var n=Object(l.a)({},w({start:e,end:null}));return Object(l.a)(Object(l.a)({},t),{},{initialId:e,endId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},n.id,n)),dragging:[n.id]})})))},t.handleStickyMouseUp=function(e,n){n.stopPropagation(),t.state.initialId!==e&&t.state.endId!==e?"crosshair"===t.state.cursor&&t.setState((function(n){var i,a;if(!n.dragging)return Object(l.a)({},n);var o=Object(l.a)({},n.widgets[n.dragging[0]]),r=n.widgets[null!==(i=o.start)&&void 0!==i?i:e],s=n.widgets[null!==(a=o.end)&&void 0!==a?a:e];return o.start=r.id,o.end=s.id,o.initialIsHorizontal=O(o),t.setArrowChartBranch(o,t.state.widgets,!1),Object(l.a)(Object(l.a)({},n),{},{cursor:"auto",dragging:null,initialId:null,endId:null,widgets:Object(l.a)(Object(l.a)({},n.widgets),{},Object(c.a)({},o.id,o))})})):t.cancelArrowCreation()},t.handleDoubleClick=function(e){var n=e.ctrlKey||e.metaKey?150:100,i=v({x:e.clientX-n/2,y:e.clientY-50,width:n});t.setState((function(t){return{selected:[i.id],widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(c.a)({},i.id,i))}}))},t.handleDrag=function(e){var n=t.mousePosition?e.clientX-t.mousePosition.x:e.clientX,i=t.mousePosition?e.clientY-t.mousePosition.y:e.clientY;t.mousePosition={x:e.clientX,y:e.clientY};var a=t.state,o=a.dragging,r=a.widgets;if(o){var s=o.map((function(t){return r[t]}));if(s.length>1||"sticky"===s[0].type){var g=Object.values(r).filter((function(t){return"arrow"===t.type})),h=Object.values(r).filter((function(t){return"arrow"===t.type&&o&&(t.start&&o.includes(t.start)||t.end&&o.includes(t.end))})).reduce((function(e,a){var r=a;return t.updateArrow(r),o&&r.start&&o.includes(r.start)&&r.end&&o.includes(r.end)&&r.chartBranch&&("oneToOne"===r.chartBranch.type?r.chartBranch.position=r.chartBranch.position+(O(r)?n:i):g.forEach((function(t){var e,a;if(t.chartBranch&&(null===(e=t.chartBranch)||void 0===e?void 0:e.position)===(null===(a=r.chartBranch)||void 0===a?void 0:a.position)){if(t.end&&!o.includes(t.end)||t.start&&!o.includes(t.start))return;r.chartBranch.position=r.chartBranch.position+(O(r)?n:i)}}))),Object(l.a)(Object(l.a)({},e),{},Object(c.a)({},r.id,Object(l.a)({},r)))}),{}),d=s.reduce((function(t,e){return Object(l.a)(Object(l.a)({},t),{},Object(c.a)({},e.id,Object(l.a)(Object(l.a)({},e),{},{x:e.x+n,y:e.y+i})))}),{});t.setState({widgets:Object(l.a)(Object(l.a)(Object(l.a)({},r),d),h)})}else if("arrow"===s[0].type&&!t.mouseOverSticky){var p=Object(l.a)({},s[0]);p.end&&p.start||t.updateArrow(p,t.mousePosition),t.setState({widgets:Object(l.a)(Object(l.a)({},r),{},Object(c.a)({},p.id,p))})}}},t.handleMouseHoverSticky=function(e,n){t.mouseOverSticky=!0;var i=n.target.id||null,a=t.state,o=a.dragging,r=a.widgets;if(o){var s=o.map((function(t){return r[t]}));if(1===s.length&&"arrow"===s[0].type){var g=Object(l.a)({},s[0]),h=!!t.state.endId,d=h?g.startPoint!==i&&g.start===e:g.endPoint!==i&&g.end===e;if(g.start!==e&&g.end!==e||d){var p,u;g.start=null!==(p=g.start)&&void 0!==p?p:e,g.end=null!==(u=g.end)&&void 0!==u?u:e,h?(g.startPoint="auto"!==i?i:null,g.arrowType="initial",g.chartBranch=null):(g.endPoint="auto"!==i?i:null,g.arrowType="initial",g.chartBranch=null),t.updateArrow(g);var y=Object(l.a)(Object(l.a)({},r),{},Object(c.a)({},g.id,g));t.setState({widgets:y})}}}},t.opositePoint=function(t){switch(t){case"top":return"bottom";case"bottom":return"top";case"right":return"left";case"left":return"right"}},t.handleMouseLeaveSticky=function(e,n){t.mouseOverSticky=!1;var i=t.state,a=i.dragging,o=i.widgets;if(a){var r=a.map((function(t){return o[t]}));if(1===r.length&&"arrow"===r[0].type&&r[0].start&&r[0].end&&(r[0].start===e||r[0].end===e)){var s=Object(l.a)({},r[0]);s.startPoint=s.start===e?null:s.startPoint,s.endPoint=s.end===e?null:s.endPoint,s.start=s.start===e?null:s.start,s.end=s.end===e?null:s.end,t.setState({widgets:Object(l.a)(Object(l.a)({},o),{},Object(c.a)({},s.id,s))})}if(1===r.length&&"arrow"===r[0].type&&(r[0].start===e&&!r[0].end||r[0].end===e&&!r[0].start)){var g=Object(l.a)({},r[0]),h=t.state.widgets[e],d=n.clientX,p=n.clientY,u=p>h.y&&p<h.y+h.height,y=u?d<=h.x?"left":"right":p<=h.y?"top":"bottom",b=t.opositePoint(y);t.setState({widgets:Object(l.a)(Object(l.a)({},o),{},Object(c.a)({},g.id,Object(l.a)(Object(l.a)({},g),{},{points:[{x:d,y:p,type:y},{x:d,y:p,type:b}],initialIsHorizontal:u})))})}}},t.handleWidgetDragStart=function(e,n){var i=n.shiftKey;if(n.stopPropagation(),0===n.button&&!t.state.dragging){var a=t.state.selected&&(t.state.selected.includes(e)||i)?t.state.selected.includes(e)?t.state.selected:[].concat(Object(s.a)(t.state.selected),[e]):[e],o=t.state.selected&&t.state.selected.includes(e)?t.state.selected:[e];t.setState({dragging:o,selected:a})}},t.handleKeyDown=function(e){if(("c"===e.key||"C"===e.key)&&!window.editingLabel){var n="auto"===t.state.cursor?"crosshair":"auto";"auto"===n?t.cancelArrowCreation():t.setState({cursor:n})}"Backspace"!==e.key&&"Delete"!==e.key||!t.state.selected||t.setState((function(t){var e=t.selected||null,n=t.widgets;return null===e||void 0===e||e.forEach((function(t){Object.values(n).forEach((function(e){"arrow"!==e.type||e.start!==t&&e.end!==t||delete n[e.id]})),delete n[t]})),Object(l.a)(Object(l.a)({},t),{},{selected:null,widgets:Object(l.a)({},n)})}))},t.handleMouseDown=function(){t.setState({selected:null})},t.isDraggingArrow=function(){var e=t.state.dragging&&t.state.dragging.map((function(e){return t.state.widgets[e]}));return e&&1===e.length&&"arrow"===e[0].type},t.getConnectedStickyPos=function(t,e){var n={x:0,y:0};switch(t.type){case"top":n.x=t.x-e/2,n.y=t.y;break;case"right":n.x=t.x-e,n.y=t.y-50;break;case"bottom":n.x=t.x-e/2,n.y=t.y-100;break;case"left":n.x=t.x,n.y=t.y-e/2}return n},t.handleMouseUp=function(e){if(t.isDraggingArrow()){if(t.state.initialId||t.state.endId){if(t.state.endId)return void t.cancelArrowCreation();var n=e.ctrlKey||e.metaKey?150:100,i=t.state.dragging&&t.state.dragging.map((function(e){return t.state.widgets[e]})),a=i&&Object(l.a)({},i[0]),o=a&&a.points[a.points.length-1];if(!o||!a)return;var r,s=t.getConnectedStickyPos(o,n),g=v(Object(l.a)(Object(l.a)({},s),{},{width:n}));if(a.end=g.id,a.initialIsHorizontal=O(a),t.setArrowChartBranch(a,t.state.widgets,!1),a)t.setState({selected:[g.id],dragging:null,initialId:null,endId:null,cursor:"auto",widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},(r={},Object(c.a)(r,g.id,g),Object(c.a)(r,a.id,Object(l.a)({},a)),r))})}}else t.setState((function(e){if(!e.dragging)return Object(l.a)({},e);var n=Object.values(e.widgets).filter((function(t){var n,i;return"arrow"===t.type&&(t.start&&(null===(n=e.dragging)||void 0===n?void 0:n.includes(t.start))||t.end&&(null===(i=e.dragging)||void 0===i?void 0:i.includes(t.end)))})).map((function(t){return t})).reduce((function(n,i){if(!e.settings.stickToConvergentWidgetSide||"chartBranch"!==i.arrowType){if(t.isChartSideArrow(i,e.widgets)){var a=e.widgets[i.start||""],o=e.widgets[i.end||""];t.updateArrowChartSide(i,a,o)&&(i.arrowType="chartSide")}t.setArrowChartBranch(i,e.widgets,!1)}return i.initialIsHorizontal=O(i),Object(l.a)(Object(l.a)({},n),{},Object(c.a)({},i.id,Object(l.a)({},i)))}),{});return{dragging:null,widgets:Object(l.a)(Object(l.a)({},e.widgets),n)}}))},t.handleRef=function(e){t.ref=e,t.ref&&t.ref.focus()},t.getStartPointType=function(t){if(!(t.length<2)){var e=t[0],n=t[1];return e.x<n.x?"right":e.x>n.x?"left":e.y<n.y?"bottom":"top"}},t.getEndPointType=function(e){var n=Object(s.a)(e).reverse();return t.getStartPointType(n)},t.handleDragSementStart=function(e,n,i){var a=t.state.widgets[e],o=O(a)?n%2!==0:n%2===0,r=0===n,g=n===a.points.length-2;if(0===n||n===a.points.length-2){if(r&&g){var h=a.points[0],d=a.points[1];if(o){var p={x:i.x,y:h.y},u={x:i.x,y:d.y};a.points=[Object(l.a)(Object(l.a)({},h),{},{type:"right"}),p,u,Object(l.a)(Object(l.a)({},d),{},{type:"right"})]}else{var y={x:h.x,y:i.y},b={x:d.x,y:i.y};a.points=[Object(l.a)(Object(l.a)({},h),{},{type:"top"}),y,b,Object(l.a)(Object(l.a)({},d),{},{type:"top"})]}}else if(r){var f=a.points.slice(2),v=a.points[0];if(o){var w={x:i.x,y:v.y},x={x:i.x,y:a.points[1].y};a.points=[Object(l.a)(Object(l.a)({},v),{},{type:"right"}),w,x].concat(Object(s.a)(f))}else{var j={x:v.x,y:i.y},m={x:a.points[1].x,y:i.y};a.points=[Object(l.a)(Object(l.a)({},v),{},{type:"top"}),j,m].concat(Object(s.a)(f))}}else if(g){var S=a.points.slice(0,a.points.length-2),k=a.points[a.points.length-1];if("right"===k.type||"left"===k.type){var M={x:k.x,y:i.y},C={x:a.points[a.points.length-2].x,y:i.y};a.points=[].concat(Object(s.a)(S),[C,M,Object(l.a)(Object(l.a)({},k),{},{type:"top"})])}else{var P={x:i.x,y:k.y},B={x:i.x,y:a.points[a.points.length-2].y};a.points=[].concat(Object(s.a)(S),[B,P,Object(l.a)(Object(l.a)({},k),{},{type:"right"})])}}t.setState({widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},Object(c.a)({},e,a)),newSegment:r||g})}},t.handleDragSegment=function(e,n,i){var a=t.state.widgets[e],o=O(a)?n%2!==0:n%2===0;0!==n&&n!==a.points.length-1&&(o?(a.points[n].x=i.x,a.points[n+1].x=i.x):(a.points[n].y=i.y,a.points[n+1].y=i.y),t.setState({widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},Object(c.a)({},e,a))}))},t.handleDragSegmentEnd=function(e,n,i){var a=t.state.widgets[e],o=a.points;(O(a)?n%2!==0:n%2===0)?a.points[n].x===a.points[n-1].x?a.points.splice(n,2):a.points[n+1].x===a.points[n+2].x&&a.points.splice(n+1,2):a.points[n].y===a.points[n-1].y?a.points.splice(n,2):a.points[n+1].y===a.points[n+2].y&&a.points.splice(n+1,2);var r=t.getStartPointType(o),s=t.getEndPointType(o);a.points[0].type=r,a.points[o.length-1].type=s,1===n&&t.setArrowChartBranch(a,t.state.widgets,!1,i),t.state.newSegment&&(a.startPoint=r,a.endPoint=s,t.updateArrow(a)),t.setState({widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},Object(c.a)({},e,a)),newSegment:!1})},t.setIntermidiatePoints=function(t){var e,n,i,a=t.points,o=a[0],r=a[a.length-1],c="right"===o.type||"left"===o.type,l="right"===r.type||"left"===r.type,g=c?(r.x-o.x)/2:(r.y-o.y)/2;if((c&&o.y===r.y||!c&&o.x===r.x)&&a.length<5)return t.points=[o,r],t.arrowType="initial",void(t.chartBranch=null);if(c!==l&&a.length<5){if(c?"bottom"===r.type&&r.y>o.y||"top"===r.type&&r.y<o.y:"right"===r.type&&r.x>o.x||"left"===r.type&&r.x<o.x)return e=c?{x:o.x+g,y:o.y}:{x:o.x,y:o.y+g},"bottom"===r.type||"right"===r.type?(n=c?{x:o.x+g,y:r.y+20}:{x:r.x+20,y:o.y+g},i=c?{x:r.x,y:r.y+20}:{x:r.x+20,y:r.y}):(n=c?{x:o.x+g,y:r.y-20}:{x:r.x-20,y:o.y+g},i=c?{x:r.x,y:r.y-20}:{x:r.x-20,y:r.y}),void(t.points=[o,e,n,i,r]);var h=c?{x:r.x,y:o.y}:{x:o.x,y:r.y};t.points=[o,h,r]}else if(a.length>=5){e=c?{x:a[1].x,y:o.y}:{x:o.x,y:a[1].y},i=l?{x:a[a.length-2].x,y:r.y}:{x:r.x,y:a[a.length-2].y};var d=a.slice(2,a.length-2);t.points=[o,e].concat(Object(s.a)(d),[i,r])}else{var p=c?o.x+g:o.y+g;if(t.chartBranch){var u="manyToOne"===t.chartBranch.type?r:o;t.chartBranch.convergenceSide===u.type&&(p=t.chartBranch.position)}e=c?{x:p,y:o.y}:{x:o.x,y:p},n=c?{x:p,y:r.y}:{x:r.x,y:p},t.points=[o,e,n,r]}},t.handleCheckStick=function(e){var n=Object(l.a)(Object(l.a)({},t.state.settings),{},{stickToConvergentWidgetSide:e});t.setState({settings:n})},t.handleCheckLabels=function(e){var n=Object(l.a)(Object(l.a)({},t.state.settings),{},{showLabels:e});t.setState({settings:n})},t}return Object(h.a)(n,[{key:"cancelArrowCreation",value:function(){this.setState((function(t){if(t.dragging&&t.dragging.length){var e=Object(l.a)({},t.widgets[t.dragging[0]]);if("arrow"===e.type){var n=t.widgets;return delete n[e.id],Object(l.a)(Object(l.a)({},t),{},{dragging:null,initialId:null,endId:null,cursor:"auto",widgets:Object(l.a)({},n)})}}return Object(l.a)(Object(l.a)({},t),{},{dragging:null,initialId:null,endId:null,cursor:"auto"})}))}},{key:"setArrowChartBranch",value:function(t,e,n,i){if(!this.state.settings.stickToConvergentWidgetSide&&t.chartBranch&&(("manyToOne"===t.chartBranch.type?t.points[t.points.length-1]:t.points[0]).type===t.chartBranch.convergenceSide&&(!i||t.chartBranch.position===i)))return void console.log("not recalculating chart branch");var a=this.getSharedChartBranchArrow(t,e);if(n&&!a||2===t.points.length)return t.arrowType="initial",t.chartBranch=null,void console.log("setting chart branch null");if(t.arrowType="chartBranch",a&&a.chartBranch&&!i)console.log("become part of an existing chartBranch"),"oneToOne"===a.chartBranch.type&&(a.start===t.start?(a.chartBranch.type="oneToMany",a.chartBranch.convergenceSide=t.points[0].type):(a.chartBranch.type="manyToOne",a.chartBranch.convergenceSide=t.points[t.points.length-1].type)),t.chartBranch=Object.assign({},a.chartBranch);else if(!t.startPoint&&!t.endPoint||i){console.log("new lonely charBranch arrow");var o={position:i||0,convergenceSide:t.points[0].type,type:"oneToOne"};i||(console.log("convergenceSide: ",o.convergenceSide),"horizontal"===x(o.convergenceSide||"right")?o.position=t.points[0].x+(t.points[t.points.length-1].x-t.points[0].x)/2:o.position=t.points[0].y+(t.points[t.points.length-1].y-t.points[0].y)/2),t.chartBranch=o}}},{key:"getSharedChartBranchArrow",value:function(t,e){var n=Object.values(e).filter((function(e){return"arrow"===e.type&&e.id!==t.id&&"chartBranch"===e.arrowType&&e.chartBranch&&(e.start===t.start&&e.points[0].type===t.points[0].type||e.end===t.end&&e.points[e.points.length-1].type===t.points[t.points.length-1].type)})).map((function(t){return t}));return n.length>0?n[0]:null}},{key:"updateArrow",value:function(t,e){var n=this.state.widgets,i=n[t.start||""],a=n[t.end||""],o=!!e,r=i||a;if(r){var c=Object(s.a)(t.points);if(!this.state.settings.stickToConvergentWidgetSide||"chartBranch"!==t.arrowType){var g=e?e.x:a.x,h=e?e.y:a.y,d=e?0:a.width,p=e?0:a.height;if(c.length<5&&(t.initialIsHorizontal?r.x+r.width+10<g?(c[0].type=i?"right":"left",c[c.length-1].type=i?"left":"right"):g+d+10<r.x?(c[0].type=i?"left":"right",c[c.length-1].type=i?"right":"left"):h>r.y+r.height?(c[0].type=i?"bottom":"top",c[c.length-1].type=i?"top":"bottom"):(c[0].type=i?"top":"bottom",c[c.length-1].type=i?"bottom":"top"):r.y+r.height+10<h?(c[0].type=i?"bottom":"top",c[c.length-1].type=i?"top":"bottom"):h+p+10<r.y?(c[0].type=i?"top":"bottom",c[c.length-1].type=i?"bottom":"top"):g>r.x+r.width?(c[0].type=i?"right":"left",c[c.length-1].type=i?"left":"right"):(c[0].type=i?"left":"right",c[c.length-1].type=i?"right":"left"),t.startPoint&&(t.startPoint===c[0].type?t.startPoint=null:c[0].type=t.startPoint),t.endPoint&&(t.endPoint===c[c.length-1].type?t.endPoint=null:c[c.length-1].type=t.endPoint)),c[0]=i?this.getWidgetSideMidPosition(c[0],i):Object(l.a)(Object(l.a)({},c[0]),{},{x:e.x,y:e.y}),c[c.length-1]=a?this.getWidgetSideMidPosition(c[c.length-1],a):Object(l.a)(Object(l.a)({},c[c.length-1]),{},{x:e.x,y:e.y}),t.points=c,this.isChartSideArrow(t,n)&&c.length<5&&(console.log("IS CHART SIDE ARROW"),o?this.updateArrowChartSide(t,r,a,e,!!a):this.updateArrowChartSide(t,i,a)),o&&t.points.length<5){var u=t.points;"left"===u[0].type||"right"===u[0].type?u[u.length-1].y<=u[0].y+10&&u[u.length-1].y>=u[0].y-10&&(u[u.length-1].y=u[0].y):"top"!==u[0].type&&"bottom"!==u[0].type||u[u.length-1].x<=u[0].x+10&&u[u.length-1].x>=u[0].x-10&&(u[u.length-1].x=u[0].x)}this.setArrowChartBranch(t,n,!0)}if(t.chartBranch&&i&&a&&c.length<5){var y="manyToOne"===t.chartBranch.type,b=y?t.points[t.points.length-1]:t.points[0],f=y?t.points[0]:t.points[t.points.length-1],v=y?a:i,w=y?i:a;b=this.getWidgetSideMidPosition(b,v),f=this.getWidgetSideMidPosition(f,w),"horizontal"===x(t.chartBranch.convergenceSide||"right")?t.chartBranch.position>=w.x&&t.chartBranch.position<=w.x+w.width?(f.x=t.chartBranch.position,f.y=w.y+w.height/2>b.y?w.y:w.y+w.height):(f.type=t.chartBranch.position<w.x?"left":"right",f=this.getWidgetSideMidPosition(f,w)):t.chartBranch.position>=w.y&&t.chartBranch.position<=w.y+w.height?(f.x=w.x+w.width/2>b.x?w.x:w.x+w.width,f.y=t.chartBranch.position):(f.type=t.chartBranch.position<w.y?"top":"bottom",f=this.getWidgetSideMidPosition(f,w)),t.points[0]=y?f:b,t.points[t.points.length-1]=y?b:f}this.setIntermidiatePoints(t)}}},{key:"isChartSideArrow",value:function(t,e){return!this.getSharedChartBranchArrow(t,e)&&(!t.startPoint&&!t.endPoint&&(console.log("initialIsHorizontal: ",t.initialIsHorizontal),t.initialIsHorizontal&&("top"===t.points[0].type||"bottom"===t.points[0].type)||!t.initialIsHorizontal&&("left"===t.points[0].type||"right"===t.points[0].type)))}},{key:"updateArrowChartSide",value:function(t,e,n,i,a){if(!(t.points.length>=5)){var o=i?i.x:n.x,r=i?i.y:n.y,s=i?0:n.width,c=i?0:n.height;if(t.initialIsHorizontal){console.log("CASE 1");var g=this.getIntersectionMiddle(e.x,e.width,o,s);if(g)return t.points=[Object(l.a)(Object(l.a)({},t.points[0]),{},{x:g}),Object(l.a)(Object(l.a)({},t.points[t.points.length-1]),{},{x:g})],!0}else{console.log("CASE 2");var h=this.getIntersectionMiddle(e.y,e.height,r,c);if(h)return t.points=[Object(l.a)(Object(l.a)({},t.points[0]),{},{y:h}),Object(l.a)(Object(l.a)({},t.points[t.points.length-1]),{},{y:h})],!0}a&&i?(t.initialIsHorizontal?t.points[t.points.length-1].type=o>e.x+e.width/2?"right":"left":t.points[t.points.length-1].type=r>e.y+e.height/2?"bottom":"top",t.points[t.points.length-1]=this.getWidgetSideMidPosition(t.points[t.points.length-1],e)):(t.initialIsHorizontal?t.points[0].type=o>e.x+e.width/2?"right":"left":t.points[0].type=r>e.y+e.height/2?"bottom":"top",t.points[0]=this.getWidgetSideMidPosition(t.points[0],e));var d=e.x+e.width/2,p=e.y+e.height/2,u=o+s/2,y=r+c/2,b=Math.abs(d-u)-(e.width/2+s/2),f=Math.abs(p-y)-(e.height/2+c/2);if(t.initialIsHorizontal?b<=10:f<=10)if(a)if(t.initialIsHorizontal){t.points[0].type=r>t.points[t.points.length-1].y?"top":"bottom";var v=e.width/2+Math.max(b+10,20);t.points[0].x=d+("right"===t.points[t.points.length-1].type?v:-v),t.points[0].y="top"===t.points[0].type?r:r+c}else{t.points[0].type=o>t.points[t.points.length-1].x?"left":"right";var w=e.height/2+Math.max(f+10,20);t.points[0].x="left"===t.points[t.points.length-1].type?o:o+s,t.points[0].y=p+("bottom"===t.points[t.points.length-1].type?w:-w)}else if(t.initialIsHorizontal){t.points[t.points.length-1].type=r>t.points[0].y?"top":"bottom";var x=e.width/2+Math.max(b+10,20);t.points[t.points.length-1].x=d+("right"===t.points[0].type?x:-x),t.points[t.points.length-1].y="top"===t.points[t.points.length-1].type?r:r+c}else{t.points[t.points.length-1].type=o>t.points[0].x?"left":"right";var O=e.height/2+Math.max(f+10,20);t.points[t.points.length-1].x="left"===t.points[t.points.length-1].type?o:o+s,t.points[t.points.length-1].y=p+("bottom"===t.points[0].type?O:-O)}else a?(t.initialIsHorizontal?t.points[0].type="right"===t.points[t.points.length-1].type?"left":"right":t.points[0].type="bottom"===t.points[t.points.length-1].type?"top":"bottom",t.points[0]=i?Object(l.a)(Object(l.a)({},t.points[0]),{},{x:i.x,y:i.y}):this.getWidgetSideMidPosition(t.points[0],n)):(t.initialIsHorizontal?t.points[t.points.length-1].type="right"===t.points[0].type?"left":"right":t.points[t.points.length-1].type="bottom"===t.points[0].type?"top":"bottom",t.points[t.points.length-1]=i?Object(l.a)(Object(l.a)({},t.points[t.points.length-1]),{},{x:i.x,y:i.y}):this.getWidgetSideMidPosition(t.points[t.points.length-1],n));return!1}}},{key:"getIntersectionMiddle",value:function(t,e,n,i){var a=t+e,o=n+i;if(0===i)return n>=t&&n<=a?n:null;if(t===n&&a===o||t>n&&t<o){var r=o-t;return r<=20?null:t+r/2}if(a>n&&a<o){var s=a-n;return s<=20?null:a-s/2}return null}},{key:"between",value:function(t,e,n){return t>e&&t<n}},{key:"getWidgetSideMidPosition",value:function(t,e){var n={type:t.type,x:0,y:0};switch(t.type){case"top":n.x=e.x+e.width/2,n.y=e.y;break;case"right":n.x=e.x+e.width,n.y=e.y+e.height/2;break;case"bottom":n.x=e.x+e.width/2,n.y=e.y+e.height;break;case"left":n.x=e.x,n.y=e.y+e.height/2}return n}},{key:"render",value:function(){var t=this,e=this.state,n=e.cursor,i=e.selected,o=e.widgets;return a.a.createElement("div",null,a.a.createElement("div",{id:"canvas",style:{cursor:n},className:"App ".concat("crosshair"===n?"connector-mode":""),tabIndex:1,onDoubleClick:this.handleDoubleClick,onKeyDown:this.handleKeyDown,onMouseMove:this.handleDrag,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,ref:this.handleRef},Object.values(o).map((function(e){return"sticky"===e.type?a.a.createElement(u,{cursor:n,onMouseDown:t.handleStickyMouseDown,onMouseUp:t.handleStickyMouseUp,onDragStart:t.handleWidgetDragStart,onMouseHover:t.handleMouseHoverSticky,onMouseLeave:t.handleMouseLeaveSticky,selected:!!(null===i||void 0===i?void 0:i.includes(e.id)),widget:e,key:e.id}):"arrow"===e.type?a.a.createElement(y,{widget:e,key:e.id,onDragPointStart:t.handleArrowPointDragStart,onDragSegmentEnd:t.handleDragSegmentEnd,onDragSegment:t.handleDragSegment,onDragSegmentStart:t.handleDragSementStart,showLabels:t.state.settings.showLabels}):null}))),a.a.createElement("div",{id:"settings",style:j},a.a.createElement(b,{label:"Stick To Convergent Widget Side",onCheckedChange:this.handleCheckStick}),a.a.createElement("hr",null),a.a.createElement(b,{label:"Show labels",onCheckedChange:this.handleCheckLabels})))}}]),n}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(m,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.6a91eec6.chunk.js.map