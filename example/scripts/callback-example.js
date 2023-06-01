const countryList = ["Australia", "USA"]

const usaStateList = [
	"Alabama",
	"Alaska",
	"Arizona",
	"Arkansas",
	"California",
	"Colorado",
	"Connecticut",
	"Delaware",
	"Florida",
	"Georgia",
]

const australiaStateList = [
	"NSW",
	"Victoria",
	"Queensland",
	"SA",
	"WA",
	"NT",
	"Tasmania",
]

const countryField = DropdownField(".country", "Country", "Country", 1, "dd1", {
	maxLines: 12,
	cssClassList: ["field1"],
	autofocus: true,
	onChange: () => {
		console.log("State list updating")
		updateStateList()
	},
})

countryField.setList(countryList)

function updateStateList() {
	const elCountry = document.querySelector(".country input")
	const elState = document.querySelector(".state input")

	elState.value = ""
	switch (elCountry.value) {
		case "USA":
			stateField.setList(usaStateList)
			break
		case "Australia":
			stateField.setList(australiaStateList)
			break
		default:
			stateField.setList([])
			break
	}
}

const stateField = DropdownField(".state", "State", "State", 2, "dd2", {
	maxLines: 14,
	cssClassList: ["field2"],
	// firstXCharactersOppositeSearchMode: 2,
	ignoreFirstXCharacters: 1,
	// noFiltering: true,
	showDropdownArrow: true,
	arrowKeysNoDropdown: 2,
})

const disabledField = DropdownField(
	".disabled",
	"Disabled field",
	"Disabled field",
	3,
	"dd3",
	{
		maxLines: 14,
		cssClassList: ["field2"],
		disableOnOpen: true,
	}
)
