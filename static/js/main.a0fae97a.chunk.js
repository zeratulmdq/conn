(this.webpackJsonpdiagraming=this.webpackJsonpdiagraming||[]).push([[0],[,,,,,,,,function(t,e,n){},,function(t,e,n){t.exports=n(17)},,,,,function(t,e,n){},function(t,e,n){},function(t,e,n){"use strict";n.r(e);var i=n(0),a=n.n(i),r=n(9),o=n.n(r),c=(n(15),n(2)),s=n(1),h=n(3),l=n(4),d=n(6),p=n(5),y=(n(16),n(8),function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(h.a)(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).dragging=!1,t.initialX=0,t.initialY=0,t.handleContextMenu=function(e){var n=t.props;(0,n.onRightClick)(n.widget.id,e)},t.handleDragStart=function(e){var n=t.props;(0,n.onDragStart)(n.widget.id,e)},t}return Object(l.a)(n,[{key:"render",value:function(){var t=this.props,e=t.cursor,n=t.selected,i=t.widget,r=i.x,o=i.y,c=i.width,s=i.height;return a.a.createElement("div",{onContextMenu:this.handleContextMenu,onMouseDown:this.handleDragStart,style:{top:o,left:r,width:c,height:s,cursor:"crosshair"===e?"crosshair":"pointer",border:n?"2px solid blue":"none"},className:"Sticky"})}}]),n}(a.a.Component)),u=n(19),g=function(t){return{id:u.a(),height:100,width:100,type:"sticky",x:(t.x||0)-50,y:(t.y||0)-50}},f=function(t){return{id:u.a(),height:0,width:0,type:"arrow",x:(t.x||0)-25,y:(t.y||0)-25,start:t.start||null,end:t.end||null,points:[],arrowType:"initial",chartBranch:null,initialIsHorizontal:!0}},w=function(t){return"left"===t||"right"===t?"horizontal":"vertical"},x=function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){return Object(h.a)(this,n),e.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return a.a.createElement("svg",{style:{position:"absolute",top:0,left:0,pointerEvents:"none"},xmlns:"http://www.w3.org/2000/svg",version:"1.1"},function(t,e){var n=t[0],i=t[1],r="right"===n.type||"left"===n.type,o="right"===i.type||"left"===i.type;if(r&&n.y===i.y||!r&&n.x===i.x){var c="M ".concat(n.x," ").concat(n.y," L ").concat(i.x," ").concat(i.y);return[a.a.createElement("path",{d:c,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("circle",{cx:"".concat(i.x),cy:"".concat(i.y),r:"5",stroke:"#5cb85c",fill:"#5cb85c"})]}if(r!==o){var s="".concat(n.x," ").concat(n.y),h=r?"".concat(i.x," ").concat(n.y):"".concat(n.x," ").concat(i.y),l="".concat(i.x," ").concat(i.y),d="M ".concat(s," L ").concat(h),p="M ".concat(h," L ").concat(l);return[a.a.createElement("path",{d:d,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("path",{d:p,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("circle",{cx:"".concat(i.x),cy:"".concat(i.y),r:"5",stroke:"#5cb85c",fill:"#5cb85c"})]}var y=r?(i.x-n.x)/2:(i.y-n.y)/2,u=r?n.x+y:n.y+y;if(e){var g="manyToOne"===e.type?i:n;e.convergenceSide===g.type&&(u=e.position)}var f="".concat(n.x," ").concat(n.y),w=r?"".concat(u," ").concat(n.y):" ".concat(n.x," ").concat(u),x=r?"".concat(u," ").concat(i.y):" ".concat(i.x," ").concat(u),b="".concat(i.x," ").concat(i.y),v="M ".concat(f," L ").concat(w),O="M ".concat(w," L ").concat(x),k="M ".concat(x," L ").concat(b);return[a.a.createElement("path",{d:v,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("path",{d:O,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("path",{d:k,stroke:"red",strokeWidth:"2",fill:"none"}),a.a.createElement("circle",{cx:"".concat(i.x),cy:"".concat(i.y),r:"5",stroke:"#5cb85c",fill:"#5cb85c"})]}(this.props.widget.points,this.props.widget.chartBranch))}}]),n}(a.a.PureComponent),b=function(t){Object(d.a)(n,t);var e=Object(p.a)(n);function n(){var t;Object(h.a)(this,n);for(var i=arguments.length,a=new Array(i),r=0;r<i;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))).ref=null,t.state={cursor:"auto",dragging:null,initialId:null,initialX:null,initialY:null,lastX:null,lastY:null,selected:null,widgets:{}},t.handleRightClick=function(e){e.preventDefault(),e.stopPropagation(),t.state.initialId&&t.cancelArrowCreation()},t.handleStickyRightClick=function(e,n){n.preventDefault(),n.stopPropagation(),t.state.initialId?t.state.initialId!==e?t.setState((function(n){var i=n.widgets[n.initialId||""],a=n.widgets[e],r=Math.abs((i.x-a.x)/(i.y-a.y))>1,o=Object(s.a)(Object(s.a)({},f({start:n.initialId,end:e})),{},{initialIsHorizontal:r});return t.updateArrow(o,n.widgets),Object(s.a)(Object(s.a)({},n),{},{cursor:"auto",initialId:null,widgets:Object(s.a)(Object(s.a)({},n.widgets),{},Object(c.a)({},o.id,o))})})):t.cancelArrowCreation():t.setState({initialId:e,cursor:"crosshair"})},t.handleDoubleClick=function(e){var n=g({x:e.clientX,y:e.clientY});t.setState((function(t){return{selected:n.id,widgets:Object(s.a)(Object(s.a)({},t.widgets),{},Object(c.a)({},n.id,n))}}))},t.handleDrag=function(e){var n=e.clientX,i=e.clientY;t.setState((function(e){if(!e.dragging||!e.lastX||!e.lastY)return Object(s.a)({},e);var a=Object(s.a)({},e.widgets[e.dragging]);a.x=a.x+n-e.lastX,a.y=a.y+i-e.lastY;var r=Object.values(e.widgets).filter((function(t){return"arrow"===t.type&&(t.start===e.dragging||t.end===e.dragging)})).reduce((function(n,i){var a=i;return t.updateArrow(a,e.widgets),Object(s.a)(Object(s.a)({},n),{},Object(c.a)({},a.id,Object(s.a)({},a)))}),{});return{lastX:n,lastY:i,widgets:Object(s.a)(Object(s.a)({},e.widgets),{},Object(c.a)({},a.id,a),r)}}))},t.handleDragStart=function(e,n){var i=n.clientX,a=n.clientY;n.stopPropagation(),0===n.button&&t.setState({dragging:e,selected:e,initialX:i,initialY:a,lastX:i,lastY:a})},t.handleKeyDown=function(e){"Backspace"!==e.key&&"Delete"!==e.key||!t.state.selected||t.setState((function(t){var e=t.selected||"",n=t.widgets;return delete n[e],Object.values(n).forEach((function(t){"arrow"!==t.type||t.start!==e&&t.end!==e||delete n[t.id]})),Object(s.a)(Object(s.a)({},t),{},{selected:null,widgets:Object(s.a)({},n)})}))},t.handleMouseDown=function(){t.setState({selected:null})},t.handleMouseUp=function(e){t.setState((function(e){if(!e.dragging)return Object(s.a)({},e);var n=Object.values(e.widgets).filter((function(t){return"arrow"===t.type&&(t.start===e.dragging||t.end===e.dragging)})).map((function(t){return t})).reduce((function(n,i){if("chartBranch"!==i.arrowType){if(t.isChartSideArrow(i,e.widgets)){var a=e.widgets[i.start||""],r=e.widgets[i.end||""];t.updateArrowChartSide(i,a,r)&&(i.arrowType="chartSide")}t.setArrowChartBranch(i,e.widgets,!1)}return i.initialIsHorizontal="left"===i.points[0].type||"right"===i.points[0].type,Object(s.a)(Object(s.a)({},n),{},Object(c.a)({},i.id,Object(s.a)({},i)))}),{});return{dragging:null,widgets:Object(s.a)(Object(s.a)({},e.widgets),n)}}))},t.handleRef=function(e){return t.ref=e},t}return Object(l.a)(n,[{key:"cancelArrowCreation",value:function(){this.setState({initialId:null,cursor:"auto"})}},{key:"setArrowChartBranch",value:function(t,e,n){var i=this.getSharedChartBranchArrow(t,e);if(!n||i)if(n||(t.arrowType="chartBranch"),i&&i.chartBranch)"oneToOne"===i.chartBranch.type&&(i.start===t.start?(i.chartBranch.type="oneToMany",i.chartBranch.convergenceSide=t.points[0].type):(i.chartBranch.type="manyToOne",i.chartBranch.convergenceSide=t.points[1].type)),t.chartBranch=Object.assign({},i.chartBranch);else{var a={position:0,convergenceSide:t.points[0].type,type:"oneToOne"};"horizontal"===w(a.convergenceSide)?a.position=t.points[0].x+(t.points[1].x-t.points[0].x)/2:a.position=t.points[0].y+(t.points[1].y-t.points[0].y)/2,t.chartBranch=a}}},{key:"getSharedChartBranchArrow",value:function(t,e){var n=Object.values(e).filter((function(e){return"arrow"===e.type&&e.id!==t.id&&"chartBranch"===e.arrowType&&e.chartBranch&&(e.start===t.start&&e.points[0].type===t.points[0].type||e.end===t.end&&e.points[1].type===t.points[1].type)})).map((function(t){return t}));return n.length>0?n[0]:null}},{key:"updateArrow",value:function(t,e){var n=e[t.start||""],i=e[t.end||""],a=Math.abs((n.x-i.x)/(n.y-i.y))>1,r=[{type:"right",x:0,y:0},{type:"left",x:1,y:0}];if(2===t.points.length&&(r=t.points),"chartBranch"!==t.arrowType&&(a?n.x+n.width+10<i.x?(r[0].type="right",r[1].type="left"):(r[0].type="left",r[1].type="right"):n.y+n.height+10<i.y?(r[0].type="bottom",r[1].type="top"):(r[0].type="top",r[1].type="bottom")),r[0]=this.getWidgetSideMidPosition(r[0],n),r[1]=this.getWidgetSideMidPosition(r[1],i),t.points=r,"chartBranch"!==t.arrowType&&(this.isChartSideArrow(t,e)&&this.updateArrowChartSide(t,n,i),this.setArrowChartBranch(t,e,!0)),t.chartBranch&&"oneToOne"!==t.chartBranch.type){var o="manyToOne"===t.chartBranch.type?t.points[1]:t.points[0],c="manyToOne"===t.chartBranch.type?t.points[0]:t.points[1],s="manyToOne"===t.chartBranch.type?i:n,h=s===n?i:n;o=this.getWidgetSideMidPosition(o,s),c=this.getWidgetSideMidPosition(c,h),"horizontal"===w(t.chartBranch.convergenceSide)?t.chartBranch.position>=h.x&&t.chartBranch.position<=h.x+h.width?(c.x=t.chartBranch.position,c.y=h.y+h.height/2>o.y?h.y:h.y+h.height):(c.type=t.chartBranch.position<h.x?"left":"right",c=this.getWidgetSideMidPosition(c,h)):t.chartBranch.position>=h.y&&t.chartBranch.position<=h.y+h.height?(c.x=h.x+h.width/2>o.x?h.x:h.x+h.width,c.y=t.chartBranch.position):(c.type=t.chartBranch.position<h.y?"top":"bottom",c=this.getWidgetSideMidPosition(c,h)),t.points[0]="manyToOne"===t.chartBranch.type?c:o,t.points[1]="manyToOne"===t.chartBranch.type?o:c}}},{key:"isChartSideArrow",value:function(t,e){if(!this.getSharedChartBranchArrow(t,e))return t.initialIsHorizontal&&("top"===t.points[0].type||"bottom"===t.points[0].type)||!t.initialIsHorizontal&&("left"===t.points[0].type||"right"===t.points[0].type)}},{key:"updateArrowChartSide",value:function(t,e,n){if(t.initialIsHorizontal){var i=this.getIntersectionMiddle(e.x,e.width,n.x,n.width);if(i)return t.points[0].x=i,t.points[1].x=i,!0}else{var a=this.getIntersectionMiddle(e.y,e.height,n.y,n.height);if(a)return t.points[0].y=a,t.points[1].y=a,!0}t.initialIsHorizontal?t.points[0].type=n.x>e.x+e.width/2?"right":"left":t.points[0].type=n.y>e.y+e.height/2?"bottom":"top",t.points[0]=this.getWidgetSideMidPosition(t.points[0],e);var r=e.x+e.width/2,o=e.y+e.height/2,c=n.x+n.width/2,s=n.y+n.height/2,h=Math.abs(r-c)-(e.width/2+n.width/2),l=Math.abs(o-s)-(e.height/2+n.height/2);if(t.initialIsHorizontal?h<=10:l<=10)if(t.initialIsHorizontal){t.points[1].type=n.y>t.points[0].y?"top":"bottom";var d=e.width/2+Math.max(h+10,20);t.points[1].x=r+("right"===t.points[0].type?d:-d),t.points[1].y="top"===t.points[1].type?n.y:n.y+n.height}else{t.points[1].type=n.x>t.points[0].x?"left":"right";var p=e.height/2+Math.max(l+10,20);t.points[1].x="left"===t.points[1].type?n.x:n.x+n.width,t.points[1].y=o+("bottom"===t.points[0].type?p:-p)}else t.initialIsHorizontal?t.points[1].type="right"===t.points[0].type?"left":"right":t.points[1].type="bottom"===t.points[0].type?"top":"bottom",t.points[1]=this.getWidgetSideMidPosition(t.points[1],n);return!1}},{key:"widgetsTooClose",value:function(t,e,n,i){var a=t.x+t.width/2,r=t.y+t.height/2,o=e.x+e.width/2,c=e.y+e.height/2;return i?Math.abs(a-o)-(t.width/2+e.width/2)<=n:Math.abs(r-c)-(t.height/2+e.height/2)<=n}},{key:"getIntersectionMiddle",value:function(t,e,n,i){var a=t+e,r=n+i;if(t===n&&a===r||t>n&&t<r){var o=r-t;return o<=20?null:t+o/2}if(a>n&&a<r){var c=a-n;return c<=20?null:a-c/2}return null}},{key:"getWidgetSideMidPosition",value:function(t,e){var n={type:t.type,x:0,y:0};switch(t.type){case"top":n.x=e.x+e.width/2,n.y=e.y;break;case"right":n.x=e.x+e.width,n.y=e.y+e.height/2;break;case"bottom":n.x=e.x+e.width/2,n.y=e.y+e.height;break;case"left":n.x=e.x,n.y=e.y+e.width/2}return n}},{key:"render",value:function(){var t=this,e=this.state,n=e.cursor,i=e.selected,r=e.widgets;return a.a.createElement("div",{style:{cursor:n},className:"App",tabIndex:1,onContextMenu:this.handleRightClick,onDoubleClick:this.handleDoubleClick,onKeyDown:this.handleKeyDown,onMouseMove:this.handleDrag,onMouseDown:this.handleMouseDown,onMouseUp:this.handleMouseUp,ref:this.handleRef},Object.values(r).map((function(e){return"sticky"===e.type?a.a.createElement(y,{cursor:n,onRightClick:t.handleStickyRightClick,onDragStart:t.handleDragStart,selected:i===e.id,widget:e,key:e.id}):"arrow"===e.type?a.a.createElement(x,{widget:e,key:e.id}):null})))}}]),n}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}],[[10,1,2]]]);
//# sourceMappingURL=main.a0fae97a.chunk.js.map