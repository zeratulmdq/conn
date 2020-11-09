(this.webpackJsonpdiagraming=this.webpackJsonpdiagraming||[]).push([[0],[,,,,,,,,function(t,e,n){},,,function(t,e,n){t.exports=n(19)},,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);var a=n(1),i=n.n(a),o=n(9),r=n.n(o),c=(n(16),n(10)),s=n(2),l=n(0),d=n(3),h=n(4),g=n(6),u=n(5),p=(n(17),n(8),function(t){Object(g.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return(t=e.call.apply(e,[this].concat(i))).dragging=!1,t.initialX=0,t.initialY=0,t.handleDragStart=function(e){var n=t.props,a=n.onDragStart,i=n.widget,o=n.cursor,r=n.onMouseDown;"crosshair"===o?r(i.id,e):a(i.id,e)},t.handleMouseUp=function(e){var n=t.props,a=n.onMouseUp,i=n.cursor,o=n.widget;"crosshair"===i&&a(o.id,e)},t.handleMouseHover=function(e){var n=t.props;(0,n.onMouseHover)(n.widget.id,e)},t.handleMouseLeave=function(e){var n=t.props;(0,n.onMouseLeave)(n.widget.id,e)},t}return Object(h.a)(n,[{key:"render",value:function(){var t=this.props,e=t.cursor,n=t.selected,a=t.widget,o=a.x,r=a.y,c=a.width,s=a.height;return i.a.createElement("div",{onMouseUp:this.handleMouseUp,onMouseDown:this.handleDragStart,onMouseMove:this.handleMouseHover,onMouseLeave:this.handleMouseLeave,style:{top:r,left:o,width:c,height:s,cursor:"crosshair"===e?"crosshair":"pointer",border:n?"2px solid blue":"none"},className:"Sticky"},i.a.createElement("div",{className:"snapping-point top",style:{top:-15,left:c/2-15,width:30,height:30},id:"top"}),i.a.createElement("div",{className:"snapping-point right",style:{top:s/2-15,left:c-15,width:30,height:30},id:"right"}),i.a.createElement("div",{className:"snapping-point bottom",style:{top:s-15,left:c/2-15,width:30,height:30},id:"bottom"}),i.a.createElement("div",{className:"snapping-point left",style:{top:s/2-15,left:-15,width:30,height:30},id:"left"}),i.a.createElement("svg",{className:"auto-affordance"},i.a.createElement("circle",{cx:"".concat(c/2),cy:"".concat(s/2),r:"5",stroke:"#1c7ff9",fill:"none"})))}}]),n}(i.a.Component)),y=(n(18),function(t){Object(g.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,o=new Array(a),r=0;r<a;r++)o[r]=arguments[r];return(t=e.call.apply(e,[this].concat(o))).state={draggingMiddleSegment:!1},t.getPoints=function(){var e=t.props.widget.points;return{start:e[0],end:e[1]}},t.handleSegmentDragStart=function(){t.state.draggingMiddleSegment||t.setState({draggingMiddleSegment:!0})},t.handleSegmentDragEnd=function(){if(t.state.draggingMiddleSegment){var e=t.state.position;t.props.onDragSegmentEnd(t.props.widget.id,e),t.setState({draggingMiddleSegment:!1,position:void 0})}},t.connectionDot=function(e,n,a,o){return i.a.createElement("circle",{key:a,cx:"".concat(e),cy:"".concat(n),r:"5",stroke:o?"black":"#1c7ff9",fill:o?"white":"#1c7ff9",onMouseDown:function(e){var n=t.props;(0,n.onDragPointStart)(n.widget.id,e,!!o)}})},t.handleMouseMove=function(e){var n=e.clientX,a=e.clientY;if(t.state.draggingMiddleSegment){var i=t.getPoints(),o=i.start,r=i.end;if("right"===o.type||"left"===o.type){var c=Math.min(o.x,r.x),s=Math.max(o.x,r.x);return o.type===r.type&&(s<n-10||n+10<c)?void t.setState({position:n}):void(c<n-10&&s>n+10&&t.state.position!==n&&t.setState({position:n}))}var l=Math.min(o.y,r.y),d=Math.max(o.y,r.y);if(o.type===r.type&&(d<a-10||a+10<d))t.setState({position:a});else l<a-10&&d>a+10&&t.state.position!==a&&t.setState({position:a})}},t.pathGenerator=function(e,n,a){var o=e[0],r=e[1],c="right"===o.type||"left"===o.type,s="right"===r.type||"left"===r.type,l=c?(r.x-o.x)/2:(r.y-o.y)/2;if(c&&o.y===r.y||!c&&o.x===r.x){var d="M ".concat(o.x," ").concat(o.y," L ").concat(r.x," ").concat(r.y);return[t.connectionDot(o.x,o.y,"0",!0),i.a.createElement("path",{d:d,stroke:"black",strokeWidth:"2",fill:"none",key:"1"}),t.connectionDot(r.x,r.y,"2")]}if(c!==s){if(c?"bottom"===r.type&&r.y>o.y||"top"===r.type&&r.y<o.y:"right"===r.type&&r.x>o.x||"left"===r.type&&r.x<o.x){var h,g,u="".concat(o.x," ").concat(o.y),p=c?"".concat(o.x+l," ").concat(o.y):" ".concat(o.x," ").concat(o.y+l),y="".concat(r.x," ").concat(r.y);"bottom"===r.type||"right"===r.type?(h=c?"".concat(o.x+l," ").concat(r.y+20):" ".concat(r.x+20," ").concat(o.y+l),g=c?"".concat(r.x," ").concat(r.y+20):" ".concat(r.x+20," ").concat(r.y)):(h=c?"".concat(o.x+l," ").concat(r.y-20):" ".concat(r.x-20," ").concat(o.y+l),g=c?"".concat(r.x," ").concat(r.y-20):" ".concat(r.x-20," ").concat(r.y));var f="M ".concat(u," L ").concat(p),v="M ".concat(p," L ").concat(h),b="M ".concat(h," L ").concat(g),w="M ".concat(g," L ").concat(y);return[t.connectionDot(o.x,o.y,"0",!0),i.a.createElement("path",{d:f,stroke:"black",strokeWidth:"2",fill:"none",key:"1"}),i.a.createElement("path",{key:"2",d:v,stroke:"black",strokeWidth:"2",fill:"none"}),i.a.createElement("path",{d:b,stroke:"black",strokeWidth:"2",fill:"none",key:"3"}),i.a.createElement("path",{d:w,stroke:"black",strokeWidth:"2",fill:"none",key:"4"}),t.connectionDot(r.x,r.y,"5")]}var x="".concat(o.x," ").concat(o.y),m=c?"".concat(r.x," ").concat(o.y):"".concat(o.x," ").concat(r.y),O="".concat(r.x," ").concat(r.y),k="M ".concat(x," L ").concat(m),j="M ".concat(m," L ").concat(O);return[t.connectionDot(o.x,o.y,"0",!0),i.a.createElement("path",{d:k,stroke:"black",strokeWidth:"2",fill:"none",key:"1"}),i.a.createElement("path",{d:j,stroke:"black",strokeWidth:"2",fill:"none",key:"2"}),t.connectionDot(r.x,r.y,"3")]}var S=c?"ew-resize":"ns-resize";if((c?"right"===r.type&&r.x>o.x||"left"===r.type&&r.x<o.x:"bottom"===r.type&&r.y>o.y||"top"===r.type&&r.y<o.y)&&!n){var M,B,D="".concat(o.x," ").concat(o.y),P="".concat(r.x," ").concat(r.y);"bottom"===r.type||"right"===r.type?(M=c?"".concat(r.x+20," ").concat(o.y):" ".concat(o.x," ").concat(r.y+20),B=c?"".concat(r.x+20," ").concat(r.y):" ".concat(r.x," ").concat(r.y+20)):(M=c?"".concat(r.x-20," ").concat(o.y):" ".concat(o.x," ").concat(r.y-20),B=c?"".concat(r.x-20," ").concat(r.y):" ".concat(r.x," ").concat(r.y-20));var E="M ".concat(D," L ").concat(M),C="M ".concat(M," L ").concat(B),I="M ".concat(B," L ").concat(P);return[t.connectionDot(o.x,o.y,"0",!0),i.a.createElement("path",{d:E,stroke:"black",strokeWidth:"2",fill:"none",key:"1"}),i.a.createElement("path",{key:"2",d:C,stroke:"black",strokeWidth:"2",fill:"none",style:{cursor:S,pointerEvents:"auto"},onMouseDown:t.handleSegmentDragStart}),i.a.createElement("path",{d:I,stroke:"black",strokeWidth:"2",fill:"none",key:"3"}),t.connectionDot(r.x,r.y,"4")]}var A=a||(c?o.x+l:o.y+l);if(n){var W="manyToOne"===n.type?r:o;n.convergenceSide===W.type&&(A=a||n.position)}var H="".concat(o.x," ").concat(o.y),z=c?"".concat(A," ").concat(o.y):" ".concat(o.x," ").concat(A),T=c?"".concat(A," ").concat(r.y):" ".concat(r.x," ").concat(A),L="".concat(r.x," ").concat(r.y),U="M ".concat(H," L ").concat(z),Y="M ".concat(z," L ").concat(T),K="M ".concat(T," L ").concat(L);return[t.connectionDot(o.x,o.y,"0",!0),i.a.createElement("path",{d:U,stroke:"black",strokeWidth:"2",fill:"none",key:"1"}),i.a.createElement("path",{key:"2",d:Y,stroke:"black",strokeWidth:"2",fill:"none",style:{cursor:S,pointerEvents:"auto"},onMouseDown:t.handleSegmentDragStart}),i.a.createElement("path",{d:K,stroke:"black",strokeWidth:"2",fill:"none",key:"3"}),t.connectionDot(r.x,r.y,"4")]},t}return Object(h.a)(n,[{key:"render",value:function(){var t=this.pathGenerator(this.props.widget.points,this.props.widget.chartBranch,this.state.position);return i.a.createElement("svg",{style:{position:"absolute",top:0,left:0,pointerEvents:this.state.draggingMiddleSegment?"auto":"none"},xmlns:"http://www.w3.org/2000/svg",version:"1.1",className:"Arrow",onMouseUp:this.handleSegmentDragEnd,onMouseMove:this.handleMouseMove},t)}}]),n}(i.a.PureComponent)),f=function(t){Object(g.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return(t=e.call.apply(e,[this].concat(i))).state={checked:!1},t.handleOnChange=function(e){t.setState((function(e){var n=!e.checked;return t.props.onCheckedChange(n),{checked:n}}))},t}return Object(h.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{style:{height:"auto"}},i.a.createElement("label",null,i.a.createElement("input",{type:"checkbox",style:{width:15,height:15},onChange:this.handleOnChange,defaultChecked:this.state.checked}),this.props.label))}}]),n}(i.a.PureComponent),v=n(21),b=function(t){var e,n;return{id:v.a(),height:null!==(e=t.height)&&void 0!==e?e:100,width:null!==(n=t.width)&&void 0!==n?n:100,type:"sticky",x:t.x||0,y:t.y||0}},w=function(t){return{id:v.a(),height:0,width:0,type:"arrow",x:(t.x||0)-25,y:(t.y||0)-25,start:t.start||null,end:t.end||null,points:[],arrowType:t.arrowType||"initial",chartBranch:null,initialIsHorizontal:t.initialIsHorizontal||!0}},x=function(t){return"left"===t||"right"===t?"horizontal":"vertical"},m=function(t){return"left"===t.points[0].type||"right"===t.points[0].type},O={position:"absolute",top:0,width:"auto",height:"auto",borderStyle:"solid",backgroundColor:"lightgray",padding:10},k=function(t){Object(g.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(d.a)(this,n);for(var a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return(t=e.call.apply(e,[this].concat(i))).ref=null,t.state={settings:{stickToConvergentWidgetSide:!1},cursor:"auto",dragging:null,initialId:null,endId:null,selected:null,widgets:{}},t.mousePosition=null,t.mouseOverSticky=!1,t.handleArrowPointDragStart=function(e,n,a){if(a){var i=t.state.widgets[e].end;t.setState((function(t){return Object(l.a)(Object(l.a)({},t),{},{cursor:"crosshair",dragging:[e],endId:i,initialId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(s.a)({},e,Object(l.a)(Object(l.a)({},t.widgets[e]),{},{start:null,startPoint:null,initialIsHorizontal:m(t.widgets[e])})))})}))}else{var o=t.state.widgets[e].start;t.setState((function(t){return Object(l.a)(Object(l.a)({},t),{},{cursor:"crosshair",dragging:[e],initialId:o,endId:null,widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(s.a)({},e,Object(l.a)(Object(l.a)({},t.widgets[e]),{},{end:null,endPoint:null,initialIsHorizontal:m(t.widgets[e])})))})}))}},t.handleStickyMouseDown=function(e,n){if("crosshair"===t.state.cursor)if(t.state.dragging);else{var a={x:n.clientX,y:n.clientY};t.setState((function(n){var i=Object(l.a)({},w({start:e,end:null}));return t.updateArrow(i,a),Object(l.a)(Object(l.a)({},n),{},{initialId:e,endId:null,widgets:Object(l.a)(Object(l.a)({},n.widgets),{},Object(s.a)({},i.id,i)),dragging:[i.id]})}))}},t.handleStickyMouseUp=function(e,n){n.stopPropagation(),t.state.initialId!==e&&t.state.endId!==e?"crosshair"===t.state.cursor&&t.setState((function(n){var a,i;if(!n.dragging)return Object(l.a)({},n);var o=Object(l.a)({},n.widgets[n.dragging[0]]),r=n.widgets[null!==(a=o.start)&&void 0!==a?a:e],c=n.widgets[null!==(i=o.end)&&void 0!==i?i:e];return o.start=r.id,o.end=c.id,o.initialIsHorizontal=m(o),t.setArrowChartBranch(o,t.state.widgets,!1),Object(l.a)(Object(l.a)({},n),{},{cursor:"auto",dragging:null,initialId:null,endId:null,widgets:Object(l.a)(Object(l.a)({},n.widgets),{},Object(s.a)({},o.id,o))})})):t.cancelArrowCreation()},t.handleDoubleClick=function(e){var n=e.ctrlKey||e.metaKey?150:100,a=b({x:e.clientX-n/2,y:e.clientY-50,width:n});t.setState((function(t){return{selected:[a.id],widgets:Object(l.a)(Object(l.a)({},t.widgets),{},Object(s.a)({},a.id,a))}}))},t.handleDrag=function(e){var n=t.mousePosition?e.clientX-t.mousePosition.x:e.clientX,a=t.mousePosition?e.clientY-t.mousePosition.y:e.clientY;t.mousePosition={x:e.clientX,y:e.clientY};var i=t.state,o=i.dragging,r=i.widgets;if(o){var c=o.map((function(t){return r[t]}));if(c.length>1||"sticky"===c[0].type){var d=Object.values(r).filter((function(t){return"arrow"===t.type})),h=Object.values(r).filter((function(t){return"arrow"===t.type&&o&&(t.start&&o.includes(t.start)||t.end&&o.includes(t.end))})).reduce((function(e,i){var r=i;return t.updateArrow(r),o&&r.start&&o.includes(r.start)&&r.end&&o.includes(r.end)&&r.chartBranch&&("oneToOne"===r.chartBranch.type?r.chartBranch.position=r.chartBranch.position+(m(r)?n:a):d.forEach((function(t){var e,i;if(t.chartBranch&&(null===(e=t.chartBranch)||void 0===e?void 0:e.position)===(null===(i=r.chartBranch)||void 0===i?void 0:i.position)){if(t.end&&!o.includes(t.end)||t.start&&!o.includes(t.start))return;r.chartBranch.position=r.chartBranch.position+(m(r)?n:a)}}))),Object(l.a)(Object(l.a)({},e),{},Object(s.a)({},r.id,Object(l.a)({},r)))}),{}),g=c.reduce((function(t,e){return Object(l.a)(Object(l.a)({},t),{},Object(s.a)({},e.id,Object(l.a)(Object(l.a)({},e),{},{x:e.x+n,y:e.y+a})))}),{});t.setState({widgets:Object(l.a)(Object(l.a)(Object(l.a)({},r),g),h)})}else if("arrow"===c[0].type&&!t.mouseOverSticky){var u=Object(l.a)({},c[0]);u.end&&u.start||t.updateArrow(u,t.mousePosition),t.setState({widgets:Object(l.a)(Object(l.a)({},r),{},Object(s.a)({},u.id,u))})}}},t.handleMouseHoverSticky=function(e,n){t.mouseOverSticky=!0;var a=n.target.id||null,i=t.state,o=i.dragging,r=i.widgets;if(o){var c=o.map((function(t){return r[t]}));if(1===c.length&&"arrow"===c[0].type){var d=Object(l.a)({},c[0]),h=!!t.state.endId,g=h?d.startPoint!==a&&d.start===e:d.endPoint!==a&&d.end===e;if(d.start!==e&&d.end!==e||g){var u,p;d.start=null!==(u=d.start)&&void 0!==u?u:e,d.end=null!==(p=d.end)&&void 0!==p?p:e,h?(d.startPoint="auto"!==a?a:null,d.arrowType="initial",d.chartBranch=null):(d.endPoint="auto"!==a?a:null,d.arrowType="initial",d.chartBranch=null),t.updateArrow(d);var y=Object(l.a)(Object(l.a)({},r),{},Object(s.a)({},d.id,d));t.setState({widgets:y})}}}},t.handleMouseLeaveSticky=function(e,n){t.mouseOverSticky=!1;var a=t.state,i=a.dragging,o=a.widgets;if(i){var r=i.map((function(t){return o[t]}));if(1===r.length&&"arrow"===r[0].type&&r[0].start&&r[0].end&&(r[0].start===e||r[0].end===e)){var c=Object(l.a)({},r[0]);c.startPoint=c.start===e?null:c.startPoint,c.endPoint=c.end===e?null:c.endPoint,c.start=c.start===e?null:c.start,c.end=c.end===e?null:c.end,t.setState({widgets:Object(l.a)(Object(l.a)({},o),{},Object(s.a)({},c.id,c))})}if(1===r.length&&"arrow"===r[0].type&&(r[0].start===e&&!r[0].end||r[0].end===e&&!r[0].start)){var d=Object(l.a)({},r[0]),h=t.state.widgets[e],g=n.clientY>h.y&&n.clientY<h.y+h.height;t.setState({widgets:Object(l.a)(Object(l.a)({},o),{},Object(s.a)({},d.id,Object(l.a)(Object(l.a)({},d),{},{initialIsHorizontal:g})))})}}},t.handleWidgetDragStart=function(e,n){var a=n.shiftKey;if(n.stopPropagation(),0===n.button&&!t.state.dragging){var i=t.state.selected&&(t.state.selected.includes(e)||a)?t.state.selected.includes(e)?t.state.selected:[].concat(Object(c.a)(t.state.selected),[e]):[e],o=t.state.selected&&t.state.selected.includes(e)?t.state.selected:[e];t.setState({dragging:o,selected:i})}},t.handleKeyDown=function(e){if("c"===e.key||"C"===e.key){var n="auto"===t.state.cursor?"crosshair":"auto";"auto"===n?t.cancelArrowCreation():t.setState({cursor:n})}"Backspace"!==e.key&&"Delete"!==e.key||!t.state.selected||t.setState((function(t){var e=t.selected||null,n=t.widgets;return null===e||void 0===e||e.forEach((function(t){Object.values(n).forEach((function(e){"arrow"!==e.type||e.start!==t&&e.end!==t||delete n[e.id]})),delete n[t]})),Object(l.a)(Object(l.a)({},t),{},{selected:null,widgets:Object(l.a)({},n)})}))},t.handleMouseDown=function(){t.setState({selected:null})},t.isDraggingArrow=function(){var e=t.state.dragging&&t.state.dragging.map((function(e){return t.state.widgets[e]}));return e&&1===e.length&&"arrow"===e[0].type},t.getConnectedStickyPos=function(t,e){var n={x:0,y:0};switch(t.type){case"top":n.x=t.x-e/2,n.y=t.y;break;case"right":n.x=t.x-e,n.y=t.y-50;break;case"bottom":n.x=t.x-e/2,n.y=t.y-100;break;case"left":n.x=t.x,n.y=t.y-e/2}return n},t.handleMouseUp=function(e){if(t.isDraggingArrow()){if(t.state.initialId||t.state.endId){if(t.state.endId)return void t.cancelArrowCreation();var n=e.ctrlKey||e.metaKey?150:100,a=t.state.dragging&&t.state.dragging.map((function(e){return t.state.widgets[e]})),i=a&&Object(l.a)({},a[0]),o=i&&i.points[1];if(!o||!i)return;var r,c=t.getConnectedStickyPos(o,n),d=b(Object(l.a)(Object(l.a)({},c),{},{width:n}));if(i.end=d.id,i.initialIsHorizontal=m(i),t.setArrowChartBranch(i,t.state.widgets,!1),i)t.setState({selected:[d.id],dragging:null,initialId:null,endId:null,cursor:"auto",widgets:Object(l.a)(Object(l.a)({},t.state.widgets),{},(r={},Object(s.a)(r,d.id,d),Object(s.a)(r,i.id,Object(l.a)({},i)),r))})}}else t.setState((function(e){if(!e.dragging)return Object(l.a)({},e);var n=Object.values(e.widgets).filter((function(t){var n,a;return"arrow"===t.type&&(t.start&&(null===(n=e.dragging)||void 0===n?void 0:n.includes(t.start))||t.end&&(null===(a=e.dragging)||void 0===a?void 0:a.includes(t.end)))})).map((function(t){return t})).reduce((function(n,a){if(!e.settings.stickToConvergentWidgetSide||"chartBranch"!==a.arrowType){if(t.isChartSideArrow(a,e.widgets)){var i=e.widgets[a.start||""],o=e.widgets[a.end||""];t.updateArrowChartSide(a,i,o)&&(a.arrowType="chartSide")}t.setArrowChartBranch(a,e.widgets,!1)}return a.initialIsHorizontal=m(a),Object(l.a)(Object(l.a)({},n),{},Object(s.a)({},a.id,Object(l.a)({},a)))}),{});return{dragging:null,widgets:Object(l.a)(Object(l.a)({},e.widgets),n)}}))},t.handleRef=function(e){t.ref=e,t.ref&&t.ref.focus()},t.handleDragSegmentEnd=function(e,n){var a=t.state.widgets[e];t.setArrowChartBranch(a,t.state.widgets,!1,n)},t}return Object(h.a)(n,[{key:"cancelArrowCreation",value:function(){this.setState((function(t){if(t.dragging&&t.dragging.length){var e=Object(l.a)({},t.widgets[t.dragging[0]]);if("arrow"===e.type){var n=t.widgets;return delete n[e.id],Object(l.a)(Object(l.a)({},t),{},{dragging:null,initialId:null,endId:null,cursor:"auto",widgets:Object(l.a)({},n)})}}return Object(l.a)(Object(l.a)({},t),{},{dragging:null,initialId:null,endId:null,cursor:"auto"})}))}},{key:"setArrowChartBranch",value:function(t,e,n,a){if(!this.state.settings.stickToConvergentWidgetSide&&t.chartBranch&&(("manyToOne"===t.chartBranch.type?t.points[1]:t.points[0]).type===t.chartBranch.convergenceSide&&(!a||t.chartBranch.position===a)))return void console.log("not recalculating chart branch");var i=this.getSharedChartBranchArrow(t,e);if(n&&!i)return t.chartBranch=null,void console.log("setting chart branch null");if(t.arrowType="chartBranch",i&&i.chartBranch&&!a)console.log("become part of an existing chartBranch"),"oneToOne"===i.chartBranch.type&&(i.start===t.start?(i.chartBranch.type="oneToMany",i.chartBranch.convergenceSide=t.points[0].type):(i.chartBranch.type="manyToOne",i.chartBranch.convergenceSide=t.points[1].type)),t.chartBranch=Object.assign({},i.chartBranch);else if(!t.startPoint&&!t.endPoint||a){console.log("new lonely charBranch arrow");var o={position:a||0,convergenceSide:t.points[0].type,type:"oneToOne"};a||(console.log("convergenceSide: ",o.convergenceSide),"horizontal"===x(o.convergenceSide)?o.position=t.points[0].x+(t.points[1].x-t.points[0].x)/2:o.position=t.points[0].y+(t.points[1].y-t.points[0].y)/2),t.chartBranch=o}}},{key:"getSharedChartBranchArrow",value:function(t,e){var n=Object.values(e).filter((function(e){return"arrow"===e.type&&e.id!==t.id&&"chartBranch"===e.arrowType&&e.chartBranch&&(e.start===t.start&&e.points[0].type===t.points[0].type||e.end===t.end&&e.points[1].type===t.points[1].type)})).map((function(t){return t}));return n.length>0?n[0]:null}},{key:"updateArrow",value:function(t,e){var n=this.state.widgets,a=n[t.start||""],i=n[t.end||""],o=!!e,r=a||i;if(r){var c=[{type:"right",x:0,y:0},{type:"left",x:1,y:0}];if(2===t.points.length&&(c=t.points),!this.state.settings.stickToConvergentWidgetSide||"chartBranch"!==t.arrowType){var s=e?e.x:i.x,d=e?e.y:i.y,h=e?0:i.width;r.x+r.width+10<s?(c[0].type=t.startPoint||(a?"right":"left"),c[1].type=t.endPoint||(a?"left":"right")):s+h+10<r.x?(c[0].type=t.startPoint||(a?"left":"right"),c[1].type=t.endPoint||(a?"right":"left")):d>r.y+r.height+10?(c[0].type=t.startPoint||(a?"bottom":"top"),c[1].type=t.endPoint||(a?"top":"bottom")):(c[0].type=t.startPoint||(a?"top":"bottom"),c[1].type=t.endPoint||(a?"bottom":"top")),c[0]=a?this.getWidgetSideMidPosition(c[0],a):Object(l.a)(Object(l.a)({},c[0]),{},{x:e.x,y:e.y}),c[1]=i?this.getWidgetSideMidPosition(c[1],i):Object(l.a)(Object(l.a)({},c[1]),{},{x:e.x,y:e.y}),t.points=c,this.isChartSideArrow(t,n)&&(o?this.updateArrowChartSide(t,r,i,e,!!i):this.updateArrowChartSide(t,a,i)),this.setArrowChartBranch(t,n,!0)}if(t.chartBranch&&a&&i){var g="manyToOne"===t.chartBranch.type,u=g?t.points[1]:t.points[0],p=g?t.points[0]:t.points[1],y=g?i:a,f=g?a:i;u=this.getWidgetSideMidPosition(u,y),p=this.getWidgetSideMidPosition(p,f),"horizontal"===x(t.chartBranch.convergenceSide)?t.chartBranch.position>=f.x&&t.chartBranch.position<=f.x+f.width?(p.x=t.chartBranch.position,p.y=f.y+f.height/2>u.y?f.y:f.y+f.height):(p.type=t.chartBranch.position<f.x?"left":"right",p=this.getWidgetSideMidPosition(p,f)):t.chartBranch.position>=f.y&&t.chartBranch.position<=f.y+f.height?(p.x=f.x+f.width/2>u.x?f.x:f.x+f.width,p.y=t.chartBranch.position):(p.type=t.chartBranch.position<f.y?"top":"bottom",p=this.getWidgetSideMidPosition(p,f)),t.points[0]=g?p:u,t.points[1]=g?u:p}}}},{key:"isChartSideArrow",value:function(t,e){return!this.getSharedChartBranchArrow(t,e)&&(!t.startPoint&&!t.endPoint&&(t.initialIsHorizontal&&("top"===t.points[0].type||"bottom"===t.points[0].type)||!t.initialIsHorizontal&&("left"===t.points[0].type||"right"===t.points[0].type)))}},{key:"updateArrowChartSide",value:function(t,e,n,a,i){var o=a?a.x:n.x,r=a?a.y:n.y,c=a?0:n.width,s=a?0:n.height;if(t.initialIsHorizontal){var d=this.getIntersectionMiddle(e.x,e.width,o,c);if(d)return t.points[0].x=d,t.points[1].x=d,!0}else{var h=this.getIntersectionMiddle(e.y,e.height,r,s);if(h)return t.points[0].y=h,t.points[1].y=h,!0}i&&a?(t.initialIsHorizontal?t.points[1].type=o>e.x+e.width/2?"right":"left":t.points[1].type=r>e.y+e.height/2?"bottom":"top",t.points[1]=this.getWidgetSideMidPosition(t.points[1],e)):(t.initialIsHorizontal?t.points[0].type=o>e.x+e.width/2?"right":"left":t.points[0].type=r>e.y+e.height/2?"bottom":"top",t.points[0]=this.getWidgetSideMidPosition(t.points[0],e));var g=e.x+e.width/2,u=e.y+e.height/2,p=o+c/2,y=r+s/2,f=Math.abs(g-p)-(e.width/2+c/2),v=Math.abs(u-y)-(e.height/2+s/2);if(t.initialIsHorizontal?f<=10:v<=10)if(i)if(t.initialIsHorizontal){t.points[0].type=r>t.points[1].y?"top":"bottom";var b=e.width/2+Math.max(f+10,20);t.points[0].x=g+("right"===t.points[1].type?b:-b),t.points[0].y="top"===t.points[0].type?r:r+s}else{t.points[0].type=o>t.points[1].x?"left":"right";var w=e.height/2+Math.max(v+10,20);t.points[0].x="left"===t.points[1].type?o:o+c,t.points[0].y=u+("bottom"===t.points[1].type?w:-w)}else if(t.initialIsHorizontal){t.points[1].type=r>t.points[0].y?"top":"bottom";var x=e.width/2+Math.max(f+10,20);t.points[1].x=g+("right"===t.points[0].type?x:-x),t.points[1].y="top"===t.points[1].type?r:r+s}else{t.points[1].type=o>t.points[0].x?"left":"right";var m=e.height/2+Math.max(v+10,20);t.points[1].x="left"===t.points[1].type?o:o+c,t.points[1].y=u+("bottom"===t.points[0].type?m:-m)}else i?(t.initialIsHorizontal?t.points[0].type="right"===t.points[1].type?"left":"right":t.points[0].type="bottom"===t.points[1].type?"top":"bottom",t.points[0]=a?Object(l.a)(Object(l.a)({},t.points[0]),{},{x:a.x,y:a.y}):this.getWidgetSideMidPosition(t.points[0],n)):(t.initialIsHorizontal?t.points[1].type="right"===t.points[0].type?"left":"right":t.points[1].type="bottom"===t.points[0].type?"top":"bottom",t.points[1]=a?Object(l.a)(Object(l.a)({},t.points[1]),{},{x:a.x,y:a.y}):this.getWidgetSideMidPosition(t.points[1],n));return!1}},{key:"getIntersectionMiddle",value:function(t,e,n,a){var i=t+e,o=n+a;if(0===a)return n>=t&&n<=i?n:null;if(t===n&&i===o||t>n&&t<o){var r=o-t;return r<=20?null:t+r/2}if(i>n&&i<o){var c=i-n;return c<=20?null:i-c/2}return null}},{key:"between",value:function(t,e,n){return t>e&&t<n}},{key:"getWidgetSideMidPosition",value:function(t,e){var n={type:t.type,x:0,y:0};switch(t.type){case"top":n.x=e.x+e.width/2,n.y=e.y;break;case"right":n.x=e.x+e.width,n.y=e.y+e.height/2;break;case"bottom":n.x=e.x+e.width/2,n.y=e.y+e.height;break;case"left":n.x=e.x,n.y=e.y+e.height/2}return n}},{key:"render",value:function(){var t=this,e=this.state,n=e.cursor,a=e.selected,o=e.widgets;return i.a.createElement("div",null,i.a.createElement("div",{id:"canvas",style:{cursor:n},className:"App ".concat("crosshair"===n?"connector-mode":""),tabIndex:1,onDoubleClick:this.handleDoubleClick,onKeyDown:this.handleKeyDown,onMouseMove:this.handleDrag,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,ref:this.handleRef},Object.values(o).map((function(e){return"sticky"===e.type?i.a.createElement(p,{cursor:n,onMouseDown:t.handleStickyMouseDown,onMouseUp:t.handleStickyMouseUp,onDragStart:t.handleWidgetDragStart,onMouseHover:t.handleMouseHoverSticky,onMouseLeave:t.handleMouseLeaveSticky,selected:!!(null===a||void 0===a?void 0:a.includes(e.id)),widget:e,key:e.id}):"arrow"===e.type?i.a.createElement(y,{widget:e,key:e.id,onDragPointStart:t.handleArrowPointDragStart,onDragSegmentEnd:t.handleDragSegmentEnd}):null}))),i.a.createElement("div",{id:"settings",style:O},i.a.createElement(f,{label:"Stick To Convergent Widget Side",onCheckedChange:function(e){return t.setState({settings:{stickToConvergentWidgetSide:e}})}})))}}]),n}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(k,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}],[[11,1,2]]]);
//# sourceMappingURL=main.c1b4c615.chunk.js.map