var vr = Object.defineProperty;
var Er = (r, e, t) => e in r ? vr(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var re = (r, e, t) => Er(r, typeof e != "symbol" ? e + "" : e, t);
import { app as ye, BrowserWindow as Ds, ipcMain as Fs, screen as He } from "electron";
import { fileURLToPath as br } from "node:url";
import oe from "node:path";
import Is from "fs";
import Us from "url";
import wr from "child_process";
import Ms from "http";
import qs from "https";
import Sr from "tty";
import kr from "util";
import $s from "os";
import Re from "stream";
import xr from "zlib";
import Cr from "path";
import Or from "buffer";
import qt from "crypto";
import Tr from "events";
import Rr from "net";
import Nr from "tls";
import Lr from "dgram";
function Ar(r, e) {
  for (var t = 0; t < e.length; t++) {
    const s = e[t];
    if (typeof s != "string" && !Array.isArray(s)) {
      for (const n in s)
        if (n !== "default" && !(n in r)) {
          const i = Object.getOwnPropertyDescriptor(s, n);
          i && Object.defineProperty(r, n, i.get ? i : {
            enumerable: !0,
            get: () => s[n]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }));
}
function $t(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */
var pe = Is, Kt = Us, Br = wr.spawn, Vs = Ct;
Ct.XMLHttpRequest = Ct;
function Ct(r) {
  r = r || {};
  var e = this, t = Ms, s = qs, n, i, o = {}, h = !1, a = {
    "User-Agent": "node-XMLHttpRequest",
    Accept: "*/*"
  }, l = Object.assign({}, a), u = [
    "accept-charset",
    "accept-encoding",
    "access-control-request-headers",
    "access-control-request-method",
    "connection",
    "content-length",
    "content-transfer-encoding",
    "cookie",
    "cookie2",
    "date",
    "expect",
    "host",
    "keep-alive",
    "origin",
    "referer",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "via"
  ], c = [
    "TRACE",
    "TRACK",
    "CONNECT"
  ], f = !1, p = !1, y = !1, m = {};
  this.UNSENT = 0, this.OPENED = 1, this.HEADERS_RECEIVED = 2, this.LOADING = 3, this.DONE = 4, this.readyState = this.UNSENT, this.onreadystatechange = null, this.responseText = "", this.responseXML = "", this.response = Buffer.alloc(0), this.status = null, this.statusText = null;
  var w = function(d) {
    return h || d && u.indexOf(d.toLowerCase()) === -1;
  }, k = function(d) {
    return d && c.indexOf(d) === -1;
  };
  this.open = function(d, _, T, P, B) {
    if (this.abort(), p = !1, y = !1, !k(d))
      throw new Error("SecurityError: Request method not allowed");
    o = {
      method: d,
      url: _.toString(),
      async: typeof T != "boolean" ? !0 : T,
      user: P || null,
      password: B || null
    }, O(this.OPENED);
  }, this.setDisableHeaderCheck = function(d) {
    h = d;
  }, this.setRequestHeader = function(d, _) {
    if (this.readyState != this.OPENED)
      throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
    if (!w(d))
      return console.warn('Refused to set unsafe header "' + d + '"'), !1;
    if (f)
      throw new Error("INVALID_STATE_ERR: send flag is true");
    return l[d] = _, !0;
  }, this.getResponseHeader = function(d) {
    return typeof d == "string" && this.readyState > this.OPENED && i.headers[d.toLowerCase()] && !p ? i.headers[d.toLowerCase()] : null;
  }, this.getAllResponseHeaders = function() {
    if (this.readyState < this.HEADERS_RECEIVED || p)
      return "";
    var d = "";
    for (var _ in i.headers)
      _ !== "set-cookie" && _ !== "set-cookie2" && (d += _ + ": " + i.headers[_] + `\r
`);
    return d.substr(0, d.length - 2);
  }, this.getRequestHeader = function(d) {
    return typeof d == "string" && l[d] ? l[d] : "";
  }, this.send = function(d) {
    if (this.readyState != this.OPENED)
      throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
    if (f)
      throw new Error("INVALID_STATE_ERR: send has already been called");
    var _ = !1, T = !1, P = Kt.parse(o.url), B;
    switch (P.protocol) {
      case "https:":
        _ = !0;
      case "http:":
        B = P.hostname;
        break;
      case "file:":
        T = !0;
        break;
      case void 0:
      case "":
        B = "localhost";
        break;
      default:
        throw new Error("Protocol not supported.");
    }
    if (T) {
      if (o.method !== "GET")
        throw new Error("XMLHttpRequest: Only GET method is supported");
      if (o.async)
        pe.readFile(unescape(P.pathname), function(D, Z) {
          D ? e.handleError(D, D.errno || -1) : (e.status = 200, e.responseText = Z.toString("utf8"), e.response = Z, O(e.DONE));
        });
      else
        try {
          this.response = pe.readFileSync(unescape(P.pathname)), this.responseText = this.response.toString("utf8"), this.status = 200, O(e.DONE);
        } catch (D) {
          this.handleError(D, D.errno || -1);
        }
      return;
    }
    var G = P.port || (_ ? 443 : 80), z = P.pathname + (P.search ? P.search : "");
    if (l.Host = B, _ && G === 443 || G === 80 || (l.Host += ":" + P.port), o.user) {
      typeof o.password > "u" && (o.password = "");
      var ce = new Buffer(o.user + ":" + o.password);
      l.Authorization = "Basic " + ce.toString("base64");
    }
    if (o.method === "GET" || o.method === "HEAD")
      d = null;
    else if (d) {
      l["Content-Length"] = Buffer.isBuffer(d) ? d.length : Buffer.byteLength(d);
      var E = Object.keys(l);
      E.some(function(D) {
        return D.toLowerCase() === "content-type";
      }) || (l["Content-Type"] = "text/plain;charset=UTF-8");
    } else o.method === "POST" && (l["Content-Length"] = 0);
    var x = r.agent || !1, g = {
      host: B,
      port: G,
      path: z,
      method: o.method,
      headers: l,
      agent: x
    };
    if (_ && (g.pfx = r.pfx, g.key = r.key, g.passphrase = r.passphrase, g.cert = r.cert, g.ca = r.ca, g.ciphers = r.ciphers, g.rejectUnauthorized = r.rejectUnauthorized !== !1), p = !1, o.async) {
      var L = _ ? s.request : t.request;
      f = !0, e.dispatchEvent("readystatechange");
      var Y = function(D) {
        if (i = D, i.statusCode === 302 || i.statusCode === 303 || i.statusCode === 307) {
          o.url = i.headers.location;
          var Z = Kt.parse(o.url);
          B = Z.hostname;
          var $ = {
            hostname: Z.hostname,
            port: Z.port,
            path: Z.path,
            method: i.statusCode === 303 ? "GET" : o.method,
            headers: l
          };
          _ && ($.pfx = r.pfx, $.key = r.key, $.passphrase = r.passphrase, $.cert = r.cert, $.ca = r.ca, $.ciphers = r.ciphers, $.rejectUnauthorized = r.rejectUnauthorized !== !1), n = L($, Y).on("error", R), n.end();
          return;
        }
        O(e.HEADERS_RECEIVED), e.status = i.statusCode, i.on("data", function(Le) {
          if (Le) {
            var yr = Buffer.from(Le);
            e.response = Buffer.concat([e.response, yr]);
          }
          f && O(e.LOADING);
        }), i.on("end", function() {
          f && (f = !1, O(e.DONE), e.responseText = e.response.toString("utf8"));
        }), i.on("error", function(Le) {
          e.handleError(Le);
        });
      }, R = function(D) {
        if (n.reusedSocket && D.code === "ECONNRESET")
          return L(g, Y).on("error", R);
        e.handleError(D);
      };
      n = L(g, Y).on("error", R), r.autoUnref && n.on("socket", (D) => {
        D.unref();
      }), d && n.write(d), n.end(), e.dispatchEvent("loadstart");
    } else {
      var he = ".node-xmlhttprequest-content-" + process.pid, se = ".node-xmlhttprequest-sync-" + process.pid;
      pe.writeFileSync(se, "", "utf8");
      for (var be = "var http = require('http'), https = require('https'), fs = require('fs');var doRequest = http" + (_ ? "s" : "") + ".request;var options = " + JSON.stringify(g) + ";var responseText = '';var responseData = Buffer.alloc(0);var req = doRequest(options, function(response) {response.on('data', function(chunk) {  var data = Buffer.from(chunk);  responseText += data.toString('utf8');  responseData = Buffer.concat([responseData, data]);});response.on('end', function() {fs.writeFileSync('" + he + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText, data: responseData.toString('base64')}}), 'utf8');fs.unlinkSync('" + se + "');});response.on('error', function(error) {fs.writeFileSync('" + he + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');fs.unlinkSync('" + se + "');});}).on('error', function(error) {fs.writeFileSync('" + he + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');fs.unlinkSync('" + se + "');});" + (d ? "req.write('" + JSON.stringify(d).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();", at = Br(process.argv[0], ["-e", be]); pe.existsSync(se); )
        ;
      if (e.responseText = pe.readFileSync(he, "utf8"), at.stdin.end(), pe.unlinkSync(he), e.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
        var Ne = JSON.parse(e.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, ""));
        e.handleError(Ne, 503);
      } else {
        e.status = e.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, "$1");
        var de = JSON.parse(e.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/, "$1"));
        i = {
          statusCode: e.status,
          headers: de.data.headers
        }, e.responseText = de.data.text, e.response = Buffer.from(de.data.data, "base64"), O(e.DONE);
      }
    }
  }, this.handleError = function(d, _) {
    this.status = _ || 0, this.statusText = d, this.responseText = d.stack, p = !0, O(this.DONE);
  }, this.abort = function() {
    n && (n.abort(), n = null), l = Object.assign({}, a), this.responseText = "", this.responseXML = "", this.response = Buffer.alloc(0), p = y = !0, this.readyState !== this.UNSENT && (this.readyState !== this.OPENED || f) && this.readyState !== this.DONE && (f = !1, O(this.DONE)), this.readyState = this.UNSENT;
  }, this.addEventListener = function(d, _) {
    d in m || (m[d] = []), m[d].push(_);
  }, this.removeEventListener = function(d, _) {
    d in m && (m[d] = m[d].filter(function(T) {
      return T !== _;
    }));
  }, this.dispatchEvent = function(d) {
    if (typeof e["on" + d] == "function" && (this.readyState === this.DONE && o.async ? setTimeout(function() {
      e["on" + d]();
    }, 0) : e["on" + d]()), d in m)
      for (let _ = 0, T = m[d].length; _ < T; _++)
        this.readyState === this.DONE ? setTimeout(function() {
          m[d][_].call(e);
        }, 0) : m[d][_].call(e);
  };
  var O = function(d) {
    if (!(e.readyState === d || e.readyState === e.UNSENT && y) && (e.readyState = d, (o.async || e.readyState < e.OPENED || e.readyState === e.DONE) && e.dispatchEvent("readystatechange"), e.readyState === e.DONE)) {
      let _;
      y ? _ = "abort" : p ? _ = "error" : _ = "load", e.dispatchEvent(_), e.dispatchEvent("loadend");
    }
  };
}
const js = /* @__PURE__ */ $t(Vs), Pr = /* @__PURE__ */ Ar({
  __proto__: null,
  default: js
}, [Vs]), Q = /* @__PURE__ */ Object.create(null);
Q.open = "0";
Q.close = "1";
Q.ping = "2";
Q.pong = "3";
Q.message = "4";
Q.upgrade = "5";
Q.noop = "6";
const We = /* @__PURE__ */ Object.create(null);
Object.keys(Q).forEach((r) => {
  We[Q[r]] = r;
});
const Ot = { type: "error", data: "parser error" }, Vt = ({ type: r, data: e }, t, s) => e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? s(t ? e : "b" + Hs(e, !0).toString("base64")) : s(Q[r] + (e || "")), Hs = (r, e) => Buffer.isBuffer(r) || r instanceof Uint8Array && !e ? r : r instanceof ArrayBuffer ? Buffer.from(r) : Buffer.from(r.buffer, r.byteOffset, r.byteLength);
let ct;
function Dr(r, e) {
  if (r.data instanceof ArrayBuffer || ArrayBuffer.isView(r.data))
    return e(Hs(r.data, !1));
  Vt(r, !0, (t) => {
    ct || (ct = new TextEncoder()), e(ct.encode(t));
  });
}
const jt = (r, e) => {
  if (typeof r != "string")
    return {
      type: "message",
      data: Xt(r, e)
    };
  const t = r.charAt(0);
  if (t === "b") {
    const s = Buffer.from(r.substring(1), "base64");
    return {
      type: "message",
      data: Xt(s, e)
    };
  }
  return We[t] ? r.length > 1 ? {
    type: We[t],
    data: r.substring(1)
  } : {
    type: We[t]
  } : Ot;
}, Xt = (r, e) => {
  switch (e) {
    case "arraybuffer":
      return r instanceof ArrayBuffer ? r : Buffer.isBuffer(r) ? r.buffer.slice(r.byteOffset, r.byteOffset + r.byteLength) : r.buffer;
    case "nodebuffer":
    default:
      return Buffer.isBuffer(r) ? r : Buffer.from(r);
  }
}, Ws = "", Fr = (r, e) => {
  const t = r.length, s = new Array(t);
  let n = 0;
  r.forEach((i, o) => {
    Vt(i, !1, (h) => {
      s[o] = h, ++n === t && e(s.join(Ws));
    });
  });
}, Ir = (r, e) => {
  const t = r.split(Ws), s = [];
  for (let n = 0; n < t.length; n++) {
    const i = jt(t[n], e);
    if (s.push(i), i.type === "error")
      break;
  }
  return s;
};
function Ur() {
  return new TransformStream({
    transform(r, e) {
      Dr(r, (t) => {
        const s = t.length;
        let n;
        if (s < 126)
          n = new Uint8Array(1), new DataView(n.buffer).setUint8(0, s);
        else if (s < 65536) {
          n = new Uint8Array(3);
          const i = new DataView(n.buffer);
          i.setUint8(0, 126), i.setUint16(1, s);
        } else {
          n = new Uint8Array(9);
          const i = new DataView(n.buffer);
          i.setUint8(0, 127), i.setBigUint64(1, BigInt(s));
        }
        r.data && typeof r.data != "string" && (n[0] |= 128), e.enqueue(n), e.enqueue(t);
      });
    }
  });
}
let ht;
function Ae(r) {
  return r.reduce((e, t) => e + t.length, 0);
}
function Be(r, e) {
  if (r[0].length === e)
    return r.shift();
  const t = new Uint8Array(e);
  let s = 0;
  for (let n = 0; n < e; n++)
    t[n] = r[0][s++], s === r[0].length && (r.shift(), s = 0);
  return r.length && s < r[0].length && (r[0] = r[0].slice(s)), t;
}
function Mr(r, e) {
  ht || (ht = new TextDecoder());
  const t = [];
  let s = 0, n = -1, i = !1;
  return new TransformStream({
    transform(o, h) {
      for (t.push(o); ; ) {
        if (s === 0) {
          if (Ae(t) < 1)
            break;
          const a = Be(t, 1);
          i = (a[0] & 128) === 128, n = a[0] & 127, n < 126 ? s = 3 : n === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (Ae(t) < 2)
            break;
          const a = Be(t, 2);
          n = new DataView(a.buffer, a.byteOffset, a.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (Ae(t) < 8)
            break;
          const a = Be(t, 8), l = new DataView(a.buffer, a.byteOffset, a.length), u = l.getUint32(0);
          if (u > Math.pow(2, 21) - 1) {
            h.enqueue(Ot);
            break;
          }
          n = u * Math.pow(2, 32) + l.getUint32(4), s = 3;
        } else {
          if (Ae(t) < n)
            break;
          const a = Be(t, n);
          h.enqueue(jt(i ? a : ht.decode(a), e)), s = 0;
        }
        if (n === 0 || n > r) {
          h.enqueue(Ot);
          break;
        }
      }
    }
  });
}
const Gs = 4;
function N(r) {
  if (r) return qr(r);
}
function qr(r) {
  for (var e in N.prototype)
    r[e] = N.prototype[e];
  return r;
}
N.prototype.on = N.prototype.addEventListener = function(r, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + r] = this._callbacks["$" + r] || []).push(e), this;
};
N.prototype.once = function(r, e) {
  function t() {
    this.off(r, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(r, t), this;
};
N.prototype.off = N.prototype.removeListener = N.prototype.removeAllListeners = N.prototype.removeEventListener = function(r, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + r];
  if (!t) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + r], this;
  for (var s, n = 0; n < t.length; n++)
    if (s = t[n], s === e || s.fn === e) {
      t.splice(n, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + r], this;
};
N.prototype.emit = function(r) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + r], s = 1; s < arguments.length; s++)
    e[s - 1] = arguments[s];
  if (t) {
    t = t.slice(0);
    for (var s = 0, n = t.length; s < n; ++s)
      t[s].apply(this, e);
  }
  return this;
};
N.prototype.emitReserved = N.prototype.emit;
N.prototype.listeners = function(r) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + r] || [];
};
N.prototype.hasListeners = function(r) {
  return !!this.listeners(r).length;
};
const et = process.nextTick, X = global, $r = "nodebuffer";
function Vr() {
  return new Hr();
}
function jr(r) {
  const e = r.split("; "), t = e[0].indexOf("=");
  if (t === -1)
    return;
  const s = e[0].substring(0, t).trim();
  if (!s.length)
    return;
  let n = e[0].substring(t + 1).trim();
  n.charCodeAt(0) === 34 && (n = n.slice(1, -1));
  const i = {
    name: s,
    value: n
  };
  for (let o = 1; o < e.length; o++) {
    const h = e[o].split("=");
    if (h.length !== 2)
      continue;
    const a = h[0].trim(), l = h[1].trim();
    switch (a) {
      case "Expires":
        i.expires = new Date(l);
        break;
      case "Max-Age":
        const u = /* @__PURE__ */ new Date();
        u.setUTCSeconds(u.getUTCSeconds() + parseInt(l, 10)), i.expires = u;
        break;
    }
  }
  return i;
}
class Hr {
  constructor() {
    this._cookies = /* @__PURE__ */ new Map();
  }
  parseCookies(e) {
    e && e.forEach((t) => {
      const s = jr(t);
      s && this._cookies.set(s.name, s);
    });
  }
  get cookies() {
    const e = Date.now();
    return this._cookies.forEach((t, s) => {
      var n;
      ((n = t.expires) === null || n === void 0 ? void 0 : n.getTime()) < e && this._cookies.delete(s);
    }), this._cookies.entries();
  }
  addCookies(e) {
    const t = [];
    for (const [s, n] of this.cookies)
      t.push(`${s}=${n.value}`);
    t.length && (e.setDisableHeaderCheck(!0), e.setRequestHeader("cookie", t.join("; ")));
  }
  appendCookies(e) {
    for (const [t, s] of this.cookies)
      e.append("cookie", `${t}=${s.value}`);
  }
}
function zs(r, ...e) {
  return e.reduce((t, s) => (r.hasOwnProperty(s) && (t[s] = r[s]), t), {});
}
const Wr = X.setTimeout, Gr = X.clearTimeout;
function tt(r, e) {
  e.useNativeTimers ? (r.setTimeoutFn = Wr.bind(X), r.clearTimeoutFn = Gr.bind(X)) : (r.setTimeoutFn = X.setTimeout.bind(X), r.clearTimeoutFn = X.clearTimeout.bind(X));
}
const zr = 1.33;
function Yr(r) {
  return typeof r == "string" ? Kr(r) : Math.ceil((r.byteLength || r.size) * zr);
}
function Kr(r) {
  let e = 0, t = 0;
  for (let s = 0, n = r.length; s < n; s++)
    e = r.charCodeAt(s), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (s++, t += 4);
  return t;
}
function Ys() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Xr(r) {
  let e = "";
  for (let t in r)
    r.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(r[t]));
  return e;
}
function Jr(r) {
  let e = {}, t = r.split("&");
  for (let s = 0, n = t.length; s < n; s++) {
    let i = t[s].split("=");
    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
  }
  return e;
}
var Tt = { exports: {} }, Pe = { exports: {} }, lt, Jt;
function Qr() {
  if (Jt) return lt;
  Jt = 1;
  var r = 1e3, e = r * 60, t = e * 60, s = t * 24, n = s * 7, i = s * 365.25;
  lt = function(u, c) {
    c = c || {};
    var f = typeof u;
    if (f === "string" && u.length > 0)
      return o(u);
    if (f === "number" && isFinite(u))
      return c.long ? a(u) : h(u);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(u)
    );
  };
  function o(u) {
    if (u = String(u), !(u.length > 100)) {
      var c = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        u
      );
      if (c) {
        var f = parseFloat(c[1]), p = (c[2] || "ms").toLowerCase();
        switch (p) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return f * i;
          case "weeks":
          case "week":
          case "w":
            return f * n;
          case "days":
          case "day":
          case "d":
            return f * s;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return f * t;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return f * e;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return f * r;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return f;
          default:
            return;
        }
      }
    }
  }
  function h(u) {
    var c = Math.abs(u);
    return c >= s ? Math.round(u / s) + "d" : c >= t ? Math.round(u / t) + "h" : c >= e ? Math.round(u / e) + "m" : c >= r ? Math.round(u / r) + "s" : u + "ms";
  }
  function a(u) {
    var c = Math.abs(u);
    return c >= s ? l(u, c, s, "day") : c >= t ? l(u, c, t, "hour") : c >= e ? l(u, c, e, "minute") : c >= r ? l(u, c, r, "second") : u + " ms";
  }
  function l(u, c, f, p) {
    var y = c >= f * 1.5;
    return Math.round(u / f) + " " + p + (y ? "s" : "");
  }
  return lt;
}
var ft, Qt;
function Ks() {
  if (Qt) return ft;
  Qt = 1;
  function r(e) {
    s.debug = s, s.default = s, s.coerce = l, s.disable = o, s.enable = i, s.enabled = h, s.humanize = Qr(), s.destroy = u, Object.keys(e).forEach((c) => {
      s[c] = e[c];
    }), s.names = [], s.skips = [], s.formatters = {};
    function t(c) {
      let f = 0;
      for (let p = 0; p < c.length; p++)
        f = (f << 5) - f + c.charCodeAt(p), f |= 0;
      return s.colors[Math.abs(f) % s.colors.length];
    }
    s.selectColor = t;
    function s(c) {
      let f, p = null, y, m;
      function w(...k) {
        if (!w.enabled)
          return;
        const O = w, d = Number(/* @__PURE__ */ new Date()), _ = d - (f || d);
        O.diff = _, O.prev = f, O.curr = d, f = d, k[0] = s.coerce(k[0]), typeof k[0] != "string" && k.unshift("%O");
        let T = 0;
        k[0] = k[0].replace(/%([a-zA-Z%])/g, (B, G) => {
          if (B === "%%")
            return "%";
          T++;
          const z = s.formatters[G];
          if (typeof z == "function") {
            const ce = k[T];
            B = z.call(O, ce), k.splice(T, 1), T--;
          }
          return B;
        }), s.formatArgs.call(O, k), (O.log || s.log).apply(O, k);
      }
      return w.namespace = c, w.useColors = s.useColors(), w.color = s.selectColor(c), w.extend = n, w.destroy = s.destroy, Object.defineProperty(w, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => p !== null ? p : (y !== s.namespaces && (y = s.namespaces, m = s.enabled(c)), m),
        set: (k) => {
          p = k;
        }
      }), typeof s.init == "function" && s.init(w), w;
    }
    function n(c, f) {
      const p = s(this.namespace + (typeof f > "u" ? ":" : f) + c);
      return p.log = this.log, p;
    }
    function i(c) {
      s.save(c), s.namespaces = c, s.names = [], s.skips = [];
      let f;
      const p = (typeof c == "string" ? c : "").split(/[\s,]+/), y = p.length;
      for (f = 0; f < y; f++)
        p[f] && (c = p[f].replace(/\*/g, ".*?"), c[0] === "-" ? s.skips.push(new RegExp("^" + c.slice(1) + "$")) : s.names.push(new RegExp("^" + c + "$")));
    }
    function o() {
      const c = [
        ...s.names.map(a),
        ...s.skips.map(a).map((f) => "-" + f)
      ].join(",");
      return s.enable(""), c;
    }
    function h(c) {
      if (c[c.length - 1] === "*")
        return !0;
      let f, p;
      for (f = 0, p = s.skips.length; f < p; f++)
        if (s.skips[f].test(c))
          return !1;
      for (f = 0, p = s.names.length; f < p; f++)
        if (s.names[f].test(c))
          return !0;
      return !1;
    }
    function a(c) {
      return c.toString().substring(2, c.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    function l(c) {
      return c instanceof Error ? c.stack || c.message : c;
    }
    function u() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return s.enable(s.load()), s;
  }
  return ft = r, ft;
}
var Zt;
function Zr() {
  return Zt || (Zt = 1, function(r, e) {
    e.formatArgs = s, e.save = n, e.load = i, e.useColors = t, e.storage = o(), e.destroy = /* @__PURE__ */ (() => {
      let a = !1;
      return () => {
        a || (a = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), e.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function t() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let a;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (a = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(a[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function s(a) {
      if (a[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + a[0] + (this.useColors ? "%c " : " ") + "+" + r.exports.humanize(this.diff), !this.useColors)
        return;
      const l = "color: " + this.color;
      a.splice(1, 0, l, "color: inherit");
      let u = 0, c = 0;
      a[0].replace(/%[a-zA-Z%]/g, (f) => {
        f !== "%%" && (u++, f === "%c" && (c = u));
      }), a.splice(c, 0, l);
    }
    e.log = console.debug || console.log || (() => {
    });
    function n(a) {
      try {
        a ? e.storage.setItem("debug", a) : e.storage.removeItem("debug");
      } catch {
      }
    }
    function i() {
      let a;
      try {
        a = e.storage.getItem("debug");
      } catch {
      }
      return !a && typeof process < "u" && "env" in process && (a = process.env.DEBUG), a;
    }
    function o() {
      try {
        return localStorage;
      } catch {
      }
    }
    r.exports = Ks()(e);
    const { formatters: h } = r.exports;
    h.j = function(a) {
      try {
        return JSON.stringify(a);
      } catch (l) {
        return "[UnexpectedJSONParseError]: " + l.message;
      }
    };
  }(Pe, Pe.exports)), Pe.exports;
}
var De = { exports: {} }, ut, es;
function en() {
  return es || (es = 1, ut = (r, e) => {
    e = e || process.argv;
    const t = r.startsWith("-") ? "" : r.length === 1 ? "-" : "--", s = e.indexOf(t + r), n = e.indexOf("--");
    return s !== -1 && (n === -1 ? !0 : s < n);
  }), ut;
}
var dt, ts;
function tn() {
  if (ts) return dt;
  ts = 1;
  const r = $s, e = en(), t = process.env;
  let s;
  e("no-color") || e("no-colors") || e("color=false") ? s = !1 : (e("color") || e("colors") || e("color=true") || e("color=always")) && (s = !0), "FORCE_COLOR" in t && (s = t.FORCE_COLOR.length === 0 || parseInt(t.FORCE_COLOR, 10) !== 0);
  function n(h) {
    return h === 0 ? !1 : {
      level: h,
      hasBasic: !0,
      has256: h >= 2,
      has16m: h >= 3
    };
  }
  function i(h) {
    if (s === !1)
      return 0;
    if (e("color=16m") || e("color=full") || e("color=truecolor"))
      return 3;
    if (e("color=256"))
      return 2;
    if (h && !h.isTTY && s !== !0)
      return 0;
    const a = s ? 1 : 0;
    if (process.platform === "win32") {
      const l = r.release().split(".");
      return Number(process.versions.node.split(".")[0]) >= 8 && Number(l[0]) >= 10 && Number(l[2]) >= 10586 ? Number(l[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in t)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some((l) => l in t) || t.CI_NAME === "codeship" ? 1 : a;
    if ("TEAMCITY_VERSION" in t)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(t.TEAMCITY_VERSION) ? 1 : 0;
    if (t.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in t) {
      const l = parseInt((t.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (t.TERM_PROGRAM) {
        case "iTerm.app":
          return l >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(t.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(t.TERM) || "COLORTERM" in t ? 1 : (t.TERM === "dumb", a);
  }
  function o(h) {
    const a = i(h);
    return n(a);
  }
  return dt = {
    supportsColor: o,
    stdout: o(process.stdout),
    stderr: o(process.stderr)
  }, dt;
}
var ss;
function sn() {
  return ss || (ss = 1, function(r, e) {
    const t = Sr, s = kr;
    e.init = u, e.log = h, e.formatArgs = i, e.save = a, e.load = l, e.useColors = n, e.destroy = s.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), e.colors = [6, 2, 3, 4, 5, 1];
    try {
      const f = tn();
      f && (f.stderr || f).level >= 2 && (e.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    e.inspectOpts = Object.keys(process.env).filter((f) => /^debug_/i.test(f)).reduce((f, p) => {
      const y = p.substring(6).toLowerCase().replace(/_([a-z])/g, (w, k) => k.toUpperCase());
      let m = process.env[p];
      return /^(yes|on|true|enabled)$/i.test(m) ? m = !0 : /^(no|off|false|disabled)$/i.test(m) ? m = !1 : m === "null" ? m = null : m = Number(m), f[y] = m, f;
    }, {});
    function n() {
      return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : t.isatty(process.stderr.fd);
    }
    function i(f) {
      const { namespace: p, useColors: y } = this;
      if (y) {
        const m = this.color, w = "\x1B[3" + (m < 8 ? m : "8;5;" + m), k = `  ${w};1m${p} \x1B[0m`;
        f[0] = k + f[0].split(`
`).join(`
` + k), f.push(w + "m+" + r.exports.humanize(this.diff) + "\x1B[0m");
      } else
        f[0] = o() + p + " " + f[0];
    }
    function o() {
      return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function h(...f) {
      return process.stderr.write(s.formatWithOptions(e.inspectOpts, ...f) + `
`);
    }
    function a(f) {
      f ? process.env.DEBUG = f : delete process.env.DEBUG;
    }
    function l() {
      return process.env.DEBUG;
    }
    function u(f) {
      f.inspectOpts = {};
      const p = Object.keys(e.inspectOpts);
      for (let y = 0; y < p.length; y++)
        f.inspectOpts[p[y]] = e.inspectOpts[p[y]];
    }
    r.exports = Ks()(e);
    const { formatters: c } = r.exports;
    c.o = function(f) {
      return this.inspectOpts.colors = this.useColors, s.inspect(f, this.inspectOpts).split(`
`).map((p) => p.trim()).join(" ");
    }, c.O = function(f) {
      return this.inspectOpts.colors = this.useColors, s.inspect(f, this.inspectOpts);
    };
  }(De, De.exports)), De.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Tt.exports = Zr() : Tt.exports = sn();
var rn = Tt.exports;
const W = /* @__PURE__ */ $t(rn), nn = W("engine.io-client:transport");
class on extends Error {
  constructor(e, t, s) {
    super(e), this.description = t, this.context = s, this.type = "TransportError";
  }
}
class Ht extends N {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, tt(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, s) {
    return super.emitReserved("error", new on(e, t, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" ? this.write(e) : nn("transport is not open, discarding packets");
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = jt(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = Xr(e);
    return t.length ? "?" + t : "";
  }
}
const V = W("engine.io-client:polling");
class an extends Ht {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      V("paused"), this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (V("we are currently polling - waiting to pause"), s++, this.once("pollComplete", function() {
        V("pre-pause polling complete"), --s || t();
      })), this.writable || (V("we are currently writing - waiting to pause"), s++, this.once("drain", function() {
        V("pre-pause writing complete"), --s || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    V("polling"), this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    V("polling got data %s", e);
    const t = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    Ir(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" ? this._poll() : V('ignoring poll - transport state "%s"', this.readyState));
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      V("writing close packet"), this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? (V("transport open - closing"), e()) : (V("transport not open - deferring close"), this.once("open", e));
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, Fr(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = Ys()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
}
let Xs = !1;
try {
  Xs = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const cn = Xs, Rt = W("engine.io-client:polling");
function hn() {
}
class ln extends an {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const t = location.protocol === "https:";
      let s = location.port;
      s || (s = t ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || s !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const s = this.request({
      method: "POST",
      data: e
    });
    s.on("success", t), s.on("error", (n, i) => {
      this.onError("xhr post error", n, i);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    Rt("xhr poll");
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, s) => {
      this.onError("xhr poll error", t, s);
    }), this.pollXhr = e;
  }
}
class J extends N {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t, s) {
    super(), this.createRequest = e, tt(this, s), this._opts = s, this._method = s.method || "GET", this._uri = t, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const t = zs(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(t);
    try {
      Rt("xhr open %s: %s", this._method, this._uri), s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let n in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(n) && s.setRequestHeader(n, this._opts.extraHeaders[n]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var n;
        s.readyState === 3 && ((n = this._opts.cookieJar) === null || n === void 0 || n.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, Rt("xhr data %s", this._data), s.send(this._data);
    } catch (n) {
      this.setTimeoutFn(() => {
        this._onError(n);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = J.requestsCount++, J.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = hn, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete J.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
J.requestsCount = 0;
J.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", rs);
  else if (typeof addEventListener == "function") {
    const r = "onpagehide" in X ? "pagehide" : "unload";
    addEventListener(r, rs, !1);
  }
}
function rs() {
  for (let r in J.requests)
    J.requests.hasOwnProperty(r) && J.requests[r].abort();
}
(function() {
  const r = fn({
    xdomain: !1
  });
  return r && r.responseType !== null;
})();
function fn(r) {
  const e = r.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || cn))
      return new XMLHttpRequest();
  } catch {
  }
  try {
    return new X[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
  } catch {
  }
}
const un = js || Pr;
class dn extends ln {
  request(e = {}) {
    var t;
    return Object.assign(e, { xd: this.xd, cookieJar: (t = this.socket) === null || t === void 0 ? void 0 : t._cookieJar }, this.opts), new J((s) => new un(s), this.uri(), e);
  }
}
const { Duplex: Co } = Re;
var Je = { exports: {} }, ue = {
  BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
  EMPTY_BUFFER: Buffer.alloc(0),
  GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
  kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
  kListener: Symbol("kListener"),
  kStatusCode: Symbol("status-code"),
  kWebSocket: Symbol("websocket"),
  NOOP: () => {
  }
}, Fe = { exports: {} };
function Js(r) {
  throw new Error('Could not dynamically require "' + r + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ie = { exports: {} }, pt, ns;
function pn() {
  if (ns) return pt;
  ns = 1;
  var r = Is, e = Cr, t = $s, s = typeof __webpack_require__ == "function" ? __non_webpack_require__ : Js, n = process.config && process.config.variables || {}, i = !!process.env.PREBUILDS_ONLY, o = process.versions.modules, h = z() ? "electron" : G() ? "node-webkit" : "node", a = process.env.npm_config_arch || t.arch(), l = process.env.npm_config_platform || t.platform(), u = process.env.LIBC || (ce(l) ? "musl" : "glibc"), c = process.env.ARM_VERSION || (a === "arm64" ? "8" : n.arm_version) || "", f = (process.versions.uv || "").split(".")[0];
  pt = p;
  function p(E) {
    return s(p.resolve(E));
  }
  p.resolve = p.path = function(E) {
    E = e.resolve(E || ".");
    try {
      var x = s(e.join(E, "package.json")).name.toUpperCase().replace(/-/g, "_");
      process.env[x + "_PREBUILD"] && (E = process.env[x + "_PREBUILD"]);
    } catch {
    }
    if (!i) {
      var g = m(e.join(E, "build/Release"), w);
      if (g) return g;
      var L = m(e.join(E, "build/Debug"), w);
      if (L) return L;
    }
    var Y = se(E);
    if (Y) return Y;
    var R = se(e.dirname(process.execPath));
    if (R) return R;
    var he = [
      "platform=" + l,
      "arch=" + a,
      "runtime=" + h,
      "abi=" + o,
      "uv=" + f,
      c ? "armv=" + c : "",
      "libc=" + u,
      "node=" + process.versions.node,
      process.versions.electron ? "electron=" + process.versions.electron : "",
      typeof __webpack_require__ == "function" ? "webpack=true" : ""
      // eslint-disable-line
    ].filter(Boolean).join(" ");
    throw new Error("No native build was found for " + he + `
    loaded from: ` + E + `
`);
    function se(be) {
      var at = y(e.join(be, "prebuilds")).map(k), Ne = at.filter(O(l, a)).sort(d)[0];
      if (Ne) {
        var de = e.join(be, "prebuilds", Ne.name), D = y(de).map(_), Z = D.filter(T(h, o)), $ = Z.sort(B(h))[0];
        if ($) return e.join(de, $.file);
      }
    }
  };
  function y(E) {
    try {
      return r.readdirSync(E);
    } catch {
      return [];
    }
  }
  function m(E, x) {
    var g = y(E).filter(x);
    return g[0] && e.join(E, g[0]);
  }
  function w(E) {
    return /\.node$/.test(E);
  }
  function k(E) {
    var x = E.split("-");
    if (x.length === 2) {
      var g = x[0], L = x[1].split("+");
      if (g && L.length && L.every(Boolean))
        return { name: E, platform: g, architectures: L };
    }
  }
  function O(E, x) {
    return function(g) {
      return g == null || g.platform !== E ? !1 : g.architectures.includes(x);
    };
  }
  function d(E, x) {
    return E.architectures.length - x.architectures.length;
  }
  function _(E) {
    var x = E.split("."), g = x.pop(), L = { file: E, specificity: 0 };
    if (g === "node") {
      for (var Y = 0; Y < x.length; Y++) {
        var R = x[Y];
        if (R === "node" || R === "electron" || R === "node-webkit")
          L.runtime = R;
        else if (R === "napi")
          L.napi = !0;
        else if (R.slice(0, 3) === "abi")
          L.abi = R.slice(3);
        else if (R.slice(0, 2) === "uv")
          L.uv = R.slice(2);
        else if (R.slice(0, 4) === "armv")
          L.armv = R.slice(4);
        else if (R === "glibc" || R === "musl")
          L.libc = R;
        else
          continue;
        L.specificity++;
      }
      return L;
    }
  }
  function T(E, x) {
    return function(g) {
      return !(g == null || g.runtime && g.runtime !== E && !P(g) || g.abi && g.abi !== x && !g.napi || g.uv && g.uv !== f || g.armv && g.armv !== c || g.libc && g.libc !== u);
    };
  }
  function P(E) {
    return E.runtime === "node" && E.napi;
  }
  function B(E) {
    return function(x, g) {
      return x.runtime !== g.runtime ? x.runtime === E ? -1 : 1 : x.abi !== g.abi ? x.abi ? -1 : 1 : x.specificity !== g.specificity ? x.specificity > g.specificity ? -1 : 1 : 0;
    };
  }
  function G() {
    return !!(process.versions && process.versions.nw);
  }
  function z() {
    return process.versions && process.versions.electron || process.env.ELECTRON_RUN_AS_NODE ? !0 : typeof window < "u" && window.process && window.process.type === "renderer";
  }
  function ce(E) {
    return E === "linux" && r.existsSync("/etc/alpine-release");
  }
  return p.parseTags = _, p.matchTags = T, p.compareTags = B, p.parseTuple = k, p.matchTuple = O, p.compareTuples = d, pt;
}
var is;
function Qs() {
  if (is) return Ie.exports;
  is = 1;
  const r = typeof __webpack_require__ == "function" ? __non_webpack_require__ : Js;
  return typeof r.addon == "function" ? Ie.exports = r.addon.bind(r) : Ie.exports = pn(), Ie.exports;
}
var mt, os;
function mn() {
  return os || (os = 1, mt = { mask: (t, s, n, i, o) => {
    for (var h = 0; h < o; h++)
      n[i + h] = t[h] ^ s[h & 3];
  }, unmask: (t, s) => {
    const n = t.length;
    for (var i = 0; i < n; i++)
      t[i] ^= s[i & 3];
  } }), mt;
}
var as;
function _n() {
  if (as) return Fe.exports;
  as = 1;
  try {
    Fe.exports = Qs()(__dirname);
  } catch {
    Fe.exports = mn();
  }
  return Fe.exports;
}
var gn, yn;
const { EMPTY_BUFFER: vn } = ue, Nt = Buffer[Symbol.species];
function En(r, e) {
  if (r.length === 0) return vn;
  if (r.length === 1) return r[0];
  const t = Buffer.allocUnsafe(e);
  let s = 0;
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    t.set(i, s), s += i.length;
  }
  return s < e ? new Nt(t.buffer, t.byteOffset, s) : t;
}
function Zs(r, e, t, s, n) {
  for (let i = 0; i < n; i++)
    t[s + i] = r[i] ^ e[i & 3];
}
function er(r, e) {
  for (let t = 0; t < r.length; t++)
    r[t] ^= e[t & 3];
}
function bn(r) {
  return r.length === r.buffer.byteLength ? r.buffer : r.buffer.slice(r.byteOffset, r.byteOffset + r.length);
}
function Lt(r) {
  if (Lt.readOnly = !0, Buffer.isBuffer(r)) return r;
  let e;
  return r instanceof ArrayBuffer ? e = new Nt(r) : ArrayBuffer.isView(r) ? e = new Nt(r.buffer, r.byteOffset, r.byteLength) : (e = Buffer.from(r), Lt.readOnly = !1), e;
}
Je.exports = {
  concat: En,
  mask: Zs,
  toArrayBuffer: bn,
  toBuffer: Lt,
  unmask: er
};
if (!process.env.WS_NO_BUFFER_UTIL)
  try {
    const r = _n();
    yn = Je.exports.mask = function(e, t, s, n, i) {
      i < 48 ? Zs(e, t, s, n, i) : r.mask(e, t, s, n, i);
    }, gn = Je.exports.unmask = function(e, t) {
      e.length < 32 ? er(e, t) : r.unmask(e, t);
    };
  } catch {
  }
var st = Je.exports;
const cs = Symbol("kDone"), _t = Symbol("kRun");
let wn = class {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
   *     to run concurrently
   */
  constructor(e) {
    this[cs] = () => {
      this.pending--, this[_t]();
    }, this.concurrency = e || 1 / 0, this.jobs = [], this.pending = 0;
  }
  /**
   * Adds a job to the queue.
   *
   * @param {Function} job The job to run
   * @public
   */
  add(e) {
    this.jobs.push(e), this[_t]();
  }
  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [_t]() {
    if (this.pending !== this.concurrency && this.jobs.length) {
      const e = this.jobs.shift();
      this.pending++, e(this[cs]);
    }
  }
};
var Sn = wn;
const we = xr, hs = st, kn = Sn, { kStatusCode: tr } = ue, xn = Buffer[Symbol.species], Cn = Buffer.from([0, 0, 255, 255]), Qe = Symbol("permessage-deflate"), ee = Symbol("total-length"), Oe = Symbol("callback"), ne = Symbol("buffers"), Ge = Symbol("error");
let Ue, On = class {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} [options] Configuration options
   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
   *     for, or request, a custom client window size
   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
   *     acknowledge disabling of client context takeover
   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
   *     calls to zlib
   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
   *     use of a custom server window size
   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
   *     disabling of server context takeover
   * @param {Number} [options.threshold=1024] Size (in bytes) below which
   *     messages should not be compressed if context takeover is disabled
   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
   *     deflate
   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
   *     inflate
   * @param {Boolean} [isServer=false] Create the instance in either server or
   *     client mode
   * @param {Number} [maxPayload=0] The maximum allowed message length
   */
  constructor(e, t, s) {
    if (this._maxPayload = s | 0, this._options = e || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!t, this._deflate = null, this._inflate = null, this.params = null, !Ue) {
      const n = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
      Ue = new kn(n);
    }
  }
  /**
   * @type {String}
   */
  static get extensionName() {
    return "permessage-deflate";
  }
  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const e = {};
    return this._options.serverNoContextTakeover && (e.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (e.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (e.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? e.client_max_window_bits = this._options.clientMaxWindowBits : this._options.clientMaxWindowBits == null && (e.client_max_window_bits = !0), e;
  }
  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(e) {
    return e = this.normalizeParams(e), this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e), this.params;
  }
  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate && (this._inflate.close(), this._inflate = null), this._deflate) {
      const e = this._deflate[Oe];
      this._deflate.close(), this._deflate = null, e && e(
        new Error(
          "The deflate stream was closed while data was being processed"
        )
      );
    }
  }
  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(e) {
    const t = this._options, s = e.find((n) => !(t.serverNoContextTakeover === !1 && n.server_no_context_takeover || n.server_max_window_bits && (t.serverMaxWindowBits === !1 || typeof t.serverMaxWindowBits == "number" && t.serverMaxWindowBits > n.server_max_window_bits) || typeof t.clientMaxWindowBits == "number" && !n.client_max_window_bits));
    if (!s)
      throw new Error("None of the extension offers can be accepted");
    return t.serverNoContextTakeover && (s.server_no_context_takeover = !0), t.clientNoContextTakeover && (s.client_no_context_takeover = !0), typeof t.serverMaxWindowBits == "number" && (s.server_max_window_bits = t.serverMaxWindowBits), typeof t.clientMaxWindowBits == "number" ? s.client_max_window_bits = t.clientMaxWindowBits : (s.client_max_window_bits === !0 || t.clientMaxWindowBits === !1) && delete s.client_max_window_bits, s;
  }
  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(e) {
    const t = e[0];
    if (this._options.clientNoContextTakeover === !1 && t.client_no_context_takeover)
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    if (!t.client_max_window_bits)
      typeof this._options.clientMaxWindowBits == "number" && (t.client_max_window_bits = this._options.clientMaxWindowBits);
    else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits == "number" && t.client_max_window_bits > this._options.clientMaxWindowBits)
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    return t;
  }
  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(e) {
    return e.forEach((t) => {
      Object.keys(t).forEach((s) => {
        let n = t[s];
        if (n.length > 1)
          throw new Error(`Parameter "${s}" must have only a single value`);
        if (n = n[0], s === "client_max_window_bits") {
          if (n !== !0) {
            const i = +n;
            if (!Number.isInteger(i) || i < 8 || i > 15)
              throw new TypeError(
                `Invalid value for parameter "${s}": ${n}`
              );
            n = i;
          } else if (!this._isServer)
            throw new TypeError(
              `Invalid value for parameter "${s}": ${n}`
            );
        } else if (s === "server_max_window_bits") {
          const i = +n;
          if (!Number.isInteger(i) || i < 8 || i > 15)
            throw new TypeError(
              `Invalid value for parameter "${s}": ${n}`
            );
          n = i;
        } else if (s === "client_no_context_takeover" || s === "server_no_context_takeover") {
          if (n !== !0)
            throw new TypeError(
              `Invalid value for parameter "${s}": ${n}`
            );
        } else
          throw new Error(`Unknown parameter "${s}"`);
        t[s] = n;
      });
    }), e;
  }
  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(e, t, s) {
    Ue.add((n) => {
      this._decompress(e, t, (i, o) => {
        n(), s(i, o);
      });
    });
  }
  /**
   * Compress data. Concurrency limited.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(e, t, s) {
    Ue.add((n) => {
      this._compress(e, t, (i, o) => {
        n(), s(i, o);
      });
    });
  }
  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(e, t, s) {
    const n = this._isServer ? "client" : "server";
    if (!this._inflate) {
      const i = `${n}_max_window_bits`, o = typeof this.params[i] != "number" ? we.Z_DEFAULT_WINDOWBITS : this.params[i];
      this._inflate = we.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits: o
      }), this._inflate[Qe] = this, this._inflate[ee] = 0, this._inflate[ne] = [], this._inflate.on("error", Rn), this._inflate.on("data", sr);
    }
    this._inflate[Oe] = s, this._inflate.write(e), t && this._inflate.write(Cn), this._inflate.flush(() => {
      const i = this._inflate[Ge];
      if (i) {
        this._inflate.close(), this._inflate = null, s(i);
        return;
      }
      const o = hs.concat(
        this._inflate[ne],
        this._inflate[ee]
      );
      this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[ee] = 0, this._inflate[ne] = [], t && this.params[`${n}_no_context_takeover`] && this._inflate.reset()), s(null, o);
    });
  }
  /**
   * Compress data.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(e, t, s) {
    const n = this._isServer ? "server" : "client";
    if (!this._deflate) {
      const i = `${n}_max_window_bits`, o = typeof this.params[i] != "number" ? we.Z_DEFAULT_WINDOWBITS : this.params[i];
      this._deflate = we.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits: o
      }), this._deflate[ee] = 0, this._deflate[ne] = [], this._deflate.on("data", Tn);
    }
    this._deflate[Oe] = s, this._deflate.write(e), this._deflate.flush(we.Z_SYNC_FLUSH, () => {
      if (!this._deflate)
        return;
      let i = hs.concat(
        this._deflate[ne],
        this._deflate[ee]
      );
      t && (i = new xn(i.buffer, i.byteOffset, i.length - 4)), this._deflate[Oe] = null, this._deflate[ee] = 0, this._deflate[ne] = [], t && this.params[`${n}_no_context_takeover`] && this._deflate.reset(), s(null, i);
    });
  }
};
var Wt = On;
function Tn(r) {
  this[ne].push(r), this[ee] += r.length;
}
function sr(r) {
  if (this[ee] += r.length, this[Qe]._maxPayload < 1 || this[ee] <= this[Qe]._maxPayload) {
    this[ne].push(r);
    return;
  }
  this[Ge] = new RangeError("Max payload size exceeded"), this[Ge].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[Ge][tr] = 1009, this.removeListener("data", sr), this.reset();
}
function Rn(r) {
  this[Qe]._inflate = null, r[tr] = 1007, this[Oe](r);
}
var Ze = { exports: {} }, Me = { exports: {} }, gt, ls;
function Nn() {
  if (ls) return gt;
  ls = 1;
  function r(e) {
    const t = e.length;
    let s = 0;
    for (; s < t; )
      if (!(e[s] & 128))
        s++;
      else if ((e[s] & 224) === 192) {
        if (s + 1 === t || (e[s + 1] & 192) !== 128 || (e[s] & 254) === 192)
          return !1;
        s += 2;
      } else if ((e[s] & 240) === 224) {
        if (s + 2 >= t || (e[s + 1] & 192) !== 128 || (e[s + 2] & 192) !== 128 || e[s] === 224 && (e[s + 1] & 224) === 128 || // overlong
        e[s] === 237 && (e[s + 1] & 224) === 160)
          return !1;
        s += 3;
      } else if ((e[s] & 248) === 240) {
        if (s + 3 >= t || (e[s + 1] & 192) !== 128 || (e[s + 2] & 192) !== 128 || (e[s + 3] & 192) !== 128 || e[s] === 240 && (e[s + 1] & 240) === 128 || // overlong
        e[s] === 244 && e[s + 1] > 143 || e[s] > 244)
          return !1;
        s += 4;
      } else
        return !1;
    return !0;
  }
  return gt = r, gt;
}
var fs;
function Ln() {
  if (fs) return Me.exports;
  fs = 1;
  try {
    Me.exports = Qs()(__dirname);
  } catch {
    Me.exports = Nn();
  }
  return Me.exports;
}
var us;
const { isUtf8: ds } = Or, An = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  // 0 - 15
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  // 16 - 31
  0,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  1,
  1,
  0,
  // 32 - 47
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  // 48 - 63
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  // 64 - 79
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  1,
  1,
  // 80 - 95
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  // 96 - 111
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  0,
  1,
  0
  // 112 - 127
];
function Bn(r) {
  return r >= 1e3 && r <= 1014 && r !== 1004 && r !== 1005 && r !== 1006 || r >= 3e3 && r <= 4999;
}
function At(r) {
  const e = r.length;
  let t = 0;
  for (; t < e; )
    if (!(r[t] & 128))
      t++;
    else if ((r[t] & 224) === 192) {
      if (t + 1 === e || (r[t + 1] & 192) !== 128 || (r[t] & 254) === 192)
        return !1;
      t += 2;
    } else if ((r[t] & 240) === 224) {
      if (t + 2 >= e || (r[t + 1] & 192) !== 128 || (r[t + 2] & 192) !== 128 || r[t] === 224 && (r[t + 1] & 224) === 128 || // Overlong
      r[t] === 237 && (r[t + 1] & 224) === 160)
        return !1;
      t += 3;
    } else if ((r[t] & 248) === 240) {
      if (t + 3 >= e || (r[t + 1] & 192) !== 128 || (r[t + 2] & 192) !== 128 || (r[t + 3] & 192) !== 128 || r[t] === 240 && (r[t + 1] & 240) === 128 || // Overlong
      r[t] === 244 && r[t + 1] > 143 || r[t] > 244)
        return !1;
      t += 4;
    } else
      return !1;
  return !0;
}
Ze.exports = {
  isValidStatusCode: Bn,
  isValidUTF8: At,
  tokenChars: An
};
if (ds)
  us = Ze.exports.isValidUTF8 = function(r) {
    return r.length < 24 ? At(r) : ds(r);
  };
else if (!process.env.WS_NO_UTF_8_VALIDATE)
  try {
    const r = Ln();
    us = Ze.exports.isValidUTF8 = function(e) {
      return e.length < 32 ? At(e) : r(e);
    };
  } catch {
  }
var rt = Ze.exports;
const { Writable: Pn } = Re, ps = Wt, {
  BINARY_TYPES: Dn,
  EMPTY_BUFFER: ms,
  kStatusCode: Fn,
  kWebSocket: In
} = ue, { concat: yt, toArrayBuffer: Un, unmask: Mn } = st, { isValidStatusCode: qn, isValidUTF8: _s } = rt, qe = Buffer[Symbol.species], q = 0, gs = 1, ys = 2, vs = 3, vt = 4, Et = 5, $e = 6;
let $n = class extends Pn {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} [options] Options object
   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {String} [options.binaryType=nodebuffer] The type for binary data
   * @param {Object} [options.extensions] An object containing the negotiated
   *     extensions
   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
   *     client or server mode
   * @param {Number} [options.maxPayload=0] The maximum allowed message length
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   */
  constructor(e = {}) {
    super(), this._allowSynchronousEvents = e.allowSynchronousEvents !== void 0 ? e.allowSynchronousEvents : !0, this._binaryType = e.binaryType || Dn[0], this._extensions = e.extensions || {}, this._isServer = !!e.isServer, this._maxPayload = e.maxPayload | 0, this._skipUTF8Validation = !!e.skipUTF8Validation, this[In] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = q;
  }
  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   * @private
   */
  _write(e, t, s) {
    if (this._opcode === 8 && this._state == q) return s();
    this._bufferedBytes += e.length, this._buffers.push(e), this.startLoop(s);
  }
  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(e) {
    if (this._bufferedBytes -= e, e === this._buffers[0].length) return this._buffers.shift();
    if (e < this._buffers[0].length) {
      const s = this._buffers[0];
      return this._buffers[0] = new qe(
        s.buffer,
        s.byteOffset + e,
        s.length - e
      ), new qe(s.buffer, s.byteOffset, e);
    }
    const t = Buffer.allocUnsafe(e);
    do {
      const s = this._buffers[0], n = t.length - e;
      e >= s.length ? t.set(this._buffers.shift(), n) : (t.set(new Uint8Array(s.buffer, s.byteOffset, e), n), this._buffers[0] = new qe(
        s.buffer,
        s.byteOffset + e,
        s.length - e
      )), e -= s.length;
    } while (e > 0);
    return t;
  }
  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(e) {
    this._loop = !0;
    do
      switch (this._state) {
        case q:
          this.getInfo(e);
          break;
        case gs:
          this.getPayloadLength16(e);
          break;
        case ys:
          this.getPayloadLength64(e);
          break;
        case vs:
          this.getMask();
          break;
        case vt:
          this.getData(e);
          break;
        case Et:
        case $e:
          this._loop = !1;
          return;
      }
    while (this._loop);
    this._errored || e();
  }
  /**
   * Reads the first two bytes of a frame.
   *
   * @param {Function} cb Callback
   * @private
   */
  getInfo(e) {
    if (this._bufferedBytes < 2) {
      this._loop = !1;
      return;
    }
    const t = this.consume(2);
    if (t[0] & 48) {
      const n = this.createError(
        RangeError,
        "RSV2 and RSV3 must be clear",
        !0,
        1002,
        "WS_ERR_UNEXPECTED_RSV_2_3"
      );
      e(n);
      return;
    }
    const s = (t[0] & 64) === 64;
    if (s && !this._extensions[ps.extensionName]) {
      const n = this.createError(
        RangeError,
        "RSV1 must be clear",
        !0,
        1002,
        "WS_ERR_UNEXPECTED_RSV_1"
      );
      e(n);
      return;
    }
    if (this._fin = (t[0] & 128) === 128, this._opcode = t[0] & 15, this._payloadLength = t[1] & 127, this._opcode === 0) {
      if (s) {
        const n = this.createError(
          RangeError,
          "RSV1 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        e(n);
        return;
      }
      if (!this._fragmented) {
        const n = this.createError(
          RangeError,
          "invalid opcode 0",
          !0,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        e(n);
        return;
      }
      this._opcode = this._fragmented;
    } else if (this._opcode === 1 || this._opcode === 2) {
      if (this._fragmented) {
        const n = this.createError(
          RangeError,
          `invalid opcode ${this._opcode}`,
          !0,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        e(n);
        return;
      }
      this._compressed = s;
    } else if (this._opcode > 7 && this._opcode < 11) {
      if (!this._fin) {
        const n = this.createError(
          RangeError,
          "FIN must be set",
          !0,
          1002,
          "WS_ERR_EXPECTED_FIN"
        );
        e(n);
        return;
      }
      if (s) {
        const n = this.createError(
          RangeError,
          "RSV1 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        e(n);
        return;
      }
      if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
        const n = this.createError(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          !0,
          1002,
          "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
        );
        e(n);
        return;
      }
    } else {
      const n = this.createError(
        RangeError,
        `invalid opcode ${this._opcode}`,
        !0,
        1002,
        "WS_ERR_INVALID_OPCODE"
      );
      e(n);
      return;
    }
    if (!this._fin && !this._fragmented && (this._fragmented = this._opcode), this._masked = (t[1] & 128) === 128, this._isServer) {
      if (!this._masked) {
        const n = this.createError(
          RangeError,
          "MASK must be set",
          !0,
          1002,
          "WS_ERR_EXPECTED_MASK"
        );
        e(n);
        return;
      }
    } else if (this._masked) {
      const n = this.createError(
        RangeError,
        "MASK must be clear",
        !0,
        1002,
        "WS_ERR_UNEXPECTED_MASK"
      );
      e(n);
      return;
    }
    this._payloadLength === 126 ? this._state = gs : this._payloadLength === 127 ? this._state = ys : this.haveLength(e);
  }
  /**
   * Gets extended payload length (7+16).
   *
   * @param {Function} cb Callback
   * @private
   */
  getPayloadLength16(e) {
    if (this._bufferedBytes < 2) {
      this._loop = !1;
      return;
    }
    this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(e);
  }
  /**
   * Gets extended payload length (7+64).
   *
   * @param {Function} cb Callback
   * @private
   */
  getPayloadLength64(e) {
    if (this._bufferedBytes < 8) {
      this._loop = !1;
      return;
    }
    const t = this.consume(8), s = t.readUInt32BE(0);
    if (s > Math.pow(2, 21) - 1) {
      const n = this.createError(
        RangeError,
        "Unsupported WebSocket frame: payload length > 2^53 - 1",
        !1,
        1009,
        "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
      );
      e(n);
      return;
    }
    this._payloadLength = s * Math.pow(2, 32) + t.readUInt32BE(4), this.haveLength(e);
  }
  /**
   * Payload length has been read.
   *
   * @param {Function} cb Callback
   * @private
   */
  haveLength(e) {
    if (this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)) {
      const t = this.createError(
        RangeError,
        "Max payload size exceeded",
        !1,
        1009,
        "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
      );
      e(t);
      return;
    }
    this._masked ? this._state = vs : this._state = vt;
  }
  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = !1;
      return;
    }
    this._mask = this.consume(4), this._state = vt;
  }
  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @private
   */
  getData(e) {
    let t = ms;
    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = !1;
        return;
      }
      t = this.consume(this._payloadLength), this._masked && this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3] && Mn(t, this._mask);
    }
    if (this._opcode > 7) {
      this.controlMessage(t, e);
      return;
    }
    if (this._compressed) {
      this._state = Et, this.decompress(t, e);
      return;
    }
    t.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(t)), this.dataMessage(e);
  }
  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(e, t) {
    this._extensions[ps.extensionName].decompress(e, this._fin, (n, i) => {
      if (n) return t(n);
      if (i.length) {
        if (this._messageLength += i.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
          const o = this.createError(
            RangeError,
            "Max payload size exceeded",
            !1,
            1009,
            "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
          );
          t(o);
          return;
        }
        this._fragments.push(i);
      }
      this.dataMessage(t), this._state === q && this.startLoop(t);
    });
  }
  /**
   * Handles a data message.
   *
   * @param {Function} cb Callback
   * @private
   */
  dataMessage(e) {
    if (!this._fin) {
      this._state = q;
      return;
    }
    const t = this._messageLength, s = this._fragments;
    if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
      let n;
      this._binaryType === "nodebuffer" ? n = yt(s, t) : this._binaryType === "arraybuffer" ? n = Un(yt(s, t)) : n = s, this._allowSynchronousEvents ? (this.emit("message", n, !0), this._state = q) : (this._state = $e, setImmediate(() => {
        this.emit("message", n, !0), this._state = q, this.startLoop(e);
      }));
    } else {
      const n = yt(s, t);
      if (!this._skipUTF8Validation && !_s(n)) {
        const i = this.createError(
          Error,
          "invalid UTF-8 sequence",
          !0,
          1007,
          "WS_ERR_INVALID_UTF8"
        );
        e(i);
        return;
      }
      this._state === Et || this._allowSynchronousEvents ? (this.emit("message", n, !1), this._state = q) : (this._state = $e, setImmediate(() => {
        this.emit("message", n, !1), this._state = q, this.startLoop(e);
      }));
    }
  }
  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(e, t) {
    if (this._opcode === 8) {
      if (e.length === 0)
        this._loop = !1, this.emit("conclude", 1005, ms), this.end();
      else {
        const s = e.readUInt16BE(0);
        if (!qn(s)) {
          const i = this.createError(
            RangeError,
            `invalid status code ${s}`,
            !0,
            1002,
            "WS_ERR_INVALID_CLOSE_CODE"
          );
          t(i);
          return;
        }
        const n = new qe(
          e.buffer,
          e.byteOffset + 2,
          e.length - 2
        );
        if (!this._skipUTF8Validation && !_s(n)) {
          const i = this.createError(
            Error,
            "invalid UTF-8 sequence",
            !0,
            1007,
            "WS_ERR_INVALID_UTF8"
          );
          t(i);
          return;
        }
        this._loop = !1, this.emit("conclude", s, n), this.end();
      }
      this._state = q;
      return;
    }
    this._allowSynchronousEvents ? (this.emit(this._opcode === 9 ? "ping" : "pong", e), this._state = q) : (this._state = $e, setImmediate(() => {
      this.emit(this._opcode === 9 ? "ping" : "pong", e), this._state = q, this.startLoop(t);
    }));
  }
  /**
   * Builds an error object.
   *
   * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
   * @param {String} message The error message
   * @param {Boolean} prefix Specifies whether or not to add a default prefix to
   *     `message`
   * @param {Number} statusCode The status code
   * @param {String} errorCode The exposed error code
   * @return {(Error|RangeError)} The error
   * @private
   */
  createError(e, t, s, n, i) {
    this._loop = !1, this._errored = !0;
    const o = new e(
      s ? `Invalid WebSocket frame: ${t}` : t
    );
    return Error.captureStackTrace(o, this.createError), o.code = i, o[Fn] = n, o;
  }
};
var Vn = $n;
const { Duplex: No } = Re, { randomFillSync: jn } = qt, Es = Wt, { EMPTY_BUFFER: Hn } = ue, { isValidStatusCode: Wn } = rt, { mask: bs, toBuffer: me } = st, j = Symbol("kByteLength"), Gn = Buffer.alloc(4), ze = 8 * 1024;
let le, _e = ze, zn = class fe {
  /**
   * Creates a Sender instance.
   *
   * @param {Duplex} socket The connection socket
   * @param {Object} [extensions] An object containing the negotiated extensions
   * @param {Function} [generateMask] The function used to generate the masking
   *     key
   */
  constructor(e, t, s) {
    this._extensions = t || {}, s && (this._generateMask = s, this._maskBuffer = Buffer.alloc(4)), this._socket = e, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._deflating = !1, this._queue = [];
  }
  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {(Buffer|String)} data The data to frame
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @return {(Buffer|String)[]} The framed data
   * @public
   */
  static frame(e, t) {
    let s, n = !1, i = 2, o = !1;
    t.mask && (s = t.maskBuffer || Gn, t.generateMask ? t.generateMask(s) : (_e === ze && (le === void 0 && (le = Buffer.alloc(ze)), jn(le, 0, ze), _e = 0), s[0] = le[_e++], s[1] = le[_e++], s[2] = le[_e++], s[3] = le[_e++]), o = (s[0] | s[1] | s[2] | s[3]) === 0, i = 6);
    let h;
    typeof e == "string" ? (!t.mask || o) && t[j] !== void 0 ? h = t[j] : (e = Buffer.from(e), h = e.length) : (h = e.length, n = t.mask && t.readOnly && !o);
    let a = h;
    h >= 65536 ? (i += 8, a = 127) : h > 125 && (i += 2, a = 126);
    const l = Buffer.allocUnsafe(n ? h + i : i);
    return l[0] = t.fin ? t.opcode | 128 : t.opcode, t.rsv1 && (l[0] |= 64), l[1] = a, a === 126 ? l.writeUInt16BE(h, 2) : a === 127 && (l[2] = l[3] = 0, l.writeUIntBE(h, 4, 6)), t.mask ? (l[1] |= 128, l[i - 4] = s[0], l[i - 3] = s[1], l[i - 2] = s[2], l[i - 1] = s[3], o ? [l, e] : n ? (bs(e, s, l, i, h), [l]) : (bs(e, s, e, 0, h), [l, e])) : [l, e];
  }
  /**
   * Sends a close message to the other peer.
   *
   * @param {Number} [code] The status code component of the body
   * @param {(String|Buffer)} [data] The message component of the body
   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
   * @param {Function} [cb] Callback
   * @public
   */
  close(e, t, s, n) {
    let i;
    if (e === void 0)
      i = Hn;
    else {
      if (typeof e != "number" || !Wn(e))
        throw new TypeError("First argument must be a valid error code number");
      if (t === void 0 || !t.length)
        i = Buffer.allocUnsafe(2), i.writeUInt16BE(e, 0);
      else {
        const h = Buffer.byteLength(t);
        if (h > 123)
          throw new RangeError("The message must not be greater than 123 bytes");
        i = Buffer.allocUnsafe(2 + h), i.writeUInt16BE(e, 0), typeof t == "string" ? i.write(t, 2) : i.set(t, 2);
      }
    }
    const o = {
      [j]: i.length,
      fin: !0,
      generateMask: this._generateMask,
      mask: s,
      maskBuffer: this._maskBuffer,
      opcode: 8,
      readOnly: !1,
      rsv1: !1
    };
    this._deflating ? this.enqueue([this.dispatch, i, !1, o, n]) : this.sendFrame(fe.frame(i, o), n);
  }
  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  ping(e, t, s) {
    let n, i;
    if (typeof e == "string" ? (n = Buffer.byteLength(e), i = !1) : (e = me(e), n = e.length, i = me.readOnly), n > 125)
      throw new RangeError("The data size must not be greater than 125 bytes");
    const o = {
      [j]: n,
      fin: !0,
      generateMask: this._generateMask,
      mask: t,
      maskBuffer: this._maskBuffer,
      opcode: 9,
      readOnly: i,
      rsv1: !1
    };
    this._deflating ? this.enqueue([this.dispatch, e, !1, o, s]) : this.sendFrame(fe.frame(e, o), s);
  }
  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  pong(e, t, s) {
    let n, i;
    if (typeof e == "string" ? (n = Buffer.byteLength(e), i = !1) : (e = me(e), n = e.length, i = me.readOnly), n > 125)
      throw new RangeError("The data size must not be greater than 125 bytes");
    const o = {
      [j]: n,
      fin: !0,
      generateMask: this._generateMask,
      mask: t,
      maskBuffer: this._maskBuffer,
      opcode: 10,
      readOnly: i,
      rsv1: !1
    };
    this._deflating ? this.enqueue([this.dispatch, e, !1, o, s]) : this.sendFrame(fe.frame(e, o), s);
  }
  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
   *     or text
   * @param {Boolean} [options.compress=false] Specifies whether or not to
   *     compress `data`
   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Function} [cb] Callback
   * @public
   */
  send(e, t, s) {
    const n = this._extensions[Es.extensionName];
    let i = t.binary ? 2 : 1, o = t.compress, h, a;
    if (typeof e == "string" ? (h = Buffer.byteLength(e), a = !1) : (e = me(e), h = e.length, a = me.readOnly), this._firstFragment ? (this._firstFragment = !1, o && n && n.params[n._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (o = h >= n._threshold), this._compress = o) : (o = !1, i = 0), t.fin && (this._firstFragment = !0), n) {
      const l = {
        [j]: h,
        fin: t.fin,
        generateMask: this._generateMask,
        mask: t.mask,
        maskBuffer: this._maskBuffer,
        opcode: i,
        readOnly: a,
        rsv1: o
      };
      this._deflating ? this.enqueue([this.dispatch, e, this._compress, l, s]) : this.dispatch(e, this._compress, l, s);
    } else
      this.sendFrame(
        fe.frame(e, {
          [j]: h,
          fin: t.fin,
          generateMask: this._generateMask,
          mask: t.mask,
          maskBuffer: this._maskBuffer,
          opcode: i,
          readOnly: a,
          rsv1: !1
        }),
        s
      );
  }
  /**
   * Dispatches a message.
   *
   * @param {(Buffer|String)} data The message to send
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     `data`
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  dispatch(e, t, s, n) {
    if (!t) {
      this.sendFrame(fe.frame(e, s), n);
      return;
    }
    const i = this._extensions[Es.extensionName];
    this._bufferedBytes += s[j], this._deflating = !0, i.compress(e, s.fin, (o, h) => {
      if (this._socket.destroyed) {
        const a = new Error(
          "The socket was closed while data was being compressed"
        );
        typeof n == "function" && n(a);
        for (let l = 0; l < this._queue.length; l++) {
          const u = this._queue[l], c = u[u.length - 1];
          typeof c == "function" && c(a);
        }
        return;
      }
      this._bufferedBytes -= s[j], this._deflating = !1, s.readOnly = !1, this.sendFrame(fe.frame(h, s), n), this.dequeue();
    });
  }
  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    for (; !this._deflating && this._queue.length; ) {
      const e = this._queue.shift();
      this._bufferedBytes -= e[3][j], Reflect.apply(e[0], this, e.slice(1));
    }
  }
  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(e) {
    this._bufferedBytes += e[3][j], this._queue.push(e);
  }
  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} [cb] Callback
   * @private
   */
  sendFrame(e, t) {
    e.length === 2 ? (this._socket.cork(), this._socket.write(e[0]), this._socket.write(e[1], t), this._socket.uncork()) : this._socket.write(e[0], t);
  }
};
var Yn = zn;
const { kForOnEventAttribute: Se, kListener: bt } = ue, ws = Symbol("kCode"), Ss = Symbol("kData"), ks = Symbol("kError"), xs = Symbol("kMessage"), Cs = Symbol("kReason"), ge = Symbol("kTarget"), Os = Symbol("kType"), Ts = Symbol("kWasClean");
class ve {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @throws {TypeError} If the `type` argument is not specified
   */
  constructor(e) {
    this[ge] = null, this[Os] = e;
  }
  /**
   * @type {*}
   */
  get target() {
    return this[ge];
  }
  /**
   * @type {String}
   */
  get type() {
    return this[Os];
  }
}
Object.defineProperty(ve.prototype, "target", { enumerable: !0 });
Object.defineProperty(ve.prototype, "type", { enumerable: !0 });
class nt extends ve {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {Number} [options.code=0] The status code explaining why the
   *     connection was closed
   * @param {String} [options.reason=''] A human-readable string explaining why
   *     the connection was closed
   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
   *     connection was cleanly closed
   */
  constructor(e, t = {}) {
    super(e), this[ws] = t.code === void 0 ? 0 : t.code, this[Cs] = t.reason === void 0 ? "" : t.reason, this[Ts] = t.wasClean === void 0 ? !1 : t.wasClean;
  }
  /**
   * @type {Number}
   */
  get code() {
    return this[ws];
  }
  /**
   * @type {String}
   */
  get reason() {
    return this[Cs];
  }
  /**
   * @type {Boolean}
   */
  get wasClean() {
    return this[Ts];
  }
}
Object.defineProperty(nt.prototype, "code", { enumerable: !0 });
Object.defineProperty(nt.prototype, "reason", { enumerable: !0 });
Object.defineProperty(nt.prototype, "wasClean", { enumerable: !0 });
class Gt extends ve {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.error=null] The error that generated this event
   * @param {String} [options.message=''] The error message
   */
  constructor(e, t = {}) {
    super(e), this[ks] = t.error === void 0 ? null : t.error, this[xs] = t.message === void 0 ? "" : t.message;
  }
  /**
   * @type {*}
   */
  get error() {
    return this[ks];
  }
  /**
   * @type {String}
   */
  get message() {
    return this[xs];
  }
}
Object.defineProperty(Gt.prototype, "error", { enumerable: !0 });
Object.defineProperty(Gt.prototype, "message", { enumerable: !0 });
class rr extends ve {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.data=null] The message content
   */
  constructor(e, t = {}) {
    super(e), this[Ss] = t.data === void 0 ? null : t.data;
  }
  /**
   * @type {*}
   */
  get data() {
    return this[Ss];
  }
}
Object.defineProperty(rr.prototype, "data", { enumerable: !0 });
const Kn = {
  /**
   * Register an event listener.
   *
   * @param {String} type A string representing the event type to listen for
   * @param {(Function|Object)} handler The listener to add
   * @param {Object} [options] An options object specifies characteristics about
   *     the event listener
   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
   *     listener should be invoked at most once after being added. If `true`,
   *     the listener would be automatically removed when invoked.
   * @public
   */
  addEventListener(r, e, t = {}) {
    for (const n of this.listeners(r))
      if (!t[Se] && n[bt] === e && !n[Se])
        return;
    let s;
    if (r === "message")
      s = function(i, o) {
        const h = new rr("message", {
          data: o ? i : i.toString()
        });
        h[ge] = this, Ve(e, this, h);
      };
    else if (r === "close")
      s = function(i, o) {
        const h = new nt("close", {
          code: i,
          reason: o.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });
        h[ge] = this, Ve(e, this, h);
      };
    else if (r === "error")
      s = function(i) {
        const o = new Gt("error", {
          error: i,
          message: i.message
        });
        o[ge] = this, Ve(e, this, o);
      };
    else if (r === "open")
      s = function() {
        const i = new ve("open");
        i[ge] = this, Ve(e, this, i);
      };
    else
      return;
    s[Se] = !!t[Se], s[bt] = e, t.once ? this.once(r, s) : this.on(r, s);
  },
  /**
   * Remove an event listener.
   *
   * @param {String} type A string representing the event type to remove
   * @param {(Function|Object)} handler The listener to remove
   * @public
   */
  removeEventListener(r, e) {
    for (const t of this.listeners(r))
      if (t[bt] === e && !t[Se]) {
        this.removeListener(r, t);
        break;
      }
  }
};
var Xn = {
  EventTarget: Kn
};
function Ve(r, e, t) {
  typeof r == "object" && r.handleEvent ? r.handleEvent.call(r, t) : r.call(e, t);
}
const { tokenChars: ke } = rt;
function K(r, e, t) {
  r[e] === void 0 ? r[e] = [t] : r[e].push(t);
}
function Jn(r) {
  const e = /* @__PURE__ */ Object.create(null);
  let t = /* @__PURE__ */ Object.create(null), s = !1, n = !1, i = !1, o, h, a = -1, l = -1, u = -1, c = 0;
  for (; c < r.length; c++)
    if (l = r.charCodeAt(c), o === void 0)
      if (u === -1 && ke[l] === 1)
        a === -1 && (a = c);
      else if (c !== 0 && (l === 32 || l === 9))
        u === -1 && a !== -1 && (u = c);
      else if (l === 59 || l === 44) {
        if (a === -1)
          throw new SyntaxError(`Unexpected character at index ${c}`);
        u === -1 && (u = c);
        const p = r.slice(a, u);
        l === 44 ? (K(e, p, t), t = /* @__PURE__ */ Object.create(null)) : o = p, a = u = -1;
      } else
        throw new SyntaxError(`Unexpected character at index ${c}`);
    else if (h === void 0)
      if (u === -1 && ke[l] === 1)
        a === -1 && (a = c);
      else if (l === 32 || l === 9)
        u === -1 && a !== -1 && (u = c);
      else if (l === 59 || l === 44) {
        if (a === -1)
          throw new SyntaxError(`Unexpected character at index ${c}`);
        u === -1 && (u = c), K(t, r.slice(a, u), !0), l === 44 && (K(e, o, t), t = /* @__PURE__ */ Object.create(null), o = void 0), a = u = -1;
      } else if (l === 61 && a !== -1 && u === -1)
        h = r.slice(a, c), a = u = -1;
      else
        throw new SyntaxError(`Unexpected character at index ${c}`);
    else if (n) {
      if (ke[l] !== 1)
        throw new SyntaxError(`Unexpected character at index ${c}`);
      a === -1 ? a = c : s || (s = !0), n = !1;
    } else if (i)
      if (ke[l] === 1)
        a === -1 && (a = c);
      else if (l === 34 && a !== -1)
        i = !1, u = c;
      else if (l === 92)
        n = !0;
      else
        throw new SyntaxError(`Unexpected character at index ${c}`);
    else if (l === 34 && r.charCodeAt(c - 1) === 61)
      i = !0;
    else if (u === -1 && ke[l] === 1)
      a === -1 && (a = c);
    else if (a !== -1 && (l === 32 || l === 9))
      u === -1 && (u = c);
    else if (l === 59 || l === 44) {
      if (a === -1)
        throw new SyntaxError(`Unexpected character at index ${c}`);
      u === -1 && (u = c);
      let p = r.slice(a, u);
      s && (p = p.replace(/\\/g, ""), s = !1), K(t, h, p), l === 44 && (K(e, o, t), t = /* @__PURE__ */ Object.create(null), o = void 0), h = void 0, a = u = -1;
    } else
      throw new SyntaxError(`Unexpected character at index ${c}`);
  if (a === -1 || i || l === 32 || l === 9)
    throw new SyntaxError("Unexpected end of input");
  u === -1 && (u = c);
  const f = r.slice(a, u);
  return o === void 0 ? K(e, f, t) : (h === void 0 ? K(t, f, !0) : s ? K(t, h, f.replace(/\\/g, "")) : K(t, h, f), K(e, o, t)), e;
}
function Qn(r) {
  return Object.keys(r).map((e) => {
    let t = r[e];
    return Array.isArray(t) || (t = [t]), t.map((s) => [e].concat(
      Object.keys(s).map((n) => {
        let i = s[n];
        return Array.isArray(i) || (i = [i]), i.map((o) => o === !0 ? n : `${n}=${o}`).join("; ");
      })
    ).join("; ")).join(", ");
  }).join(", ");
}
var Zn = { format: Qn, parse: Jn };
const ei = Tr, ti = qs, si = Ms, nr = Rr, ri = Nr, { randomBytes: ni, createHash: ii } = qt, { Duplex: Lo, Readable: Ao } = Re, { URL: wt } = Us, ie = Wt, oi = Vn, ai = Yn, {
  BINARY_TYPES: Rs,
  EMPTY_BUFFER: je,
  GUID: ci,
  kForOnEventAttribute: St,
  kListener: hi,
  kStatusCode: li,
  kWebSocket: U,
  NOOP: ir
} = ue, {
  EventTarget: { addEventListener: fi, removeEventListener: ui }
} = Xn, { format: di, parse: pi } = Zn, { toBuffer: mi } = st, _i = 30 * 1e3, or = Symbol("kAborted"), kt = [8, 13], te = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"], gi = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
class v extends ei {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|URL)} address The URL to which to connect
   * @param {(String|String[])} [protocols] The subprotocols
   * @param {Object} [options] Connection options
   */
  constructor(e, t, s) {
    super(), this._binaryType = Rs[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = je, this._closeTimer = null, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = v.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, e !== null ? (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, t === void 0 ? t = [] : Array.isArray(t) || (typeof t == "object" && t !== null ? (s = t, t = []) : t = [t]), ar(this, e, t, s)) : (this._autoPong = s.autoPong, this._isServer = !0);
  }
  /**
   * This deviates from the WHATWG interface since ws doesn't support the
   * required default "blob" type (instead we define a custom "nodebuffer"
   * type).
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }
  set binaryType(e) {
    Rs.includes(e) && (this._binaryType = e, this._receiver && (this._receiver._binaryType = e));
  }
  /**
   * @type {Number}
   */
  get bufferedAmount() {
    return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount;
  }
  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }
  /**
   * @type {Boolean}
   */
  get isPaused() {
    return this._paused;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onclose() {
    return null;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onerror() {
    return null;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onopen() {
    return null;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onmessage() {
    return null;
  }
  /**
   * @type {String}
   */
  get protocol() {
    return this._protocol;
  }
  /**
   * @type {Number}
   */
  get readyState() {
    return this._readyState;
  }
  /**
   * @type {String}
   */
  get url() {
    return this._url;
  }
  /**
   * Set up the socket and the internal resources.
   *
   * @param {Duplex} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Object} options Options object
   * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Number} [options.maxPayload=0] The maximum allowed message size
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @private
   */
  setSocket(e, t, s) {
    const n = new oi({
      allowSynchronousEvents: s.allowSynchronousEvents,
      binaryType: this.binaryType,
      extensions: this._extensions,
      isServer: this._isServer,
      maxPayload: s.maxPayload,
      skipUTF8Validation: s.skipUTF8Validation
    });
    this._sender = new ai(e, this._extensions, s.generateMask), this._receiver = n, this._socket = e, n[U] = this, e[U] = this, n.on("conclude", bi), n.on("drain", wi), n.on("error", Si), n.on("message", ki), n.on("ping", xi), n.on("pong", Ci), e.setTimeout && e.setTimeout(0), e.setNoDelay && e.setNoDelay(), t.length > 0 && e.unshift(t), e.on("close", hr), e.on("data", it), e.on("end", lr), e.on("error", fr), this._readyState = v.OPEN, this.emit("open");
  }
  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    if (!this._socket) {
      this._readyState = v.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
      return;
    }
    this._extensions[ie.extensionName] && this._extensions[ie.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = v.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
  }
  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} [code] Status code explaining why the connection is closing
   * @param {(String|Buffer)} [data] The reason why the connection is
   *     closing
   * @public
   */
  close(e, t) {
    if (this.readyState !== v.CLOSED) {
      if (this.readyState === v.CONNECTING) {
        M(this, this._req, "WebSocket was closed before the connection was established");
        return;
      }
      if (this.readyState === v.CLOSING) {
        this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end();
        return;
      }
      this._readyState = v.CLOSING, this._sender.close(e, t, !this._isServer, (s) => {
        s || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end());
      }), this._closeTimer = setTimeout(
        this._socket.destroy.bind(this._socket),
        _i
      );
    }
  }
  /**
   * Pause the socket.
   *
   * @public
   */
  pause() {
    this.readyState === v.CONNECTING || this.readyState === v.CLOSED || (this._paused = !0, this._socket.pause());
  }
  /**
   * Send a ping.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the ping is sent
   * @public
   */
  ping(e, t, s) {
    if (this.readyState === v.CONNECTING)
      throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
    if (typeof e == "function" ? (s = e, e = t = void 0) : typeof t == "function" && (s = t, t = void 0), typeof e == "number" && (e = e.toString()), this.readyState !== v.OPEN) {
      xt(this, e, s);
      return;
    }
    t === void 0 && (t = !this._isServer), this._sender.ping(e || je, t, s);
  }
  /**
   * Send a pong.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the pong is sent
   * @public
   */
  pong(e, t, s) {
    if (this.readyState === v.CONNECTING)
      throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
    if (typeof e == "function" ? (s = e, e = t = void 0) : typeof t == "function" && (s = t, t = void 0), typeof e == "number" && (e = e.toString()), this.readyState !== v.OPEN) {
      xt(this, e, s);
      return;
    }
    t === void 0 && (t = !this._isServer), this._sender.pong(e || je, t, s);
  }
  /**
   * Resume the socket.
   *
   * @public
   */
  resume() {
    this.readyState === v.CONNECTING || this.readyState === v.CLOSED || (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume());
  }
  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} [options] Options object
   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
   *     text
   * @param {Boolean} [options.compress] Specifies whether or not to compress
   *     `data`
   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when data is written out
   * @public
   */
  send(e, t, s) {
    if (this.readyState === v.CONNECTING)
      throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
    if (typeof t == "function" && (s = t, t = {}), typeof e == "number" && (e = e.toString()), this.readyState !== v.OPEN) {
      xt(this, e, s);
      return;
    }
    const n = {
      binary: typeof e != "string",
      mask: !this._isServer,
      compress: !0,
      fin: !0,
      ...t
    };
    this._extensions[ie.extensionName] || (n.compress = !1), this._sender.send(e || je, n, s);
  }
  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState !== v.CLOSED) {
      if (this.readyState === v.CONNECTING) {
        M(this, this._req, "WebSocket was closed before the connection was established");
        return;
      }
      this._socket && (this._readyState = v.CLOSING, this._socket.destroy());
    }
  }
}
Object.defineProperty(v, "CONNECTING", {
  enumerable: !0,
  value: te.indexOf("CONNECTING")
});
Object.defineProperty(v.prototype, "CONNECTING", {
  enumerable: !0,
  value: te.indexOf("CONNECTING")
});
Object.defineProperty(v, "OPEN", {
  enumerable: !0,
  value: te.indexOf("OPEN")
});
Object.defineProperty(v.prototype, "OPEN", {
  enumerable: !0,
  value: te.indexOf("OPEN")
});
Object.defineProperty(v, "CLOSING", {
  enumerable: !0,
  value: te.indexOf("CLOSING")
});
Object.defineProperty(v.prototype, "CLOSING", {
  enumerable: !0,
  value: te.indexOf("CLOSING")
});
Object.defineProperty(v, "CLOSED", {
  enumerable: !0,
  value: te.indexOf("CLOSED")
});
Object.defineProperty(v.prototype, "CLOSED", {
  enumerable: !0,
  value: te.indexOf("CLOSED")
});
[
  "binaryType",
  "bufferedAmount",
  "extensions",
  "isPaused",
  "protocol",
  "readyState",
  "url"
].forEach((r) => {
  Object.defineProperty(v.prototype, r, { enumerable: !0 });
});
["open", "error", "close", "message"].forEach((r) => {
  Object.defineProperty(v.prototype, `on${r}`, {
    enumerable: !0,
    get() {
      for (const e of this.listeners(r))
        if (e[St]) return e[hi];
      return null;
    },
    set(e) {
      for (const t of this.listeners(r))
        if (t[St]) {
          this.removeListener(r, t);
          break;
        }
      typeof e == "function" && this.addEventListener(r, e, {
        [St]: !0
      });
    }
  });
});
v.prototype.addEventListener = fi;
v.prototype.removeEventListener = ui;
var yi = v;
function ar(r, e, t, s) {
  const n = {
    allowSynchronousEvents: !0,
    autoPong: !0,
    protocolVersion: kt[1],
    maxPayload: 104857600,
    skipUTF8Validation: !1,
    perMessageDeflate: !0,
    followRedirects: !1,
    maxRedirects: 10,
    ...s,
    socketPath: void 0,
    hostname: void 0,
    protocol: void 0,
    timeout: void 0,
    method: "GET",
    host: void 0,
    path: void 0,
    port: void 0
  };
  if (r._autoPong = n.autoPong, !kt.includes(n.protocolVersion))
    throw new RangeError(
      `Unsupported protocol version: ${n.protocolVersion} (supported versions: ${kt.join(", ")})`
    );
  let i;
  if (e instanceof wt)
    i = e;
  else
    try {
      i = new wt(e);
    } catch {
      throw new SyntaxError(`Invalid URL: ${e}`);
    }
  i.protocol === "http:" ? i.protocol = "ws:" : i.protocol === "https:" && (i.protocol = "wss:"), r._url = i.href;
  const o = i.protocol === "wss:", h = i.protocol === "ws+unix:";
  let a;
  if (i.protocol !== "ws:" && !o && !h ? a = `The URL's protocol must be one of "ws:", "wss:", "http:", "https", or "ws+unix:"` : h && !i.pathname ? a = "The URL's pathname is empty" : i.hash && (a = "The URL contains a fragment identifier"), a) {
    const m = new SyntaxError(a);
    if (r._redirects === 0)
      throw m;
    Ye(r, m);
    return;
  }
  const l = o ? 443 : 80, u = ni(16).toString("base64"), c = o ? ti.request : si.request, f = /* @__PURE__ */ new Set();
  let p;
  if (n.createConnection = n.createConnection || (o ? Ei : vi), n.defaultPort = n.defaultPort || l, n.port = i.port || l, n.host = i.hostname.startsWith("[") ? i.hostname.slice(1, -1) : i.hostname, n.headers = {
    ...n.headers,
    "Sec-WebSocket-Version": n.protocolVersion,
    "Sec-WebSocket-Key": u,
    Connection: "Upgrade",
    Upgrade: "websocket"
  }, n.path = i.pathname + i.search, n.timeout = n.handshakeTimeout, n.perMessageDeflate && (p = new ie(
    n.perMessageDeflate !== !0 ? n.perMessageDeflate : {},
    !1,
    n.maxPayload
  ), n.headers["Sec-WebSocket-Extensions"] = di({
    [ie.extensionName]: p.offer()
  })), t.length) {
    for (const m of t) {
      if (typeof m != "string" || !gi.test(m) || f.has(m))
        throw new SyntaxError(
          "An invalid or duplicated subprotocol was specified"
        );
      f.add(m);
    }
    n.headers["Sec-WebSocket-Protocol"] = t.join(",");
  }
  if (n.origin && (n.protocolVersion < 13 ? n.headers["Sec-WebSocket-Origin"] = n.origin : n.headers.Origin = n.origin), (i.username || i.password) && (n.auth = `${i.username}:${i.password}`), h) {
    const m = n.path.split(":");
    n.socketPath = m[0], n.path = m[1];
  }
  let y;
  if (n.followRedirects) {
    if (r._redirects === 0) {
      r._originalIpc = h, r._originalSecure = o, r._originalHostOrSocketPath = h ? n.socketPath : i.host;
      const m = s && s.headers;
      if (s = { ...s, headers: {} }, m)
        for (const [w, k] of Object.entries(m))
          s.headers[w.toLowerCase()] = k;
    } else if (r.listenerCount("redirect") === 0) {
      const m = h ? r._originalIpc ? n.socketPath === r._originalHostOrSocketPath : !1 : r._originalIpc ? !1 : i.host === r._originalHostOrSocketPath;
      (!m || r._originalSecure && !o) && (delete n.headers.authorization, delete n.headers.cookie, m || delete n.headers.host, n.auth = void 0);
    }
    n.auth && !s.headers.authorization && (s.headers.authorization = "Basic " + Buffer.from(n.auth).toString("base64")), y = r._req = c(n), r._redirects && r.emit("redirect", r.url, y);
  } else
    y = r._req = c(n);
  n.timeout && y.on("timeout", () => {
    M(r, y, "Opening handshake has timed out");
  }), y.on("error", (m) => {
    y === null || y[or] || (y = r._req = null, Ye(r, m));
  }), y.on("response", (m) => {
    const w = m.headers.location, k = m.statusCode;
    if (w && n.followRedirects && k >= 300 && k < 400) {
      if (++r._redirects > n.maxRedirects) {
        M(r, y, "Maximum redirects exceeded");
        return;
      }
      y.abort();
      let O;
      try {
        O = new wt(w, e);
      } catch {
        const _ = new SyntaxError(`Invalid URL: ${w}`);
        Ye(r, _);
        return;
      }
      ar(r, O, t, s);
    } else r.emit("unexpected-response", y, m) || M(
      r,
      y,
      `Unexpected server response: ${m.statusCode}`
    );
  }), y.on("upgrade", (m, w, k) => {
    if (r.emit("upgrade", m), r.readyState !== v.CONNECTING) return;
    y = r._req = null;
    const O = m.headers.upgrade;
    if (O === void 0 || O.toLowerCase() !== "websocket") {
      M(r, w, "Invalid Upgrade header");
      return;
    }
    const d = ii("sha1").update(u + ci).digest("base64");
    if (m.headers["sec-websocket-accept"] !== d) {
      M(r, w, "Invalid Sec-WebSocket-Accept header");
      return;
    }
    const _ = m.headers["sec-websocket-protocol"];
    let T;
    if (_ !== void 0 ? f.size ? f.has(_) || (T = "Server sent an invalid subprotocol") : T = "Server sent a subprotocol but none was requested" : f.size && (T = "Server sent no subprotocol"), T) {
      M(r, w, T);
      return;
    }
    _ && (r._protocol = _);
    const P = m.headers["sec-websocket-extensions"];
    if (P !== void 0) {
      if (!p) {
        M(r, w, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
        return;
      }
      let B;
      try {
        B = pi(P);
      } catch {
        M(r, w, "Invalid Sec-WebSocket-Extensions header");
        return;
      }
      const G = Object.keys(B);
      if (G.length !== 1 || G[0] !== ie.extensionName) {
        M(r, w, "Server indicated an extension that was not requested");
        return;
      }
      try {
        p.accept(B[ie.extensionName]);
      } catch {
        M(r, w, "Invalid Sec-WebSocket-Extensions header");
        return;
      }
      r._extensions[ie.extensionName] = p;
    }
    r.setSocket(w, k, {
      allowSynchronousEvents: n.allowSynchronousEvents,
      generateMask: n.generateMask,
      maxPayload: n.maxPayload,
      skipUTF8Validation: n.skipUTF8Validation
    });
  }), n.finishRequest ? n.finishRequest(y, r) : y.end();
}
function Ye(r, e) {
  r._readyState = v.CLOSING, r.emit("error", e), r.emitClose();
}
function vi(r) {
  return r.path = r.socketPath, nr.connect(r);
}
function Ei(r) {
  return r.path = void 0, !r.servername && r.servername !== "" && (r.servername = nr.isIP(r.host) ? "" : r.host), ri.connect(r);
}
function M(r, e, t) {
  r._readyState = v.CLOSING;
  const s = new Error(t);
  Error.captureStackTrace(s, M), e.setHeader ? (e[or] = !0, e.abort(), e.socket && !e.socket.destroyed && e.socket.destroy(), process.nextTick(Ye, r, s)) : (e.destroy(s), e.once("error", r.emit.bind(r, "error")), e.once("close", r.emitClose.bind(r)));
}
function xt(r, e, t) {
  if (e) {
    const s = mi(e).length;
    r._socket ? r._sender._bufferedBytes += s : r._bufferedAmount += s;
  }
  if (t) {
    const s = new Error(
      `WebSocket is not open: readyState ${r.readyState} (${te[r.readyState]})`
    );
    process.nextTick(t, s);
  }
}
function bi(r, e) {
  const t = this[U];
  t._closeFrameReceived = !0, t._closeMessage = e, t._closeCode = r, t._socket[U] !== void 0 && (t._socket.removeListener("data", it), process.nextTick(cr, t._socket), r === 1005 ? t.close() : t.close(r, e));
}
function wi() {
  const r = this[U];
  r.isPaused || r._socket.resume();
}
function Si(r) {
  const e = this[U];
  e._socket[U] !== void 0 && (e._socket.removeListener("data", it), process.nextTick(cr, e._socket), e.close(r[li])), e.emit("error", r);
}
function Ns() {
  this[U].emitClose();
}
function ki(r, e) {
  this[U].emit("message", r, e);
}
function xi(r) {
  const e = this[U];
  e._autoPong && e.pong(r, !this._isServer, ir), e.emit("ping", r);
}
function Ci(r) {
  this[U].emit("pong", r);
}
function cr(r) {
  r.resume();
}
function hr() {
  const r = this[U];
  this.removeListener("close", hr), this.removeListener("data", it), this.removeListener("end", lr), r._readyState = v.CLOSING;
  let e;
  !this._readableState.endEmitted && !r._closeFrameReceived && !r._receiver._writableState.errorEmitted && (e = r._socket.read()) !== null && r._receiver.write(e), r._receiver.end(), this[U] = void 0, clearTimeout(r._closeTimer), r._receiver._writableState.finished || r._receiver._writableState.errorEmitted ? r.emitClose() : (r._receiver.on("error", Ns), r._receiver.on("finish", Ns));
}
function it(r) {
  this[U]._receiver.write(r) || this.pause();
}
function lr() {
  const r = this[U];
  r._readyState = v.CLOSING, r._receiver.end(), this.end();
}
function fr() {
  const r = this[U];
  this.removeListener("error", fr), this.on("error", ir), r && (r._readyState = v.CLOSING, this.destroy());
}
const Oi = /* @__PURE__ */ $t(yi), { tokenChars: Bo } = rt, { Duplex: Po } = Re, { createHash: Do } = qt, { GUID: Fo, kWebSocket: Io } = ue, Ti = W("engine.io-client:websocket"), Ri = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ni extends Ht {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), t = this.opts.protocols, s = Ri ? {} : zs(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, t, s);
    } catch (n) {
      return this.emitReserved("error", n);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], n = t === e.length - 1;
      Vt(s, this.supportsBinary, (i) => {
        try {
          this.doWrite(s, i);
        } catch {
          Ti("websocket closed before onclose event");
        }
        n && et(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = Ys()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
}
class Li extends Ni {
  createSocket(e, t, s) {
    var n;
    if (!((n = this.socket) === null || n === void 0) && n._cookieJar) {
      s.headers = s.headers || {}, s.headers.cookie = typeof s.headers.cookie == "string" ? [s.headers.cookie] : s.headers.cookie || [];
      for (const [i, o] of this.socket._cookieJar.cookies)
        s.headers.cookie.push(`${i}=${o.value}`);
    }
    return new Oi(e, t, s);
  }
  doWrite(e, t) {
    const s = {};
    e.options && (s.compress = e.options.compress), this.opts.perMessageDeflate && // @ts-ignore
    (typeof t == "string" ? Buffer.byteLength(t) : t.length) < this.opts.perMessageDeflate.threshold && (s.compress = !1), this.ws.send(t, s);
  }
}
const xe = W("engine.io-client:webtransport");
class Ai extends Ht {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      xe("transport closed gracefully"), this.onClose();
    }).catch((e) => {
      xe("transport closed due to %s", e), this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const t = Mr(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = e.readable.pipeThrough(t).getReader(), n = Ur();
        n.readable.pipeTo(e.writable), this._writer = n.writable.getWriter();
        const i = () => {
          s.read().then(({ done: h, value: a }) => {
            if (h) {
              xe("session is closed");
              return;
            }
            xe("received chunk: %o", a), this.onPacket(a), i();
          }).catch((h) => {
            xe("an error occurred while reading: %s", h);
          });
        };
        i();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], n = t === e.length - 1;
      this._writer.write(s).then(() => {
        n && et(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const Bi = {
  websocket: Li,
  webtransport: Ai,
  polling: dn
}, Pi = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Di = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function Bt(r) {
  if (r.length > 8e3)
    throw "URI too long";
  const e = r, t = r.indexOf("["), s = r.indexOf("]");
  t != -1 && s != -1 && (r = r.substring(0, t) + r.substring(t, s).replace(/:/g, ";") + r.substring(s, r.length));
  let n = Pi.exec(r || ""), i = {}, o = 14;
  for (; o--; )
    i[Di[o]] = n[o] || "";
  return t != -1 && s != -1 && (i.source = e, i.host = i.host.substring(1, i.host.length - 1).replace(/;/g, ":"), i.authority = i.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), i.ipv6uri = !0), i.pathNames = Fi(i, i.path), i.queryKey = Ii(i, i.query), i;
}
function Fi(r, e) {
  const t = /\/{2,9}/g, s = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && s.splice(0, 1), e.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function Ii(r, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, n, i) {
    n && (t[n] = i);
  }), t;
}
const C = W("engine.io-client:socket"), Pt = typeof addEventListener == "function" && typeof removeEventListener == "function", Te = [];
Pt && addEventListener("offline", () => {
  C("closing %d connection(s) because the network was lost", Te.length), Te.forEach((r) => r());
}, !1);
class ae extends N {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t) {
    if (super(), this.binaryType = $r, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (t = e, e = null), e) {
      const s = Bt(e);
      t.hostname = s.host, t.secure = s.protocol === "https" || s.protocol === "wss", t.port = s.port, s.query && (t.query = s.query);
    } else t.host && (t.hostname = Bt(t.host).host);
    tt(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach((s) => {
      const n = s.prototype.name;
      this.transports.push(n), this._transportsByName[n] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Jr(this.opts.query)), Pt && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (C("adding listener for the 'offline' event"), this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, Te.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = Vr()), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    C('creating transport "%s"', e);
    const t = Object.assign({}, this.opts.query);
    t.EIO = Gs, t.transport = e, this.id && (t.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return C("options: %j", s), new this._transportsByName[e](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && ae.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const t = this.createTransport(e);
    t.open(), this.setTransport(t);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    C("setting transport %s", e.name), this.transport && (C("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (t) => this._onClose("transport close", t));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    C("socket open"), this.readyState = "open", ae.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (C('socket receive: type "%s", data "%s"', e.type, e.data), this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this._onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
    else
      C('packet received with socket readyState "%s"', this.readyState);
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      C("flushing %d packets in socket", e.length), this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const n = this.writeBuffer[s].data;
      if (n && (t += Yr(n)), s > 0 && t > this._maxPayload)
        return C("only send %d out of %d packets", s, this.writeBuffer.length), this.writeBuffer.slice(0, s);
      t += 2;
    }
    return C("payload size is %d (max: %d)", t, this._maxPayload), this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (C("throttled timer detected, scheduling connection close"), this._pingTimeoutTime = 0, et(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, t, s, n) {
    if (typeof t == "function" && (n = t, t = void 0), typeof s == "function" && (n = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const i = {
      type: e,
      data: t,
      options: s
    };
    this.emitReserved("packetCreate", i), this.writeBuffer.push(i), n && this.once("flush", n), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), C("socket closing - telling transport to close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, s = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : e();
    }) : this.upgrading ? s() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (C("socket error %j", e), ae.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return C("trying next transport"), this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (C('socket close with reason: "%s"', e), this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), Pt && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = Te.indexOf(this._offlineEventListener);
        s !== -1 && (C("removing listener for the 'offline' event"), Te.splice(s, 1));
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
ae.protocol = Gs;
class Ui extends ae {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade) {
      C("starting upgrade probes");
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
    }
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    C('probing transport "%s"', e);
    let t = this.createTransport(e), s = !1;
    ae.priorWebsocketSuccess = !1;
    const n = () => {
      s || (C('probe transport "%s" opened', e), t.send([{ type: "ping", data: "probe" }]), t.once("packet", (c) => {
        if (!s)
          if (c.type === "pong" && c.data === "probe") {
            if (C('probe transport "%s" pong', e), this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            ae.priorWebsocketSuccess = t.name === "websocket", C('pausing current transport "%s"', this.transport.name), this.transport.pause(() => {
              s || this.readyState !== "closed" && (C("changing transport and sending upgrade packet"), u(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            C('probe transport "%s" failed', e);
            const f = new Error("probe error");
            f.transport = t.name, this.emitReserved("upgradeError", f);
          }
      }));
    };
    function i() {
      s || (s = !0, u(), t.close(), t = null);
    }
    const o = (c) => {
      const f = new Error("probe error: " + c);
      f.transport = t.name, i(), C('probe transport "%s" failed because of error: %s', e, c), this.emitReserved("upgradeError", f);
    };
    function h() {
      o("transport closed");
    }
    function a() {
      o("socket closed");
    }
    function l(c) {
      t && c.name !== t.name && (C('"%s" works - aborting "%s"', c.name, t.name), i());
    }
    const u = () => {
      t.removeListener("open", n), t.removeListener("error", o), t.removeListener("close", h), this.off("close", a), this.off("upgrading", l);
    };
    t.once("open", n), t.once("error", o), t.once("close", h), this.once("close", a), this.once("upgrading", l), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      s || t.open();
    }, 200) : t.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const t = [];
    for (let s = 0; s < e.length; s++)
      ~this.transports.indexOf(e[s]) && t.push(e[s]);
    return t;
  }
}
let Mi = class extends Ui {
  constructor(e, t = {}) {
    const s = typeof e == "object" ? e : t;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((n) => Bi[n]).filter((n) => !!n)), super(e, s);
  }
};
const Ls = W("socket.io-client:url");
function qi(r, e = "", t) {
  let s = r;
  t = t || typeof location < "u" && location, r == null && (r = t.protocol + "//" + t.host), typeof r == "string" && (r.charAt(0) === "/" && (r.charAt(1) === "/" ? r = t.protocol + r : r = t.host + r), /^(https?|wss?):\/\//.test(r) || (Ls("protocol-less url %s", r), typeof t < "u" ? r = t.protocol + "//" + r : r = "https://" + r), Ls("parse %s", r), s = Bt(r)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const i = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + i + ":" + s.port + e, s.href = s.protocol + "://" + i + (t && t.port === s.port ? "" : ":" + s.port), s;
}
const $i = typeof ArrayBuffer == "function", Vi = (r) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(r) : r.buffer instanceof ArrayBuffer, ur = Object.prototype.toString, ji = typeof Blob == "function" || typeof Blob < "u" && ur.call(Blob) === "[object BlobConstructor]", Hi = typeof File == "function" || typeof File < "u" && ur.call(File) === "[object FileConstructor]";
function zt(r) {
  return $i && (r instanceof ArrayBuffer || Vi(r)) || ji && r instanceof Blob || Hi && r instanceof File;
}
function Ke(r, e) {
  if (!r || typeof r != "object")
    return !1;
  if (Array.isArray(r)) {
    for (let t = 0, s = r.length; t < s; t++)
      if (Ke(r[t]))
        return !0;
    return !1;
  }
  if (zt(r))
    return !0;
  if (r.toJSON && typeof r.toJSON == "function" && arguments.length === 1)
    return Ke(r.toJSON(), !0);
  for (const t in r)
    if (Object.prototype.hasOwnProperty.call(r, t) && Ke(r[t]))
      return !0;
  return !1;
}
function Wi(r) {
  const e = [], t = r.data, s = r;
  return s.data = Dt(t, e), s.attachments = e.length, { packet: s, buffers: e };
}
function Dt(r, e) {
  if (!r)
    return r;
  if (zt(r)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(r), t;
  } else if (Array.isArray(r)) {
    const t = new Array(r.length);
    for (let s = 0; s < r.length; s++)
      t[s] = Dt(r[s], e);
    return t;
  } else if (typeof r == "object" && !(r instanceof Date)) {
    const t = {};
    for (const s in r)
      Object.prototype.hasOwnProperty.call(r, s) && (t[s] = Dt(r[s], e));
    return t;
  }
  return r;
}
function Gi(r, e) {
  return r.data = Ft(r.data, e), delete r.attachments, r;
}
function Ft(r, e) {
  if (!r)
    return r;
  if (r && r._placeholder === !0) {
    if (typeof r.num == "number" && r.num >= 0 && r.num < e.length)
      return e[r.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(r))
    for (let t = 0; t < r.length; t++)
      r[t] = Ft(r[t], e);
  else if (typeof r == "object")
    for (const t in r)
      Object.prototype.hasOwnProperty.call(r, t) && (r[t] = Ft(r[t], e));
  return r;
}
const It = W("socket.io-parser"), zi = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], Yi = 5;
var b;
(function(r) {
  r[r.CONNECT = 0] = "CONNECT", r[r.DISCONNECT = 1] = "DISCONNECT", r[r.EVENT = 2] = "EVENT", r[r.ACK = 3] = "ACK", r[r.CONNECT_ERROR = 4] = "CONNECT_ERROR", r[r.BINARY_EVENT = 5] = "BINARY_EVENT", r[r.BINARY_ACK = 6] = "BINARY_ACK";
})(b || (b = {}));
class Ki {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return It("encoding packet %j", e), (e.type === b.EVENT || e.type === b.ACK) && Ke(e) ? this.encodeAsBinary({
      type: e.type === b.EVENT ? b.BINARY_EVENT : b.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === b.BINARY_EVENT || e.type === b.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), It("encoded %j as %s", e, t), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = Wi(e), s = this.encodeAsString(t.packet), n = t.buffers;
    return n.unshift(s), n;
  }
}
function As(r) {
  return Object.prototype.toString.call(r) === "[object Object]";
}
class Yt extends N {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const s = t.type === b.BINARY_EVENT;
      s || t.type === b.BINARY_ACK ? (t.type = s ? b.EVENT : b.ACK, this.reconstructor = new Xi(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (zt(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const s = {
      type: Number(e.charAt(0))
    };
    if (b[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === b.BINARY_EVENT || s.type === b.BINARY_ACK) {
      const i = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const o = e.substring(i, t);
      if (o != Number(o) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (e.charAt(t + 1) === "/") {
      const i = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      s.nsp = e.substring(i, t);
    } else
      s.nsp = "/";
    const n = e.charAt(t + 1);
    if (n !== "" && Number(n) == n) {
      const i = t + 1;
      for (; ++t; ) {
        const o = e.charAt(t);
        if (o == null || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      s.id = Number(e.substring(i, t + 1));
    }
    if (e.charAt(++t)) {
      const i = this.tryParse(e.substr(t));
      if (Yt.isPayloadValid(s.type, i))
        s.data = i;
      else
        throw new Error("invalid payload");
    }
    return It("decoded %s as %j", e, s), s;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case b.CONNECT:
        return As(t);
      case b.DISCONNECT:
        return t === void 0;
      case b.CONNECT_ERROR:
        return typeof t == "string" || As(t);
      case b.EVENT:
      case b.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && zi.indexOf(t[0]) === -1);
      case b.ACK:
      case b.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class Xi {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = Gi(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const Ji = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Yt,
  Encoder: Ki,
  get PacketType() {
    return b;
  },
  protocol: Yi
}, Symbol.toStringTag, { value: "Module" }));
function H(r, e, t) {
  return r.on(e, t), function() {
    r.off(e, t);
  };
}
const A = W("socket.io-client:socket"), Qi = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class dr extends N {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      H(e, "open", this.onopen.bind(this)),
      H(e, "packet", this.onpacket.bind(this)),
      H(e, "error", this.onerror.bind(this)),
      H(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    var s, n, i;
    if (Qi.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const o = {
      type: b.EVENT,
      data: t
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const u = this.ids++;
      A("emitting packet with ack id %d", u);
      const c = t.pop();
      this._registerAckCallback(u, c), o.id = u;
    }
    const h = (n = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || n === void 0 ? void 0 : n.writable, a = this.connected && !(!((i = this.io.engine) === null || i === void 0) && i._hasPingExpired());
    return this.flags.volatile && !h ? A("discard packet as the transport is not currently writable") : a ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var s;
    const n = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (n === void 0) {
      this.acks[e] = t;
      return;
    }
    const i = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let h = 0; h < this.sendBuffer.length; h++)
        this.sendBuffer[h].id === e && (A("removing packet with ack id %d from the buffer", e), this.sendBuffer.splice(h, 1));
      A("event with ack id %d has timed out after %d ms", e, n), t.call(this, new Error("operation has timed out"));
    }, n), o = (...h) => {
      this.io.clearTimeoutFn(i), t.apply(this, h);
    };
    o.withError = !0, this.acks[e] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((s, n) => {
      const i = (o, h) => o ? n(o) : s(h);
      i.withError = !0, t.push(i), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((n, ...i) => s !== this._queue[0] ? void 0 : (n !== null ? s.tryCount > this._opts.retries && (A("packet [%d] is discarded after %d tries", s.id, s.tryCount), this._queue.shift(), t && t(n)) : (A("packet [%d] was successfully sent", s.id), this._queue.shift(), t && t(null, ...i)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (A("draining queue"), !this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    if (t.pending && !e) {
      A("packet [%d] has already been sent and is waiting for an ack", t.id);
      return;
    }
    t.pending = !0, t.tryCount++, A("sending packet [%d] (try n°%d)", t.id, t.tryCount), this.flags = t.flags, this.emit.apply(this, t.args);
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    A("transport is open - connecting"), typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: b.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    A("close (%s)", e), this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((s) => String(s.id) === e)) {
        const s = this.acks[e];
        delete this.acks[e], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case b.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case b.EVENT:
        case b.BINARY_EVENT:
          this.onevent(e);
          break;
        case b.ACK:
        case b.BINARY_ACK:
          this.onack(e);
          break;
        case b.DISCONNECT:
          this.ondisconnect();
          break;
        case b.CONNECT_ERROR:
          this.destroy();
          const s = new Error(e.data.message);
          s.data = e.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    A("emitting event %j", t), e.id != null && (A("attaching ack callback to event"), t.push(this.ack(e.id))), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const s of t)
        s.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let s = !1;
    return function(...n) {
      s || (s = !0, A("sending ack %j", n), t.packet({
        type: b.ACK,
        id: e,
        data: n
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    if (typeof t != "function") {
      A("bad ack %s", e.id);
      return;
    }
    delete this.acks[e.id], A("calling ack %s with %j", e.id, e.data), t.withError && e.data.unshift(null), t.apply(this, e.data);
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    A("socket connected with id %s", e), this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    A("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && (A("performing disconnect (%s)", this.nsp), this.packet({ type: b.DISCONNECT })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const s of t)
        s.apply(this, e.data);
    }
  }
}
function Ee(r) {
  r = r || {}, this.ms = r.min || 100, this.max = r.max || 1e4, this.factor = r.factor || 2, this.jitter = r.jitter > 0 && r.jitter <= 1 ? r.jitter : 0, this.attempts = 0;
}
Ee.prototype.duration = function() {
  var r = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * r);
    r = Math.floor(e * 10) & 1 ? r + t : r - t;
  }
  return Math.min(r, this.max) | 0;
};
Ee.prototype.reset = function() {
  this.attempts = 0;
};
Ee.prototype.setMin = function(r) {
  this.ms = r;
};
Ee.prototype.setMax = function(r) {
  this.max = r;
};
Ee.prototype.setJitter = function(r) {
  this.jitter = r;
};
const F = W("socket.io-client:manager");
class Ut extends N {
  constructor(e, t) {
    var s;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, tt(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((s = t.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new Ee({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const n = t.parser || Ji;
    this.encoder = new n.Encoder(), this.decoder = new n.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (F("readyState %s", this._readyState), ~this._readyState.indexOf("open"))
      return this;
    F("opening %s", this.uri), this.engine = new Mi(this.uri, this.opts);
    const t = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const n = H(t, "open", function() {
      s.onopen(), e && e();
    }), i = (h) => {
      F("error"), this.cleanup(), this._readyState = "closed", this.emitReserved("error", h), e ? e(h) : this.maybeReconnectOnOpen();
    }, o = H(t, "error", i);
    if (this._timeout !== !1) {
      const h = this._timeout;
      F("connect attempt will timeout after %d", h);
      const a = this.setTimeoutFn(() => {
        F("connect attempt timed out after %d", h), n(), i(new Error("timeout")), t.close();
      }, h);
      this.opts.autoUnref && a.unref(), this.subs.push(() => {
        this.clearTimeoutFn(a);
      });
    }
    return this.subs.push(n), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    F("open"), this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      H(e, "ping", this.onping.bind(this)),
      H(e, "data", this.ondata.bind(this)),
      H(e, "error", this.onerror.bind(this)),
      H(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      H(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    et(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    F("error", e), this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let s = this.nsps[e];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new dr(this, e, t), this.nsps[e] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const s of t)
      if (this.nsps[s].active) {
        F("socket %s is still active, skipping close", s);
        return;
      }
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    F("writing packet %j", e);
    const t = this.encoder.encode(e);
    for (let s = 0; s < t.length; s++)
      this.engine.write(t[s], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    F("cleanup"), this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    F("disconnect"), this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, t) {
    var s;
    F("closed due to %s", e), this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      F("reconnect failed"), this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      F("will wait %dms before reconnect attempt", t), this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        e.skipReconnect || (F("attempting reconnect"), this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((n) => {
          n ? (F("reconnect attempt error"), e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", n)) : (F("reconnect success"), e.onreconnect());
        }));
      }, t);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const Bs = W("socket.io-client"), Ce = {};
function Xe(r, e) {
  typeof r == "object" && (e = r, r = void 0), e = e || {};
  const t = qi(r, e.path || "/socket.io"), s = t.source, n = t.id, i = t.path, o = Ce[n] && i in Ce[n].nsps, h = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let a;
  return h ? (Bs("ignoring socket cache for %s", s), a = new Ut(s, e)) : (Ce[n] || (Bs("new io instance for %s", s), Ce[n] = new Ut(s, e)), a = Ce[n]), t.query && !e.query && (e.query = t.queryKey), a.socket(t.path, e);
}
Object.assign(Xe, {
  Manager: Ut,
  Socket: dr,
  io: Xe,
  connect: Xe
});
const Zi = "http://127.0.0.1:3000", eo = 41234;
async function to() {
  try {
    console.log("Trying SMU on localhost...");
    const r = await pr(Zi, 1500);
    return console.log("Connected to local SMU"), r;
  } catch {
    console.log("No local SMU found, starting UDP discovery...");
  }
  return so();
}
function pr(r, e) {
  return new Promise((t, s) => {
    const n = Xe(r, {
      transports: ["websocket"],
      timeout: e,
      reconnection: !1
    }), i = setTimeout(() => {
      n.disconnect(), s(new Error("Socket.IO timeout"));
    }, e);
    n.on("connect", () => {
      clearTimeout(i), t(n);
    }), n.on("connect_error", (o) => {
      clearTimeout(i), n.disconnect(), s(o);
    });
  });
}
function so() {
  return new Promise((r) => {
    const e = Lr.createSocket("udp4");
    e.on("message", async (t) => {
      try {
        const s = JSON.parse(t.toString());
        if (s.type === "SMU_ANNOUNCE") {
          console.log("SMU announced:", s);
          const n = await pr(
            `http://${s.ip}:${s.wsPort}`,
            3e3
          );
          e.close(), r(n);
        }
      } catch {
      }
    }), e.bind(eo, () => {
      console.log("Listening for SMU UDP broadcasts...");
    });
  });
}
ye.setName("OpenPos Kiosk");
ye.setAppUserModelId("org.openpos.kiosk");
const mr = oe.dirname(br(import.meta.url));
process.env.APP_ROOT = oe.join(mr, "..");
const Mo = !0, Mt = process.env.VITE_DEV_SERVER_URL, qo = oe.join(process.env.APP_ROOT, "dist-electron"), _r = oe.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Mt ? oe.join(process.env.APP_ROOT, "public") : _r;
let S;
function gr() {
  const r = He.getAllDisplays();
  let e = r[0];
  for (const t of r)
    if (t.bounds.height > t.bounds.width) {
      e = t;
      break;
    }
  S = new Ds({
    icon: oe.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    frame: !1,
    resizable: !1,
    transparent: !0,
    roundedCorners: !1,
    fullscreenable: !0,
    width: 800,
    height: 500,
    x: e.bounds.x + (e.bounds.width - 800) / 2,
    y: e.bounds.y + (e.bounds.height - 500) / 2,
    kiosk: !1,
    show: !1,
    backgroundColor: "#000000",
    webPreferences: {
      preload: oe.join(mr, "preload.mjs")
    }
  }), Mt ? S.loadURL(Mt) : S.loadFile(oe.join(_r, "index.html")), S.once("ready-to-show", () => {
    S == null || S.show(), ot.start();
  });
}
function Ps(r) {
  if (!S) return;
  const e = He.getAllDisplays().some((t) => t.bounds.height > t.bounds.width);
  if (r)
    if (e) {
      const t = He.getAllDisplays();
      let s = t[0];
      for (const n of t)
        if (n.bounds.height > n.bounds.width) {
          s = n;
          break;
        }
      S.setKiosk(!1), S.setResizable(!0), S.setSize(s.bounds.width, s.bounds.height), S.setPosition(s.bounds.x, s.bounds.y), S.maximize();
    } else {
      I("No vertical monitor found, not enabling kiosk mode"), S.setKiosk(!1), S.setResizable(!0);
      const t = He.getPrimaryDisplay().workAreaSize.height, s = Math.round(t * 9 / 16);
      S.setPosition(0, 0), S.setSize(s, t);
    }
  else
    S.setSize(800, 500), S.setKiosk(!1), S.setFullScreen(!1), S.setResizable(!1);
}
function I(r) {
  console.log(`[SMU] ${r}`);
  try {
    S == null || S.webContents.send("log-message", { message: r });
  } catch {
  }
}
class ro {
  constructor() {
    re(this, "socket", null);
    re(this, "status", "disconnected");
    re(this, "reconnecting", !1);
    re(this, "reconnectAttempts", 0);
    re(this, "maxReconnectDelay", 1e4);
    re(this, "baseReconnectDelay", 2e3);
    re(this, "isRunning", !1);
  }
  start() {
    if (this.isRunning) {
      I("Connection manager already running");
      return;
    }
    this.isRunning = !0, I("Starting SMU connection manager..."), this.connect();
  }
  stop() {
    this.isRunning = !1, this.cleanup();
  }
  getStatus() {
    return this.status;
  }
  async connect() {
    if (this.isRunning) {
      if (this.reconnecting) {
        I("Already attempting to reconnect, skipping...");
        return;
      }
      this.reconnecting = !0;
      try {
        I(`Connection attempt ${this.reconnectAttempts + 1}...`);
        const e = await to();
        this.socket = e, this.reconnectAttempts = 0, I("SMU connection established"), this.setupSocketListeners(), I("Requesting kiosk assets..."), await this.socket.emit("kiosk:assets:request"), I("Requesting products..."), await this.socket.emit("kiosk:products:request");
        try {
          this.socket.send(
            JSON.stringify({
              type: "HELLO",
              role: "KIOSK"
            })
          );
        } catch (t) {
          I("Failed to send HELLO message: " + t);
        }
        this.reconnecting = !1;
      } catch (e) {
        this.reconnecting = !1, this.reconnectAttempts++;
        const t = Math.min(
          this.baseReconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
          this.maxReconnectDelay
        );
        I(
          `Connection failed (attempt ${this.reconnectAttempts}). Retrying in ${t}ms... Error: ${e}`
        ), this.updateStatus("disconnected"), this.isRunning && setTimeout(() => this.connect(), t);
      }
    }
  }
  setupSocketListeners() {
    this.socket && (this.socket.removeAllListeners(), this.socket.on("kiosk:assets:response", (e) => {
      I("Received kiosk assets info: " + JSON.stringify(e));
    }), this.socket.on("kiosk:products:response", (e) => {
      I("Received products info: " + JSON.stringify(e)), this.updateStatus("connected"), Ps(!0);
    }), this.socket.on("disconnect", (e) => {
      I(`SMU socket disconnected: ${e}`), this.handleDisconnection();
    }), this.socket.on("connect_error", (e) => {
      I(`SMU connection error: ${e}`), this.handleDisconnection();
    }));
  }
  handleDisconnection() {
    this.cleanup(), this.updateStatus("disconnected"), Ps(!1), this.isRunning && setTimeout(() => this.connect(), 1e3);
  }
  cleanup() {
    if (this.socket) {
      try {
        this.socket.removeAllListeners(), this.socket.disconnect();
      } catch (e) {
        I("Error during socket cleanup: " + e);
      }
      this.socket = null;
    }
  }
  updateStatus(e) {
    this.status = e, I(`Status updated: ${e}`);
    try {
      S == null || S.webContents.send("scu-status", { status: e });
    } catch {
    }
  }
}
const ot = new ro();
ye.on("window-all-closed", () => {
  ot.stop(), ye.quit(), S = null;
});
ye.on("activate", () => {
  Ds.getAllWindows().length === 0 && gr();
});
ye.whenReady().then(async () => {
  gr();
});
Fs.on("scu-request-status", () => {
  const r = ot.getStatus();
  try {
    S == null || S.webContents.send("scu-status", { status: r });
  } catch {
  }
});
Fs.handle("scu-get-status", async () => ot.getStatus());
export {
  Mo as DEVMODE,
  qo as MAIN_DIST,
  _r as RENDERER_DIST,
  Mt as VITE_DEV_SERVER_URL
};
