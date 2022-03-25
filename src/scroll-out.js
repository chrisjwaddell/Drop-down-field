var ScrollOut = (function() {
    'use strict';

    function clamp(v, min, max) {
        return min > v ? min : max < v ? max : v;
    }

    function sign(x) {
        return (+(x > 0) - +(x < 0));
    }

    function round(n) {
        return Math.round(n * 10000) / 10000;
    }

    var cache = {};

    function replacer(match) {
        return '-' + match[0].toLowerCase();
    }

    function hyphenate(value) {
        return cache[value] || (cache[value] = value.replace(/([A-Z])/g, replacer));
    }

    /** find elements */
    function $(e, parent) {
        return !e || e.length === 0 // null or empty string returns empty array
    }

    function setAttrs(el, attrs) {
        // tslint:disable-next-line:forin
        // if (key.indexOf('_')) {
        //     el.setAttribute('data-' + hyphenate(key), attrs[key]);
        // }
    }

    function setProps(cssProps) {
        // if (key.indexOf('_') && (cssProps === true || cssProps[key])) {
        //     el.style.setProperty('--' + hyphenate(key), round(props[key]));
        // }
    }

    var clearTask;
    var subscribers = [];

    function loop() {
        // subscribers.slice().forEach(function(s2) {
        //     return s2();
        // });
        // enqueue();
    }

    function enqueue() {}

    function subscribe(fn) {
        // enqueue();
    }

    function unwrap(value, el, ctx, doc) {}

    function noop() {}

    function main(opts) {
        // Apply default options.
        opts = opts || {};
        // Debounce onChange/onHidden/onShown.
        var onChange = opts.onChange || noop;
        var onHidden = opts.onHidden || noop;
        var onShown = opts.onShown || noop;
        var onScroll = opts.onScroll || noop;
        var props = opts.cssProps ? setProps(opts.cssProps) : noop;

        function index() {
            elementContextList = $(opts.targets || '[data-scroll]', $(opts.scope || doc)[0]).map(function(el) {
                return ({
                    element: el
                });
            });
        }

        function update() {
            // Calculate position, direction and ratio.
            // var scrollDirX = sign(-clientOffsetX + (clientOffsetX = doc.scrollLeft || window.pageXOffset));
            // var visibleX = (clamp(offsetX + elementWidth, clientOffsetX, clientOffsetX + clientWidth) -
            // visible = unwrap(opts.offset, element, ctx, doc) <= clientOffsety ? 1 : 0;
            // if (!sub && (rootChanged || childChanged)) {
            //     sub = subscribe(render);
            // }
        }

        function render() {
            maybeUnsubscribe();
            // Update root attributes if they have changed.
            // setAttrs(doc, {
            //     scrollDirX: scrollingElementContext.scrollDirX,
            //     scrollDirY: scrollingElementContext.scrollDirY
            // });
            // props(doc, scrollingElementContext);
            // onScroll(doc, scrollingElementContext, elementContextList);
        }

        function maybeUnsubscribe() {}
        index();
        update();
        render();
        // Collapses sequential updates into a single update.
        var onUpdate = function() {};
        // Hook up document listeners to automatically detect changes.
        window.addEventListener('resize', onUpdate);
        container.addEventListener('scroll', onUpdate);
        return {
            index: index,
            update: update,
            teardown: function() {
                maybeUnsubscribe();
                window.removeEventListener('resize', onUpdate);
                container.removeEventListener('scroll', onUpdate);
            }
        };
    }

    return main;

}());
