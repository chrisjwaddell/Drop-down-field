<!-- PROJECT LOGO -->
<div align="center">
    <img src="dist/images/logo.jpg" alt="Logo" width="135" height="100">
    <h1 align="center">Drop Down Field</h1>
    <h3>A beautiful Drop down field with many options</h3>
    <br />
</div>

This drop down field is a filterable drop down field list with various options.
As the user types, the drop down list is filtered to match what the user types.
You have options over how filtering is done.
This drop down field is a one column list. And one selection only.

![](https://github.com/chrisjwaddell/Drop-down-field/blob/main/img/country.gif)

There is an autocomplete option making it fast to use. You have the option of whether you want an arrow for the drop down. If you press escape, the text field
goes back to what you typed or what was originally in the field as you entered it.


Filterable drop downs are in many cases better than your standard drop down box, it filters and you can easily choose by using up and down arrow and letters.

The dropdown list can programmatically be changed.

There is also an *onChange* callback so if the field value changes, you can have a function that runs. 



[Three great examples of when to use a dropdown field](https://chrisjwaddell.github.io/Drop-down-field/example/use-cases.html)  
  
[Dropdown field Examples with code and descriptions](https://chrisjwaddell.github.io/Drop-down-field/)  
  
[Using an *onChange* callback to change a 2nd dropdown list based on the value chosen on the first dropdown field](https://chrisjwaddell.github.io/Drop-down-field/example/callback-example.htm)



## How to use

Add these lines the head of your HTML:

```
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/chrisjwaddell/Drop-down-field@main/dist/style/dropdown-field.css">

<script src="https://cdn.jsdelivr.net/gh/chrisjwaddell/Drop-down-field@main/dist/scripts/dropdown-field.js"></script>

```

Add this to your javascript:

```
const countryField = DropdownField(".country", "Country", "Country", 1, "dd1", {
	cssClassList: ["field1"],
    // options go here
	autofocus: true,
	onChange: () => {
		updateStateList()
	},
})

countryField.setList("Australia", "USA");
```

It has the main *DropdownField* function has following option arguments:
\
`let <field_variable_name> = DropdownField(target, Field name, Placeholder, tabindex, ID, Options)`

Then set your list (which can be changed any time) by:
\
`<field_variable_name>.setList(<your_dropdown_list-array>)`

The mandatory settings are:
\
target - the query string of where the drop down field gets placed.\
ID - The ID that will be placed in the HTML. It must have a unique ID.\

<br>
If 'ID' is missing, some features won't work properly. 


Settings that should be filled in:
\
Field name - If this isn't filled in, the field label will not be visible
Placeholder - If this is not filled in, it will take the field name
tabindex
Options - an object with the option names appearing below.


## Filtering options

It matches characters to the options regardless of upper or lower case. You can
filter by what each item in the list starts with or by anywhere in the item
string. You can start filtering only when there are more than 2 characters.
Anything typed goes into the data-filter attribute. See below for further
options.

## Keys and General behaviour of the field

When the field focus is lost, if what is in the text field doesn't match any
drop down option, the text field is either set to it's original field value when
you entered the field or the field is made blank.

Esc - It takes the user back to what was typed, the filter. So if they select an
item from the drop down list, this will be undone and it will go back to what
they typed. Or it will take them back to what was originally in the field when
they entered it. It also closes the drop down list.

Enter - toggles the drop down list to display it or not.

Arrow keys - For going up or down the list. The drop down list doesn't have to
be visible to go through the list.

## Options

| Property                             | Value                       | Description                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `maxLines`                           | Integer - below 12 is ideal | How many lines will show in the drop down, the size of the drop down list. Suggestion - less than 12 otherwise the whole list won't fit on the webpage. The default is _10_.                                                                                                                                                                       |
| `searchMode`                         | _starts with_, ""           | _starts with_ means the filtered drop down list items characters start with what the user typed as the search filter. Any other value and it will search for the search filter anywhere in the list item. The default is _"starts with_".                                                                                                                       |
| `firstXCharactersOppositeSearchMode` | Integer - Usually below 4   | For the first _X_ characters, it will do the opposite of the _searchMode_ setting. The default is _0_.                                                                                                                                                                                                                                            |
| `ignoreFirstXCharacters`             | Integer - Usually below 4   | Don't filter the drop down list for the first _X_ characters. The default is _0_.                                                                                                                                                                                                                                                                   |
| `showDropdownArrow`                  | _true_ or _false_           | Show an arrow. The arrow toggles the drop down list. Default is _true_.                                                                                                                                                                                                                                                                          |
| `noFiltering`                        | _true_ or _false_           | No filtering is done on the list, the drop down list is always the complete list regardless of if anything is typed. The default is _false_.                                                                                                                                                                                                          |
| `onFocusOpenDropdown`                | _true_ or _false_           | On focussing on the field, tabbing to or clicking the field, the drop down appears. The default is _true_.                                                                                                                                                                                                                                             |
| `onClickToggleDropdown`              | _true_ or _false_           | Clicking on the field makes the drop down list appear. The default is _false_.                                                                                                                                                                                                                                                                          |
| `typingOpenDropdown`                 | _true_ or _false_           | Any typing on the keyboard will automatically make the drop down list appear. The default is _true_.                                                                                                                                                                                                                                                 |
| `enterToggleDropdown`                | _true_ or _false_           | Pressing Enter on the keyboard toggles the drop down list to appear or disappear. The default is _true_.                                                                                                                                                                                                                                             |
| `arrowKeysNoDropdown`                | _0_, _1_ or _2_           | If no dropdown appears: 0 - do nothing; 1 - open drop down; 2 - don't show drop down, go up or down the list. This feature is good for sequential data in the list when the user knows the order of the list such as numbers, alphabetic order of a short list. Default - _0_. This setting is independent of typingOpenDropdown. |
| `autocomplete`                       | _true_ or _false_           | Suggests the first item in the list according to the filter settings. If the user tab out of the field with nothing selected and it will choose the first item. It works regardless of whether the list is showing or not. The default is _false_.                                                                                                                                                                             |
| `cssClassList`                       | Array of CSS class names    | Adds these classes to the container of the drop down. This CSS should be hierarchically placed after dropdown-field.css                                                                                                                                                                                                        |

Autocomplete kills the Escape fallback to original value feature.

<br><br>

## Event Callbacks

| Callback                  | Description
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onChange`          | Place a callback function in this property to run after a change occurs in the dropdown field.  |


<br><br>
## Methods

| Method                  | Description
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `clearField()`          | Clears the field and the item selected in the list. |
| `setList(list)`         | This method can be used to set and change the full dropdown list. It can be really powerful for _onChange_ events of other fields. An example would be, choosing a country, then another drop down showing the States of the country chosen, the fields are dependent on each other. |
| `getList()`             | Show the current (unfiltered) full list. |
| `enableList(boolean)`   | Enable or disable a dropdown field so that it can't get focus. It can be used with the _onChange_ callback. On page load, use the _disableOnOpen_ property to get the same effect on startup. |


<br>
<br>

## Drop down field styling

You can add CSS classes to the drop down field or you can use Javascript in your
own way to style the drop down fields. _cssClassList_ takes an array of classes
eg _[ "field1", "ma3"]_

The CSS should be placed after dropdown-field.css in the CSS hierarchy. Some CSS variables for drop
down field styling are:
```
.field1 {
    --dd-width: 200px;
    --dd-font-size: 12px;
    --dd-border-radius: 8px;
    --dd-input-height: 35px;
}
```



## Miscellaneous notes

This drop down list is for a finite number of options. It's best to keep the list no more than say 200 or 300.

The list must contain all unique items.

List item can't have special characters\
^ $    . * ?    ! : |    + - =    \ /    ( ) [ ] { }



### Attributes in the DOM

origin - The field value when the field was originally entered.\
filter - What was typed in to the field.
