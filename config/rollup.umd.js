import {terser} from "rollup-plugin-terser"
import terserOptions from "./non-min"

export default {
	input: "src/scripts/dropdown-field.js",
	output: [
		{
			file: "dust/scripts/dropdown-field.js",
			name: "DropdownField",
			format: "umd",
		},
	],
	plugins: [terser(terserOptions)],
}
