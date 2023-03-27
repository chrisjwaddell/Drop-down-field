import {createElementAtt} from "./lib/dom.js"

import {eventkeyAZ09} from "./lib/event-keys.js"

function DropdownList(
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
	}

	const settings = opts || {}

	const maxLines = settings.maxLines ?? settingDefaults.maxLines
	let searchModeNumber = 1
	if (settings.searchMode) {
		if (settings.searchMode.toLowerCase() === "starts with") {
			searchModeNumber = 0
		} else {
			searchModeNumber = 1
		}
	} else {
		searchModeNumber = 0
	}
	const firstXLettersOppositeSearchMode =
		settings.firstXLettersOppositeSearchMode ??
		settingDefaults.firstXLettersOppositeSearchMode

	const showDropdownArrow =
		settings.showDropdownArrow ?? settingDefaults.showDropdownArrow

	const objectLength = (obj) => Object.entries(obj).length

	let selectionLength
	let originalText
	let maxHeight
	let lineHeight
	let scrollAt

	function render(
		ULSelector,
		fieldLabel,
		placeholder,
		tabindex,
		ID,
		dropDownOptions
	) {
		const elOuter = document.querySelector(ULSelector)
		const elField = createElementAtt(
			elOuter,
			"div",
			["ddsearchfield"],
			[["ID", ID]],
			""
		)
		createElementAtt(elField, "label", [], [], fieldLabel)
		const elInputArrow = createElementAtt(
			elField,
			"div",
			["inputarrow"],
			[],
			""
		)
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
		)

		// Drop down arrow
		if (showDropdownArrow) {
			elInput.style.padding = "5px 30px 5px 12px"

			let elArrow = createElementAtt(
				elInputArrow,
				"div",
				["arrow"],
				[],
				""
			)

			const xmlns = "http://www.w3.org/2000/svg"
			let elSVG = document.createElementNS(xmlns, "svg")
			elSVG.setAttributeNS(null, "viewBox", "0 0 100 100")
			elSVG.setAttributeNS(null, "width", "100")
			elSVG.setAttributeNS(null, "height", "100")

			let elLine1 = document.createElementNS(xmlns, "line")
			elLine1.setAttribute("x1", 20)
			elLine1.setAttribute("y1", 35)
			elLine1.setAttribute("x2", 50)
			elLine1.setAttribute("y2", 65)
			elSVG.appendChild(elLine1)
			let elLine2 = document.createElementNS(xmlns, "line")
			elLine2.setAttribute("x1", 50)
			elLine2.setAttribute("y1", 65)
			elLine2.setAttribute("x2", 80)
			elLine2.setAttribute("y2", 35)
			elSVG.appendChild(elLine2)

			elArrow.appendChild(elSVG)
			// elArrow.appendChild(elSVG)
		}

		let elUL = createElementAtt(elField, "ul", ["ddlist"], [], "")

		// Number of lines to display
		// Work out height of a line and multiply for height of box
		let elULTemp = createElementAtt(
			document.querySelector("#" + ID + ".ddsearchfield"),
			"ul",
			["ddlist", "isvisible"],
			[],
			""
		)

		elULTemp.style.visibility = "hidden"
		let elLI = createElementAtt(elULTemp, "li", [], [], "li")
		elLI.textContent = "abc"

		lineHeight = elLI.clientHeight
		elULTemp.remove()

		maxHeight = lineHeight * maxLines
		elUL.style.maxHeight = maxHeight + "px"

		scrollAt =
			maxHeight - lineHeight * 4 > 0 ? maxHeight - lineHeight * 4 : 0
	}

	render(ULSelector, fieldLabel, placeholder, tabindex, ID)

	let elInput = document.querySelector("#" + ID + " input")
	let elUL = document.querySelector("#" + ID + " ul")

	document.addEventListener("DOMContentLoaded", function () {
		console.log("DOMContentLoaded event")

		let elInput = document.querySelector("#" + ID + " input")
		elInput.addEventListener("focus", onFocus)
	})

	function selectionActive() {
		if (elInput.nextElementSibling) {
			for (let i = 0; i < selectionLength; i++) {
				if (elUL.children[i].classList.value === "active") {
					return i
				}
			}
			return -1
		}
		return -1
	}

	// Return search results
	// searchMode - 0 - anywhere in, 1 - starts with str
	function selectionFilter(str, dropDownOptions, searchMode) {
		let regex

		searchMode
			? (regex = new RegExp(`.*${str}.*`, "gi"))
			: (regex = new RegExp(`^${str}.*`, "gi"))
		return dropDownOptions.filter((cv) => cv.match(regex))
	}

	function dropdownSelectedString(selectionLine, searchString) {
		const fieldString = new RegExp(`${searchString}`, "i")
		const startPos = selectionLine.search(fieldString)
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
		console.log("onFocus")
		originalText = elInput.value.trim()
		elInput.addEventListener("keyup", onKeyUp)
		elInput.addEventListener("blur", onBlur)

		elUL.addEventListener("mousemove", onMouseMove)
		elUL.addEventListener("mousedown", onMouseDown)

		if (showDropdownArrow) {
			document
				.querySelector("#" + ID + " .arrow")
				.addEventListener("click", onClick)
		}
	}

	function onKeyUp(e) {
		const DD_LIST_SIZE = objectLength(dropDownOptions)
		let matches
		let matchlist

		selectionLength = elUL.children.length
		let index = selectionActive()

		if (e.keyCode === 38) {
			// Up arrow
			if (selectionLength > 0) {
				// Arrows work only when the list is showing
				if (elUL.classList.contains("isvisible")) {
					if (elUL.children[index]) {
						if (elUL.children[index].offsetTop < lineHeight * 2) {
							let ulTop = elUL.scrollTop
							if (ulTop - lineHeight * 3 < 0) {
								elUL.scrollTo(0, ulTop - lineHeight)
							} else {
								elUL.scrollTo(0, ulTop - lineHeight)
							}
						}
					}

					if (index === -1) {
						elUL.scrollTo(0, elUL.scrollHeight - maxHeight)
						index = selectionLength - 1
						elUL.children[index].classList.add("active")
						elInput.value = elUL.children[index].textContent
					} else if (index === 0) {
						elUL.scrollTo(0, 0)
						elUL.children[index].classList.remove("active")
						index = -1
						elInput.value = originalText
					} else {
						elUL.children[index].classList.remove("active")
						index--
						elUL.children[index].classList.add("active")
						elInput.value = elUL.children[index].textContent
					}
				}
			}
		} else if (e.keyCode === 40) {
			// Down arrow
			if (selectionLength > 0) {
				// Arrows work only when the list is showing
				if (elUL.children[index]) {
					if (elUL.children[index].offsetTop > scrollAt) {
						let ulTop = elUL.scrollTop
						elUL.scrollTo(0, ulTop + lineHeight)
					}
				}
				if (elUL.classList.contains("isvisible")) {
					if (index === -1) {
						elUL.scrollTo(0, 0)
						index++
						elUL.children[index].classList.add("active")
						elInput.value = elUL.children[index].textContent
					} else if (index === selectionLength - 1) {
						elUL.children[index].classList.remove("active")
						index = -1
						elInput.value = originalText
					} else {
						elUL.children[index].classList.remove("active")
						index++
						elUL.children[index].classList.add("active")
						elInput.value = elUL.children[index].textContent
					}
				}
			}
		} else if (e.keyCode === 13) {
			// Enter
			// Enter toggles showing the drop down
			if (selectionLength <= 1) {
				elUL.classList.remove("isvisible")
			} else {
				elUL.classList.toggle("isvisible")
				elUL.style.maxHeight = maxHeight + "px"
				elUL.scrollTo(0, 0)
			}
		} else if (e.keyCode === 27) {
			// Escape
			escape()
		} else if (e.keyCode === 9) {
			// Tab
		} else {
			// Characters have been typed, this is where it finds the results

			let results = ""
			let strSearch = elInput.value.trim()

			if (!!firstXLettersOppositeSearchMode) {
				// If First x letters is a different mode
				if (strSearch.length <= firstXLettersOppositeSearchMode) {
					if (searchModeNumber === 0) {
						console.log("1 0    ")
						results = selectionFilter(strSearch, dropDownOptions, 1)
					} else {
						console.log("1 1   ")
						results = selectionFilter(strSearch, dropDownOptions, 0)
					}
				} else {
					console.log("2")
					results = selectionFilter(
						strSearch,
						dropDownOptions,
						searchModeNumber
					)
				}
			} else {
				console.log("3")
				results = selectionFilter(
					strSearch,
					dropDownOptions,
					searchModeNumber
				)
			}

			// This is mainly when the field gets focus from Shift+Tab, if there is only 1 item
			// in the drop down, don't show the drop down
			if (
				originalText === elInput.value.trim() &&
				results.length === 1 &&
				!eventkeyAZ09(e.keyCode)
			)
				return

			originalText = elInput.value.trim()

			// Nothing typed in or nothing matching
			if (results.length === DD_LIST_SIZE || results.length === 0) {
				matches = []
				elUL.classList.remove("isvisible")
				for (let i = 0, len = elUL.children.length; i < len; i++) {
					elUL.children[i] && elUL.children[i].remove()
				}
			} else {
				// Letters typed are bold
				matches = results.map((cv) =>
					dropdownSelectedString(cv, elInput.value.trim())
				)
				// console.log(matches)

				matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")
				// console.log(matchlist)

				elUL.classList.add("isvisible")
				elUL.style.maxHeight = maxHeight + "px"
				elUL.scrollTo(0, 0)
				elUL.innerHTML = matchlist
			}
		}
	}

	function listClose() {
		elUL.classList.remove("isvisible")
	}

	function escape() {
		// Press Esc and it goes back to what was originally typed. Field focus stays.
		listClose()
		elInput.value = originalText

		if (
			!dropDownOptions
				.map((x) => x.toLowerCase())
				.includes(elInput.value.trim().toLowerCase())
		) {
			elInput.value = originalText
		} else {
			const dd = dropDownOptions
				.map((x) => x.toLowerCase())
				.findIndex((cv) => cv === elInput.value.trim().toLowerCase())
			elInput.value = dropDownOptions[dd]
		}
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
		let arr = []

		arr = [...elUL.children]

		if (arr.length === 1) {
			if (
				elInput.value.trim() !== arr[0].textContent &&
				elInput.value.trim().toLowerCase() ===
					arr[0].textContent.toLowerCase()
			) {
				elInput.value = arr[0].textContent
			}
		}

		if (!dropDownOptions.includes(elInput.value.trim())) {
			elInput.value = ""
		}
		elUL.classList.remove("isvisible")

		elUL.removeEventListener("mousedown", onMouseDown)
		elUL.removeEventListener("mousemove", onMouseMove)

		elInput.removeEventListener("keyup", onKeyUp)
		elInput.removeEventListener("blur", onBlur)
	}

	function onMouseDown(e) {
		console.log("onMouseDown")
		elInput.value = e.target.innerText
		originalText = e.target.innerText
	}

	function onMouseMove() {
		let selectionHover = ""
		let index = -1
		if (elUL.children[0]) {
			selectionHover =
				document.querySelector(".ddlist li:hover") == null
					? ""
					: document.querySelector(".ddlist li:hover").textContent
			for (let i = 0; i < elUL.children.length; i++) {
				elUL.children[i].classList.remove("active")
				if (
					selectionHover !== "" &&
					selectionHover === elUL.children[i].textContent
				) {
					if (index !== -1)
						elUL.children[index].classList.remove("active")
					index = i
					elUL.children[index].classList.add("active")
				}
			}
		}
	}

	function onClick(e) {
		console.log("onClick")
		console.log(e.target)
		console.log(e.target.parentNode)
		console.log(e.target.parentNode.parentNode.parentNode)
		console.log(elInput.value)
		elUL = document.querySelector("#" + ID + " ul")
		console.log(ID)
		console.log(elUL)
		elUL.classList.toggle("isvisible")
		console.log(Boolean(elUL.value))

		if (!elUL.value) {
			let matches = selectionFilter("", dropDownOptions, 0)
			let matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")
			console.log(matchlist)
			elUL.innerHTML = matchlist
		}
	}
}

export {DropdownList}
