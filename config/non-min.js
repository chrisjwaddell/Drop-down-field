export default {
	// prevent any compression
	compress: false,
	mangle: false,
	format: {
		comments: /^\**!|@preserve|@license|@cc_on/i,
		beautify: true,
	},
}
