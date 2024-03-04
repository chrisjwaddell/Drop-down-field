const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
	entry: "./src/scripts/dropdown-field.js",
	output: {
		path: path.resolve(__dirname, "dist", "scripts"),
		filename: "bundle.js",
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				// test: /\.js(\?.*)?$/i,
				terserOptions: {
					// keep_fnames: true,
					compress: true,
					format: {
						comments: /^\**!|@preserve|@license|@cc_on/i,
						// comments: false,
					},
				},
			}),
		],
	},
	mode: "production",
}
