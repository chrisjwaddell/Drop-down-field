(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, 
    global.DropdownField = factory());
})(this, (function() {
    "use strict";
    function appendChild(el, child) {
        return el.appendChild(child);
    }
    function createElementAtt(parent, element, cls, att, text) {
        const el = document.createElement(element);
        if (text) {
            el.textContent = text;
        }
        cls.forEach((item => {
            el.classList.add(item);
        }));
        att.forEach((i => {
            el.setAttribute(i[0], i[1]);
        }));
        return parent && appendChild(parent, el) || el;
    }
    const LIST_SELECTED_CLASSNAME = "selected";
    function listFindSelectedIndex(parentUL, selectclass, listLength) {
        for (let i = 0; i < listLength; i += 1) {
            if (parentUL.childNodes[i]) {
                if (parentUL.childNodes[i].classList.contains(selectclass)) {
                    return i;
                }
            }
        }
        return -1;
    }
    function listItemValueIndex(parentUL, itemValue) {
        for (let i = 0; i < parentUL.childNodes.length; i += 1) {
            if (parentUL.childNodes[i]) {
                if (parentUL.childNodes[i].textContent === itemValue) {
                    return i;
                }
            }
        }
        return -1;
    }
    function listSelectWithIndex(list, index) {
        list.children[index].classList.add(LIST_SELECTED_CLASSNAME);
    }
    function listSelectionChange(list, down, currentSelection, listLength) {
        function oldNewSelection(oldIndex, newIndex) {
            if (oldIndex === -1) {
                if (list.childNodes[newIndex]) {
                    list.childNodes[newIndex].classList.add(LIST_SELECTED_CLASSNAME);
                    return list.childNodes[newIndex].textContent;
                }
                return null;
            }
            if (list.childNodes[oldIndex] && list.childNodes[newIndex]) {
                list.childNodes[oldIndex].classList.remove(LIST_SELECTED_CLASSNAME);
                list.childNodes[newIndex].classList.add(LIST_SELECTED_CLASSNAME);
                return list.childNodes[newIndex].textContent;
            }
            return null;
        }
        if (listLength > 0) {
            if (currentSelection === -1) {
                if (down) {
                    return oldNewSelection(-1, 0);
                }
                return oldNewSelection(-1, listLength - 1);
            }
            if (list.childNodes[currentSelection]) {
                if (currentSelection === 0) {
                    if (down) {
                        return oldNewSelection(0, 1);
                    }
                    return oldNewSelection(0, listLength - 1);
                }
                if (currentSelection === listLength - 1) {
                    if (down) {
                        return oldNewSelection(currentSelection, 0);
                    }
                    return oldNewSelection(currentSelection, currentSelection - 1);
                }
                if (down) {
                    return oldNewSelection(currentSelection, currentSelection + 1);
                }
                return oldNewSelection(currentSelection, currentSelection - 1);
            }
        }
    }
    const objectLength = obj => Object.entries(obj).length;
    function escapeRegExp(str) {
        const avoidEscapeError = str.slice(-1) === "\\" ? str[str.length - 1] : str;
        return avoidEscapeError.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
    function DropdownField(target, fieldLabel, placeholder, tabindex, ID, opts) {
        let list = [];
        const settingDefaults = {
            maxLines: 10,
            searchMode: 1,
            firstXCharactersOppositeSearchMode: 0,
            ignoreFirstXCharacters: 0,
            noFiltering: false,
            onFocusOpenDropdown: true,
            onClickToggleDropdown: false,
            typingOpenDropdown: true,
            enterToggleDropdown: true,
            arrowKeysNoDropdown: 0,
            autocomplete: false,
            disableOnOpen: false
        };
        const settings = opts || {};
        const maxLines = settings.maxLines ?? settingDefaults.maxLines;
        let searchModeNumber = 1;
        if (typeof settings.searchMode !== "undefined" || settings.searchMode) {
            if (settings.searchMode.toLowerCase() === "starts with") {
                searchModeNumber = 0;
            } else {
                searchModeNumber = 1;
            }
        } else {
            searchModeNumber = 0;
        }
        const firstXCharactersOppositeSearchMode = settings.firstXCharactersOppositeSearchMode ?? settingDefaults.firstXCharactersOppositeSearchMode;
        const ignoreFirstXCharacters = settings.ignoreFirstXCharacters ?? settingDefaults.ignoreFirstXCharacters;
        const noFiltering = settings.noFiltering ?? settingDefaults.noFiltering;
        const onFocusOpenDropdown = settings.onFocusOpenDropdown ?? settingDefaults.onFocusOpenDropdown;
        const onClickToggleDropdown = settings.onClickToggleDropdown ?? settingDefaults.onClickToggleDropdown;
        const typingOpenDropdown = settings.typingOpenDropdown ?? settingDefaults.typingOpenDropdown;
        const enterToggleDropdown = settings.enterToggleDropdown ?? settingDefaults.enterToggleDropdown;
        const arrowKeysNoDropdown = settings.arrowKeysNoDropdown ?? settingDefaults.arrowKeysNoDropdown;
        const disableOnOpen = settings.disableOnOpen ?? settingDefaults.disableOnOpen;
        let selectionLength;
        let maxHeight;
        let lineHeight;
        if (!ID) console.error("Warning: 'id' parameter not in. You must put 'id' in otherwise some " + "features won't work correctly when you leave the DropdownField component");
        function render(target, fieldLabel, placeholder, tabindex, ID) {
            const elTarget = document.querySelector(target);
            let elField;
            if (settings.cssClassList) {
                elField = createElementAtt(elTarget, "div", [ "ddfield" ].concat(settings.cssClassList), [ [ "ID", ID ], [ "data-origin", "" ], [ "data-filter", "" ], [ "data-mode", "" ] ], "");
            } else {
                elField = createElementAtt(elTarget, "div", [ "ddfield" ], [ [ "ID", ID ], [ "data-origin", "" ], [ "data-filter", "" ], [ "data-mode", "" ] ], "");
            }
            createElementAtt(elField, "label", [], [], fieldLabel);
            const elInputArrow = createElementAtt(elField, "div", [ "inputarrow" ], [], "");
            const elInput = createElementAtt(elInputArrow, "input", [], [ [ "type", "text" ], [ "placeholder", placeholder ? placeholder : fieldLabel ], [ "aria-autocomplete", "both" ], [ "autocapitalize", "none" ], [ "autocomplete", "off" ], [ "autocorrect", "off" ], [ "spellcheck", "false" ], [ "tabindex", tabindex || 1 ], [ "value", "" ] ], "");
            if (settings.autofocus !== true) {
                elInput.classList.add("autofocus");
            }
            let elArrow = null;
            if (typeof settings.showDropdownArrow === "undefined" || settings.showDropdownArrow === true) {
                elInput.style.padding = "5px 30px 5px 12px";
                elArrow = createElementAtt(elInputArrow, "button", [ "arrow" ], [ [ "tabindex", "-1" ] ], "");
                const xmlns = "http://www.w3.org/2000/svg";
                const elSVG = document.createElementNS(xmlns, "svg");
                elSVG.setAttributeNS(null, "viewBox", "0 0 100 100");
                elSVG.setAttributeNS(null, "width", "100");
                elSVG.setAttributeNS(null, "height", "100");
                const elLine1 = document.createElementNS(xmlns, "line");
                elLine1.setAttribute("x1", 20);
                elLine1.setAttribute("y1", 35);
                elLine1.setAttribute("x2", 50);
                elLine1.setAttribute("y2", 65);
                elSVG.appendChild(elLine1);
                const elLine2 = document.createElementNS(xmlns, "line");
                elLine2.setAttribute("x1", 50);
                elLine2.setAttribute("y1", 65);
                elLine2.setAttribute("x2", 80);
                elLine2.setAttribute("y2", 35);
                elSVG.appendChild(elLine2);
                elArrow.appendChild(elSVG);
            }
            if (settings.autocomplete) {
                createElementAtt(elField, "div", [ "autocomplete" ], [], "test");
            }
            const elUL = createElementAtt(elField, "ul", [ "ddlist" ], [], "");
            const elULTemp = createElementAtt(document.querySelector("#" + ID + ".ddfield"), "ul", [ "ddlist", "isvisible" ], [], "");
            elULTemp.style.visibility = "hidden";
            const elLI = createElementAtt(elULTemp, "li", [], [], "li");
            elLI.textContent = "a";
            lineHeight = elLI.offsetHeight;
            elULTemp.remove();
            maxHeight = lineHeight * maxLines;
            elUL.style.maxHeight = maxHeight + "px";
            if (disableOnOpen) {
                elUL.classList.remove("isvisible");
                elUL.disabled = "true";
                elInput.disabled = "true";
                if (elArrow) elArrow.disabled = "true";
            }
        }
        render(target, fieldLabel, placeholder, tabindex, ID);
        const elDDContainer = document.querySelector("#" + ID);
        const elInput = document.querySelector("#" + ID + " input");
        const elArrow = document.querySelector("#" + ID + " .arrow");
        const elUL = document.querySelector("#" + ID + " ul");
        const elAutocomplete = document.querySelector("#" + ID + " .autocomplete");
        function listSelectionChangeScroll(list, down, currentSelection, listLength, scrollAmount, listSize) {
            if (listLength > 0) {
                if (currentSelection === -1) {
                    if (down) {
                        list.scrollTo(0, 0);
                    } else {
                        if (list.children[listLength - 1].offsetTop > 0) {
                            list.scrollTop;
                            list.scrollTo(0, list.children[listLength - 1].offsetTop - scrollAmount);
                        }
                    }
                } else {
                    if (list.children[currentSelection]) {
                        list.scrollTop;
                        if (currentSelection === 0) {
                            if (!down) {
                                list.scrollTo(0, list.children[listLength - 1].offsetTop);
                            }
                        } else if (currentSelection === listLength - 1) {
                            if (down) {
                                if (list.children[listLength - 1].offsetTop > 0) {
                                    list.scrollTo(0, 0);
                                }
                            } else {
                                const ot = list.children[currentSelection].offsetTop;
                                const ulTop = list.scrollTop;
                                if (ot - ulTop > listSize - 2 * scrollAmount) {
                                    list.scrollTo(0, ulTop + scrollAmount);
                                } else {
                                    list.scrollTo(0, ulTop - scrollAmount);
                                }
                            }
                        } else {
                            const ot = list.children[currentSelection].offsetTop;
                            const ulTop = list.scrollTop;
                            if (down) {
                                if (ot - ulTop > scrollAmount / 2) {
                                    if (list.children[currentSelection].offsetTop > 0) {
                                        list.scrollTo(0, ulTop + scrollAmount);
                                    }
                                }
                            } else {
                                if (ot - ulTop > listSize - 2 * scrollAmount) {
                                    list.scrollTo(0, ulTop + scrollAmount);
                                } else {
                                    list.scrollTo(0, ulTop - scrollAmount);
                                }
                            }
                        }
                    }
                }
            }
        }
        function selectionFilter(str, searchMode) {
            let regex;
            const escapedStr = escapeRegExp(str);
            searchMode ? regex = new RegExp(`.*${escapedStr}.*`, "gi") : regex = new RegExp(`^${escapedStr}.*`, "gi");
            return list.filter((cv => cv.match(regex)));
        }
        function dropdownSelectedString(selectionLine, searchString) {
            const escapedStr = escapeRegExp(searchString);
            const fieldString = new RegExp(`${escapedStr}`, "i");
            const startPos = selectionLine.search(fieldString);
            if (startPos === -1 || searchString.length === 0) {
                return selectionLine;
            }
            return `${selectionLine.slice(0, startPos)}<strong>${selectionLine.slice(startPos, startPos + searchString.length)}</strong>${selectionLine.slice(startPos + searchString.length)}`;
        }
        function selectionFilterWithOptions(strSearch, searchMode) {
            let results;
            if (firstXCharactersOppositeSearchMode) {
                if (strSearch.length <= firstXCharactersOppositeSearchMode) {
                    if (searchModeNumber === 0) {
                        results = selectionFilter(strSearch, 1);
                    } else {
                        results = selectionFilter(strSearch, 0);
                    }
                } else {
                    results = selectionFilter(strSearch, searchModeNumber);
                }
            } else {
                results = selectionFilter(strSearch, searchModeNumber);
            }
            return results;
        }
        function populateList(filter, results) {
            let DD_LIST_SIZE;
            if (list) {
                DD_LIST_SIZE = objectLength(list);
            } else {
                DD_LIST_SIZE = 0;
            }
            if (results.length === DD_LIST_SIZE) {
                const matchlist = results.map((cv => `<li>${cv}</li>`)).join("");
                elUL.style.maxHeight = maxHeight + "px";
                elUL.scrollTo(0, 0);
                elUL.innerHTML = matchlist;
            } else if (results.length === 0) {
                elUL.classList.remove("isvisible");
                elUL.innherHTML = "";
            } else {
                const matches = results.map((cv => dropdownSelectedString(cv, filter.trim())));
                const matchlist = matches.map((cv => `<li>${cv}</li>`)).join("");
                elUL.style.maxHeight = maxHeight + "px";
                elUL.scrollTo(0, 0);
                elUL.innerHTML = matchlist;
            }
        }
        function getAttributes() {
            const origin = elDDContainer.dataset.origin;
            const filter = elDDContainer.dataset.filter;
            return {
                origin: origin,
                filter: filter
            };
        }
        function getMode() {
            const mode = elDDContainer.dataset.mode;
            let arr = [];
            if (mode) {
                arr = mode.split(";");
            }
            const entry = arr[0] || "";
            const control = arr[1] || "";
            let lastDDMode;
            if (arr[2]) {
                if (arr[2] === "true") {
                    lastDDMode = true;
                } else {
                    lastDDMode = false;
                }
            } else {
                lastDDMode = false;
            }
            return {
                entry: entry,
                control: control,
                lastDDMode: lastDDMode
            };
        }
        function setMode(entry, control, lastDDMode) {
            elDDContainer.dataset.mode = `${entry};${control};${lastDDMode}`;
        }
        document.addEventListener("DOMContentLoaded", (function() {
            elInput.addEventListener("focus", onFocusInput, false);
            if (elArrow) {
                elArrow.addEventListener("click", onClickArrow, true);
            }
            window.addEventListener("load", (function() {
                if (document.querySelector(".autofocus")) document.querySelector(".autofocus").focus();
            }));
        }));
        function onFocusInput() {
            let {origin: origin, filter: filter} = getAttributes();
            let {entry: entry, control: control, lastDDMode: lastDDMode} = getMode();
            elInput.addEventListener("click", onClickInput, false);
            elInput.addEventListener("keydown", onKeyDownInput);
            elInput.addEventListener("keyup", onKeyUpInput);
            elInput.addEventListener("blur", onBlurInput);
            if (entry === "" || entry === "enter" || entry === "listclick") {
                let results;
                if (noFiltering || filter.length <= ignoreFirstXCharacters) {
                    results = list;
                } else {
                    results = selectionFilterWithOptions(filter);
                }
                populateList(filter, results);
                let indexSelected = -1;
                if (elInput.value) {
                    elDDContainer.dataset.origin = elInput.value;
                    indexSelected = listItemValueIndex(elUL, elInput.value);
                    if (indexSelected !== -1) {
                        listSelectWithIndex(elUL, indexSelected);
                    }
                }
                if (entry !== "listclick") {
                    if (onFocusOpenDropdown) {
                        openDropdown();
                        lastDDMode = true;
                    }
                }
                if (indexSelected !== -1) {
                    elUL.scrollTop;
                    elUL.scrollTo(0, elUL.children[indexSelected].offsetTop - lineHeight);
                } else {
                    elUL.scrollTo(0, 0);
                }
            }
            if (entry === "enter") entry = "stay";
            if (entry === "") entry = "enter";
            if (entry === "listclick") entry = "enter";
            control = "input";
            setMode(entry, control, lastDDMode);
        }
        function onBlurInput(e) {
            let {entry: entry, control: control, lastDDMode: lastDDMode} = getMode();
            let arr = [];
            arr = [ ...elUL.children ];
            if (arr.length === 1) {
                if (elInput.value.trim() !== arr[0].textContent && elInput.value.trim().toLowerCase() === arr[0].textContent.toLowerCase()) {
                    elInput.value = arr[0].textContent;
                    if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
                }
            }
            closeDropdown();
            elInput.removeEventListener("click", onClickInput, false);
            elInput.removeEventListener("keydown", onKeyDownInput);
            elInput.removeEventListener("keyup", onKeyUpInput);
            elInput.removeEventListener("blur", onBlurInput);
            if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
            control = "input";
            setMode(entry, control, lastDDMode);
        }
        function onClickInput() {
            let {entry: entry, control: control, lastDDMode: lastDDMode} = getMode();
            if (entry === "enter") {
                if (onClickToggleDropdown) {
                    openDropdown();
                    lastDDMode = true;
                }
                entry = "stay";
            } else {
                if (onClickToggleDropdown) {
                    toggleDropdown();
                    lastDDMode = !lastDDMode;
                }
            }
            setMode(entry, control, lastDDMode);
        }
        const keyCodes = {
            8: "backspace",
            9: "tab",
            16: "shift",
            13: "enter",
            27: "escape",
            32: "space",
            38: "up",
            46: "delete",
            40: "down"
        };
        function isPrintableKeyCode(keyCode) {
            return keyCode > 47 && keyCode < 58 || keyCode === 32 || keyCode === 8 || keyCode > 64 && keyCode < 91 || keyCode > 95 && keyCode < 112 || keyCode > 185 && keyCode < 193 || keyCode > 218 && keyCode < 223;
        }
        function onKeyDownInput(e) {
            if (keyCodes[e.keyCode] === "tab") {
                if (elAutocomplete) {
                    if (elAutocomplete.classList.contains("isvisible")) {
                        elInput.value = elAutocomplete.textContent;
                        if (settings.onChange) settings.onChange();
                    }
                }
            }
        }
        function onKeyUpInput(e) {
            getAttributes();
            let {entry: entry, control: control, lastDDMode: lastDDMode} = getMode();
            const DD_LIST_SIZE = objectLength(list);
            let matches;
            let matchlist;
            selectionLength = elUL.children.length;
            let index = listFindSelectedIndex(elUL, "selected", selectionLength);
            let ddVisible = elUL.classList.contains("isvisible");
            switch (keyCodes[e.keyCode]) {
              case "up":
                if (!ddVisible && arrowKeysNoDropdown !== 2) {
                    if (arrowKeysNoDropdown === 1) {
                        openDropdown();
                    }
                } else {
                    let val = listSelectionChange(elUL, false, index, selectionLength);
                    if (val) {
                        elInput.value = val;
                        if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
                        if (settings.onChange) settings.onChange();
                    }
                    if (ddVisible) {
                        listSelectionChangeScroll(elUL, false, index, selectionLength, lineHeight, maxHeight);
                    }
                }
                break;

              case "down":
                if (!ddVisible && arrowKeysNoDropdown !== 2) {
                    if (arrowKeysNoDropdown === 1) {
                        openDropdown();
                    }
                } else {
                    let val = listSelectionChange(elUL, true, index, selectionLength);
                    if (val) {
                        elInput.value = val;
                        if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
                        if (settings.onChange) settings.onChange();
                    }
                    if (ddVisible) {
                        listSelectionChangeScroll(elUL, true, index, selectionLength, lineHeight, maxHeight);
                    }
                }
                break;

              case "enter":
                if (enterToggleDropdown) {
                    if (selectionLength >= 1) {
                        toggleDropdown(lastDDMode);
                        lastDDMode = !lastDDMode;
                        elDDContainer.dataset.mode = elUL.classList.contains("isvisible");
                    }
                } else {
                    if (elUL.classList.contains("isvisible")) {
                        closeDropdown();
                        lastDDMode = false;
                        elDDContainer.dataset.mode = false;
                    }
                }
                break;

              case "escape":
                escape();
                lastDDMode = false;
                break;

              default:
                if (keyCodes[e.keyCode] !== "tab" && keyCodes[e.keyCode] !== "escape" && keyCodes[e.keyCode] !== "shift" && !(e.shiftKey && e.key === "Tab") || e.keyCode === 229) {
                    if (typingOpenDropdown) {
                        if (!lastDDMode) {
                            openDropdown();
                            lastDDMode = true;
                        }
                    }
                }
                if (isPrintableKeyCode(e.keyCode) || e.keyCode === "Delete" || e.keyCode === 229) {
                    const strSearch = elInput.value;
                    elDDContainer.dataset.filter = strSearch.toLowerCase();
                    let results;
                    if (noFiltering || elInput.value.trim().length <= ignoreFirstXCharacters) {
                        results = list;
                        if (settings.onChange) settings.onChange();
                    } else {
                        results = selectionFilterWithOptions(strSearch);
                    }
                    if (results.length === DD_LIST_SIZE) {
                        matchlist = results.map((cv => `<li>${cv}</li>`)).join("");
                        elUL.style.maxHeight = maxHeight + "px";
                        elUL.innerHTML = matchlist;
                        elUL.scrollTo(0, 0);
                        if (elInput.value.trim.length === 0) {
                            if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
                        }
                    } else if (results.length === 0) {
                        matches = [];
                        elUL.innerHTML = "";
                        elUL.classList.remove("isvisible");
                        if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
                    } else {
                        matches = results.map((cv => dropdownSelectedString(cv, elInput.value.trim())));
                        matchlist = matches.map((cv => `<li>${cv}</li>`)).join("");
                        elUL.innerHTML = matchlist;
                        elUL.scrollTo(0, 0);
                        if (elAutocomplete) autocomplete();
                    }
                }
            }
            entry = "stay";
            control = "list";
            setMode(entry, control, lastDDMode);
        }
        function toggleDropdown(dropdownIsVisble) {
            const visible = dropdownIsVisble ? dropdownIsVisble : elUL.classList.contains("isvisible");
            if (visible) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }
        function openDropdown() {
            elUL.addEventListener("mousedown", onMouseDownUL, false);
            if (!elInput.disabled) {
                let indexSelected = -1;
                if (elInput.value) {
                    indexSelected = listItemValueIndex(elUL, elInput.value);
                    if (indexSelected !== -1) {
                        listSelectWithIndex(elUL, indexSelected);
                    }
                }
                if (elUL.childNodes.length !== 0) {
                    elUL.classList.add("isvisible");
                    if (indexSelected !== -1) {
                        if (elUL.children[indexSelected]) {
                            if (elUL.children[indexSelected].offsetTop > lineHeight * 2) {
                                elUL.scrollTop;
                                elUL.scrollTo(0, elUL.children[indexSelected].offsetTop - lineHeight);
                            }
                        }
                    } else {
                        elUL.scrollTo(0, 0);
                    }
                }
            }
        }
        function closeDropdown() {
            elUL.removeEventListener("mousedown", onMouseDownUL, false);
            elUL.classList.remove("isvisible");
        }
        function escape() {
            if (elDDContainer.dataset.filter) {
                elInput.value = elDDContainer.dataset.filter;
            } else if (elDDContainer.dataset.origin) {
                elInput.value = elDDContainer.dataset.origin;
                if (settings.onChange) settings.onChange();
            }
            closeDropdown();
        }
        function onMouseDownUL(e) {
            let {entry: entry, control: control, lastDDMode: lastDDMode} = getMode();
            if (e.target.tagName === "LI") {
                elInput.value = e.target.innerText;
                if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
            } else if (e.target.tagName === "STRONG") {
                elInput.value = e.target.parentElement.innerText;
                if (elAutocomplete) elAutocomplete.classList.remove("isvisible");
            }
            let len = elUL.childNodes.length;
            let index = listFindSelectedIndex(elUL, "selected", len);
            if (index !== -1) {
                elUL.children[index].classList.remove("selected");
            }
            index = listItemValueIndex(elUL, elInput.value);
            if (index !== -1) {
                elUL.children[index].classList.add("selected");
            }
            if (e.target.tagName === "LI" || e.target.tagName === "STRONG") {
                if (settings.onChange) settings.onChange();
            }
            lastDDMode = false;
            entry = "listclick";
            control = "list";
            setMode(entry, control, lastDDMode);
        }
        function onClickArrow(e) {
            let {origin: origin, filter: filter} = getAttributes();
            let {entry: entry, control: control, lastDDMode: lastDDMode} = getMode();
            if (entry === "" || entry === "enter") {
                if (origin) {
                    elInput.value = origin;
                    if (elAutocomplete) {
                        elAutocomplete.classList.remove("isvisible");
                    }
                    if (settings.onChange) settings.onChange();
                }
            } else {
                if (filter) {
                    elInput.value = filter;
                    if (elAutocomplete) autocomplete();
                    if (settings.onChange) settings.onChange();
                }
            }
            toggleDropdown(lastDDMode);
            lastDDMode = elUL.classList.contains("isvisible");
            if (control === "input") {
                entry = "stay";
            } else if (!entry || entry === "enter") {
                entry = "enter";
            } else if (entry === "enter") {
                entry = "stay";
            }
            control = "arrow";
            setMode(entry, control, lastDDMode);
            elInput.focus();
        }
        function autocomplete() {
            if (elUL.childNodes[0]) {
                elAutocomplete.classList.add("isvisible");
                elAutocomplete.textContent = elUL.childNodes[0].textContent;
                elUL.childNodes[0].classList.add("selected");
            }
        }
        function clearField() {
            if (!selectionLength) selectionLength = elUL.children.length;
            let index = listFindSelectedIndex(elUL, "selected", selectionLength);
            if (index !== -1) {
                elUL.children[index].classList.remove("selected");
                elInput.value = "";
                if (settings.onChange) settings.onChange();
            }
        }
        function getList() {
            return list;
        }
        function setList(ddList) {
            list = ddList;
            const matchlist = list.map((cv => `<li>${cv}</li>`)).join("");
            elUL.style.maxHeight = maxHeight + "px";
            elUL.scrollTo(0, 0);
            elUL.innerHTML = matchlist;
        }
        function enableList(enabled) {
            if (enabled) {
                elUL.removeAttribute("disabled");
                elInput.removeAttribute("disabled");
                elArrow.removeAttribute("disabled");
            } else {
                elUL.classList.remove("isvisible");
                elUL.disabled = "true";
                elInput.disabled = "true";
                elArrow.disabled = "true";
            }
        }
        return {
            clearField: clearField,
            getList: getList,
            setList: setList,
            enableList: enableList
        };
    }
    return DropdownField;
}));
