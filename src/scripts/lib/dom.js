function appendChild(el, child) {
	return el.appendChild(child)
}

function createElementAtt(parent, element, cls, att, text) {
	const el = document.createElement(element)

	if (text) {
		el.textContent = text
	}

	cls.forEach((item) => {
		el.classList.add(item)
	})

	att.forEach((i) => {
		el.setAttribute(i[0], i[1])
	})

	return (parent && appendChild(parent, el)) || el
}

export {createElementAtt}
