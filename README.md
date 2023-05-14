This drop down search text field is similar to the Google.com search box. It's
ideal for choosing from a list of options greater than 50 but less than 500.

Drop down search field is a drop down field where the user types and the
selections appear automatically as you type. Drop down options are supplied from
an array. It almost like the Google.com search bar. It is designed for
usability. You can hover over an option, use arrows and the text field updates
automatically. If you press escape, the text field goes back to what you typed.
There is no drop down arrow.

If you type in less than three characters, it looks for those characters in the
first part of the drop down options. If you type in three or more characters, it
looks for those consecutive three characters in any part of the drop down items.

Esc - removes drop down options list and the text field removes what was
selected from the drop down box and shows just what was typed in

Enter - toggles the drop down options to display them or not.

Field lost focus - If what is in the text field doesn't match any drop down
option, the text field is made blank when it loses focus.

If what is typed in is less than three characters, the drop down list shows all
options that begin with that text. If you type in "c", it shows all options
beginning with "c", if you type in "ca" it shows all options beginning with
"ca". If what is typed in to the text box is three characters or more, it shows
all the drop down options that have those three consecutive characters anywhere
in its string.

It matches letters to the options regardless of upper or lower case.

dropDownList.js has all the options. It is assumed these options are in correct
format, trimmed with no spaces at the start or end of each option.

Possible improvements If there are more than 20 options, a scroll bar should be
put in the drop down options.

| property                             | description                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `maxLines`                           | How many lines will show in the drop down, the size of the drop down list. Suggestion - less than 12 otherwise the whole list won't fit on the webpage.                                                                                                                                                                        |
| `searchMode`                         | _starts with_ means the filtered drop down list items characters start with what the user typed as the search filter. Any other value and it will search for the search filter anywhere in the list item                                                                                                                       |
| `firstXCharactersOppositeSearchMode` | For the first _X_ characters, it will do the opposite of the _searchMode_ setting.                                                                                                                                                                                                                                             |
| `ignoreFirstXCharacters`             | returns the props you should apply to the `label` element that you render.                                                                                                                                                                                                                                                     |
| `showDropdownArrow`                  | .                                                                                                                                                                                                                                                                                                                              |
| `noFiltering`                        | returns the props you should apply to the `ul` element (or root of your menu) that you render.                                                                                                                                                                                                                                 |
| `onFocusOpenDropdown`                | returns the props you should apply to the root element that you render. It can be optional.                                                                                                                                                                                                                                    |
| `onClickToggleDropdown`              | returns the props you should apply to the root element that you render. It can be optional.                                                                                                                                                                                                                                    |
| `typingOpenDropdown`                 | returns the props you should apply to the root element that you render. It can be optional.                                                                                                                                                                                                                                    |
| `enterToggleDropdown`                | returns the props you should apply to the root element that you render. It can be optional.                                                                                                                                                                                                                                    |
| `arrowKeysNoDropdown`                | If no dropdown appears: 0 - do nothing; 1 - open drop down; 2 - don't show drop down, go up or down the list. This feature is good for sequential data in the list whn the user knows the order of the list such as numbers, alphabetic order of a short list. Default - 0. This setting is independent of typingOpenDropdown. |
| `autocomplete`                       | Suggests the first item in the list according to the filter settings. Tab out of the field with nothing selected and it will choose the first item.                                                                                                                                                                            |
| `onFocusOpenDropdown`                | returns the props you should apply to the root element that you render. It can be optional.                                                                                                                                                                                                                                    |
| `cssClassList`                       | returns the props you should apply to the root element that you render. It can be optional.                                                                                                                                                                                                                                    |

Autocomplete kills the Escape fallback to original value feature.
