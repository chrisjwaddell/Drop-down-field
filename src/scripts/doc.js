document.addEventListener("DOMContentLoaded", function () {
	// document.addEventListener("focus", onFocusDoc, true)
	document.addEventListener("focus", onFocusClickDoc, true)
	document.addEventListener("click", onFocusClickDoc, true)
})

const findOptions = (item) => dropDownOptions.includes(item)

// On leaving the field, if the value doesn't match anything in
// the list, make the field blank or go back to the original
// value or if autocomplete enabled, pick the first item in the list

function onFocusClickDoc(e) {
	const arrInput = Array.from(document.querySelectorAll(".ddfield input"))
	let inputIndex = -1
	const arrLastDD = Array.from(document.querySelectorAll(".ddfield"))
	const lastDDIndex = arrLastDD.findIndex((cv) => cv.dataset.mode !== "")

	let arrowClicked = false
	if (e.target.classList) {
		if (e.target.classList.contains("arrow")) {
			arrowClicked = true
			inputIndex = arrInput.findIndex(
				(cv) => cv === e.target.previousElementSibling
			)
		} else {
			inputIndex = arrInput.findIndex((cv) => cv === e.target)
		}
	} else {
		inputIndex = -1
	}

	if (inputIndex === -1 && !arrowClicked && lastDDIndex !== -1) {
		leaveField(arrInput[lastDDIndex], arrLastDD[lastDDIndex])

		arrInput[lastDDIndex].parentNode.parentNode.dataset.origin = ""
		arrInput[lastDDIndex].parentNode.parentNode.dataset.mode = ""
		arrInput[lastDDIndex].parentNode.parentNode.dataset.filter = ""
	} else {
		if (lastDDIndex !== -1) {
			if (inputIndex !== lastDDIndex) {
				leaveField(arrInput[lastDDIndex], arrLastDD[lastDDIndex])
				arrInput[lastDDIndex].parentNode.parentNode.dataset.origin = ""
				arrInput[lastDDIndex].parentNode.parentNode.dataset.mode = ""
				arrInput[lastDDIndex].parentNode.parentNode.dataset.filter = ""
			}
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

	// Find if an item is in a DOM list
	// Return a boolean
	// Live NodeList
	function itemIsInList(list, item) {
		return Array.from(list.childNodes)
			.map((cv) => cv.textContent)
			.includes(item)
	}

	// If field value on leaving the field isn't in the list,
	// see if autocomplete needs to be activated,
	// if not see if origin needs to be activated
	function leaveField(inputElement, ddContainer) {
		if (inputElement.value.length !== 0) {
			const id = ddContainer.id

			const elUL = document.querySelector(`#${id} ul`)
			const valueInList = itemIsInList(elUL, inputElement.value)
			const elAutocomplete = document.querySelector(
				`#${id} .autocomplete`
			)

			// See if field value is in the list, if not
			// go back to original
			if (!valueInList) {
				if (elAutocomplete) {
					if (elUL.childNodes[0]) {
						inputElement.value = elUL.childNodes[0].textContent
					} else {
						if (ddContainer.dataset.origin) {
							inputElement.value = ddContainer.dataset.origin
						} else {
							inputElement.value = ""
						}
					}
				} else {
					if (ddContainer.dataset.origin) {
						inputElement.value = ddContainer.dataset.origin
					} else {
						inputElement.value = ""
					}
				}
			}
		}

		// hide autocomplete bubble
		if (document.querySelector(`#${ddContainer.id} .autocomplete`))
			document
				.querySelector(`#${ddContainer.id} .autocomplete`)
				.classList.remove("isvisible")
	}
}
