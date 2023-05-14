# Drop Down Field

This drop down field is a filterable drop down field list with various options.
As the user types, the drop down list is filtered to match what the user types.
You have options over how filtering is done.

There is an autocomplete option making it fast to use. You have the option of
whether you want an arrow for the drop down. If you press escape, the text field
goes back to what you typed or what was originally in the field as you entered
it.

## Filtering options

It matches characters to the options regardless of upper or lower case. You can
filter by what each item in the list starts with or by anywhere in the item
string. You can start filtering only when there are more than 2 characters. See
below for further options.

## Keys and General behaviour of the field

When the field focus is lost, if what is in the text field doesn't match any
drop down option, the text field is either set to it's original field value when
you entered the field or the field is made blank.

Esc - Makes the drop down list disappear and if anything was typed and then an
item has been selected from the list, it goes back to what was typed and if not,
it goes back to what was originally in the field as you entered it.

Enter - toggles the drop down list to display it or not.

Arrow keys - For going up or down the list. The drop down list doesn't have to
be visible to go through the list.

| Property                             | Value                       | Description                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `maxLines`                           | Integer - below 12 is ideal | How many lines will show in the drop down, the size of the drop down list. Suggestion - less than 12 otherwise the whole list won't fit on the webpage.                                                                                                                                                                        |
| `searchMode`                         | _starts with_, ""           | _starts with_ means the filtered drop down list items characters start with what the user typed as the search filter. Any other value and it will search for the search filter anywhere in the list item                                                                                                                       |
| `firstXCharactersOppositeSearchMode` | Integer - Usually below 5   | For the first _X_ characters, it will do the opposite of the _searchMode_ setting.                                                                                                                                                                                                                                             |
| `ignoreFirstXCharacters`             | Integer - Usually below 5   | Don't filter the drop down list for the first _X_ characters                                                                                                                                                                                                                                                                   |
| `showDropdownArrow`                  | _true_ or _false_           | Show an arrow. The arrow toggles the drop down list.                                                                                                                                                                                                                                                                           |
| `noFiltering`                        | _true_ or _false_           | No filtering is done on the list, the drop down list is always the complete list regardless of if anything is typed.                                                                                                                                                                                                           |
| `onFocusOpenDropdown`                | _true_ or _false_           | On focussing on the field, tabbing to or clicking the field, the drop down appears                                                                                                                                                                                                                                             |
| `onClickToggleDropdown`              | _true_ or _false_           | Clicking on the field makes the drop down list appear                                                                                                                                                                                                                                                                          |
| `typingOpenDropdown`                 | _true_ or _false_           | Any typing on the keyboard will automatically make the drop down list appear.                                                                                                                                                                                                                                                  |
| `enterToggleDropdown`                | _true_ or _false_           | Pressing Enter on the keyboard toggles the drop down list to appear or disappear.                                                                                                                                                                                                                                              |
| `arrowKeysNoDropdown`                | _true_ or _false_           | If no dropdown appears: 0 - do nothing; 1 - open drop down; 2 - don't show drop down, go up or down the list. This feature is good for sequential data in the list whn the user knows the order of the list such as numbers, alphabetic order of a short list. Default - 0. This setting is independent of typingOpenDropdown. |
| `autocomplete`                       | _true_ or _false_           | Suggests the first item in the list according to the filter settings. Tab out of the field with nothing selected and it will choose the first item                                                                                                                                                                             |
| `cssClassList`                       | Array of CSS class names    | Adds these classes to the container of the drop down. This CSS should be hierarchically placed after dropdown-field.css                                                                                                                                                                                                        |

Autocomplete kills the Escape fallback to original value feature.

# Drop down field styling

You can add CSS classes to the drop down field or you can use Javascript in your
own way to style the drop down fields. _cssClassList_ takes an array of classes
eg _[ "field1", "ma3"]_

The CSS should be placed after dropdown-field.css. Some CSS variables for drop
down field styling are:
`.field2 { --dd-width: 200px; --dd-font-size: 12px; --dd-border-radius: 8px; --dd-input-height: 35px; }`

Attributes in the DOM origin - The field value when the field was originally
entered. filter - What was typed in to the field.
