(function () {
    "use strict";
    function d(e, t, i, n, l) {
        const s = document.createElement(t);
        return l && (s.textContent = l), i.forEach(e => {
            s.classList.add(e);
        }), n.forEach(e => {
            s.setAttribute(e[0], e[1]);
        }), e && (n = s, e.appendChild(n)) || s;
    }
    const h = document.querySelector(".container .outer");
    function e(e, t) {
        var i = d(h, "div", [ "field" ], [], "");
        d(i, "label", [], [], e);
        const s = d(i, "input", [], [ [ "type", "text" ], [ "placeholder", t ], [ "autofocus", "" ], [ "aria-autocomplete", "both" ], [ "autocapitalize", "none" ], [ "autocomplete", "off" ], [ "autocorrect", "off" ], [ "spellcheck", "false" ], [ "value", "" ] ], ""), r = d(i, "ul", [ "countrylist" ], [], "");
        let o, c;
        function n(e) {
            var t;
            let i;
            o = r.children.length;
            let n = function() {
                if (s.nextElementSibling) {
                    for (let e = 0; e < o; e++) if ("active" === r.children[e].classList.value) return e;
                    return -1;
                }
                return -1;
            }();
            if (38 === e.keyCode) 0 < o && r.classList.contains("isvisible") && (-1 === n ? (n = o - 1, 
            r.children[n].classList.add("active"), s.value = r.children[n].textContent) : 0 === n ? (r.children[n].classList.remove("active"), 
            n = -1, s.value = c) : (r.children[n].classList.remove("active"), n--, r.children[n].classList.add("active"), 
            s.value = r.children[n].textContent)); else if (40 === e.keyCode) 0 < o && r.classList.contains("isvisible") && (-1 === n ? (n++, 
            r.children[n].classList.add("active"), s.value = r.children[n].textContent) : n === o - 1 ? (r.children[n].classList.remove("active"), 
            n = -1, s.value = c) : (r.children[n].classList.remove("active"), n++, r.children[n].classList.add("active"), 
            s.value = r.children[n].textContent)); else if (13 === e.keyCode) o <= 1 ? r.classList.remove("isvisible") : r.classList.toggle("isvisible"); else if (27 === e.keyCode) !function() {
                {
                    var e;
                    r.classList.remove("isvisible"), s.value = c, dropDownOptions.map(e => e.toLowerCase()).includes(s.value.trim().toLowerCase()) ? (e = dropDownOptions.map(e => e.toLowerCase()).findIndex(e => e === s.value.trim().toLowerCase()), 
                    s.value = dropDownOptions[e]) : s.value = c;
                }
            }(); else if (9 !== e.keyCode) {
                const l = function(e) {
                    let t;
                    return t = 2 < e.length ? new RegExp(`.*${e}.*`, "gi") : new RegExp(`^${e}.*`, "gi"), 
                    dropDownOptions.filter(e => e.match(t));
                }(s.value.trim());
                if (c !== s.value.trim() || 1 !== l.length || (65 <= (t = e.keyCode) && t <= 90 || (48 <= t && t <= 57 || 96 <= t && t <= 105))) if (c = s.value.trim(), 
                196 === l.length || 0 === l.length) {
                    i = [], r.classList.remove("isvisible");
                    for (let e = 0, t = r.children.length; e < t; e++) r.children[e] && r.children[e].remove();
                } else i = l.map(e => v(e, s.value.trim())), t = i.map(e => `<li>${e}</li>`).join(""), 
                r.innerHTML = t, r.classList.add("isvisible");
            }
        }
        function l(e) {
            let t = [];
            t = [ ...r.children ], 1 === t.length && s.value.trim() !== t[0].textContent && s.value.trim().toLowerCase() === t[0].textContent.toLowerCase() && (s.value = t[0].textContent), 
            dropDownOptions.includes(s.value.trim()) || (s.value = ""), r.classList.remove("isvisible"), 
            r.removeEventListener("mousedown", a), r.removeEventListener("mousemove", u), s.removeEventListener("keyup", n), 
            s.removeEventListener("blur", l);
        }
        function a(e) {
            s.value = e.target.innerText, c = e.target.innerText;
        }
        function u() {
            var t;
            let i = -1;
            if (r.children[0]) {
                t = null == document.querySelector(".countrylist li:hover") ? "" : document.querySelector(".countrylist li:hover").textContent;
                for (let e = 0; e < r.children.length; e++) r.children[e].classList.remove("active"), 
                "" !== t && t === r.children[e].textContent && (-1 !== i && r.children[i].classList.remove("active"), 
                i = e, r.children[i].classList.add("active"));
            }
        }
        function v(e, t) {
            var i = new RegExp(`${t}`, "i"), i = e.search(i);
            return -1 === i || 0 === t.length ? e : `${e.slice(0, i)}<strong>${e.slice(i, i + t.length)}</strong>${e.slice(i + t.length)}`;
        }
        s.addEventListener("focus", function(e) {
            c = s.value.trim(), s.addEventListener("keyup", n), s.addEventListener("blur", l), 
            r.addEventListener("mousemove", u), r.addEventListener("mousedown", a);
        });
    }
    e("Country of birthSS", "Country of birthSS"), e("Country of residence", "Country of residence");
})();