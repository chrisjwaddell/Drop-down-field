/* ==========================================================================
   # DROP DOWN LIST
   ========================================================================== */

const LIST_SELECTED_CLASSNAME = "selected"

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

// Select by index
function listSelectWithIndex(list, index) {
	list.children[index].classList.add(LIST_SELECTED_CLASSNAME)
}

// This is for key up and down arrow buttons
// down true, it unselects current item and selects next one
// down false it goes up
function listSelectionChange(list, down, currentSelection, listLength) {
	function oldNewSelection(oldIndex, newIndex) {
		if (oldIndex === -1) {
			if (list.childNodes[newIndex]) {
				list.childNodes[newIndex].classList.add(LIST_SELECTED_CLASSNAME)
				return list.childNodes[newIndex].textContent
			}
			return null
		}
		if (list.childNodes[oldIndex] && list.childNodes[newIndex]) {
			list.childNodes[oldIndex].classList.remove(LIST_SELECTED_CLASSNAME)
			list.childNodes[newIndex].classList.add(LIST_SELECTED_CLASSNAME)
			return list.childNodes[newIndex].textContent
		}
		return null
	}

	if (listLength > 0) {
		if (currentSelection === -1) {
			if (down) {
				return oldNewSelection(-1, 0)
			}
			return oldNewSelection(-1, listLength - 1)
		}
		if (list.childNodes[currentSelection]) {
			if (currentSelection === 0) {
				if (down) {
					return oldNewSelection(0, 1)
				}
				return oldNewSelection(0, listLength - 1)
			}
			if (currentSelection === listLength - 1) {
				if (down) {
					return oldNewSelection(currentSelection, 0)
				}
				return oldNewSelection(currentSelection, currentSelection - 1)
			}
			if (down) {
				return oldNewSelection(currentSelection, currentSelection + 1)
			}
			return oldNewSelection(currentSelection, currentSelection - 1)
		}
	}
}

export {
	listFindSelectedIndex,
	listItemValueIndex,
	listSelectWithIndex,
	listSelectionChange,
}
