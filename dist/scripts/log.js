// Console log Plus adds color and size formatting to a console.log message
// It also automatically adds function name and function arguments to the
// start of the message to make it easier to debug. (This only works for
// non-strict mode.)

// Usage
// console.log("%c" + log.fnName(...arguments) + " - message", log.logType("new"))
// In the global scope:
// console.log("%c" + " - message", log.logType("new"))

const log = (function () {
	// ^SETTINGS
	// Put your log type settings in here
	// Font color, font size
	const logLevelList = [
		{
			logType: "info",
			description: "Information",
			color: "#4499ff",
			size: 15,
		},
		{
			logType: "event",
			description:
				"For events. To help distinguish it from other functions.",
			color: "#0643d4",
			size: 25,
		},
		{
			logType: "function",
			description:
				"Helps to put this at the start of a function to see the function flow.",
			color: "#000259",
			size: 22,
		},
		{
			logType: "error",
			description: "For errors",
			color: "#d22b2a",
			size: 17,
		},
		{
			logType: "new",
			description: "Working on code temporarily, fix and move on",
			color: "#551aaa",
			size: 17,
		},
		{
			logType: "watch",
			description: "To watch variables",
			color: "#22cc77",
			size: 15,
		},
		{
			logType: "red",
			description: "Make the console log message red",
			color: "#961a16",
			size: 15,
		},
		{
			logType: "green",
			description: "Make the console log message green",
			color: "#066a00",
			size: 15,
		},
		{
			logType: "purple",
			description: "Make the console log message purple",
			color: "#9f1a9b",
			size: 15,
		},
	]

	function logCSS(c, size) {
		let fs
		try {
			fs = Number(size) || 22
		} catch {
			fs = 22
		}
		const color = c || "#4444ff"
		return `color: ${color}; font-size: ${fs}px`
	}

	function logTypeFind(lType) {
		return logLevelList.find((logLevel) => logLevel.logType === lType)
	}

	function logType(lType) {
		const logobj = logTypeFind(lType)
		return logobj ? logCSS(logobj.color, logobj.size) : logCSS()
	}

	function fnName(...args) {
		let logFnName = ""
		try {
			logFnName = fnName.caller != null ? fnName.caller.name : ""
		} catch {
			logFnName = ""
		}

		let argList = ""
		try {
			if (args != null) {
				args.forEach((el) => {
					if (el) {
						if (argList) argList += ", "
						argList +=
							el.toString() === "[object Object]"
								? JSON.stringify(el)
								: el.toString()
					}
				})
			}
		} catch {
			argList = ""
		}

		return logFnName + "(" + argList + ")"
	}

	return {
		logType,
		fnName,
	}
})()
