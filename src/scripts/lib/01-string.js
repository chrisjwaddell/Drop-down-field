// add escape characters to new RegExp
function escapeRegExp(text) {
	// strings put into a new RegExp() that end in \ create a nasty Syntax error
	let avoidEscapeError = text[text.length - 1] === "\" ? text[text.length - 1] : text

  	return avoidEscapeError.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


export {
	escapeRegExp
}
