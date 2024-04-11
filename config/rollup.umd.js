import {terser} from "rollup-plugin-terser"
import terserOptions from "./non-min"

export default {
	input: "src/scripts/dropdown-field.js",
	output: [
		{
			file: "src/scripts/dropdown-field-umd.js",
			name: "DropdownField",
			format: "umd",
		},
	],
	plugins: [terser(terserOptions)],
}
