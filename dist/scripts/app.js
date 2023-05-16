const dropDownOptions = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"Andorra",
	"Angola",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Australia",
	"Austria",
	"Azerbaijan",
	"The Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bhutan",
	"Bolivia",
	"Bosnia and Herzegovina",
	"Botswana",
	"Brazil",
	"Brunei",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Central African Republic",
	"Chad",
	"Chile",
	"China",
	"Colombia",
	"Comoros",
	"Congo, Democratic Republic of the",
	"Congo, Republic of the",
	"Costa Rica",
	"Côte d’Ivoire",
	"Croatia",
	"Cuba",
	"Cyprus",
	"Czech Republic",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"East Timor (Timor-Leste)",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Fiji",
	"Finland",
	"France",
	"Gabon",
	"The Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Greece",
	"Grenada",
	"Guatemala",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Honduras",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Korea, North",
	"Korea, South",
	"Kosovo",
	"Kuwait",
	"Kyrgyzstan",
	"Laos",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Mauritania",
	"Mauritius",
	"Mexico",
	"Micronesia, Federated States of",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Morocco",
	"Mozambique",
	"Myanmar (Burma)",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"North Macedonia",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Poland",
	"Portugal",
	"Qatar",
	"Romania",
	"Russia",
	"Rwanda",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"Spain",
	"Sri Lanka",
	"Sudan",
	"Sudan, South",
	"Suriname",
	"Sweden",
	"Switzerland",
	"Syria",
	"Taiwan",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Togo",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Vatican City",
	"Venezuela",
	"Vietnam",
	"Yemen",
	"Zambia",
	"Zimbabwe",
]

const dropDownOptions2 = ["Matthew", "Mark", "Luke", "John", "Mary", "Pauline"]

DropdownField(
	".container .outer",
	"Country of birth",
	"Country of birth",
	2,
	"dd1",
	dropDownOptions,
	{
		maxLines: 10,
		cssClassList: ["field1"],
	}
)

DropdownField(".container .outer", "Name", "Name", 3, "dd2", dropDownOptions, {
	maxLines: 14,
	cssClassList: ["field2"],
	searchMode: "anywhere in",
	// firstXCharactersOppositeSearchMode: 2,
	ignoreFirstXCharacters: 1,
	// noFiltering: true,
	showDropdownArrow: true,
	onFocusOpenDropdown: true,
	onClickToggleDropdown: false,
	typingOpenDropdown: false,
	enterToggleDropdown: true,
	autocomplete: false,
})

document.addEventListener("DOMContentLoaded", function () {
	document.addEventListener("focus", onFocusDoc, true)
	document.addEventListener("focus", onFocusClickDoc, true)
	document.addEventListener("click", onFocusClickDoc, true)
	// document.addEventListener("focus", () => console.log("Doc focus"), true)
	// document.addEventListener("click", () => console.log("Doc click"), true)
})

const findOptions = (item) => dropDownOptions.includes(item)

// On leaving the field, if the value doesn't match anything in
// the list, make the field blank or go back to the original
// value.
function onFocusDoc(e) {
	// console.log("%c" + "onFocusDoc", log.logType("event"))

	const arrInput = Array.from(document.querySelectorAll(".ddfield input"))
	let index
	if (e.target.classList) {
		if (e.target.classList.contains("arrow")) {
			index = arrInput.findIndex(
				(cv) => cv === e.target.previousElementSibling
			)
		} else {
			index = arrInput.findIndex((cv) => cv === e.target)
		}
	} else {
		index = -1
	}

	const arrLastDD = Array.from(document.querySelectorAll(".ddfield"))
	const lastDDIndex = arrLastDD.findIndex((cv) => cv.dataset.mode !== "")

	// Find if an item is in a DOM list
	// Return a boolean
	// Live NodeList
	function itemIsInList(list, item) {
		return Array.from(list.childNodes)
			.map((cv) => cv.textContent)
			.includes(item)
	}

	// console.log("%c" + "lastDDIndex - " + lastDDIndex, log.logType("red"))
	if (lastDDIndex !== -1) {
		if (index === lastDDIndex) {
		} else {
			if (arrInput[lastDDIndex].value.length !== 0) {
				// See if field value is in the list, if not
				// go back to original
				const elUL = document.querySelector(
					`#${arrLastDD[lastDDIndex].id} ul`
				)
				const valueInList = itemIsInList(
					elUL,
					arrInput[lastDDIndex].value
				)

				if (!valueInList) {
					if (arrLastDD[lastDDIndex].dataset.origin) {
						arrInput[lastDDIndex].value =
							arrLastDD[lastDDIndex].dataset.origin
					} else {
						arrInput[lastDDIndex].value = ""
					}
				}
			}

			// remove events
			// arrInput[lastDDIndex].removeEventListener(
			// 	"click",
			// 	onClickInput,
			// 	false
			// )
			// arrInput[lastDDIndex].removeEventListener("keyup", onKeyUpInput)
			// arrInput[lastDDIndex].removeEventListener("blur", onBlurInput)

			// hide autocomplete bubble
			if (
				document.querySelector(
					`#${arrLastDD[lastDDIndex].id} .autocomplete`
				)
			)
				document
					.querySelector(
						`#${arrLastDD[lastDDIndex].id} .autocomplete`
					)
					.classList.remove("isvisible")
		}
	}
}

function onFocusClickDoc(e) {
	// console.log("%c" + "onFocusClickDoc", log.logType("event"))
	const arrInput = Array.from(document.querySelectorAll(".ddfield input"))
	const index = arrInput.findIndex((cv) => cv === e.target)

	let ddFieldClicked = false
	if (e.target.parentNode) {
		if (e.target.parentNode.parentNode) {
			if (e.target.parentNode.parentNode.classList.contains("ddfield")) {
				ddFieldClicked = true
			}
		}
	}

	if (ddFieldClicked === false) {
		arrInput.forEach((cv, i) => {
			resetElement(cv)
		})
	} else {
		if (index !== -1) {
			arrInput.forEach((cv, i) => {
				if (i !== index) {
					resetElement(cv)
				}
			})
		}
	}

	function resetElement(el) {
		if (el.parentNode.parentNode.dataset.mode.slice(0, 9) !== "listclick") {
			el.parentNode.parentNode.dataset.origin = ""
			el.parentNode.parentNode.dataset.mode = ""
			el.parentNode.parentNode.dataset.filter = ""
		} else {
			el.parentNode.parentNode.dataset.mode = "listclick;input;true;false"
			el.focus()
		}
	}
}
