(this.webpackJsonpdiagraming=this.webpackJsonpdiagraming||[]).push([[0],[,,,,,,,,function(t,e,n){},,function(t,e,n){t.exports=n(17)},,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);var i=n(0),a=n.n(i),r=n(9),o=n.n(r),c=(n(15),n(2)),s=n(1),l=n(3),h=n(4),d=n(6),u=n(5),p=(n(16),n(8),function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(l.a)(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).dragging=!1,t.initialX=0,t.initialY=0,t.handleContextMenu=function(e){var n=t.props;(0,n.onRightClick)(n.widget.id,e)},t.handleDragStart=function(e){var n=t.props;(0,n.onDragStart)(n.widget.id,e)},t}return Object(h.a)(n,[{key:"render",value:function(){var t=this.props,e=t.cursor,n=t.selected,i=t.widget,r=i.x,o=i.y,c=i.width,s=i.height;return a.a.createElement("div",{onContextMenu:this.handleContextMenu,onMouseDown:this.handleDragStart,style:{top:o,left:r,width:c,height:s,cursor:"crosshair"===e?"crosshair":"pointer",border:n?"2px solid blue":"none"},className:"Sticky"})}}]),n}(a.a.Component)),y=n(19),g=function(t){return{id:y.a(),height:100,width:100,type:"sticky",x:(t.x||0)-50,y:(t.y||0)-50}},f=function(t){return{id:y.a(),height:0,width:0,type:"arrow",x:(t.x||0)-25,y:(t.y||0)-25,start:t.start||null,end:t.end||null,points:[],arrowType:"initial",chartBranchSide:null,chartBranchPosition:null,initialIsHorizontal:!0}},w=function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(){return Object(l.a)(this,n),e.apply(this,arguments)}return Object(h.a)(n,[{key:"render",value:function(){return a.a.createElement("svg",{style:{position:"absolute",top:0,left:0,pointerEvents:"none"},xmlns:"http://www.w3.org/2000/svg",version:"1.1"},function(t,e,n){var i=t[0],r=t[1],o="right"===i.type||"left"===i.type,c="right"===r.type||"left"===r.type;if(o&&i.y===r.y||!o&&i.x===r.x){var s="M ".concat(i.x," ").concat(i.y," L ").concat(r.x," ").concat(r.y);return[a.a.createElement("path",{d:s,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("circle",{cx:"".concat(r.x),cy:"".concat(r.y),r:"5",stroke:"#5cb85c",fill:"#5cb85c"})]}if(o!==c){var l="".concat(i.x," ").concat(i.y),h=o?"".concat(r.x," ").concat(i.y):"".concat(i.x," ").concat(r.y),d="".concat(r.x," ").concat(r.y),u="M ".concat(l," L ").concat(h),p="M ".concat(h," L ").concat(d);return[a.a.createElement("path",{d:u,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("path",{d:p,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("circle",{cx:"".concat(r.x),cy:"".concat(r.y),r:"5",stroke:"#5cb85c",fill:"#5cb85c"})]}var y=o?(r.x-i.x)/2:(r.y-i.y)/2,g=o?i.x+y:i.y+y;e&&n&&e===i.type&&(g=n);var f="".concat(i.x," ").concat(i.y),w=o?"".concat(g," ").concat(i.y):" ".concat(i.x," ").concat(g),b=o?"".concat(g," ").concat(r.y):" ".concat(r.x," ").concat(g),x="".concat(r.x," ").concat(r.y),v="M ".concat(f," L ").concat(w),k="M ".concat(w," L ").concat(b),j="M ".concat(b," L ").concat(x);return[a.a.createElement("path",{d:v,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("path",{d:k,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("path",{d:j,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("circle",{cx:"".concat(r.x),cy:"".concat(r.y),r:"5",stroke:"#5cb85c",fill:"#5cb85c"})]}(this.props.widget.points,this.props.widget.chartBranchSide,this.props.widget.chartBranchPosition))}}]),n}(a.a.PureComponent),b=function(t){Object(d.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(l.a)(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).ref=null,t.state={cursor:"auto",dragging:null,initialId:null,initialX:null,initialY:null,lastX:null,lastY:null,selected:null,widgets:{}},t.handleRightClick=function(e){e.preventDefault(),e.stopPropagation(),t.state.initialId&&t.cancelArrowCreation()},t.handleStickyRightClick=function(e,n){n.preventDefault(),n.stopPropagation(),t.state.initialId?t.state.initialId!==e?t.setState((function(n){var i=n.widgets[n.initialId||""],a=n.widgets[e],r=Math.abs((i.x-a.x)/(i.y-a.y))>1,o=Object(s.a)(Object(s.a)({},f({start:n.initialId,end:e})),{},{initialIsHorizontal:r});return t.updateArrow(o,n.widgets),t.updateArrowChartBranch(o,n.widgets,!0),Object(s.a)(Object(s.a)({},n),{},{cursor:"auto",initialId:null,widgets:Object(s.a)(Object(s.a)({},n.widgets),{},Object(c.a)({},o.id,o))})})):t.cancelArrowCreation():t.setState({initialId:e,cursor:"crosshair"})},t.handleDoubleClick=function(e){var n=g({x:e.clientX,y:e.clientY});t.setState((function(t){return{selected:n.id,widgets:Object(s.a)(Object(s.a)({},t.widgets),{},Object(c.a)({},n.id,n))}}))},t.handleDrag=function(e){var n=e.clientX,i=e.clientY;t.setState((function(e){if(!e.dragging||!e.lastX||!e.lastY)return Object(s.a)({},e);var a=Object(s.a)({},e.widgets[e.dragging]);a.x=a.x+n-e.lastX,a.y=a.y+i-e.lastY;var r=Object.values(e.widgets).filter((function(t){return"arrow"===t.type&&(t.start===e.dragging||t.end===e.dragging)})).reduce((function(n,i){var a=i;return t.updateArrow(a,e.widgets),t.updateArrowChartBranch(a,e.widgets,!0),Object(s.a)(Object(s.a)({},n),{},Object(c.a)({},a.id,Object(s.a)({},a)))}),{});return{lastX:n,lastY:i,widgets:Object(s.a)(Object(s.a)({},e.widgets),{},Object(c.a)({},a.id,a),r)}}))},t.handleDragStart=function(e,n){var i=n.clientX,a=n.clientY;n.stopPropagation(),0===n.button&&t.setState({dragging:e,selected:e,initialX:i,initialY:a,lastX:i,lastY:a})},t.handleKeyDown=function(e){"Backspace"!==e.key&&"Delete"!==e.key||!t.state.selected||t.setState((function(t){var e=t.selected||"",n=t.widgets;return delete n[e],Object.values(n).forEach((function(t){"arrow"!==t.type||t.start!==e&&t.end!==e||delete n[t.id]})),Object(s.a)(Object(s.a)({},t),{},{selected:null,widgets:Object(s.a)({},n)})}))},t.handleMouseDown=function(){t.setState({selected:null})},t.handleMouseUp=function(e){t.setState((function(e){if(!e.dragging)return Object(s.a)({},e);var n=Object.values(e.widgets).filter((function(t){return"arrow"===t.type&&(t.start===e.dragging||t.end===e.dragging)})).map((function(t){return t})).reduce((function(n,i){if(t.isChartSideArrow(i,e.widgets)){var a=e.widgets[i.start||""],r=e.widgets[i.end||""];t.updateArrowChartSide(i,a,r)&&(i.arrowType="chartSide",i.initialIsHorizontal=!i.initialIsHorizontal)}return i.end===e.dragging&&t.updateArrowChartBranch(i,e.widgets,!1),Object(s.a)(Object(s.a)({},n),{},Object(c.a)({},i.id,Object(s.a)({},i)))}),{});return{dragging:null,widgets:Object(s.a)(Object(s.a)({},e.widgets),n)}}))},t.handleRef=function(e){return t.ref=e},t}return Object(h.a)(n,[{key:"cancelArrowCreation",value:function(){this.setState({initialId:null,cursor:"auto"})}},{key:"updateArrowChartBranch",value:function(t,e,n){if(!t.chartBranchSide||t.chartBranchSide!==t.points[0].type){var i=this.getSharedChartBranch(t,e);if(n&&!i)return;t.arrowType="chartBranch",t.chartBranchSide=t.points[0].type,i?t.chartBranchPosition=i.chartBranchPosition:"left"===t.points[0].type||"right"===t.points[0].type?t.chartBranchPosition=t.points[0].x+(t.points[1].x-t.points[0].x)/2:t.chartBranchPosition=t.points[0].y+(t.points[1].y-t.points[0].y)/2}}},{key:"getSharedChartBranch",value:function(t,e){return Object.values(e).filter((function(e){return"arrow"===e.type&&e.start===t.start})).map((function(t){return t})).find((function(e){return e!==t&&"chartBranch"===e.arrowType&&e.points[0].type===t.points[0].type&&e.chartBranchPosition}))}},{key:"updateArrow",value:function(t,e){var n=e[t.start||""],i=e[t.end||""],a=[{type:"right",x:0,y:0},{type:"left",x:1,y:0}];Math.abs((n.x-i.x)/(n.y-i.y))>1?n.x+n.width+10<i.x?(a[0].type="right",a[1].type="left"):(a[0].type="left",a[1].type="right"):n.y+n.height+10<i.y?(a[0].type="bottom",a[1].type="top"):(a[0].type="top",a[1].type="bottom"),a[0]=this.getWidgetSideMidPosition(a[0],n),a[1]=this.getWidgetSideMidPosition(a[1],i),t.points=a,this.isChartSideArrow(t,e)&&this.updateArrowChartSide(t,n,i)}},{key:"isChartSideArrow",value:function(t,e){if(!this.getSharedChartBranch(t,e))return t.initialIsHorizontal&&("top"===t.points[0].type||"bottom"===t.points[0].type)||!t.initialIsHorizontal&&("left"===t.points[0].type||"right"===t.points[0].type)}},{key:"updateArrowChartSide",value:function(t,e,n){if(t.initialIsHorizontal){var i=this.getIntersectionMiddle(e.x,e.width,n.x,n.width);if(i)return t.points[0].x=i,t.points[1].x=i,!0}else{var a=this.getIntersectionMiddle(e.y,e.height,n.y,n.height);if(a)return t.points[0].y=a,t.points[1].y=a,!0}t.initialIsHorizontal?t.points[0].type=n.x>e.x+e.width/2?"right":"left":t.points[0].type=n.y>e.y+e.height/2?"bottom":"top",t.points[0]=this.getWidgetSideMidPosition(t.points[0],e);var r=e.x+e.width/2,o=e.y+e.height/2,c=n.x+n.width/2,s=n.y+n.height/2,l=Math.abs(r-c)-(e.width/2+n.width/2),h=Math.abs(o-s)-(e.height/2+n.height/2);if(t.initialIsHorizontal?l<=10:h<=10)if(t.initialIsHorizontal){t.points[1].type=n.y>t.points[0].y?"top":"bottom";var d=e.width/2+Math.max(l+10,20);t.points[1].x=r+("right"===t.points[0].type?d:-d),t.points[1].y="top"===t.points[1].type?n.y:n.y+n.height}else{t.points[1].type=n.x>t.points[0].x?"left":"right";var u=e.height/2+Math.max(h+10,20);t.points[1].x="left"===t.points[1].type?n.x:n.x+n.width,t.points[1].y=o+("bottom"===t.points[0].type?u:-u)}else t.initialIsHorizontal?t.points[1].type="right"===t.points[0].type?"left":"right":t.points[1].type="bottom"===t.points[0].type?"top":"bottom",t.points[1]=this.getWidgetSideMidPosition(t.points[1],n);return!1}},{key:"widgetsTooClose",value:function(t,e,n,i){var a=t.x+t.width/2,r=t.y+t.height/2,o=e.x+e.width/2,c=e.y+e.height/2;return i?Math.abs(a-o)-(t.width/2+e.width/2)<=n:Math.abs(r-c)-(t.height/2+e.height/2)<=n}},{key:"getIntersectionMiddle",value:function(t,e,n,i){var a=t+e,r=n+i;if(t===n&&a===r||t>n&&t<r){var o=r-t;return o<=20?null:t+o/2}if(a>n&&a<r){var c=a-n;return c<=20?null:a-c/2}return null}},{key:"getWidgetSideMidPosition",value:function(t,e){var n={type:t.type,x:0,y:0};switch(t.type){case"top":n.x=e.x+e.width/2,n.y=e.y;break;case"right":n.x=e.x+e.width,n.y=e.y+e.height/2;break;case"bottom":n.x=e.x+e.width/2,n.y=e.y+e.height;break;case"left":n.x=e.x,n.y=e.y+e.width/2}return n}},{key:"render",value:function(){var t=this,e=this.state,n=e.cursor,i=e.selected,r=e.widgets;return a.a.createElement("div",{style:{cursor:n},className:"App",tabIndex:1,onContextMenu:this.handleRightClick,onDoubleClick:this.handleDoubleClick,onKeyDown:this.handleKeyDown,onMouseMove:this.handleDrag,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,ref:this.handleRef},Object.values(r).map((function(e){return"sticky"===e.type?a.a.createElement(p,{cursor:n,onRightClick:t.handleStickyRightClick,onDragStart:t.handleDragStart,selected:i===e.id,widget:e,key:e.id}):"arrow"===e.type?a.a.createElement(w,{widget:e,key:e.id}):null})))}}]),n}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}],[[10,1,2]]]);
//# sourceMappingURL=main.c0133b71.chunk.js.map