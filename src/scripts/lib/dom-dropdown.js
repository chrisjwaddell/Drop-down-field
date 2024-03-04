// Return the child of the UL with selected class in it
function listFindSelectedIndex(parentUL, selectclass, listLength) {
	for (let i = 0; i < listLength; i += 1) {
		if (parentUL.childNodes[i]) {
			if (parentUL.childNodes[i].classList.contains(selectclass)) {
				return i
			}
		}
	}
	return -1
}

// Return index with a certain value in a UL
function listItemValueIndex(parentUL, itemValue) {
	for (let i = 0; i < parentUL.childNodes.length; i += 1) {
		if (parentUL.childNodes[i]) {
			if (parentUL.childNodes[i].textContent === itemValue) {
				return i
			}
		}
	}
	return -1
}

export {listFindSelectedIndex, listItemValueIndex}
