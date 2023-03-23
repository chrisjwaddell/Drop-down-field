import {createElementAtt} from "./lib/dom.js"

import {eventkeyAZ09} from "./lib/event-keys.js"

function render(ULSelector, fieldLabel, placeholder, tabindex, ID) {
	const elOuter = document.querySelector(ULSelector)
	const elField = createElementAtt(elOuter, "div", ["ddsearchfield"], [], "")
	createElementAtt(elField, "label", [], [], fieldLabel)
	createElementAtt(
		elField,
		"input",
		[],
		[
			["type", "text"],
			["placeholder", placeholder],
			["ID", ID],
			["autofocus", ""],
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
	createElementAtt(elField, "ul", ["ddlist"], [], "")
}

function selectionFilter(str, dropDownOptions) {
	let regex
	str.length > 2
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
	return `${selectionLine.slice(0, startPos)}<strong>${selectionLine.slice(
		startPos,
		startPos + searchString.length
	)}</strong>${selectionLine.slice(startPos + searchString.length)}`
}

function bindEvents(
	outerSelector,
	fieldname,
	placeholder,
	tabindex,
	ID,
	dropDownOptions,
	opts
) {
	let elInput = document.querySelector("#" + ID)
	let elUL = document.querySelector("#" + ID + " + ul")

	let selectionLength
	let originalText
	let maxHeight

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

	// For each field, focus and blur events are always on
	// As soon as the field gets focus, keyup event fires
	function onFocus(e) {
		originalText = elInput.value.trim()
		elInput.addEventListener("keyup", onKeyUp)
		elInput.addEventListener("blur", onBlur)

		elUL.addEventListener("mousemove", onMouseMove)
		elUL.addEventListener("mousedown", onMouseDown)
	}

	function onKeyUp(e) {
		const COUNTRY_COUNT = 196
		let matches
		let matchlist

		selectionLength = elUL.children.length
		let index = selectionActive()

		if (e.keyCode === 38) {
			// Up arrow
			if (selectionLength > 0) {
				// Arrows work only when the list is showing
				if (elUL.classList.contains("isvisible")) {
					if (index === -1) {
						index = selectionLength - 1
						elUL.children[index].classList.add("active")
						elInput.value = elUL.children[index].textContent
					} else if (index === 0) {
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
				if (elUL.classList.contains("isvisible")) {
					if (index === -1) {
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

			const results = selectionFilter(
				elInput.value.trim(),
				dropDownOptions
			)

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
			if (results.length === COUNTRY_COUNT || results.length === 0) {
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
			console.log("ONE")
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

	elInput.addEventListener("focus", onFocus)

	let settingDefaults = {
		maxLines: 10,
	}

	let settings = opts || {}

	let maxLines = settings.maxLines ?? settingDefaults.maxLines

	// Number of lines to display
	// Work out height of a line and multiply for height of box
	let elULTemp = createElementAtt(
		document.querySelector(".ddsearchfield"),
		"ul",
		["ddlist", "isvisible"],
		[],
		""
	)
	elULTemp.style.visibility = "hidden"
	let elLI = createElementAtt(elULTemp, "li", [], [], "li")
	elLI.textContent = "abc"

	let lineHeight = elLI.clientHeight
	console.log(lineHeight)
	elULTemp.remove()

	maxHeight = lineHeight * maxLines
	elUL.style.maxHeight = maxHeight + "px"
}

export {render, bindEvents}
