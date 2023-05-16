document.addEventListener("DOMContentLoaded", function () {
	document.addEventListener("focus", onFocusDoc, true)
	document.addEventListener("focus", onFocusClickDoc, true)
	document.addEventListener("click", onFocusClickDoc, true)
})

const findOptions = (item) => dropDownOptions.includes(item)

// On leaving the field, if the value doesn't match anything in
// the list, make the field blank or go back to the original
// value.
function onFocusDoc(e) {
	// console.log("%c" + "onFocusDoc", log.logType("event"))

	const arrInput = Array.from(document.querySelectorAll(".ddfield input"))
	let index
	if (e.target.classList) {
		if (e.target.classList.contains("arrow")) {
			index = arrInput.findIndex(
				(cv) => cv === e.target.previousElementSibling
			)
		} else {
			index = arrInput.findIndex((cv) => cv === e.target)
		}
	} else {
		index = -1
	}

	const arrLastDD = Array.from(document.querySelectorAll(".ddfield"))
	const lastDDIndex = arrLastDD.findIndex((cv) => cv.dataset.mode !== "")

	// Find if an item is in a DOM list
	// Return a boolean
	// Live NodeList
	function itemIsInList(list, item) {
		return Array.from(list.childNodes)
			.map((cv) => cv.textContent)
			.includes(item)
	}

	// console.log("%c" + "lastDDIndex - " + lastDDIndex, log.logType("red"))
	if (lastDDIndex !== -1) {
		if (index === lastDDIndex) {
		} else {
			if (arrInput[lastDDIndex].value.length !== 0) {
				// See if field value is in the list, if not
				// go back to original
				const elUL = document.querySelector(
					`#${arrLastDD[lastDDIndex].id} ul`
				)
				const valueInList = itemIsInList(
					elUL,
					arrInput[lastDDIndex].value
				)

				if (!valueInList) {
					if (arrLastDD[lastDDIndex].dataset.origin) {
						arrInput[lastDDIndex].value =
							arrLastDD[lastDDIndex].dataset.origin
					} else {
						arrInput[lastDDIndex].value = ""
					}
				}
			}

			// hide autocomplete bubble
			if (
				document.querySelector(
					`#${arrLastDD[lastDDIndex].id} .autocomplete`
				)
			)
				document
					.querySelector(
						`#${arrLastDD[lastDDIndex].id} .autocomplete`
					)
					.classList.remove("isvisible")
		}
	}
}

function onFocusClickDoc(e) {
	const arrInput = Array.from(document.querySelectorAll(".ddfield input"))
	const index = arrInput.findIndex((cv) => cv === e.target)

	let ddFieldClicked = false
	if (e.target.parentNode) {
		if (e.target.parentNode.parentNode) {
			if (e.target.parentNode.parentNode.classList.contains("ddfield")) {
				ddFieldClicked = true
			}
		}
	}

	if (ddFieldClicked === false) {
		arrInput.forEach((cv, i) => {
			resetElement(cv)
		})
	} else {
		if (index !== -1) {
			arrInput.forEach((cv, i) => {
				if (i !== index) {
					resetElement(cv)
				}
			})
		}
	}

	function resetElement(el) {
		if (el.parentNode.parentNode.dataset.mode.slice(0, 9) !== "listclick") {
			el.parentNode.parentNode.dataset.origin = ""
			el.parentNode.parentNode.dataset.mode = ""
			el.parentNode.parentNode.dataset.filter = ""
		} else {
			el.parentNode.parentNode.dataset.mode = "listclick;input;true;false"
			el.focus()
		}
	}
}
