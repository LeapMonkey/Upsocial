(()=>{"use strict";var e={8452:(e,t,r)=>{r.r(t),r.d(t,{default:()=>P});r(9526);var n=r(5017),o=r(1882),i=r(5648),a=r(6337),l=r(83),u=r(7557),c=n.default.create({container:{flex:1,position:"relative"},loadingView:{position:"absolute",top:0,left:0,backgroundColor:"rgba(0, 0, 0, 0.6)",width:a.default.get("window").width,height:a.default.get("window").height,justifyContent:"center",alignItems:"center",zIndex:1e4}});const d=(0,l.connect)((function(e){return{auth:e.auth,loading:e.loading}}),{})((function(e){return(0,u.jsxs)(o.default,{style:c.container,children:[(0,u.jsx)(i.default,{}),(0,u.jsx)(ProfileManage,{})]})}));var f=r(7670),s=r(6441);const p=function(e){return void 0===e||null===e||"object"===typeof e&&0===Object.keys(e).length||"string"===typeof e&&0===e.trim().length};var v={isAuthenticated:!1,user:{}};var g=r(4942);function b(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function y(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?b(Object(r),!0).forEach((function(t){(0,g.default)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):b(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var h={loading:!1};var O={},j=[s.default],w=(0,f.combineReducers)({auth:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1?arguments[1]:void 0;return"SET_USERS"===t.type?{isAuthenticated:!p(t.payload),user:t.payload}:e},loading:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:h,t=arguments.length>1?arguments[1]:void 0;return"LOADING_DATA"===t.type?y(y({},e),{},{loading:t.payload}):e}});var m=function(){return(0,f.createStore)(w,O,(0,f.compose)(f.applyMiddleware.apply(void 0,j)))}();function P(){return(0,u.jsx)(l.Provider,{store:m,children:(0,u.jsx)(d,{})})}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}r.m=e,(()=>{var e=[];r.O=(t,n,o,i)=>{if(!n){var a=1/0;for(d=0;d<e.length;d++){for(var[n,o,i]=e[d],l=!0,u=0;u<n.length;u++)(!1&i||a>=i)&&Object.keys(r.O).every((e=>r.O[e](n[u])))?n.splice(u--,1):(l=!1,i<a&&(a=i));if(l){e.splice(d--,1);var c=o();void 0!==c&&(t=c)}}return t}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[n,o,i]}})(),r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};r.O.j=t=>0===e[t];var t=(t,n)=>{var o,i,[a,l,u]=n,c=0;if(a.some((t=>0!==e[t]))){for(o in l)r.o(l,o)&&(r.m[o]=l[o]);if(u)var d=u(r)}for(t&&t(n);c<a.length;c++)i=a[c],r.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return r.O(d)},n=self.webpackChunkweb=self.webpackChunkweb||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var n=r.O(void 0,[349],(()=>r(4620)));n=r.O(n)})();
//# sourceMappingURL=main.a90758c1.js.map