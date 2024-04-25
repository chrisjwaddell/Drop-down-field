// add escape characters to new RegExp
function escapeRegExp(str) {
	// strings put into a new RegExp() that end in \ create a nasty Syntax error
	const avoidEscapeError = str.slice(-1) === "\\" ? str[str.length - 1] : str

	return avoidEscapeError.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

export {escapeRegExp}
