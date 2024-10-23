(()=>{var n={936:(n,r,e)=>{"use strict";e.d(r,{A:()=>A});var t=e(354),o=e.n(t),i=e(314),a=e.n(i)()(o());a.push([n.id,"@media screen and (min-width: 650px) {\n  .app-bar {\n    grid-template-columns: 1fr auto;\n    padding: 8px 32px;\n  }\n\n  .app-bar .app-bar__brand h1 {\n    font-size: 1.5em;\n  }\n\n  .app-bar .app-bar__menu {\n    display: none;\n  }\n\n  .app-bar .app-bar__navigation {\n    position: static;\n    width: 100%;\n  }\n\n  .app-bar .app-bar__navigation ul li {\n    display: inline-block;\n  }\n\n  .app-bar .app-bar__navigation ul li a {\n    display: inline-block;\n    width: 120px;\n    text-align: center;\n    margin: 0;\n  }\n\n  .movies {\n    grid-template-columns: 1fr 1fr;\n  }\n\n  .movie {\n    grid-template-columns: auto 1fr;\n  }\n\n  .movie .movie__title {\n    grid-column-start: 1;\n    grid-column-end: 3;\n  }\n\n  .movie .movie__overview {\n    grid-column-start: 1;\n    grid-column-end: 3;\n  }\n}\n\n@media screen and (min-width: 800px) {\n  .app-bar .app-bar__brand h1 {\n    font-size: 2em;\n  }\n}\n\n@media screen and (min-width: 850px) {\n  .movies {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}\n\n@media screen and (min-width: 1200px) {\n  .movies {\n    grid-template-columns: repeat(4, 1fr);\n  }\n}\n\n@media screen and (min-width: 1600px) {\n  .movies {\n    grid-template-columns: repeat(5, 1fr);\n  }\n}\n","",{version:3,sources:["webpack://./src/styles/responsive.css"],names:[],mappings:"AAAA;EACE;IACE,+BAA+B;IAC/B,iBAAiB;EACnB;;EAEA;IACE,gBAAgB;EAClB;;EAEA;IACE,aAAa;EACf;;EAEA;IACE,gBAAgB;IAChB,WAAW;EACb;;EAEA;IACE,qBAAqB;EACvB;;EAEA;IACE,qBAAqB;IACrB,YAAY;IACZ,kBAAkB;IAClB,SAAS;EACX;;EAEA;IACE,8BAA8B;EAChC;;EAEA;IACE,+BAA+B;EACjC;;EAEA;IACE,oBAAoB;IACpB,kBAAkB;EACpB;;EAEA;IACE,oBAAoB;IACpB,kBAAkB;EACpB;AACF;;AAEA;EACE;IACE,cAAc;EAChB;AACF;;AAEA;EACE;IACE,qCAAqC;EACvC;AACF;;AAEA;EACE;IACE,qCAAqC;EACvC;AACF;;AAEA;EACE;IACE,qCAAqC;EACvC;AACF",sourcesContent:["@media screen and (min-width: 650px) {\r\n  .app-bar {\r\n    grid-template-columns: 1fr auto;\r\n    padding: 8px 32px;\r\n  }\r\n\r\n  .app-bar .app-bar__brand h1 {\r\n    font-size: 1.5em;\r\n  }\r\n\r\n  .app-bar .app-bar__menu {\r\n    display: none;\r\n  }\r\n\r\n  .app-bar .app-bar__navigation {\r\n    position: static;\r\n    width: 100%;\r\n  }\r\n\r\n  .app-bar .app-bar__navigation ul li {\r\n    display: inline-block;\r\n  }\r\n\r\n  .app-bar .app-bar__navigation ul li a {\r\n    display: inline-block;\r\n    width: 120px;\r\n    text-align: center;\r\n    margin: 0;\r\n  }\r\n\r\n  .movies {\r\n    grid-template-columns: 1fr 1fr;\r\n  }\r\n\r\n  .movie {\r\n    grid-template-columns: auto 1fr;\r\n  }\r\n\r\n  .movie .movie__title {\r\n    grid-column-start: 1;\r\n    grid-column-end: 3;\r\n  }\r\n\r\n  .movie .movie__overview {\r\n    grid-column-start: 1;\r\n    grid-column-end: 3;\r\n  }\r\n}\r\n\r\n@media screen and (min-width: 800px) {\r\n  .app-bar .app-bar__brand h1 {\r\n    font-size: 2em;\r\n  }\r\n}\r\n\r\n@media screen and (min-width: 850px) {\r\n  .movies {\r\n    grid-template-columns: repeat(3, 1fr);\r\n  }\r\n}\r\n\r\n@media screen and (min-width: 1200px) {\r\n  .movies {\r\n    grid-template-columns: repeat(4, 1fr);\r\n  }\r\n}\r\n\r\n@media screen and (min-width: 1600px) {\r\n  .movies {\r\n    grid-template-columns: repeat(5, 1fr);\r\n  }\r\n}\r\n"],sourceRoot:""}]);const A=a},919:(n,r,e)=>{"use strict";e.d(r,{A:()=>A});var t=e(354),o=e.n(t),i=e(314),a=e.n(i)()(o());a.push([n.id,"* {\n  padding: 0;\n  margin: 0;\n}\n\nbody {\n  font-family: 'Poppins', sans-serif;\n  background-color: white;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\n\n/*\n    AppBar\n  */\n\n.app-bar {\n  padding: 8px 16px;\n  background-color: white;\n  display: grid;\n  grid-template-columns: auto 1fr auto;\n  gap: 10px;\n  position: sticky;\n  top: 0;\n  z-index: 99;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);\n}\n\n.app-bar .app-bar__menu {\n  display: flex;\n  align-items: center;\n}\n\n.app-bar .app-bar__menu button {\n  background-color: transparent;\n  border: none;\n  font-size: 18px;\n  padding: 8px;\n  cursor: pointer;\n}\n\n.app-bar .app-bar__brand {\n  display: flex;\n  align-items: center;\n}\n\n.app-bar .app-bar__brand h1 {\n  color: #db0000;\n  text-transform: uppercase;\n  font-size: 22px;\n  user-select: none;\n}\n\n.app-bar .app-bar__navigation {\n  position: absolute;\n  top: 50px;\n  left: -180px;\n  width: 150px;\n  transition: all 0.3s;\n  padding: 8px;\n  background-color: white;\n  overflow: hidden;\n}\n\n.app-bar .app-bar__navigation.open {\n  left: 0;\n}\n\n.app-bar .app-bar__navigation ul li a {\n  display: inline-block;\n  text-decoration: none;\n  color: black;\n  padding: 8px;\n  margin-bottom: 5px;\n  width: 100%;\n}\n\n/*\n    Main Content\n  */\n\nmain {\n  padding: 32px;\n  flex: 1;\n}\n\n.content {\n  margin: 0 auto;\n  min-height: 100%;\n}\n\n.content .content__heading {\n  font-weight: normal;\n}\n\n/*\n    Movies\n  */\n\n.movies {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n  margin: 32px 0;\n}\n\n/*\n    Movie Item\n  */\n\n.movie-item {\n  width: 100%;\n  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);\n  border-radius: 8px;\n  overflow: hidden;\n}\n\n.movie-item__header {\n  position: relative;\n}\n\n.movie-item .movie-item__header .movie-item__header__poster {\n  width: 100%;\n}\n\n.movie-item .movie-item__header .movie-item__header__rating {\n  position: absolute;\n  padding: 8px;\n  bottom: 20px;\n  left: 0;\n  display: inline-block;\n  background-color: black;\n  color: white;\n}\n\n.movie-item\n  .movie-item__header\n  .movie-item__header__rating\n  .movie-item__header__rating__score {\n  margin-left: 10px;\n}\n\n.movie-item .movie-item__content {\n  padding: 16px;\n}\n\n.movie-item .movie-item__content h3 {\n  margin: 0 0 10px 0;\n}\n\n.movie-item .movie-item__content h3 a {\n  color: #db0000;\n  text-decoration: none;\n}\n\n.movie-item .movie-item__content p {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 4; /* number of lines to show */\n  -webkit-box-orient: vertical;\n}\n\n/*\n    Movie\n  */\n\n.movie {\n  margin: 0 auto;\n  width: 100%;\n  max-width: 800px;\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 18px 16px;\n}\n\n.movie .movie__poster {\n  width: 100%;\n  max-width: 400px;\n}\n\n.movie .movie__info h4 {\n  margin: 8px 0;\n}\n\n/*\n    Footer\n  */\n\nfooter {\n  padding: 16px;\n}\n\nfooter p {\n  text-align: center;\n  color: #aaaaaa;\n}\n\nfooter p a {\n  color: #db0000;\n  text-decoration: none;\n}\n","",{version:3,sources:["webpack://./src/styles/style.css"],names:[],mappings:"AAAA;EACE,UAAU;EACV,SAAS;AACX;;AAEA;EACE,kCAAkC;EAClC,uBAAuB;EACvB,iBAAiB;EACjB,aAAa;EACb,sBAAsB;AACxB;;AAEA;;GAEG;;AAEH;EACE,iBAAiB;EACjB,uBAAuB;EACvB,aAAa;EACb,oCAAoC;EACpC,SAAS;EACT,gBAAgB;EAChB,MAAM;EACN,WAAW;EACX,0CAA0C;AAC5C;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,6BAA6B;EAC7B,YAAY;EACZ,eAAe;EACf,YAAY;EACZ,eAAe;AACjB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,cAAc;EACd,yBAAyB;EACzB,eAAe;EACf,iBAAiB;AACnB;;AAEA;EACE,kBAAkB;EAClB,SAAS;EACT,YAAY;EACZ,YAAY;EACZ,oBAAoB;EACpB,YAAY;EACZ,uBAAuB;EACvB,gBAAgB;AAClB;;AAEA;EACE,OAAO;AACT;;AAEA;EACE,qBAAqB;EACrB,qBAAqB;EACrB,YAAY;EACZ,YAAY;EACZ,kBAAkB;EAClB,WAAW;AACb;;AAEA;;GAEG;;AAEH;EACE,aAAa;EACb,OAAO;AACT;;AAEA;EACE,cAAc;EACd,gBAAgB;AAClB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;;GAEG;;AAEH;EACE,aAAa;EACb,0BAA0B;EAC1B,SAAS;EACT,cAAc;AAChB;;AAEA;;GAEG;;AAEH;EACE,WAAW;EACX,0CAA0C;EAC1C,kBAAkB;EAClB,gBAAgB;AAClB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,kBAAkB;EAClB,YAAY;EACZ,YAAY;EACZ,OAAO;EACP,qBAAqB;EACrB,uBAAuB;EACvB,YAAY;AACd;;AAEA;;;;EAIE,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,cAAc;EACd,qBAAqB;AACvB;;AAEA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,oBAAoB;EACpB,qBAAqB,EAAE,4BAA4B;EACnD,4BAA4B;AAC9B;;AAEA;;GAEG;;AAEH;EACE,cAAc;EACd,WAAW;EACX,gBAAgB;EAChB,aAAa;EACb,0BAA0B;EAC1B,cAAc;AAChB;;AAEA;EACE,WAAW;EACX,gBAAgB;AAClB;;AAEA;EACE,aAAa;AACf;;AAEA;;GAEG;;AAEH;EACE,aAAa;AACf;;AAEA;EACE,kBAAkB;EAClB,cAAc;AAChB;;AAEA;EACE,cAAc;EACd,qBAAqB;AACvB",sourcesContent:["* {\r\n  padding: 0;\r\n  margin: 0;\r\n}\r\n\r\nbody {\r\n  font-family: 'Poppins', sans-serif;\r\n  background-color: white;\r\n  min-height: 100vh;\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n/*\r\n    AppBar\r\n  */\r\n\r\n.app-bar {\r\n  padding: 8px 16px;\r\n  background-color: white;\r\n  display: grid;\r\n  grid-template-columns: auto 1fr auto;\r\n  gap: 10px;\r\n  position: sticky;\r\n  top: 0;\r\n  z-index: 99;\r\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.app-bar .app-bar__menu {\r\n  display: flex;\r\n  align-items: center;\r\n}\r\n\r\n.app-bar .app-bar__menu button {\r\n  background-color: transparent;\r\n  border: none;\r\n  font-size: 18px;\r\n  padding: 8px;\r\n  cursor: pointer;\r\n}\r\n\r\n.app-bar .app-bar__brand {\r\n  display: flex;\r\n  align-items: center;\r\n}\r\n\r\n.app-bar .app-bar__brand h1 {\r\n  color: #db0000;\r\n  text-transform: uppercase;\r\n  font-size: 22px;\r\n  user-select: none;\r\n}\r\n\r\n.app-bar .app-bar__navigation {\r\n  position: absolute;\r\n  top: 50px;\r\n  left: -180px;\r\n  width: 150px;\r\n  transition: all 0.3s;\r\n  padding: 8px;\r\n  background-color: white;\r\n  overflow: hidden;\r\n}\r\n\r\n.app-bar .app-bar__navigation.open {\r\n  left: 0;\r\n}\r\n\r\n.app-bar .app-bar__navigation ul li a {\r\n  display: inline-block;\r\n  text-decoration: none;\r\n  color: black;\r\n  padding: 8px;\r\n  margin-bottom: 5px;\r\n  width: 100%;\r\n}\r\n\r\n/*\r\n    Main Content\r\n  */\r\n\r\nmain {\r\n  padding: 32px;\r\n  flex: 1;\r\n}\r\n\r\n.content {\r\n  margin: 0 auto;\r\n  min-height: 100%;\r\n}\r\n\r\n.content .content__heading {\r\n  font-weight: normal;\r\n}\r\n\r\n/*\r\n    Movies\r\n  */\r\n\r\n.movies {\r\n  display: grid;\r\n  grid-template-columns: 1fr;\r\n  gap: 16px;\r\n  margin: 32px 0;\r\n}\r\n\r\n/*\r\n    Movie Item\r\n  */\r\n\r\n.movie-item {\r\n  width: 100%;\r\n  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);\r\n  border-radius: 8px;\r\n  overflow: hidden;\r\n}\r\n\r\n.movie-item__header {\r\n  position: relative;\r\n}\r\n\r\n.movie-item .movie-item__header .movie-item__header__poster {\r\n  width: 100%;\r\n}\r\n\r\n.movie-item .movie-item__header .movie-item__header__rating {\r\n  position: absolute;\r\n  padding: 8px;\r\n  bottom: 20px;\r\n  left: 0;\r\n  display: inline-block;\r\n  background-color: black;\r\n  color: white;\r\n}\r\n\r\n.movie-item\r\n  .movie-item__header\r\n  .movie-item__header__rating\r\n  .movie-item__header__rating__score {\r\n  margin-left: 10px;\r\n}\r\n\r\n.movie-item .movie-item__content {\r\n  padding: 16px;\r\n}\r\n\r\n.movie-item .movie-item__content h3 {\r\n  margin: 0 0 10px 0;\r\n}\r\n\r\n.movie-item .movie-item__content h3 a {\r\n  color: #db0000;\r\n  text-decoration: none;\r\n}\r\n\r\n.movie-item .movie-item__content p {\r\n  overflow: hidden;\r\n  text-overflow: ellipsis;\r\n  display: -webkit-box;\r\n  -webkit-line-clamp: 4; /* number of lines to show */\r\n  -webkit-box-orient: vertical;\r\n}\r\n\r\n/*\r\n    Movie\r\n  */\r\n\r\n.movie {\r\n  margin: 0 auto;\r\n  width: 100%;\r\n  max-width: 800px;\r\n  display: grid;\r\n  grid-template-columns: 1fr;\r\n  gap: 18px 16px;\r\n}\r\n\r\n.movie .movie__poster {\r\n  width: 100%;\r\n  max-width: 400px;\r\n}\r\n\r\n.movie .movie__info h4 {\r\n  margin: 8px 0;\r\n}\r\n\r\n/*\r\n    Footer\r\n  */\r\n\r\nfooter {\r\n  padding: 16px;\r\n}\r\n\r\nfooter p {\r\n  text-align: center;\r\n  color: #aaaaaa;\r\n}\r\n\r\nfooter p a {\r\n  color: #db0000;\r\n  text-decoration: none;\r\n}\r\n"],sourceRoot:""}]);const A=a},314:n=>{"use strict";n.exports=function(n){var r=[];return r.toString=function(){return this.map((function(r){var e="",t=void 0!==r[5];return r[4]&&(e+="@supports (".concat(r[4],") {")),r[2]&&(e+="@media ".concat(r[2]," {")),t&&(e+="@layer".concat(r[5].length>0?" ".concat(r[5]):""," {")),e+=n(r),t&&(e+="}"),r[2]&&(e+="}"),r[4]&&(e+="}"),e})).join("")},r.i=function(n,e,t,o,i){"string"==typeof n&&(n=[[null,n,void 0]]);var a={};if(t)for(var A=0;A<this.length;A++){var p=this[A][0];null!=p&&(a[p]=!0)}for(var c=0;c<n.length;c++){var s=[].concat(n[c]);t&&a[s[0]]||(void 0!==i&&(void 0===s[5]||(s[1]="@layer".concat(s[5].length>0?" ".concat(s[5]):""," {").concat(s[1],"}")),s[5]=i),e&&(s[2]?(s[1]="@media ".concat(s[2]," {").concat(s[1],"}"),s[2]=e):s[2]=e),o&&(s[4]?(s[1]="@supports (".concat(s[4],") {").concat(s[1],"}"),s[4]=o):s[4]="".concat(o)),r.push(s))}},r}},354:n=>{"use strict";n.exports=function(n){var r=n[1],e=n[3];if(!e)return r;if("function"==typeof btoa){var t=btoa(unescape(encodeURIComponent(JSON.stringify(e)))),o="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(t),i="/*# ".concat(o," */");return[r].concat([i]).join("\n")}return[r].join("\n")}},452:n=>{var r=function(n){"use strict";var r,e=Object.prototype,t=e.hasOwnProperty,o=Object.defineProperty||function(n,r,e){n[r]=e.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",A=i.asyncIterator||"@@asyncIterator",p=i.toStringTag||"@@toStringTag";function c(n,r,e){return Object.defineProperty(n,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),n[r]}try{c({},"")}catch(n){c=function(n,r,e){return n[r]=e}}function s(n,r,e,t){var i=r&&r.prototype instanceof v?r:v,a=Object.create(i.prototype),A=new I(t||[]);return o(a,"_invoke",{value:w(n,e,A)}),a}function l(n,r,e){try{return{type:"normal",arg:n.call(r,e)}}catch(n){return{type:"throw",arg:n}}}n.wrap=s;var u="suspendedStart",d="suspendedYield",m="executing",f="completed",h={};function v(){}function E(){}function g(){}var b={};c(b,a,(function(){return this}));var C=Object.getPrototypeOf,y=C&&C(C(j([])));y&&y!==e&&t.call(y,a)&&(b=y);var _=g.prototype=v.prototype=Object.create(b);function B(n){["next","throw","return"].forEach((function(r){c(n,r,(function(n){return this._invoke(r,n)}))}))}function x(n,r){function e(o,i,a,A){var p=l(n[o],n,i);if("throw"!==p.type){var c=p.arg,s=c.value;return s&&"object"==typeof s&&t.call(s,"__await")?r.resolve(s.__await).then((function(n){e("next",n,a,A)}),(function(n){e("throw",n,a,A)})):r.resolve(s).then((function(n){c.value=n,a(c)}),(function(n){return e("throw",n,a,A)}))}A(p.arg)}var i;o(this,"_invoke",{value:function(n,t){function o(){return new r((function(r,o){e(n,t,r,o)}))}return i=i?i.then(o,o):o()}})}function w(n,e,t){var o=u;return function(i,a){if(o===m)throw new Error("Generator is already running");if(o===f){if("throw"===i)throw a;return{value:r,done:!0}}for(t.method=i,t.arg=a;;){var A=t.delegate;if(A){var p=k(A,t);if(p){if(p===h)continue;return p}}if("next"===t.method)t.sent=t._sent=t.arg;else if("throw"===t.method){if(o===u)throw o=f,t.arg;t.dispatchException(t.arg)}else"return"===t.method&&t.abrupt("return",t.arg);o=m;var c=l(n,e,t);if("normal"===c.type){if(o=t.done?f:d,c.arg===h)continue;return{value:c.arg,done:t.done}}"throw"===c.type&&(o=f,t.method="throw",t.arg=c.arg)}}}function k(n,e){var t=e.method,o=n.iterator[t];if(o===r)return e.delegate=null,"throw"===t&&n.iterator.return&&(e.method="return",e.arg=r,k(n,e),"throw"===e.method)||"return"!==t&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+t+"' method")),h;var i=l(o,n.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,h;var a=i.arg;return a?a.done?(e[n.resultName]=a.value,e.next=n.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,h):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function S(n){var r={tryLoc:n[0]};1 in n&&(r.catchLoc=n[1]),2 in n&&(r.finallyLoc=n[2],r.afterLoc=n[3]),this.tryEntries.push(r)}function L(n){var r=n.completion||{};r.type="normal",delete r.arg,n.completion=r}function I(n){this.tryEntries=[{tryLoc:"root"}],n.forEach(S,this),this.reset(!0)}function j(n){if(null!=n){var e=n[a];if(e)return e.call(n);if("function"==typeof n.next)return n;if(!isNaN(n.length)){var o=-1,i=function e(){for(;++o<n.length;)if(t.call(n,o))return e.value=n[o],e.done=!1,e;return e.value=r,e.done=!0,e};return i.next=i}}throw new TypeError(typeof n+" is not iterable")}return E.prototype=g,o(_,"constructor",{value:g,configurable:!0}),o(g,"constructor",{value:E,configurable:!0}),E.displayName=c(g,p,"GeneratorFunction"),n.isGeneratorFunction=function(n){var r="function"==typeof n&&n.constructor;return!!r&&(r===E||"GeneratorFunction"===(r.displayName||r.name))},n.mark=function(n){return Object.setPrototypeOf?Object.setPrototypeOf(n,g):(n.__proto__=g,c(n,p,"GeneratorFunction")),n.prototype=Object.create(_),n},n.awrap=function(n){return{__await:n}},B(x.prototype),c(x.prototype,A,(function(){return this})),n.AsyncIterator=x,n.async=function(r,e,t,o,i){void 0===i&&(i=Promise);var a=new x(s(r,e,t,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(n){return n.done?n.value:a.next()}))},B(_),c(_,p,"Generator"),c(_,a,(function(){return this})),c(_,"toString",(function(){return"[object Generator]"})),n.keys=function(n){var r=Object(n),e=[];for(var t in r)e.push(t);return e.reverse(),function n(){for(;e.length;){var t=e.pop();if(t in r)return n.value=t,n.done=!1,n}return n.done=!0,n}},n.values=j,I.prototype={constructor:I,reset:function(n){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(L),!n)for(var e in this)"t"===e.charAt(0)&&t.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var n=this.tryEntries[0].completion;if("throw"===n.type)throw n.arg;return this.rval},dispatchException:function(n){if(this.done)throw n;var e=this;function o(t,o){return A.type="throw",A.arg=n,e.next=t,o&&(e.method="next",e.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],A=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var p=t.call(a,"catchLoc"),c=t.call(a,"finallyLoc");if(p&&c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(p){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(n,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&t.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===n||"continue"===n)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=n,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(n,r){if("throw"===n.type)throw n.arg;return"break"===n.type||"continue"===n.type?this.next=n.arg:"return"===n.type?(this.rval=this.arg=n.arg,this.method="return",this.next="end"):"normal"===n.type&&r&&(this.next=r),h},finish:function(n){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===n)return this.complete(e.completion,e.afterLoc),L(e),h}},catch:function(n){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===n){var t=e.completion;if("throw"===t.type){var o=t.arg;L(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(n,e,t){return this.delegate={iterator:j(n),resultName:e,nextLoc:t},"next"===this.method&&(this.arg=r),h}},n}(n.exports);try{regeneratorRuntime=r}catch(n){"object"==typeof globalThis?globalThis.regeneratorRuntime=r:Function("r","regeneratorRuntime = r")(r)}},72:n=>{"use strict";var r=[];function e(n){for(var e=-1,t=0;t<r.length;t++)if(r[t].identifier===n){e=t;break}return e}function t(n,t){for(var i={},a=[],A=0;A<n.length;A++){var p=n[A],c=t.base?p[0]+t.base:p[0],s=i[c]||0,l="".concat(c," ").concat(s);i[c]=s+1;var u=e(l),d={css:p[1],media:p[2],sourceMap:p[3],supports:p[4],layer:p[5]};if(-1!==u)r[u].references++,r[u].updater(d);else{var m=o(d,t);t.byIndex=A,r.splice(A,0,{identifier:l,updater:m,references:1})}a.push(l)}return a}function o(n,r){var e=r.domAPI(r);return e.update(n),function(r){if(r){if(r.css===n.css&&r.media===n.media&&r.sourceMap===n.sourceMap&&r.supports===n.supports&&r.layer===n.layer)return;e.update(n=r)}else e.remove()}}n.exports=function(n,o){var i=t(n=n||[],o=o||{});return function(n){n=n||[];for(var a=0;a<i.length;a++){var A=e(i[a]);r[A].references--}for(var p=t(n,o),c=0;c<i.length;c++){var s=e(i[c]);0===r[s].references&&(r[s].updater(),r.splice(s,1))}i=p}}},659:n=>{"use strict";var r={};n.exports=function(n,e){var t=function(n){if(void 0===r[n]){var e=document.querySelector(n);if(window.HTMLIFrameElement&&e instanceof window.HTMLIFrameElement)try{e=e.contentDocument.head}catch(n){e=null}r[n]=e}return r[n]}(n);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");t.appendChild(e)}},540:n=>{"use strict";n.exports=function(n){var r=document.createElement("style");return n.setAttributes(r,n.attributes),n.insert(r,n.options),r}},56:(n,r,e)=>{"use strict";n.exports=function(n){var r=e.nc;r&&n.setAttribute("nonce",r)}},825:n=>{"use strict";n.exports=function(n){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var r=n.insertStyleElement(n);return{update:function(e){!function(n,r,e){var t="";e.supports&&(t+="@supports (".concat(e.supports,") {")),e.media&&(t+="@media ".concat(e.media," {"));var o=void 0!==e.layer;o&&(t+="@layer".concat(e.layer.length>0?" ".concat(e.layer):""," {")),t+=e.css,o&&(t+="}"),e.media&&(t+="}"),e.supports&&(t+="}");var i=e.sourceMap;i&&"undefined"!=typeof btoa&&(t+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),r.styleTagTransform(t,n,r.options)}(r,n,e)},remove:function(){!function(n){if(null===n.parentNode)return!1;n.parentNode.removeChild(n)}(r)}}}},113:n=>{"use strict";n.exports=function(n,r){if(r.styleSheet)r.styleSheet.cssText=n;else{for(;r.firstChild;)r.removeChild(r.firstChild);r.appendChild(document.createTextNode(n))}}}},r={};function e(t){var o=r[t];if(void 0!==o)return o.exports;var i=r[t]={id:t,exports:{}};return n[t](i,i.exports,e),i.exports}e.n=n=>{var r=n&&n.__esModule?()=>n.default:()=>n;return e.d(r,{a:r}),r},e.d=(n,r)=>{for(var t in r)e.o(r,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:r[t]})},e.o=(n,r)=>Object.prototype.hasOwnProperty.call(n,r),e.nc=void 0,(()=>{"use strict";e(452);var n=e(72),r=e.n(n),t=e(825),o=e.n(t),i=e(659),a=e.n(i),A=e(56),p=e.n(A),c=e(540),s=e.n(c),l=e(113),u=e.n(l),d=e(919),m={};m.styleTagTransform=u(),m.setAttributes=p(),m.insert=a().bind(null,"head"),m.domAPI=o(),m.insertStyleElement=s(),r()(d.A,m),d.A&&d.A.locals&&d.A.locals;var f=e(936),h={};h.styleTagTransform=u(),h.setAttributes=p(),h.insert=a().bind(null,"head"),h.domAPI=o(),h.insertStyleElement=s(),r()(f.A,h),f.A&&f.A.locals&&f.A.locals;const v={init:function(n){var r=this,e=n.button,t=n.drawer,o=n.content;e.addEventListener("click",(function(n){r._toggleDrawer(n,t)})),o.addEventListener("click",(function(n){r._closeDrawer(n,t)}))},_toggleDrawer:function(n,r){n.stopPropagation(),r.classList.toggle("open")},_closeDrawer:function(n,r){n.stopPropagation(),r.classList.remove("open")}};function E(n){return E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},E(n)}function g(n,r){for(var e=0;e<r.length;e++){var t=r[e];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(n,b(t.key),t)}}function b(n){var r=function(n){if("object"!=E(n)||!n)return n;var r=n[Symbol.toPrimitive];if(void 0!==r){var e=r.call(n,"string");if("object"!=E(e))return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(n)}(n);return"symbol"==E(r)?r:r+""}const C=function(){return n=function n(r){var e=r.button,t=r.drawer,o=r.content;!function(n,r){if(!(n instanceof r))throw new TypeError("Cannot call a class as a function")}(this,n),this._button=e,this._drawer=t,this._content=o,this._initialAppShell()},(r=[{key:"_initialAppShell",value:function(){v.init({button:this._button,drawer:this._drawer,content:this._content})}}])&&g(n.prototype,r),Object.defineProperty(n,"prototype",{writable:!1}),n;var n,r}();console.log("hi"),new C({button:document.querySelector("#hamburgerButton"),drawer:document.querySelector("#navigationDrawer"),content:document.querySelector("#mainContent")})})()})();
//# sourceMappingURL=app.bundle.js.map