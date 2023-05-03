import {createElementAtt} from "./lib/dom.js"
import {listFindSelectedIndex, listItemValueIndex} from "./lib/dom-dropdown.js"
import {objectLength} from "./lib/object.js"

export default function DropdownField(
	ULSelector,
	fieldLabel,
	placeholder,
	tabindex,
	ID,
	dropDownOptions,
	opts
) {
	const settingDefaults = {
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

	let selectionLength
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
			["ddfield"],
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
		const elInput = createElementAtt(
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

		elInput.dataset.filter = ""

		// Drop down arrow
		if (showDropdownArrow) {
			elInput.style.padding = "5px 30px 5px 12px"

			const elArrow = createElementAtt(
				elInputArrow,
				"button",
				["arrow"],
				[["tabindex", "-1"]],
				""
			)

			const xmlns = "http://www.w3.org/2000/svg"
			const elSVG = document.createElementNS(xmlns, "svg")
			elSVG.setAttributeNS(null, "viewBox", "0 0 100 100")
			elSVG.setAttributeNS(null, "width", "100")
			elSVG.setAttributeNS(null, "height", "100")

			const elLine1 = document.createElementNS(xmlns, "line")
			elLine1.setAttribute("x1", 20)
			elLine1.setAttribute("y1", 35)
			elLine1.setAttribute("x2", 50)
			elLine1.setAttribute("y2", 65)
			elSVG.appendChild(elLine1)
			const elLine2 = document.createElementNS(xmlns, "line")
			elLine2.setAttribute("x1", 50)
			elLine2.setAttribute("y1", 65)
			elLine2.setAttribute("x2", 80)
			elLine2.setAttribute("y2", 35)
			elSVG.appendChild(elLine2)

			elArrow.appendChild(elSVG)
			// elArrow.appendChild(elSVG)
		}

		const elUL = createElementAtt(elField, "ul", ["ddlist"], [], "")

		// Number of lines to display
		// Work out height of a line and multiply for height of box
		const elULTemp = createElementAtt(
			document.querySelector("#" + ID + ".ddfield"),
			"ul",
			["ddlist", "isvisible"],
			[],
			""
		)

		elULTemp.style.visibility = "hidden"
		const elLI = createElementAtt(elULTemp, "li", [], [], "li")
		elLI.textContent = "abc"

		lineHeight = elLI.clientHeight
		elULTemp.remove()

		maxHeight = lineHeight * maxLines
		elUL.style.maxHeight = maxHeight + "px"

		scrollAt =
			maxHeight - lineHeight * 4 > 0 ? maxHeight - lineHeight * 4 : 0
	}

	render(ULSelector, fieldLabel, placeholder, tabindex, ID)

	const elDDContainer = document.querySelector("#" + ID)
	let elInput = document.querySelector("#" + ID + " input")
	// const elInputArrow = document.querySelector("#" + ID + " .inputarrow")
	const elArrow = document.querySelector("#" + ID + " .arrow")
	const elUL = document.querySelector("#" + ID + " ul")

	document.addEventListener("DOMContentLoaded", function () {
		elDDContainer.addEventListener("blur", onBlurDD, true)

		elInput.addEventListener("focus", onFocusInput, true)
		elInput.addEventListener("click", onClickInput, true)

		if (showDropdownArrow) {
			elArrow.addEventListener("blur", onBlurArrow, true)
			elArrow.addEventListener("click", onClickArrow, true)
		}
	})

	// Return search results from dropDownOptions
	// matching str
	// searchMode - 0 - anywhere in, 1 - starts with str
	function selectionFilter(str, dropDownOptions, searchMode) {
		let regex

		searchMode
			? (regex = new RegExp(`.*${str}.*`, "gi"))
			: (regex = new RegExp(`^${str}.*`, "gi"))
		return dropDownOptions.filter((cv) => cv.match(regex))
	}

	// Puts <strong> element around the search filter
	// of the line item
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

	function onBlurDD() {
		console.log("%c" + "onBlurDD", log.logType("event"))
		console.log(
			"%c" +
				"onBLurDD - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
		elDDContainer.dataset.mode = elUL.classList.contains("isvisible")
		closeDropdown()
		// console.log(document.activeElement)

		console.log(
			"%c" +
				"onBLurDD - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	// For each field, focus and blur events are always on
	// As soon as the field gets focus, keyup event fires
	// Filter is empty on focus so the list is all items
	// If text is in, select that item
	function onFocusInput(e) {
		console.log("%c" + "onFocusInput", log.logType("event"))

		console.log(
			"%c" +
				"onFocusInput - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

		console.log(
			"%c" +
				"onFocusInput - elDDContainer.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("info")
		)
		elInput.dataset.filter = ""
		elInput.addEventListener("keyup", onKeyUpInput)
		elInput.addEventListener("blur", onBlurInput)

		elUL.addEventListener("mousemove", onMouseMoveUL)
		elUL.addEventListener("mousedown", onMouseDownUL)

		// Search filter is clear so show all in the list
		const matches = selectionFilter("", dropDownOptions, searchModeNumber)

		const matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")
		elUL.innerHTML = matchlist
		elUL.style.maxHeight = maxHeight + "px"
		// elUL.scrollTo(0, 0)

		// let index = -1
		// if (elInput.value) {
		// 	index = listItemValueIndex(elUL, elInput.value)
		// 	// console.log(index)

		// 	if (index !== -1) {
		// 		elUL.children[index].classList.add("selected")
		// 	}
		// }

		// openDropdown()
		// elUL.classList.add("isvisible")
		// elDDContainer.dataset.mode = elUL.classList.contains("isvisible")
		// elUL.focus()

		console.log(
			"%c" +
				"onFocusInput - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	function onBlurInput(e) {
		console.log("%c" + "onBlurInput", log.logType("event"))

		console.log(
			"%c" +
				"onBLurInput - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

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

		elUL.removeEventListener("mousemove", onMouseMoveUL)
		elUL.removeEventListener("mousedown", onMouseDownUL)

		elInput.removeEventListener("keyup", onKeyUpInput)
		elInput.removeEventListener("blur", onBlurInput)

		// closeDropdown()

		elInput.dataset.filter = ""

		console.log(
			"%c" +
				"onBLurInput - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	function onClickInput() {
		console.log("%c" + "onClickInput", log.logType("event"))

		console.log(
			"%c" +
				"onClickInput - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

		elUL.classList.add("isvisible")
		elDDContainer.dataset.mode = elUL.classList.contains("isvisible")
		openDropdown()
		// elUL.focus()

		console.log(
			"%c" +
				"onClickInput - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	function onKeyUpInput(e) {
		console.log("%c" + "onKeyUpInput", log.logType("event"))

		console.log(
			"%c" +
				"onKeyUpInput - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

		const DD_LIST_SIZE = objectLength(dropDownOptions)
		let matches
		let matchlist

		selectionLength = elUL.children.length
		let index = listFindSelectedIndex(elUL, "selected", selectionLength)

		if (e.keyCode === 38) {
			// Up arrow
			if (selectionLength > 0) {
				// Arrows work only when the list is showing
				if (elUL.classList.contains("isvisible")) {
					if (elUL.children[index]) {
						// if (elUL.children[index].offsetTop < lineHeight * 2) {
						if (elUL.children[index].offsetTop > 0) {
							const ulTop = elUL.scrollTop
							// if (ulTop - lineHeight * 3 < 0) {
							// 	elUL.scrollTo(0, ulTop - lineHeight)
							// } else {
							elUL.scrollTo(0, ulTop - lineHeight)
							// }
						}
					}

					if (index === -1) {
						elUL.scrollTo(0, elUL.scrollHeight - maxHeight)
						index = selectionLength - 1
						elUL.children[index].classList.add("selected")
						elInput.value = elUL.children[index].textContent
					} else if (index === 0) {
						elUL.scrollTo(0, 0)
						elUL.children[index].classList.remove("selected")
						index = -1
					} else {
						elUL.children[index].classList.remove("selected")
						index--
						elUL.children[index].classList.add("selected")
						elInput.value = elUL.children[index].textContent
					}
				}
			}
		} else if (e.keyCode === 40) {
			// Down arrow
			if (selectionLength > 0) {
				// Arrows work only when the list is showing
				if (elUL.classList.contains("isvisible")) {
					if (elUL.children[index]) {
						if (elUL.children[index].offsetTop > scrollAt) {
							const ulTop = elUL.scrollTop
							elUL.scrollTo(0, ulTop + lineHeight)
						}
					}
					if (index === -1) {
						elUL.scrollTo(0, 0)
						index++
						elUL.children[index].classList.add("selected")
						elInput.value = elUL.children[index].textContent
					} else if (index === selectionLength - 1) {
						elUL.children[index].classList.remove("selected")
						index = -1
					} else {
						elUL.children[index].classList.remove("selected")
						index++
						elUL.children[index].classList.add("selected")
						elInput.value = elUL.children[index].textContent
					}
				}
			}
		} else if (e.keyCode === 13) {
			// Enter
			// Enter toggles showing the drop down
			if (selectionLength >= 1) {
				elUL.classList.toggle("isvisible")
				elDDContainer.dataset.mode =
					elUL.classList.contains("isvisible")
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
			escape()
			elDDContainer.dataset.mode = false
		} else if (e.keyCode === 9) {
			// Tab
		} else {
			// Characters have been typed, this is where it finds the results

			if (
				e.key.length === 1 ||
				e.key === "Backspace" ||
				e.key === "Delete" ||
				e.key === "Space"
			) {
				let results = ""
				const strSearch = elInput.value

				elInput.dataset.filter = strSearch.toLowerCase()

				if (firstXLettersOppositeSearchMode) {
					// If First x letters is a different mode
					if (strSearch.length <= firstXLettersOppositeSearchMode) {
						if (searchModeNumber === 0) {
							results = selectionFilter(
								strSearch,
								dropDownOptions,
								1
							)
						} else {
							results = selectionFilter(
								strSearch,
								dropDownOptions,
								0
							)
						}
					} else {
						results = selectionFilter(
							strSearch,
							dropDownOptions,
							searchModeNumber
						)
					}
				} else {
					results = selectionFilter(
						strSearch,
						dropDownOptions,
						searchModeNumber
					)
				}

				// Nothing typed in or nothing matching
				if (results.length === DD_LIST_SIZE) {
					matches = results.map((cv) =>
						dropdownSelectedString(cv, elInput.value.trim())
					)

					matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")

					elUL.classList.add("isvisible")
					elUL.style.maxHeight = maxHeight + "px"
					elUL.scrollTo(0, 0)
					elUL.innerHTML = matchlist
				} else if (results.length === 0) {
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

					matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")

					elUL.classList.add("isvisible")
					elUL.style.maxHeight = maxHeight + "px"
					elUL.scrollTo(0, 0)
					elUL.innerHTML = matchlist
				}
			}
		}

		console.log(
			"%c" +
				"onKeyUpInput - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	function toggleDropdown(visible) {
		console.log(
			"%c" +
				"toggleDropdown - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("function")
		)

		if (visible) {
			closeDropdown()
		} else {
			openDropdown()
		}

		console.log(
			"%c" +
				"toggleDropdown - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("function")
		)
	}

	function openDropdown() {
		console.log(
			"%c" +
				"openDropdown - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("function")
		)

		let indexSelected = -1
		if (elInput.value) {
			indexSelected = listItemValueIndex(elUL, elInput.value)

			if (indexSelected !== -1) {
				elUL.children[indexSelected].classList.add("selected")
			}
		}

		elUL.classList.add("isvisible")

		if (indexSelected !== -1) {
			elUL.children[indexSelected].classList.add("selected")

			// Scroll to the right position if needed
			if (elUL.children[indexSelected]) {
				if (elUL.children[indexSelected].offsetTop > lineHeight * 2) {
					const ulTop = elUL.scrollTop
					elUL.scrollTo(
						0,
						elUL.children[indexSelected].offsetTop - lineHeight
					)

					// if (ulTop - lineHeight * 3 < 0) {
					// 	elUL.scrollTo(0, ulTop - lineHeight)
					// } else {
					// 	elUL.scrollTo(0, ulTop - lineHeight)
					// }
				}
			}
		} else {
			elUL.scrollTo(0, 0)
		}
	}

	function closeDropdown() {
		console.log(
			"%c" +
				"closeDropdwon - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("function")
		)

		elUL.classList.remove("isvisible")
	}

	function escape() {
		// Press Esc and it goes back to what was originally typed. Field focus stays.
		// closeDropdown()
		elInput.value = elInput.dataset.filter
	}

	function onMouseDownUL(e) {
		console.log("%c" + "onMouseDownUL", log.logType("event"))
		console.log(
			"%c" +
				"onMouseDownUL - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

		console.log(e.target.tagName)
		if (e.target.tagName === "LI") {
			elInput.value = e.target.innerText
			// originalText = e.target.innerText
		} else if (e.target.tagName === "STRONG") {
			elInput.value = e.target.parentElement.innerText
			// originalText = e.target.parentElement.innerText
		}

		console.log(
			"%c" +
				"onMouseDownUL - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	function onMouseMoveUL() {
		// let selectionHover = ""
		//		onFocusArrow // let index = -1
		// if (elUL.children[0]) {
		// 	selectionHover =
		// 		document.querySelector(".ddlist li:hover") == null
		// 			? ""
		// 			: document.querySelector(".ddlist li:hover").textContent
		// 	for (let i = 0; i < elUL.children.length; i++) {
		// 		elUL.children[i].classList.remove("selected")
		// 		if (
		// 			selectionHover !== "" &&
		// 			selectionHover === elUL.children[i].textContent
		// 		) {
		// 			if (index !== -1)
		// 				elUL.children[index].classList.remove("selected")
		// 			index = i
		// 			elUL.children[index].classList.add("selected")
		// 		}
		// 	}
		// }
	}

	function onClickArrow(e) {
		console.log("%c" + "onClickArrow", log.logType("event"))

		console.log(
			"%c" +
				"onClickArrow - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

		// const visibleNow = elUL.classList.contains("isvisible")
		let visibleNow
		if (elUL.classList.contains("isvisible")) {
			if (elDDContainer.dataset.mode === "true") {
				visibleNow = true
			} else {
				visibleNow = true
			}
		} else {
			if (elDDContainer.dataset.mode === "true") {
				visibleNow = true
			} else {
				visibleNow = false
			}
			// visibleNow = true
			// visibleNow = elUL.classList.contains("isvisible")
		}

		// const visibleNow = elUL.classList.contains("isvisible")
		console.log(
			"%c" + "onClickArrow - visibleNow - " + visibleNow,
			log.logType("red")
		)
		// const visibleNow = !!elDDContainer.dataset.mode

		// alert(
		// 	"onClickArrow - visibleNow - " +
		// 		visibleNow +
		// 		" - elDDContainer.dataset.mode - " +
		// 		elDDContainer.dataset.mode
		// )

		elDDContainer.dataset.mode = ""

		// elUL = document.querySelector("#" + ID + " ul")

		if (!elUL.value) {
			const matches = selectionFilter("", dropDownOptions, 0)
			const matchlist = matches.map((cv) => `<li>${cv}</li>`).join("")
			elUL.innerHTML = matchlist
		}

		let i
		for (i = 0; i < elUL.children.length; i++) {
			if (elUL.children[i].textContent === elInput.value) {
				elUL.children[i].classList.add("selected")
				break
			}
		}

		if (i === elUL.children.length) elUL.scrollTo(0, 0)

		elInput = document.querySelector("#" + ID + " input")
		elInput.focus()

		toggleDropdown(visibleNow)

		console.log(
			"%c" +
				"onClickArrow - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}

	function onBlurArrow() {
		console.log("%c" + "onBlurArrow", log.logType("event"))

		console.log(
			"%c" +
				"onBlurArrow - start - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)

		elUL.classList.remove("isvisible")
		elDDContainer.dataset.mode = ""
		// alert("end of onBLurArrow")

		console.log(
			"%c" +
				"onBlurArrow - end - elUL.classList.contains(isvisible) - " +
				elUL.classList.contains("isvisible") +
				" - elDD.dataset.mode - " +
				elDDContainer.dataset.mode,
			log.logType("watch")
		)
	}
}
