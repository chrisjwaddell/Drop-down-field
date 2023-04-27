var DropdownField = (function () {
    'use strict';

    function appendChild(el, child) {
        return el.appendChild(child)
    }

    function createElementAtt(parent, element, cls, att, text) {
        const el = document.createElement(element);
        // debugger

        if (text) {
            el.textContent = text;
        }

        cls.forEach((item) => {
            el.classList.add(item);
        });

        att.forEach((i) => {
            el.setAttribute(i[0], i[1]);
        });

        return (parent && appendChild(parent, el)) || el
    }

    function DropdownField(
    	ULSelector,
    	fieldLabel,
    	placeholder,
    	tabindex,
    	ID,
    	dropDownOptions,
    	opts
    ) {
    	let settingDefaults = {
    		maxLines: 10,
    		searchMode: 1,
    		firstXLettersOppositeSearchMode: 0,
    		showDropdownArrow: false,
    	};

    	const settings = opts || {};

    	const maxLines = settings.maxLines ?? settingDefaults.maxLines;
    	let searchModeNumber = 1;
    	if (settings.searchMode) {
    		if (settings.searchMode.toLowerCase() === "starts with") {
    			searchModeNumber = 0;
    		} else {
    			searchModeNumber = 1;
    		}
    	} else {
    		searchModeNumber = 0;
    	}
    	const firstXLettersOppositeSearchMode =
    		settings.firstXLettersOppositeSearchMode ??
    		settingDefaults.firstXLettersOppositeSearchMode;

    	const showDropdownArrow =
    		settings.showDropdownArrow ?? settingDefaults.showDropdownArrow;

    	const objectLength = (obj) => Object.entries(obj).length;

    	let selectionLength;
    	let maxHeight;
    	let lineHeight;
    	let scrollAt;

    	function render(
    		ULSelector,
    		fieldLabel,
    		placeholder,
    		tabindex,
    		ID,
    		dropDownOptions
    	) {
    		const elOuter = document.querySelector(ULSelector);
    		const elField = createElementAtt(
    			elOuter,
    			"div",
    			["ddfield"],
    			[["ID", ID]],
    			""
    		);
    		createElementAtt(elField, "label", [], [], fieldLabel);
    		const elInputArrow = createElementAtt(
    			elField,
    			"div",
    			["inputarrow"],
    			[],
    			""
    		);
    		let elInput = createElementAtt(
    			elInputArrow,
    			"input",
    			[],
    			[
    				["type", "text"],
    				["placeholder", placeholder],
    				["aria-autocomplete", "both"],
    				["autocapitalize", "none"],
    				["autocomplete", "off"],
    				["autocorrect", "off"],
    				["spellcheck", "false"],
    				["tabindex", tabindex],
    				["value", ""],
    			],
    			""
    		);

    		elInput.dataset.filter = "";

    		// Drop down arrow
    		if (showDropdownArrow) {
    			elInput.style.padding = "5px 30px 5px 12px";

    			let elArrow = createElementAtt(
    				elInputArrow,
    				"div",
    				["arrow"],
    				[],
    				""
    			);

    			const xmlns = "http://www.w3.org/2000/svg";
    			let elSVG = document.createElementNS(xmlns, "svg");
    			elSVG.setAttributeNS(null, "viewBox", "0 0 100 100");
    			elSVG.setAttributeNS(null, "width", "100");
    			elSVG.setAttributeNS(null, "height", "100");

    			let elLine1 = document.createElementNS(xmlns, "line");
    			elLine1.setAttribute("x1", 20);
    			elLine1.setAttribute("y1", 35);
    			elLine1.setAttribute("x2", 50);
    			elLine1.setAttribute("y2", 65);
    			elSVG.appendChild(elLine1);
    			let elLine2 = document.createElementNS(xmlns, "line");
    			elLine2.setAttribute("x1", 50);
    			elLine2.setAttribute("y1", 65);
    			elLine2.setAttribute("x2", 80);
    			elLine2.setAttribute("y2", 35);
    			elSVG.appendChild(elLine2);

    			elArrow.appendChild(elSVG);
    			// elArrow.appendChild(elSVG)
    		}

    		let elUL = createElementAtt(elField, "ul", ["ddlist"], [], "");

    		// Number of lines to display
    		// Work out height of a line and multiply for height of box
    		let elULTemp = createElementAtt(
    			document.querySelector("#" + ID + ".ddfield"),
    			"ul",
    			["ddlist", "isvisible"],
    			[],
    			""
    		);

    		elULTemp.style.visibility = "hidden";
    		let elLI = createElementAtt(elULTemp, "li", [], [], "li");
    		elLI.textContent = "abc";

    		lineHeight = elLI.clientHeight;
    		elULTemp.remove();

    		maxHeight = lineHeight * maxLines;
    		elUL.style.maxHeight = maxHeight + "px";

    		scrollAt =
    			maxHeight - lineHeight * 4 > 0 ? maxHeight - lineHeight * 4 : 0;
    	}

    	render(ULSelector, fieldLabel, placeholder, tabindex, ID);

    	let elInput = document.querySelector("#" + ID + " input");
    	document.querySelector("#" + ID + " .inputarrow");
    	let elUL = document.querySelector("#" + ID + " ul");

    	document.addEventListener("DOMContentLoaded", function () {
    		elInput.addEventListener("focus", onFocus);

    		if (showDropdownArrow) {
    			document
    				.querySelector("#" + ID + " .arrow")
    				.addEventListener("click", onClick);
    		}
    	});

    	function selectionActive() {
    		for (let i = 0; i < selectionLength; i++) {
    			if (elUL.children[i].classList.value === "active") {
    				return i
    			}
    		}
    		return -1
    	}

    	function itemMatch(itemValue) {
    		for (let i = 0; i < selectionLength; i++) {
    			if (elUL.children[i].textContent === itemValue) {
    				return i
    			}
    		}
    		return -1
    	}

    	// Return search results
    	// searchMode - 0 - anywhere in, 1 - starts with str
    	function selectionFilter(str, dropDownOptions, searchMode) {
    		let regex;

    		searchMode
    			? (regex = new RegExp(`.*${str}.*`, "gi"))
    			: (regex = new RegExp(`^${str}.*`, "gi"));
    		return dropDownOptions.filter((cv) => cv.match(regex))
    	}

    	function dropdownSelectedString(selectionLine, searchString) {
    		const fieldString = new RegExp(`${searchString}`, "i");
    		const startPos = selectionLine.search(fieldString);
    		if (startPos === -1 || searchString.length === 0) {
    			return selectionLine
    		}
    		return `${selectionLine.slice(
			0,
			startPos
		)}<strong>${selectionLine.slice(
			startPos,
			startPos + searchString.length
		)}</strong>${selectionLine.slice(startPos + searchString.length)}`
    	}

    	// For each field, focus and blur events are always on
    	// As soon as the field gets focus, keyup event fires
    	function onFocus(e) {
    		elInput.dataset.filter = "";
    		elInput.addEventListener("keyup", onKeyUp);
    		elInput.addEventListener("blur", onBlur);

    		elUL.addEventListener("mousemove", onMouseMove);
    		elUL.addEventListener("mousedown", onMouseDown);

    		// Search filter is clear so show all in the list
    		let matches = selectionFilter("", dropDownOptions, searchModeNumber);

    		let matchlist = matches.map((cv) => `<li>${cv}</li>`).join("");
    		elUL.innerHTML = matchlist;
    		// elUL.classList.add("isvisible")
    		elUL.style.maxHeight = maxHeight + "px";
    		// elUL.scrollTo(0, 0)

    		if (elInput.value) {
    			let index = itemMatch(elInput.value);

    			if (index !== -1) {
    				elUL.children[index].classList.add("active");

    				if (elUL.children[index]) {
    					if (elUL.children[index].offsetTop < lineHeight * 2) {
    						let ulTop = elUL.scrollTop;
    						if (ulTop - lineHeight * 3 < 0) {
    							elUL.scrollTo(0, ulTop - lineHeight);
    						} else {
    							elUL.scrollTo(0, ulTop - lineHeight);
    						}
    					}
    				}
    			}
    		}
    	}

    	function onKeyUp(e) {
    		const DD_LIST_SIZE = objectLength(dropDownOptions);
    		let matches;
    		let matchlist;

    		selectionLength = elUL.children.length;
    		let index = selectionActive();

    		if (e.keyCode === 38) {
    			// Up arrow
    			if (selectionLength > 0) {
    				// Arrows work only when the list is showing
    				if (elUL.classList.contains("isvisible")) {
    					if (elUL.children[index]) {
    						if (elUL.children[index].offsetTop < lineHeight * 2) {
    							let ulTop = elUL.scrollTop;
    							if (ulTop - lineHeight * 3 < 0) {
    								elUL.scrollTo(0, ulTop - lineHeight);
    							} else {
    								elUL.scrollTo(0, ulTop - lineHeight);
    							}
    						}
    					}

    					if (index === -1) {
    						elUL.scrollTo(0, elUL.scrollHeight - maxHeight);
    						index = selectionLength - 1;
    						elUL.children[index].classList.add("active");
    						elInput.value = elUL.children[index].textContent;
    					} else if (index === 0) {
    						elUL.scrollTo(0, 0);
    						elUL.children[index].classList.remove("active");
    						index = -1;
    					} else {
    						elUL.children[index].classList.remove("active");
    						index--;
    						elUL.children[index].classList.add("active");
    						elInput.value = elUL.children[index].textContent;
    					}
    				}
    			}
    		} else if (e.keyCode === 40) {
    			// Down arrow
    			if (selectionLength > 0) {
    				// Arrows work only when the list is showing
    				if (elUL.children[index]) {
    					if (elUL.children[index].offsetTop > scrollAt) {
    						let ulTop = elUL.scrollTop;
    						elUL.scrollTo(0, ulTop + lineHeight);
    					}
    				}
    				if (elUL.classList.contains("isvisible")) {
    					if (index === -1) {
    						elUL.scrollTo(0, 0);
    						index++;
    						elUL.children[index].classList.add("active");
    						elInput.value = elUL.children[index].textContent;
    					} else if (index === selectionLength - 1) {
    						elUL.children[index].classList.remove("active");
    						index = -1;
    					} else {
    						elUL.children[index].classList.remove("active");
    						index++;
    						elUL.children[index].classList.add("active");
    						elInput.value = elUL.children[index].textContent;
    					}
    				}
    			}
    		} else if (e.keyCode === 13) {
    			// Enter
    			// Enter toggles showing the drop down
    			if (selectionLength >= 1) {
    				elUL.classList.toggle("isvisible");
    			}
    			// if (selectionLength <= 1) {
    			// 	if (elInput.value === "") {
    			// 		// Nothing typed
    			// 		let matches = selectionFilter(
    			// 			"",
    			// 			dropDownOptions,
    			// 			searchModeNumber
    			// 		)

    			// 		matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")
    			// 		elUL.innerHTML = matchlist
    			// 		elUL.classList.add("isvisible")
    			// 		elUL.style.maxHeight = maxHeight + "px"
    			// 		elUL.scrollTo(0, 0)
    			// 	} else {
    			// 		elUL.classList.remove("isvisible")
    			// 	}
    			// } else {
    			// 	elUL.classList.toggle("isvisible")
    			// 	elUL.style.maxHeight = maxHeight + "px"
    			// 	elUL.scrollTo(0, 0)
    			// }
    		} else if (e.keyCode === 27) {
    			// Escape
    			escape();
    		} else if (e.keyCode === 9) ; else {
    			// Characters have been typed, this is where it finds the results

    			if (
    				e.key.length === 1 ||
    				e.key === "Backspace" ||
    				e.key === "Delete" ||
    				e.key === "Space"
    			) {
    				let results = "";
    				let strSearch = elInput.value;

    				elInput.dataset.filter = strSearch.toLowerCase();

    				if (!!firstXLettersOppositeSearchMode) {
    					// If First x letters is a different mode
    					if (strSearch.length <= firstXLettersOppositeSearchMode) {
    						if (searchModeNumber === 0) {
    							results = selectionFilter(
    								strSearch,
    								dropDownOptions,
    								1
    							);
    						} else {
    							results = selectionFilter(
    								strSearch,
    								dropDownOptions,
    								0
    							);
    						}
    					} else {
    						results = selectionFilter(
    							strSearch,
    							dropDownOptions,
    							searchModeNumber
    						);
    					}
    				} else {
    					results = selectionFilter(
    						strSearch,
    						dropDownOptions,
    						searchModeNumber
    					);
    				}

    				// Nothing typed in or nothing matching
    				if (results.length === DD_LIST_SIZE) {
    					matches = results.map((cv) =>
    						dropdownSelectedString(cv, elInput.value.trim())
    					);

    					matchlist = matches.map((cv) => `<li>${cv}</li>`).join("");

    					elUL.classList.add("isvisible");
    					elUL.style.maxHeight = maxHeight + "px";
    					elUL.scrollTo(0, 0);
    					elUL.innerHTML = matchlist;
    				} else if (results.length === 0) {
    					matches = [];
    					elUL.classList.remove("isvisible");
    					for (let i = 0, len = elUL.children.length; i < len; i++) {
    						elUL.children[i] && elUL.children[i].remove();
    					}
    				} else {
    					// Letters typed are bold
    					matches = results.map((cv) =>
    						dropdownSelectedString(cv, elInput.value.trim())
    					);

    					matchlist = matches.map((cv) => `<li>${cv}</li>`).join("");

    					elUL.classList.add("isvisible");
    					elUL.style.maxHeight = maxHeight + "px";
    					elUL.scrollTo(0, 0);
    					elUL.innerHTML = matchlist;
    				}
    			}
    		}
    	}

    	function escape() {
    		// Press Esc and it goes back to what was originally typed. Field focus stays.
    		// listClose()
    		elInput.value = elInput.dataset.filter;
    	}

    	function onBlur(e) {
    		/*
    		 * Before leaving the field, check if what's in the input is
    		 * in the drop down list
    		 */

    		/* Selecting an item from drop down using the mouse click activates
    		 * mousedown on elUL and then input blur event. But the input box
    		 * gets the focus again so we don't want to run this function if there
    		 * was a selection with a mouseclick.
    		 */
    		let arr = [];

    		arr = [...elUL.children];

    		if (arr.length === 1) {
    			if (
    				elInput.value.trim() !== arr[0].textContent &&
    				elInput.value.trim().toLowerCase() ===
    					arr[0].textContent.toLowerCase()
    			) {
    				elInput.value = arr[0].textContent;
    			}
    		}

    		if (!dropDownOptions.includes(elInput.value.trim())) {
    			elInput.value = "";
    		}

    		elUL.removeEventListener("mousedown", onMouseDown);
    		elUL.removeEventListener("mousemove", onMouseMove);

    		elInput.removeEventListener("keyup", onKeyUp);
    		elInput.removeEventListener("blur", onBlur);

    		elUL.classList.remove("isvisible");

    		elInput.dataset.filter = "";
    	}

    	function onMouseDown(e) {
    		if (e.target.tagName === "LI") {
    			elInput.value = e.target.innerText;
    		}
    	}

    	function onMouseMove() {
    		let selectionHover = "";
    		let index = -1;
    		if (elUL.children[0]) {
    			selectionHover =
    				document.querySelector(".ddlist li:hover") == null
    					? ""
    					: document.querySelector(".ddlist li:hover").textContent;
    			for (let i = 0; i < elUL.children.length; i++) {
    				elUL.children[i].classList.remove("active");
    				if (
    					selectionHover !== "" &&
    					selectionHover === elUL.children[i].textContent
    				) {
    					if (index !== -1)
    						elUL.children[index].classList.remove("active");
    					index = i;
    					elUL.children[index].classList.add("active");
    				}
    			}
    		}
    	}

    	function onClick(e) {
    		elUL = document.querySelector("#" + ID + " ul");

    		if (!elUL.value) {
    			let matches = selectionFilter("", dropDownOptions, 0);
    			let matchlist = matches.map((cv) => `<li>${cv}</li>`).join("");
    			elUL.innerHTML = matchlist;
    		}

    		let i;
    		for (i = 0; i < elUL.children.length; i++) {
    			if (elUL.children[i].textContent === elInput.value) {
    				elUL.children[i].classList.add("active");
    				break
    			}
    		}

    		if (i === elUL.children.length) elUL.scrollTo(0, 0);

    		elUL.classList.toggle("isvisible");

    		elInput = document.querySelector("#" + ID + " input");
    		elInput.focus();
    	}
    }

    return DropdownField;

})();
