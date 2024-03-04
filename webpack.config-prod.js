const path = require("path")
// const CopyPlugin = require("copy-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
	// entry: path.join(__dirname, "src", "scripts", "dropdown-field.js"),
	entry: "./src/scripts/dropdown-field.js",
	output: {
		path: path.join(__dirname, "dist", "scripts"),
		// since there is no JS, just css, ignore the output
		filename: "dropdown-field-new.js",
	},
	plugins: [
		new CleanWebpackPlugin(),
		// new CopyPlugin({
		// 	patterns: [
		// 		{
		// 			from: path.resolve(
		// 				__dirname,
		// 				"src",
		// 				"scripts",
		// 				"dropDownList.js"
		// 			),
		// 			to: path.resolve(__dirname, "dist", "scripts"),
		// 		},
		// 	],
		// }),
	],

	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				// terserOptions: {
				// 	mangle: false,
				// 	format: {
				// 		comments: /^\**!|@preserve|@license|@cc_on/i,
				// 		beautify: true,
				// 	},
				// },
			}),
		],

		// minimizer: [
		// 	new UglifyJsPlugin({
		// 		uglifyOptions: {
		// 			comments: false,
		// 			parse: {
		// 				// parse options
		// 			},
		// 			compress: {
		// 				// compress options
		// 				drop_console: true, // default false
		// 			},
		// 			mangle: {
		// 				// mangle options
		// 				toplevel: false,
		// 				properties: {
		// 					// mangle property options
		// 				},
		// 			},
		// 			output: {
		// 				// output options
		// 				// comments: true,
		// 				comments: false,
		// 				// comments: /^@\s|@preserve|@license|@cc_on/i,
		// 				beautify: false,
		// 			},
		// 			sourceMap: {
		// 				// source map options
		// 			},
		// 			// nameCache: null, // or specify a name cache object
		// 			// toplevel: false,
		// 			// warnings: false,
		// 			// mangle: {},
		// 		},
		// }),
		// ],
	},

	// devtools must be included to make comments filter
	// mode: "development",
	mode: "production",
	// devtool: "source-map",
	// watch: true
}
