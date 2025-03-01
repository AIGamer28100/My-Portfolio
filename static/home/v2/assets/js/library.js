/**
 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.2
 */
;(function(f) {
    "use strict";
    "function" === typeof define && define.amd ? define(["jquery"], f) : "undefined" !== typeof module && module.exports ? module.exports = f(require("jquery")) : f(jQuery)
}
)(function($) {
    "use strict";
    function n(a) {
        return !a.nodeName || -1 !== $.inArray(a.nodeName.toLowerCase(), ["iframe", "#document", "html", "body"])
    }
    function h(a) {
        return $.isFunction(a) || $.isPlainObject(a) ? a : {
            top: a,
            left: a
        }
    }
    var p = $.scrollTo = function(a, d, b) {
        return $(window).scrollTo(a, d, b)
    }
    ;
    p.defaults = {
        axis: "xy",
        duration: 0,
        limit: !0
    };
    $.fn.scrollTo = function(a, d, b) {
        "object" === typeof d && (b = d,
        d = 0);
        "function" === typeof b && (b = {
            onAfter: b
        });
        "max" === a && (a = 9E9);
        b = $.extend({}, p.defaults, b);
        d = d || b.duration;
        var u = b.queue && 1 < b.axis.length;
        u && (d /= 2);
        b.offset = h(b.offset);
        b.over = h(b.over);
        return this.each(function() {
            function k(a) {
                var k = $.extend({}, b, {
                    queue: !0,
                    duration: d,
                    complete: a && function() {
                        a.call(q, e, b)
                    }
                });
                r.animate(f, k)
            }
            if (null !== a) {
                var l = n(this), q = l ? this.contentWindow || window : this, r = $(q), e = a, f = {}, t;
                switch (typeof e) {
                case "number":
                case "string":
                    if (/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)) {
                        e = h(e);
                        break
                    }
                    e = l ? $(e) : $(e, q);
                case "object":
                    if (e.length === 0)
                        return;
                    if (e.is || e.style)
                        t = (e = $(e)).offset()
                }
                var v = $.isFunction(b.offset) && b.offset(q, e) || b.offset;
                $.each(b.axis.split(""), function(a, c) {
                    var d = "x" === c ? "Left" : "Top"
                      , m = d.toLowerCase()
                      , g = "scroll" + d
                      , h = r[g]()
                      , n = p.max(q, c);
                    t ? (f[g] = t[m] + (l ? 0 : h - r.offset()[m]),
                    b.margin && (f[g] -= parseInt(e.css("margin" + d), 10) || 0,
                    f[g] -= parseInt(e.css("border" + d + "Width"), 10) || 0),
                    f[g] += v[m] || 0,
                    b.over[m] && (f[g] += e["x" === c ? "width" : "height"]() * b.over[m])) : (d = e[m],
                    f[g] = d.slice && "%" === d.slice(-1) ? parseFloat(d) / 100 * n : d);
                    b.limit && /^\d+$/.test(f[g]) && (f[g] = 0 >= f[g] ? 0 : Math.min(f[g], n));
                    !a && 1 < b.axis.length && (h === f[g] ? f = {} : u && (k(b.onAfterFirst),
                    f = {}))
                });
                k(b.onAfter)
            }
        })
    }
    ;
    p.max = function(a, d) {
        var b = "x" === d ? "Width" : "Height"
          , h = "scroll" + b;
        if (!n(a))
            return a[h] - $(a)[b.toLowerCase()]();
        var b = "client" + b
          , k = a.ownerDocument || a.document
          , l = k.documentElement
          , k = k.body;
        return Math.max(l[h], k[h]) - Math.min(l[b], k[b])
    }
    ;
    $.Tween.propHooks.scrollLeft = $.Tween.propHooks.scrollTop = {
        get: function(a) {
            return $(a.elem)[a.prop]()
        },
        set: function(a) {
            var d = this.get(a);
            if (a.options.interrupt && a._last && a._last !== d)
                return $(a.elem).stop();
            var b = Math.round(a.now);
            d !== b && ($(a.elem)[a.prop](b),
            a._last = this.get(a))
        }
    };
    return p
});
!function() {
    function e() {
        z.keyboardSupport && f("keydown", a)
    }
    function t() {
        if (!A && document.body) {
            A = !0;
            var t = document.body
              , o = document.documentElement
              , n = window.innerHeight
              , r = t.scrollHeight;
            if (B = document.compatMode.indexOf("CSS") >= 0 ? o : t,
            D = t,
            e(),
            top != self)
                X = !0;
            else if (r > n && (t.offsetHeight <= n || o.offsetHeight <= n)) {
                var a = document.createElement("div");
                a.style.cssText = "position:absolute; z-index:-10000; top:0; left:0; right:0; height:" + B.scrollHeight + "px",
                document.body.appendChild(a);
                var i;
                T = function() {
                    i || (i = setTimeout(function() {
                        L || (a.style.height = "0",
                        a.style.height = B.scrollHeight + "px",
                        i = null)
                    }, 500))
                }
                ,
                setTimeout(T, 10),
                f("resize", T);
                var l = {
                    attributes: !0,
                    childList: !0,
                    characterData: !1
                };
                if (M = new V(T),
                M.observe(t, l),
                B.offsetHeight <= n) {
                    var c = document.createElement("div");
                    c.style.clear = "both",
                    t.appendChild(c)
                }
            }
            z.fixedBackground || L || (t.style.backgroundAttachment = "scroll",
            o.style.backgroundAttachment = "scroll")
        }
    }
    function o() {
        M && M.disconnect(),
        h(I, r),
        h("mousedown", i),
        h("keydown", a),
        h("resize", T),
        h("load", t)
    }
    function n(e, t, o) {
        if (p(t, o),
        1 != z.accelerationMax) {
            var n = Date.now()
              , r = n - R;
            if (r < z.accelerationDelta) {
                var a = (1 + 50 / r) / 2;
                a > 1 && (a = Math.min(a, z.accelerationMax),
                t *= a,
                o *= a)
            }
            R = Date.now()
        }
        if (q.push({
            x: t,
            y: o,
            lastX: 0 > t ? .99 : -.99,
            lastY: 0 > o ? .99 : -.99,
            start: Date.now()
        }),
        !P) {
            var i = e === document.body
              , l = function() {
                for (var n = Date.now(), r = 0, a = 0, c = 0; c < q.length; c++) {
                    var u = q[c]
                      , d = n - u.start
                      , s = d >= z.animationTime
                      , m = s ? 1 : d / z.animationTime;
                    z.pulseAlgorithm && (m = x(m));
                    var f = u.x * m - u.lastX >> 0
                      , h = u.y * m - u.lastY >> 0;
                    r += f,
                    a += h,
                    u.lastX += f,
                    u.lastY += h,
                    s && (q.splice(c, 1),
                    c--)
                }
                i ? window.scrollBy(r, a) : (r && (e.scrollLeft += r),
                a && (e.scrollTop += a)),
                t || o || (q = []),
                q.length ? _(l, e, 1e3 / z.frameRate + 1) : P = !1
            };
            _(l, e, 0),
            P = !0
        }
    }
    function r(e) {
        A || t();
        var o = e.target
          , r = u(o);
        if (!r || e.defaultPrevented || e.ctrlKey)
            return !0;
        if (w(D, "embed") || w(o, "embed") && /\.pdf/i.test(o.src) || w(D, "object"))
            return !0;
        var a = -e.wheelDeltaX || e.deltaX || 0
          , i = -e.wheelDeltaY || e.deltaY || 0;
        return K && (e.wheelDeltaX && b(e.wheelDeltaX, 120) && (a = -120 * (e.wheelDeltaX / Math.abs(e.wheelDeltaX))),
        e.wheelDeltaY && b(e.wheelDeltaY, 120) && (i = -120 * (e.wheelDeltaY / Math.abs(e.wheelDeltaY)))),
        a || i || (i = -e.wheelDelta || 0),
        1 === e.deltaMode && (a *= 40,
        i *= 40),
        !z.touchpadSupport && v(i) ? !0 : (Math.abs(a) > 1.2 && (a *= z.stepSize / 120),
        Math.abs(i) > 1.2 && (i *= z.stepSize / 120),
        n(r, a, i),
        e.preventDefault(),
        void l())
    }
    function a(e) {
        var t = e.target
          , o = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== N.spacebar;
        document.contains(D) || (D = document.activeElement);
        var r = /^(textarea|select|embed|object)$/i
          , a = /^(button|submit|radio|checkbox|file|color|image)$/i;
        if (r.test(t.nodeName) || w(t, "input") && !a.test(t.type) || w(D, "video") || y(e) || t.isContentEditable || e.defaultPrevented || o)
            return !0;
        if ((w(t, "button") || w(t, "input") && a.test(t.type)) && e.keyCode === N.spacebar)
            return !0;
        var i, c = 0, d = 0, s = u(D), m = s.clientHeight;
        switch (s == document.body && (m = window.innerHeight),
        e.keyCode) {
        case N.up:
            d = -z.arrowScroll;
            break;
        case N.down:
            d = z.arrowScroll;
            break;
        case N.spacebar:
            i = e.shiftKey ? 1 : -1,
            d = -i * m * .9;
            break;
        case N.pageup:
            d = .9 * -m;
            break;
        case N.pagedown:
            d = .9 * m;
            break;
        case N.home:
            d = -s.scrollTop;
            break;
        case N.end:
            var f = s.scrollHeight - s.scrollTop - m;
            d = f > 0 ? f + 10 : 0;
            break;
        case N.left:
            c = -z.arrowScroll;
            break;
        case N.right:
            c = z.arrowScroll;
            break;
        default:
            return !0
        }
        n(s, c, d),
        e.preventDefault(),
        l()
    }
    function i(e) {
        D = e.target
    }
    function l() {
        clearTimeout(E),
        E = setInterval(function() {
            F = {}
        }, 1e3)
    }
    function c(e, t) {
        for (var o = e.length; o--; )
            F[j(e[o])] = t;
        return t
    }
    function u(e) {
        var t = []
          , o = document.body
          , n = B.scrollHeight;
        do {
            var r = F[j(e)];
            if (r)
                return c(t, r);
            if (t.push(e),
            n === e.scrollHeight) {
                var a = s(B) && s(o)
                  , i = a || m(B);
                if (X && d(B) || !X && i)
                    return c(t, $())
            } else if (d(e) && m(e))
                return c(t, e)
        } while (e = e.parentElement)
    }
    function d(e) {
        return e.clientHeight + 10 < e.scrollHeight
    }
    function s(e) {
        var t = getComputedStyle(e, "").getPropertyValue("overflow-y");
        return "hidden" !== t
    }
    function m(e) {
        var t = getComputedStyle(e, "").getPropertyValue("overflow-y");
        return "scroll" === t || "auto" === t
    }
    function f(e, t) {
        window.addEventListener(e, t, !1)
    }
    function h(e, t) {
        window.removeEventListener(e, t, !1)
    }
    function w(e, t) {
        return (e.nodeName || "").toLowerCase() === t.toLowerCase()
    }
    function p(e, t) {
        e = e > 0 ? 1 : -1,
        t = t > 0 ? 1 : -1,
        (Y.x !== e || Y.y !== t) && (Y.x = e,
        Y.y = t,
        q = [],
        R = 0)
    }
    function v(e) {
        return e ? (O.length || (O = [e, e, e]),
        e = Math.abs(e),
        O.push(e),
        O.shift(),
        clearTimeout(H),
        H = setTimeout(function() {
            window.localStorage && (localStorage.SS_deltaBuffer = O.join(","))
        }, 1e3),
        !g(120) && !g(100)) : void 0
    }
    function b(e, t) {
        return Math.floor(e / t) == e / t
    }
    function g(e) {
        return b(O[0], e) && b(O[1], e) && b(O[2], e)
    }
    function y(e) {
        var t = e.target
          , o = !1;
        if (-1 != document.URL.indexOf("www.youtube.com/watch"))
            do
                if (o = t.classList && t.classList.contains("html5-video-controls"))
                    break;
            while (t = t.parentNode);
        return o
    }
    function S(e) {
        var t, o, n;
        return e *= z.pulseScale,
        1 > e ? t = e - (1 - Math.exp(-e)) : (o = Math.exp(-1),
        e -= 1,
        n = 1 - Math.exp(-e),
        t = o + n * (1 - o)),
        t * z.pulseNormalize
    }
    function x(e) {
        return e >= 1 ? 1 : 0 >= e ? 0 : (1 == z.pulseNormalize && (z.pulseNormalize /= S(1)),
        S(e))
    }
    function k(e) {
        for (var t in e)
            C.hasOwnProperty(t) && (z[t] = e[t])
    }
    var D, M, T, E, H, C = {
        frameRate: 150,
        animationTime: 400,
        stepSize: 100,
        pulseAlgorithm: !0,
        pulseScale: 4,
        pulseNormalize: 1,
        accelerationDelta: 50,
        accelerationMax: 3,
        keyboardSupport: !0,
        arrowScroll: 50,
        touchpadSupport: !1,
        fixedBackground: !0,
        excluded: ""
    }, z = C, L = !1, X = !1, Y = {
        x: 0,
        y: 0
    }, A = !1, B = document.documentElement, O = [], K = /^Mac/.test(navigator.platform), N = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    }, q = [], P = !1, R = Date.now(), j = function() {
        var e = 0;
        return function(t) {
            return t.uniqueID || (t.uniqueID = e++)
        }
    }(), F = {};
    window.localStorage && localStorage.SS_deltaBuffer && (O = localStorage.SS_deltaBuffer.split(","));
    var I, _ = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e, t, o) {
            window.setTimeout(e, o || 1e3 / 60)
        }
    }(), V = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver, $ = function() {
        var e;
        return function() {
            if (!e) {
                var t = document.createElement("div");
                t.style.cssText = "height:10000px;width:1px;",
                document.body.appendChild(t);
                {
                    var o = document.body.scrollTop;
                    document.documentElement.scrollTop
                }
                window.scrollBy(0, 1),
                e = document.body.scrollTop != o ? document.body : document.documentElement,
                window.scrollBy(0, -1),
                document.body.removeChild(t)
            }
            return e
        }
    }(), U = window.navigator.userAgent, W = /Edge/.test(U), G = /chrome/i.test(U) && !W, J = /safari/i.test(U) && !W, Q = /mobile/i.test(U), Z = (G || J) && !Q;
    "onwheel"in document.createElement("div") ? I = "wheel" : "onmousewheel"in document.createElement("div") && (I = "mousewheel"),
    I && Z && (f(I, r),
    f("mousedown", i),
    f("load", t)),
    k.destroy = o,
    window.SmoothScrollOptions && k(window.SmoothScrollOptions),
    "object" == typeof exports ? module.exports = k : window.SmoothScroll = k
}();
/*
 * jQuery.appear
 * http://code.google.com/p/jquery-appear/
 *
 * Copyright (c) 2009 Michael Hixson
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*/
(function($) {
    $.fn.appear = function(f, o) {
        var s = $.extend({
            one: true
        }, o);
        return this.each(function() {
            var t = $(this);
            t.appeared = false;
            if (!f) {
                t.trigger('appear', s.data);
                return;
            }
            var w = $(window);
            var c = function() {
                if (!t.is(':visible')) {
                    t.appeared = false;
                    return;
                }
                var a = w.scrollLeft();
                var b = w.scrollTop();
                var o = t.offset();
                var x = o.left;
                var y = o.top;
                if (y + t.height() >= b && y <= b + w.height() && x + t.width() >= a && x <= a + w.width()) {
                    if (!t.appeared)
                        t.trigger('appear', s.data);
                } else {
                    t.appeared = false;
                }
            };
            var m = function() {
                t.appeared = true;
                if (s.one) {
                    w.unbind('scroll', c);
                    var i = $.inArray(c, $.fn.appear.checks);
                    if (i >= 0)
                        $.fn.appear.checks.splice(i, 1);
                }
                f.apply(this, arguments);
            };
            if (s.one)
                t.one('appear', s.data, m);
            else
                t.bind('appear', s.data, m);
            w.scroll(c);
            $.fn.appear.checks.push(c);
            (c)();
        });
    }
    ;
    $.extend($.fn.appear, {
        checks: [],
        timeout: null,
        checkAll: function() {
            var l = $.fn.appear.checks.length;
            if (l > 0)
                while (l--)
                    ($.fn.appear.checks[l])();
        },
        run: function() {
            if ($.fn.appear.timeout)
                clearTimeout($.fn.appear.timeout);
            $.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
        }
    });
    $.each(['append', 'prepend', 'after', 'before', 'attr', 'removeAttr', 'addClass', 'removeClass', 'toggleClass', 'remove', 'css', 'show', 'hide'], function(i, n) {
        var u = $.fn[n];
        if (u) {
            $.fn[n] = function() {
                var r = u.apply(this, arguments);
                $.fn.appear.run();
                return r;
            }
        }
    });
}
)(jQuery);
!function(a, b) {
    "function" == typeof define && define.amd ? define(["jquery"], b) : b(a.jQuery)
}(this, function(a) {
    "use strict";
    function e(d, e) {
        this.element = d,
        this.$element = a(this.element),
        this.options = a.extend({}, c, e),
        this._defaults = c,
        this._name = b,
        this.init()
    }
    var b = "scrolly"
      , c = {
        bgParallax: !1
    };
    e.prototype.init = function() {
        var b = this;
        this.startPosition = this.$element.position().top,
        this.offsetTop = this.$element.offset().top,
        this.height = this.$element.outerHeight(!0),
        this.velocity = this.$element.attr("data-velocity"),
        this.bgStart = parseInt(this.$element.attr("data-fit"), 10),
        a(document).scroll(function() {
            b.didScroll = !0
        }),
        setInterval(function() {
            b.didScroll && (b.didScroll = !1,
            b.scrolly())
        }, 10)
    }
    ,
    e.prototype.scrolly = function() {
        var b = a(window).scrollTop()
          , c = a(window).height()
          , d = this.startPosition;
        this.offsetTop >= b + c ? this.$element.addClass("scrolly-invisible") : d = this.$element.hasClass("scrolly-invisible") ? this.startPosition + (b + (c - this.offsetTop)) * this.velocity : this.startPosition + b * this.velocity,
        this.bgStart && (d += this.bgStart),
        this.options.bgParallax === !0 ? this.$element.css({
            backgroundPosition: "50% " + d + "px"
        }) : this.$element.css({
            top: d
        })
    }
    ,
    a.fn[b] = function(c) {
        return this.each(function() {
            a.data(this, "plugin_" + b) || a.data(this, "plugin_" + b, new e(this,c))
        })
    }
});
(function(e) {
    e.extend({
        browserSelector: function() {
            var e = navigator.userAgent
              , t = e.toLowerCase()
              , n = function(e) {
                return t.indexOf(e) > -1
            }
              , r = "gecko"
              , i = "webkit"
              , s = "safari"
              , o = "opera"
              , u = document.documentElement
              , a = [!/opera|webtv/i.test(t) && /msie\s(\d)/.test(t) ? "ie ie" + parseFloat(navigator.appVersion.split("MSIE")[1]) : n("firefox/2") ? r + " ff2" : n("firefox/3.5") ? r + " ff3 ff3_5" : n("firefox/3") ? r + " ff3" : n("gecko/") ? r : n("opera") ? o + (/version\/(\d+)/.test(t) ? " " + o + RegExp.jQuery1 : /opera(\s|\/)(\d+)/.test(t) ? " " + o + RegExp.jQuery2 : "") : n("konqueror") ? "konqueror" : n("chrome") ? i + " chrome" : n("iron") ? i + " iron" : n("applewebkit/") ? i + " " + s + (/version\/(\d+)/.test(t) ? " " + s + RegExp.jQuery1 : "") : n("mozilla/") ? r : "", n("j2me") ? "mobile" : n("iphone") ? "iphone" : n("ipod") ? "ipod" : n("mac") ? "mac" : n("darwin") ? "mac" : n("webtv") ? "webtv" : n("win") ? "win" : n("freebsd") ? "freebsd" : n("x11") || n("linux") ? "linux" : "", "js"];
            c = a.join(" ");
            u.className += " " + c
        }
    })
}
)(jQuery);
(function(e) {
    e.extend({
        smoothScroll: function() {
            function c() {
                var e = false;
                if (document.URL.indexOf("google.com/reader/view") > -1) {
                    e = true
                }
                if (t.excluded) {
                    var r = t.excluded.split(/[,\n] ?/);
                    r.push("mail.google.com");
                    for (var i = r.length; i--; ) {
                        if (document.URL.indexOf(r[i]) > -1) {
                            a && a.disconnect();
                            N("mousewheel", g);
                            e = true;
                            n = true;
                            break
                        }
                    }
                }
                if (e) {
                    N("keydown", y)
                }
                if (t.keyboardSupport && !e) {
                    T("keydown", y)
                }
            }
            function h() {
                if (!document.body)
                    return;
                var e = document.body;
                var i = document.documentElement;
                var f = window.innerHeight;
                var l = e.scrollHeight;
                o = document.compatMode.indexOf("CSS") >= 0 ? i : e;
                u = e;
                c();
                s = true;
                if (top != self) {
                    r = true
                } else if (l > f && (e.offsetHeight <= f || i.offsetHeight <= f)) {
                    var h = false;
                    var p = function() {
                        if (!h && i.scrollHeight != document.height) {
                            h = true;
                            setTimeout(function() {
                                i.style.height = document.height + "px";
                                h = false
                            }, 500)
                        }
                    };
                    i.style.height = "auto";
                    setTimeout(p, 10);
                    var d = {
                        attributes: true,
                        childList: true,
                        characterData: false
                    };
                    a = new _(p);
                    a.observe(e, d);
                    if (o.offsetHeight <= f) {
                        var v = document.createElement("div");
                        v.style.clear = "both";
                        e.appendChild(v)
                    }
                }
                if (document.URL.indexOf("mail.google.com") > -1) {
                    var m = document.createElement("style");
                    m.innerHTML = ".iu { visibility: hidden }";
                    (document.getElementsByTagName("head")[0] || i).appendChild(m)
                } else if (document.URL.indexOf("www.facebook.com") > -1) {
                    var g = document.getElementById("home_stream");
                    g && (g.style.webkitTransform = "translateZ(0)")
                }
                if (!t.fixedBackground && !n) {
                    e.style.backgroundAttachment = "scroll";
                    i.style.backgroundAttachment = "scroll"
                }
            }
            function m(e, n, r, i) {
                i || (i = 1e3);
                k(n, r);
                if (t.accelerationMax != 1) {
                    var s = +(new Date);
                    var o = s - v;
                    if (o < t.accelerationDelta) {
                        var u = (1 + 30 / o) / 2;
                        if (u > 1) {
                            u = Math.min(u, t.accelerationMax);
                            n *= u;
                            r *= u
                        }
                    }
                    v = +(new Date)
                }
                p.push({
                    x: n,
                    y: r,
                    lastX: n < 0 ? .99 : -.99,
                    lastY: r < 0 ? .99 : -.99,
                    start: +(new Date)
                });
                if (d) {
                    return
                }
                var a = e === document.body;
                var f = function(s) {
                    var o = +(new Date);
                    var u = 0;
                    var l = 0;
                    for (var c = 0; c < p.length; c++) {
                        var h = p[c];
                        var v = o - h.start;
                        var m = v >= t.animationTime;
                        var g = m ? 1 : v / t.animationTime;
                        if (t.pulseAlgorithm) {
                            g = P(g)
                        }
                        var y = h.x * g - h.lastX >> 0;
                        var b = h.y * g - h.lastY >> 0;
                        u += y;
                        l += b;
                        h.lastX += y;
                        h.lastY += b;
                        if (m) {
                            p.splice(c, 1);
                            c--
                        }
                    }
                    if (a) {
                        window.scrollBy(u, l)
                    } else {
                        if (u)
                            e.scrollLeft += u;
                        if (l)
                            e.scrollTop += l
                    }
                    if (!n && !r) {
                        p = []
                    }
                    if (p.length) {
                        M(f, e, i / t.frameRate + 1)
                    } else {
                        d = false
                    }
                };
                M(f, e, 0);
                d = true
            }
            function g(e) {
                if (!s) {
                    h()
                }
                var n = e.target;
                var r = x(n);
                if (!r || e.defaultPrevented || C(u, "embed") || C(n, "embed") && /\.pdf/i.test(n.src)) {
                    return true
                }
                var i = e.wheelDeltaX || 0;
                var o = e.wheelDeltaY || 0;
                if (!i && !o) {
                    o = e.wheelDelta || 0
                }
                if (!t.touchpadSupport && A(o)) {
                    return true
                }
                if (Math.abs(i) > 1.2) {
                    i *= t.stepSize / 120
                }
                if (Math.abs(o) > 1.2) {
                    o *= t.stepSize / 120
                }
                m(r, -i, -o);
                e.preventDefault()
            }
            function y(e) {
                var n = e.target;
                var r = e.ctrlKey || e.altKey || e.metaKey || e.shiftKey && e.keyCode !== l.spacebar;
                if (/input|textarea|select|embed/i.test(n.nodeName) || n.isContentEditable || e.defaultPrevented || r) {
                    return true
                }
                if (C(n, "button") && e.keyCode === l.spacebar) {
                    return true
                }
                var i, s = 0, o = 0;
                var a = x(u);
                var f = a.clientHeight;
                if (a == document.body) {
                    f = window.innerHeight
                }
                switch (e.keyCode) {
                case l.up:
                    o = -t.arrowScroll;
                    break;
                case l.down:
                    o = t.arrowScroll;
                    break;
                case l.spacebar:
                    i = e.shiftKey ? 1 : -1;
                    o = -i * f * .9;
                    break;
                case l.pageup:
                    o = -f * .9;
                    break;
                case l.pagedown:
                    o = f * .9;
                    break;
                case l.home:
                    o = -a.scrollTop;
                    break;
                case l.end:
                    var c = a.scrollHeight - a.scrollTop - f;
                    o = c > 0 ? c + 10 : 0;
                    break;
                case l.left:
                    s = -t.arrowScroll;
                    break;
                case l.right:
                    s = t.arrowScroll;
                    break;
                default:
                    return true
                }
                m(a, s, o);
                e.preventDefault()
            }
            function b(e) {
                u = e.target
            }
            function S(e, t) {
                for (var n = e.length; n--; )
                    w[E(e[n])] = t;
                return t
            }
            function x(e) {
                var t = [];
                var n = o.scrollHeight;
                do {
                    var i = w[E(e)];
                    if (i) {
                        return S(t, i)
                    }
                    t.push(e);
                    if (n === e.scrollHeight) {
                        if (!r || o.clientHeight + 10 < n) {
                            return S(t, document.body)
                        }
                    } else if (e.clientHeight + 10 < e.scrollHeight) {
                        overflow = getComputedStyle(e, "").getPropertyValue("overflow-y");
                        if (overflow === "scroll" || overflow === "auto") {
                            return S(t, e)
                        }
                    }
                } while (e = e.parentNode)
            }
            function T(e, t, n) {
                window.addEventListener(e, t, n || false)
            }
            function N(e, t, n) {
                window.removeEventListener(e, t, n || false)
            }
            function C(e, t) {
                return (e.nodeName || "").toLowerCase() === t.toLowerCase()
            }
            function k(e, t) {
                e = e > 0 ? 1 : -1;
                t = t > 0 ? 1 : -1;
                if (i.x !== e || i.y !== t) {
                    i.x = e;
                    i.y = t;
                    p = [];
                    v = 0
                }
            }
            function A(e) {
                if (!e)
                    return;
                e = Math.abs(e);
                f.push(e);
                f.shift();
                clearTimeout(L);
                var t = f[0] == f[1] && f[1] == f[2];
                var n = O(f[0], 120) && O(f[1], 120) && O(f[2], 120);
                return !(t || n)
            }
            function O(e, t) {
                return Math.floor(e / t) == e / t
            }
            function D(e) {
                var n, r, i;
                e = e * t.pulseScale;
                if (e < 1) {
                    n = e - (1 - Math.exp(-e))
                } else {
                    r = Math.exp(-1);
                    e -= 1;
                    i = 1 - Math.exp(-e);
                    n = r + i * (1 - r)
                }
                return n * t.pulseNormalize
            }
            function P(e) {
                if (e >= 1)
                    return 1;
                if (e <= 0)
                    return 0;
                if (t.pulseNormalize == 1) {
                    t.pulseNormalize /= D(1)
                }
                return D(e)
            }
            var e = {
                frameRate: 150,
                animationTime: 700,
                stepSize: 80,
                pulseAlgorithm: true,
                pulseScale: 8,
                pulseNormalize: 1,
                accelerationDelta: 20,
                accelerationMax: 1,
                keyboardSupport: true,
                arrowScroll: 50,
                touchpadSupport: true,
                fixedBackground: true,
                excluded: ""
            };
            var t = e;
            var n = false;
            var r = false;
            var i = {
                x: 0,
                y: 0
            };
            var s = false;
            var o = document.documentElement;
            var u;
            var a;
            var f = [120, 120, 120];
            var l = {
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                spacebar: 32,
                pageup: 33,
                pagedown: 34,
                end: 35,
                home: 36
            };
            var p = [];
            var d = false;
            var v = +(new Date);
            var w = {};
            setInterval(function() {
                w = {}
            }, 10 * 1e3);
            var E = function() {
                var e = 0;
                return function(t) {
                    return t.uniqueID || (t.uniqueID = e++)
                }
            }();
            var L;
            var M = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(e, t, n) {
                    window.setTimeout(e, n || 1e3 / 60)
                }
            }();
            var _ = window.MutationObserver || window.WebKitMutationObserver;
            T("mousedown", b);
            T("mousewheel", g);
            T("load", h)
        }
    })
}
)(jQuery);
/*! pace 1.0.2 */
(function() {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X = [].slice, Y = {}.hasOwnProperty, Z = function(a, b) {
        function c() {
            this.constructor = a
        }
        for (var d in b)
            Y.call(b, d) && (a[d] = b[d]);
        return c.prototype = b.prototype,
        a.prototype = new c,
        a.__super__ = b.prototype,
        a
    }, $ = [].indexOf || function(a) {
        for (var b = 0, c = this.length; c > b; b++)
            if (b in this && this[b] === a)
                return b;
        return -1
    }
    ;
    for (u = {
        catchupTime: 100,
        initialRate: .03,
        minTime: 250,
        ghostTime: 100,
        maxProgressPerFrame: 20,
        easeFactor: 1.25,
        startOnPageLoad: !0,
        restartOnPushState: !0,
        restartOnRequestAfter: 500,
        target: "body",
        elements: {
            checkInterval: 100,
            selectors: ["body"]
        },
        eventLag: {
            minSamples: 10,
            sampleCount: 3,
            lagThreshold: 3
        },
        ajax: {
            trackMethods: ["GET"],
            trackWebSockets: !0,
            ignoreURLs: []
        }
    },
    C = function() {
        var a;
        return null != (a = "undefined" != typeof performance && null !== performance && "function" == typeof performance.now ? performance.now() : void 0) ? a : +new Date
    }
    ,
    E = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
    t = window.cancelAnimationFrame || window.mozCancelAnimationFrame,
    null == E && (E = function(a) {
        return setTimeout(a, 50)
    }
    ,
    t = function(a) {
        return clearTimeout(a)
    }
    ),
    G = function(a) {
        var b, c;
        return b = C(),
        (c = function() {
            var d;
            return d = C() - b,
            d >= 33 ? (b = C(),
            a(d, function() {
                return E(c)
            })) : setTimeout(c, 33 - d)
        }
        )()
    }
    ,
    F = function() {
        var a, b, c;
        return c = arguments[0],
        b = arguments[1],
        a = 3 <= arguments.length ? X.call(arguments, 2) : [],
        "function" == typeof c[b] ? c[b].apply(c, a) : c[b]
    }
    ,
    v = function() {
        var a, b, c, d, e, f, g;
        for (b = arguments[0],
        d = 2 <= arguments.length ? X.call(arguments, 1) : [],
        f = 0,
        g = d.length; g > f; f++)
            if (c = d[f])
                for (a in c)
                    Y.call(c, a) && (e = c[a],
                    null != b[a] && "object" == typeof b[a] && null != e && "object" == typeof e ? v(b[a], e) : b[a] = e);
        return b
    }
    ,
    q = function(a) {
        var b, c, d, e, f;
        for (c = b = 0,
        e = 0,
        f = a.length; f > e; e++)
            d = a[e],
            c += Math.abs(d),
            b++;
        return c / b
    }
    ,
    x = function(a, b) {
        var c, d, e;
        if (null == a && (a = "options"),
        null == b && (b = !0),
        e = document.querySelector("[data-pace-" + a + "]")) {
            if (c = e.getAttribute("data-pace-" + a),
            !b)
                return c;
            try {
                return JSON.parse(c)
            } catch (f) {
                return d = f,
                "undefined" != typeof console && null !== console ? console.error("Error parsing inline pace options", d) : void 0
            }
        }
    }
    ,
    g = function() {
        function a() {}
        return a.prototype.on = function(a, b, c, d) {
            var e;
            return null == d && (d = !1),
            null == this.bindings && (this.bindings = {}),
            null == (e = this.bindings)[a] && (e[a] = []),
            this.bindings[a].push({
                handler: b,
                ctx: c,
                once: d
            })
        }
        ,
        a.prototype.once = function(a, b, c) {
            return this.on(a, b, c, !0)
        }
        ,
        a.prototype.off = function(a, b) {
            var c, d, e;
            if (null != (null != (d = this.bindings) ? d[a] : void 0)) {
                if (null == b)
                    return delete this.bindings[a];
                for (c = 0,
                e = []; c < this.bindings[a].length; )
                    e.push(this.bindings[a][c].handler === b ? this.bindings[a].splice(c, 1) : c++);
                return e
            }
        }
        ,
        a.prototype.trigger = function() {
            var a, b, c, d, e, f, g, h, i;
            if (c = arguments[0],
            a = 2 <= arguments.length ? X.call(arguments, 1) : [],
            null != (g = this.bindings) ? g[c] : void 0) {
                for (e = 0,
                i = []; e < this.bindings[c].length; )
                    h = this.bindings[c][e],
                    d = h.handler,
                    b = h.ctx,
                    f = h.once,
                    d.apply(null != b ? b : this, a),
                    i.push(f ? this.bindings[c].splice(e, 1) : e++);
                return i
            }
        }
        ,
        a
    }(),
    j = window.Pace || {},
    window.Pace = j,
    v(j, g.prototype),
    D = j.options = v({}, u, window.paceOptions, x()),
    U = ["ajax", "document", "eventLag", "elements"],
    Q = 0,
    S = U.length; S > Q; Q++)
        K = U[Q],
        D[K] === !0 && (D[K] = u[K]);
    i = function(a) {
        function b() {
            return V = b.__super__.constructor.apply(this, arguments)
        }
        return Z(b, a),
        b
    }(Error),
    b = function() {
        function a() {
            this.progress = 0
        }
        return a.prototype.getElement = function() {
            var a;
            if (null == this.el) {
                if (a = document.querySelector(D.target),
                !a)
                    throw new i;
                this.el = document.createElement("div"),
                this.el.className = "pace pace-active",
                document.body.className = document.body.className.replace(/pace-done/g, ""),
                document.body.className += " pace-running",
                this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',
                null != a.firstChild ? a.insertBefore(this.el, a.firstChild) : a.appendChild(this.el)
            }
            return this.el
        }
        ,
        a.prototype.finish = function() {
            var a;
            return a = this.getElement(),
            a.className = a.className.replace("pace-active", ""),
            a.className += " pace-inactive",
            document.body.className = document.body.className.replace("pace-running", ""),
            document.body.className += "pace-done"
        }
        ,
        a.prototype.update = function(a) {
            return this.progress = a,
            this.render()
        }
        ,
        a.prototype.destroy = function() {
            try {
                this.getElement().parentNode.removeChild(this.getElement())
            } catch (a) {
                i = a
            }
            return this.el = void 0
        }
        ,
        a.prototype.render = function() {
            var a, b, c, d, e, f, g;
            if (null == document.querySelector(D.target))
                return !1;
            for (a = this.getElement(),
            d = "translate3d(" + this.progress + "%, 0, 0)",
            g = ["webkitTransform", "msTransform", "transform"],
            e = 0,
            f = g.length; f > e; e++)
                b = g[e],
                a.children[0].style[b] = d;
            return (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) && (a.children[0].setAttribute("data-progress-text", "" + (0 | this.progress) + "%"),
            this.progress >= 100 ? c = "99" : (c = this.progress < 10 ? "0" : "",
            c += 0 | this.progress),
            a.children[0].setAttribute("data-progress", "" + c)),
            this.lastRenderedProgress = this.progress
        }
        ,
        a.prototype.done = function() {
            return this.progress >= 100
        }
        ,
        a
    }(),
    h = function() {
        function a() {
            this.bindings = {}
        }
        return a.prototype.trigger = function(a, b) {
            var c, d, e, f, g;
            if (null != this.bindings[a]) {
                for (f = this.bindings[a],
                g = [],
                d = 0,
                e = f.length; e > d; d++)
                    c = f[d],
                    g.push(c.call(this, b));
                return g
            }
        }
        ,
        a.prototype.on = function(a, b) {
            var c;
            return null == (c = this.bindings)[a] && (c[a] = []),
            this.bindings[a].push(b)
        }
        ,
        a
    }(),
    P = window.XMLHttpRequest,
    O = window.XDomainRequest,
    N = window.WebSocket,
    w = function(a, b) {
        var c, d, e;
        e = [];
        for (d in b.prototype)
            try {
                e.push(null == a[d] && "function" != typeof b[d] ? "function" == typeof Object.defineProperty ? Object.defineProperty(a, d, {
                    get: function() {
                        return b.prototype[d]
                    },
                    configurable: !0,
                    enumerable: !0
                }) : a[d] = b.prototype[d] : void 0)
            } catch (f) {
                c = f
            }
        return e
    }
    ,
    A = [],
    j.ignore = function() {
        var a, b, c;
        return b = arguments[0],
        a = 2 <= arguments.length ? X.call(arguments, 1) : [],
        A.unshift("ignore"),
        c = b.apply(null, a),
        A.shift(),
        c
    }
    ,
    j.track = function() {
        var a, b, c;
        return b = arguments[0],
        a = 2 <= arguments.length ? X.call(arguments, 1) : [],
        A.unshift("track"),
        c = b.apply(null, a),
        A.shift(),
        c
    }
    ,
    J = function(a) {
        var b;
        if (null == a && (a = "GET"),
        "track" === A[0])
            return "force";
        if (!A.length && D.ajax) {
            if ("socket" === a && D.ajax.trackWebSockets)
                return !0;
            if (b = a.toUpperCase(),
            $.call(D.ajax.trackMethods, b) >= 0)
                return !0
        }
        return !1
    }
    ,
    k = function(a) {
        function b() {
            var a, c = this;
            b.__super__.constructor.apply(this, arguments),
            a = function(a) {
                var b;
                return b = a.open,
                a.open = function(d, e) {
                    return J(d) && c.trigger("request", {
                        type: d,
                        url: e,
                        request: a
                    }),
                    b.apply(a, arguments)
                }
            }
            ,
            window.XMLHttpRequest = function(b) {
                var c;
                return c = new P(b),
                a(c),
                c
            }
            ;
            try {
                w(window.XMLHttpRequest, P)
            } catch (d) {}
            if (null != O) {
                window.XDomainRequest = function() {
                    var b;
                    return b = new O,
                    a(b),
                    b
                }
                ;
                try {
                    w(window.XDomainRequest, O)
                } catch (d) {}
            }
            if (null != N && D.ajax.trackWebSockets) {
                window.WebSocket = function(a, b) {
                    var d;
                    return d = null != b ? new N(a,b) : new N(a),
                    J("socket") && c.trigger("request", {
                        type: "socket",
                        url: a,
                        protocols: b,
                        request: d
                    }),
                    d
                }
                ;
                try {
                    w(window.WebSocket, N)
                } catch (d) {}
            }
        }
        return Z(b, a),
        b
    }(h),
    R = null,
    y = function() {
        return null == R && (R = new k),
        R
    }
    ,
    I = function(a) {
        var b, c, d, e;
        for (e = D.ajax.ignoreURLs,
        c = 0,
        d = e.length; d > c; c++)
            if (b = e[c],
            "string" == typeof b) {
                if (-1 !== a.indexOf(b))
                    return !0
            } else if (b.test(a))
                return !0;
        return !1
    }
    ,
    y().on("request", function(b) {
        var c, d, e, f, g;
        return f = b.type,
        e = b.request,
        g = b.url,
        I(g) ? void 0 : j.running || D.restartOnRequestAfter === !1 && "force" !== J(f) ? void 0 : (d = arguments,
        c = D.restartOnRequestAfter || 0,
        "boolean" == typeof c && (c = 0),
        setTimeout(function() {
            var b, c, g, h, i, k;
            if (b = "socket" === f ? e.readyState < 2 : 0 < (h = e.readyState) && 4 > h) {
                for (j.restart(),
                i = j.sources,
                k = [],
                c = 0,
                g = i.length; g > c; c++) {
                    if (K = i[c],
                    K instanceof a) {
                        K.watch.apply(K, d);
                        break
                    }
                    k.push(void 0)
                }
                return k
            }
        }, c))
    }),
    a = function() {
        function a() {
            var a = this;
            this.elements = [],
            y().on("request", function() {
                return a.watch.apply(a, arguments)
            })
        }
        return a.prototype.watch = function(a) {
            var b, c, d, e;
            return d = a.type,
            b = a.request,
            e = a.url,
            I(e) ? void 0 : (c = "socket" === d ? new n(b) : new o(b),
            this.elements.push(c))
        }
        ,
        a
    }(),
    o = function() {
        function a(a) {
            var b, c, d, e, f, g, h = this;
            if (this.progress = 0,
            null != window.ProgressEvent)
                for (c = null,
                a.addEventListener("progress", function(a) {
                    return h.progress = a.lengthComputable ? 100 * a.loaded / a.total : h.progress + (100 - h.progress) / 2
                }, !1),
                g = ["load", "abort", "timeout", "error"],
                d = 0,
                e = g.length; e > d; d++)
                    b = g[d],
                    a.addEventListener(b, function() {
                        return h.progress = 100
                    }, !1);
            else
                f = a.onreadystatechange,
                a.onreadystatechange = function() {
                    var b;
                    return 0 === (b = a.readyState) || 4 === b ? h.progress = 100 : 3 === a.readyState && (h.progress = 50),
                    "function" == typeof f ? f.apply(null, arguments) : void 0
                }
        }
        return a
    }(),
    n = function() {
        function a(a) {
            var b, c, d, e, f = this;
            for (this.progress = 0,
            e = ["error", "open"],
            c = 0,
            d = e.length; d > c; c++)
                b = e[c],
                a.addEventListener(b, function() {
                    return f.progress = 100
                }, !1)
        }
        return a
    }(),
    d = function() {
        function a(a) {
            var b, c, d, f;
            for (null == a && (a = {}),
            this.elements = [],
            null == a.selectors && (a.selectors = []),
            f = a.selectors,
            c = 0,
            d = f.length; d > c; c++)
                b = f[c],
                this.elements.push(new e(b))
        }
        return a
    }(),
    e = function() {
        function a(a) {
            this.selector = a,
            this.progress = 0,
            this.check()
        }
        return a.prototype.check = function() {
            var a = this;
            return document.querySelector(this.selector) ? this.done() : setTimeout(function() {
                return a.check()
            }, D.elements.checkInterval)
        }
        ,
        a.prototype.done = function() {
            return this.progress = 100
        }
        ,
        a
    }(),
    c = function() {
        function a() {
            var a, b, c = this;
            this.progress = null != (b = this.states[document.readyState]) ? b : 100,
            a = document.onreadystatechange,
            document.onreadystatechange = function() {
                return null != c.states[document.readyState] && (c.progress = c.states[document.readyState]),
                "function" == typeof a ? a.apply(null, arguments) : void 0
            }
        }
        return a.prototype.states = {
            loading: 0,
            interactive: 50,
            complete: 100
        },
        a
    }(),
    f = function() {
        function a() {
            var a, b, c, d, e, f = this;
            this.progress = 0,
            a = 0,
            e = [],
            d = 0,
            c = C(),
            b = setInterval(function() {
                var g;
                return g = C() - c - 50,
                c = C(),
                e.push(g),
                e.length > D.eventLag.sampleCount && e.shift(),
                a = q(e),
                ++d >= D.eventLag.minSamples && a < D.eventLag.lagThreshold ? (f.progress = 100,
                clearInterval(b)) : f.progress = 100 * (3 / (a + 3))
            }, 50)
        }
        return a
    }(),
    m = function() {
        function a(a) {
            this.source = a,
            this.last = this.sinceLastUpdate = 0,
            this.rate = D.initialRate,
            this.catchup = 0,
            this.progress = this.lastProgress = 0,
            null != this.source && (this.progress = F(this.source, "progress"))
        }
        return a.prototype.tick = function(a, b) {
            var c;
            return null == b && (b = F(this.source, "progress")),
            b >= 100 && (this.done = !0),
            b === this.last ? this.sinceLastUpdate += a : (this.sinceLastUpdate && (this.rate = (b - this.last) / this.sinceLastUpdate),
            this.catchup = (b - this.progress) / D.catchupTime,
            this.sinceLastUpdate = 0,
            this.last = b),
            b > this.progress && (this.progress += this.catchup * a),
            c = 1 - Math.pow(this.progress / 100, D.easeFactor),
            this.progress += c * this.rate * a,
            this.progress = Math.min(this.lastProgress + D.maxProgressPerFrame, this.progress),
            this.progress = Math.max(0, this.progress),
            this.progress = Math.min(100, this.progress),
            this.lastProgress = this.progress,
            this.progress
        }
        ,
        a
    }(),
    L = null,
    H = null,
    r = null,
    M = null,
    p = null,
    s = null,
    j.running = !1,
    z = function() {
        return D.restartOnPushState ? j.restart() : void 0
    }
    ,
    null != window.history.pushState && (T = window.history.pushState,
    window.history.pushState = function() {
        return z(),
        T.apply(window.history, arguments)
    }
    ),
    null != window.history.replaceState && (W = window.history.replaceState,
    window.history.replaceState = function() {
        return z(),
        W.apply(window.history, arguments)
    }
    ),
    l = {
        ajax: a,
        elements: d,
        document: c,
        eventLag: f
    },
    (B = function() {
        var a, c, d, e, f, g, h, i;
        for (j.sources = L = [],
        g = ["ajax", "elements", "document", "eventLag"],
        c = 0,
        e = g.length; e > c; c++)
            a = g[c],
            D[a] !== !1 && L.push(new l[a](D[a]));
        for (i = null != (h = D.extraSources) ? h : [],
        d = 0,
        f = i.length; f > d; d++)
            K = i[d],
            L.push(new K(D));
        return j.bar = r = new b,
        H = [],
        M = new m
    }
    )(),
    j.stop = function() {
        return j.trigger("stop"),
        j.running = !1,
        r.destroy(),
        s = !0,
        null != p && ("function" == typeof t && t(p),
        p = null),
        B()
    }
    ,
    j.restart = function() {
        return j.trigger("restart"),
        j.stop(),
        j.start()
    }
    ,
    j.go = function() {
        var a;
        return j.running = !0,
        r.render(),
        a = C(),
        s = !1,
        p = G(function(b, c) {
            var d, e, f, g, h, i, k, l, n, o, p, q, t, u, v, w;
            for (l = 100 - r.progress,
            e = p = 0,
            f = !0,
            i = q = 0,
            u = L.length; u > q; i = ++q)
                for (K = L[i],
                o = null != H[i] ? H[i] : H[i] = [],
                h = null != (w = K.elements) ? w : [K],
                k = t = 0,
                v = h.length; v > t; k = ++t)
                    g = h[k],
                    n = null != o[k] ? o[k] : o[k] = new m(g),
                    f &= n.done,
                    n.done || (e++,
                    p += n.tick(b));
            return d = p / e,
            r.update(M.tick(b, d)),
            r.done() || f || s ? (r.update(100),
            j.trigger("done"),
            setTimeout(function() {
                return r.finish(),
                j.running = !1,
                j.trigger("hide")
            }, Math.max(D.ghostTime, Math.max(D.minTime - (C() - a), 0)))) : c()
        })
    }
    ,
    j.start = function(a) {
        v(D, a),
        j.running = !0;
        try {
            r.render()
        } catch (b) {
            i = b
        }
        return document.querySelector(".pace") ? (j.trigger("start"),
        j.go()) : setTimeout(j.start, 50)
    }
    ,
    "function" == typeof define && define.amd ? define(["pace"], function() {
        return j
    }) : "object" == typeof exports ? module.exports = j : D.startOnPageLoad && j.start()
}
).call(this);
(function(h, f) {
    "function" === typeof define && define.amd ? define([], f) : "object" === typeof module && module.exports ? module.exports = f() : h.Rellax = f()
}
)(this, function() {
    var h = function(f, l) {
        var b = Object.create(h.prototype)
          , g = 0
          , k = 0
          , c = []
          , p = !1
          , u = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(a) {
            setTimeout(a, 1E3 / 60)
        }
          , m = function(a, b, d) {
            return a <= b ? b : a >= d ? d : a
        };
        b.options = {
            speed: -2,
            center: !1
        };
        l && Object.keys(l).forEach(function(a) {
            b.options[a] = l[a]
        });
        b.options.speed = m(b.options.speed, -10, 10);
        f || (f = ".rellax");
        var q = document.querySelectorAll(f);
        if (0 < q.length)
            b.elems = q;
        else
            throw Error("The elements you're trying to select don't exist.");
        var v = function(a) {
            var e = a.getAttribute("data-rellax-percentage")
              , d = a.getAttribute("data-rellax-speed")
              , c = e || b.options.center ? window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop : 0
              , f = c + a.getBoundingClientRect().top
              , h = a.clientHeight || a.offsetHeight || a.scrollHeight
              , g = e ? e : (c - f + k) / (h + k);
            b.options.center && (g = .5);
            c = d ? m(d, -10, 10) : b.options.speed;
            if (e || b.options.center)
                c = m(d || b.options.speed, -5, 5);
            e = Math.round(100 * c * (1 - g));
            a = a.style.cssText;
            d = "";
            0 <= a.indexOf("transform") && (d = a.indexOf("transform"),
            d = a.slice(d),
            d = (g = d.indexOf(";")) ? " " + d.slice(11, g).replace(/\s/g, "") : " " + d.slice(11).replace(/\s/g, ""));
            return {
                base: e,
                top: f,
                height: h,
                speed: c,
                style: a,
                transform: d
            }
        }
          , r = function() {
            var a = g;
            g = void 0 !== window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            return a != g ? !0 : !1
        }
          , t = function() {
            r() && !1 === p && n();
            u(t)
        }
          , n = function() {
            for (var a = 0; a < b.elems.length; a++) {
                var e = " translate3d(0," + (Math.round(100 * c[a].speed * (1 - (g - c[a].top + k) / (c[a].height + k))) - c[a].base) + "px,0)" + c[a].transform;
                b.elems[a].style.cssText = c[a].style + "-webkit-transform:" + e + ";-moz-transform:" + e + ";transform:" + e + ";"
            }
        };
        b.destroy = function() {
            for (var a = 0; a < b.elems.length; a++)
                b.elems[a].style.cssText = c[a].style;
            p = !0
        }
        ;
        (function() {
            k = window.innerHeight;
            r();
            for (var a = 0; a < b.elems.length; a++) {
                var e = v(b.elems[a]);
                c.push(e)
            }
            window.addEventListener("resize", function() {
                n()
            });
            t();
            n()
        }
        )();
        return b
    };
    return h
});
!function() {
    "use strict";
    function e(n) {
        return "undefined" == typeof this || Object.getPrototypeOf(this) !== e.prototype ? new e(n) : (O = this,
        O.version = "3.3.2",
        O.tools = new E,
        O.isSupported() ? (O.tools.extend(O.defaults, n || {}),
        O.defaults.container = t(O.defaults),
        O.store = {
            elements: {},
            containers: []
        },
        O.sequences = {},
        O.history = [],
        O.uid = 0,
        O.initialized = !1) : "undefined" != typeof console && null !== console,
        O)
    }
    function t(e) {
        if (e && e.container) {
            if ("string" == typeof e.container)
                return window.document.documentElement.querySelector(e.container);
            if (O.tools.isNode(e.container))
                return e.container
        }
        return O.defaults.container
    }
    function n(e, t) {
        return "string" == typeof e ? Array.prototype.slice.call(t.querySelectorAll(e)) : O.tools.isNode(e) ? [e] : O.tools.isNodeList(e) ? Array.prototype.slice.call(e) : []
    }
    function i() {
        return ++O.uid
    }
    function o(e, t, n) {
        t.container && (t.container = n),
        e.config ? e.config = O.tools.extendClone(e.config, t) : e.config = O.tools.extendClone(O.defaults, t),
        "top" === e.config.origin || "bottom" === e.config.origin ? e.config.axis = "Y" : e.config.axis = "X"
    }
    function r(e) {
        var t = window.getComputedStyle(e.domEl);
        e.styles || (e.styles = {
            transition: {},
            transform: {},
            computed: {}
        },
        e.styles.inline = e.domEl.getAttribute("style") || "",
        e.styles.inline += "; visibility: visible; ",
        e.styles.computed.opacity = t.opacity,
        t.transition && "all 0s ease 0s" !== t.transition ? e.styles.computed.transition = t.transition + ", " : e.styles.computed.transition = ""),
        e.styles.transition.instant = s(e, 0),
        e.styles.transition.delayed = s(e, e.config.delay),
        e.styles.transform.initial = " -webkit-transform:",
        e.styles.transform.target = " -webkit-transform:",
        a(e),
        e.styles.transform.initial += "transform:",
        e.styles.transform.target += "transform:",
        a(e)
    }
    function s(e, t) {
        var n = e.config;
        return "-webkit-transition: " + e.styles.computed.transition + "-webkit-transform " + n.duration / 1e3 + "s " + n.easing + " " + t / 1e3 + "s, opacity " + n.duration / 1e3 + "s " + n.easing + " " + t / 1e3 + "s; transition: " + e.styles.computed.transition + "transform " + n.duration / 1e3 + "s " + n.easing + " " + t / 1e3 + "s, opacity " + n.duration / 1e3 + "s " + n.easing + " " + t / 1e3 + "s; "
    }
    function a(e) {
        var t, n = e.config, i = e.styles.transform;
        t = "top" === n.origin || "left" === n.origin ? /^-/.test(n.distance) ? n.distance.substr(1) : "-" + n.distance : n.distance,
        parseInt(n.distance) && (i.initial += " translate" + n.axis + "(" + t + ")",
        i.target += " translate" + n.axis + "(0)"),
        n.scale && (i.initial += " scale(" + n.scale + ")",
        i.target += " scale(1)"),
        n.rotate.x && (i.initial += " rotateX(" + n.rotate.x + "deg)",
        i.target += " rotateX(0)"),
        n.rotate.y && (i.initial += " rotateY(" + n.rotate.y + "deg)",
        i.target += " rotateY(0)"),
        n.rotate.z && (i.initial += " rotateZ(" + n.rotate.z + "deg)",
        i.target += " rotateZ(0)"),
        i.initial += "; opacity: " + n.opacity + ";",
        i.target += "; opacity: " + e.styles.computed.opacity + ";"
    }
    function l(e) {
        var t = e.config.container;
        t && O.store.containers.indexOf(t) === -1 && O.store.containers.push(e.config.container),
        O.store.elements[e.id] = e
    }
    function c(e, t, n) {
        var i = {
            target: e,
            config: t,
            interval: n
        };
        O.history.push(i)
    }
    function f() {
        if (O.isSupported()) {
            y();
            for (var e = 0; e < O.store.containers.length; e++)
                O.store.containers[e].addEventListener("scroll", d),
                O.store.containers[e].addEventListener("resize", d);
            O.initialized || (window.addEventListener("scroll", d),
            window.addEventListener("resize", d),
            O.initialized = !0)
        }
        return O
    }
    function d() {
        T(y)
    }
    function u() {
        var e, t, n, i;
        O.tools.forOwn(O.sequences, function(o) {
            i = O.sequences[o],
            e = !1;
            for (var r = 0; r < i.elemIds.length; r++)
                n = i.elemIds[r],
                t = O.store.elements[n],
                q(t) && !e && (e = !0);
            i.active = e
        })
    }
    function y() {
        var e, t;
        u(),
        O.tools.forOwn(O.store.elements, function(n) {
            t = O.store.elements[n],
            e = w(t),
            g(t) ? (t.config.beforeReveal(t.domEl),
            e ? t.domEl.setAttribute("style", t.styles.inline + t.styles.transform.target + t.styles.transition.delayed) : t.domEl.setAttribute("style", t.styles.inline + t.styles.transform.target + t.styles.transition.instant),
            p("reveal", t, e),
            t.revealing = !0,
            t.seen = !0,
            t.sequence && m(t, e)) : v(t) && (t.config.beforeReset(t.domEl),
            t.domEl.setAttribute("style", t.styles.inline + t.styles.transform.initial + t.styles.transition.instant),
            p("reset", t),
            t.revealing = !1)
        })
    }
    function m(e, t) {
        var n = 0
          , i = 0
          , o = O.sequences[e.sequence.id];
        o.blocked = !0,
        t && "onload" === e.config.useDelay && (i = e.config.delay),
        e.sequence.timer && (n = Math.abs(e.sequence.timer.started - new Date),
        window.clearTimeout(e.sequence.timer)),
        e.sequence.timer = {
            started: new Date
        },
        e.sequence.timer.clock = window.setTimeout(function() {
            o.blocked = !1,
            e.sequence.timer = null,
            d()
        }, Math.abs(o.interval) + i - n)
    }
    function p(e, t, n) {
        var i = 0
          , o = 0
          , r = "after";
        switch (e) {
        case "reveal":
            o = t.config.duration,
            n && (o += t.config.delay),
            r += "Reveal";
            break;
        case "reset":
            o = t.config.duration,
            r += "Reset"
        }
        t.timer && (i = Math.abs(t.timer.started - new Date),
        window.clearTimeout(t.timer.clock)),
        t.timer = {
            started: new Date
        },
        t.timer.clock = window.setTimeout(function() {
            t.config[r](t.domEl),
            t.timer = null
        }, o - i)
    }
    function g(e) {
        if (e.sequence) {
            var t = O.sequences[e.sequence.id];
            return t.active && !t.blocked && !e.revealing && !e.disabled
        }
        return q(e) && !e.revealing && !e.disabled
    }
    function w(e) {
        var t = e.config.useDelay;
        return "always" === t || "onload" === t && !O.initialized || "once" === t && !e.seen
    }
    function v(e) {
        if (e.sequence) {
            var t = O.sequences[e.sequence.id];
            return !t.active && e.config.reset && e.revealing && !e.disabled
        }
        return !q(e) && e.config.reset && e.revealing && !e.disabled
    }
    function b(e) {
        return {
            width: e.clientWidth,
            height: e.clientHeight
        }
    }
    function h(e) {
        if (e && e !== window.document.documentElement) {
            var t = x(e);
            return {
                x: e.scrollLeft + t.left,
                y: e.scrollTop + t.top
            }
        }
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    }
    function x(e) {
        var t = 0
          , n = 0
          , i = e.offsetHeight
          , o = e.offsetWidth;
        do
            isNaN(e.offsetTop) || (t += e.offsetTop),
            isNaN(e.offsetLeft) || (n += e.offsetLeft),
            e = e.offsetParent;
        while (e);
        return {
            top: t,
            left: n,
            height: i,
            width: o
        }
    }
    function q(e) {
        function t() {
            var t = c + a * s
              , n = f + l * s
              , i = d - a * s
              , y = u - l * s
              , m = r.y + e.config.viewOffset.top
              , p = r.x + e.config.viewOffset.left
              , g = r.y - e.config.viewOffset.bottom + o.height
              , w = r.x - e.config.viewOffset.right + o.width;
            return t < g && i > m && n > p && y < w
        }
        function n() {
            return "fixed" === window.getComputedStyle(e.domEl).position
        }
        var i = x(e.domEl)
          , o = b(e.config.container)
          , r = h(e.config.container)
          , s = e.config.viewFactor
          , a = i.height
          , l = i.width
          , c = i.top
          , f = i.left
          , d = c + a
          , u = f + l;
        return t() || n()
    }
    function E() {}
    var O, T;
    e.prototype.defaults = {
        origin: "bottom",
        distance: "20px",
        duration: 500,
        delay: 0,
        rotate: {
            x: 0,
            y: 0,
            z: 0
        },
        opacity: 0,
        scale: .9,
        easing: "cubic-bezier(0.6, 0.2, 0.1, 1)",
        container: window.document.documentElement,
        mobile: !0,
        reset: !1,
        useDelay: "always",
        viewFactor: .2,
        viewOffset: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        beforeReveal: function(e) {},
        beforeReset: function(e) {},
        afterReveal: function(e) {},
        afterReset: function(e) {}
    },
    e.prototype.isSupported = function() {
        var e = document.documentElement.style;
        return "WebkitTransition"in e && "WebkitTransform"in e || "transition"in e && "transform"in e
    }
    ,
    e.prototype.reveal = function(e, s, a, d) {
        var u, y, m, p, g, w;
        if (void 0 !== s && "number" == typeof s ? (a = s,
        s = {}) : void 0 !== s && null !== s || (s = {}),
        u = t(s),
        y = n(e, u),
        !y.length)
            return O;
        a && "number" == typeof a && (w = i(),
        g = O.sequences[w] = {
            id: w,
            interval: a,
            elemIds: [],
            active: !1
        });
        for (var v = 0; v < y.length; v++)
            p = y[v].getAttribute("data-sr-id"),
            p ? m = O.store.elements[p] : (m = {
                id: i(),
                domEl: y[v],
                seen: !1,
                revealing: !1
            },
            m.domEl.setAttribute("data-sr-id", m.id)),
            g && (m.sequence = {
                id: g.id,
                index: g.elemIds.length
            },
            g.elemIds.push(m.id)),
            o(m, s, u),
            r(m),
            l(m),
            O.tools.isMobile() && !m.config.mobile || !O.isSupported() ? (m.domEl.setAttribute("style", m.styles.inline),
            m.disabled = !0) : m.revealing || m.domEl.setAttribute("style", m.styles.inline + m.styles.transform.initial);
        return !d && O.isSupported() && (c(e, s, a),
        O.initTimeout && window.clearTimeout(O.initTimeout),
        O.initTimeout = window.setTimeout(f, 0)),
        O
    }
    ,
    e.prototype.sync = function() {
        if (O.history.length && O.isSupported()) {
            for (var e = 0; e < O.history.length; e++) {
                var t = O.history[e];
                O.reveal(t.target, t.config, t.interval, !0)
            }
            f()
        }
        return O
    }
    ,
    E.prototype.isObject = function(e) {
        return null !== e && "object" == typeof e && e.constructor === Object
    }
    ,
    E.prototype.isNode = function(e) {
        return "object" == typeof window.Node ? e instanceof window.Node : e && "object" == typeof e && "number" == typeof e.nodeType && "string" == typeof e.nodeName
    }
    ,
    E.prototype.isNodeList = function(e) {
        var t = Object.prototype.toString.call(e)
          , n = /^\[object (HTMLCollection|NodeList|Object)\]$/;
        return "object" == typeof window.NodeList ? e instanceof window.NodeList : e && "object" == typeof e && n.test(t) && "number" == typeof e.length && (0 === e.length || this.isNode(e[0]))
    }
    ,
    E.prototype.forOwn = function(e, t) {
        if (!this.isObject(e))
            throw new TypeError('Expected "object", but received "' + typeof e + '".');
        for (var n in e)
            e.hasOwnProperty(n) && t(n)
    }
    ,
    E.prototype.extend = function(e, t) {
        return this.forOwn(t, function(n) {
            this.isObject(t[n]) ? (e[n] && this.isObject(e[n]) || (e[n] = {}),
            this.extend(e[n], t[n])) : e[n] = t[n]
        }
        .bind(this)),
        e
    }
    ,
    E.prototype.extendClone = function(e, t) {
        return this.extend(this.extend({}, e), t)
    }
    ,
    E.prototype.isMobile = function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    ,
    T = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(e) {
        window.setTimeout(e, 1e3 / 60)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return e
    }) : "undefined" != typeof module && module.exports ? module.exports = e : window.ScrollReveal = e
}();
