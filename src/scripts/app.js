/*  This drop down is like google.com
 *  The user can use up or down arrows or the mouse to select items
 *  Up and down arrows change the text in the text
 *  box but move hover doesn't  change the text field value
 *  Hovering over a list item, then using the arrows takes out the hover effect
 *  It doesn't use CSS hover because I have more control with mousemove
 *  when working with together with keypresses
 */


/*
 * Focus is the only event that's always on, it triggers the start of keyup and blur events
 * The functions are the same name as the event eg blur, mouseMove, focus
 * with the exception of escape
 * The DOM holds all the information, no global vars are used
 */

import {
    createElementAtt
} from './lib/dom.js'

import {
    eventkeyAZ09
} from './lib/keys.js'


const elOuter = document.querySelector('.container .outer');

function searchDropDown(fieldname, placeholder, tabindex) {
    const elField = createElementAtt(elOuter, 'div', ['ddsearchfield'], [], '')
    createElementAtt(elField, 'label', [], [], fieldname)
    const elInput = createElementAtt(elField, 'input', [], [
        ['type', 'text'],
        ['placeholder', placeholder],
        ['autofocus', ''],
        ['aria-autocomplete', 'both'],
        ['autocapitalize', 'none'],
        ['autocomplete', 'off'],
        ['autocorrect', 'off'],
        ['spellcheck', 'false'],
        // ['tabindex', tabindex],
        ['value', '']
    ], '')
    const elUL = createElementAtt(elField, 'ul', ['ddlist'], [], '')

    let selectionLength
    let originalText

    function selectionActive() {
        if (elInput.nextElementSibling) {
            for (let i = 0; i < selectionLength; i++) {
                if (elUL.children[i].classList.value === 'active') {
                    return i
                }
            }
            return -1
        }
        return -1
    }

    function selectionFilter(str) {
        let regex
        str.length > 2 ? regex = new RegExp(`.*${str}.*`, 'gi') : regex = new RegExp(`^${str}.*`, 'gi')
        return dropDownOptions.filter((cv) => cv.match(regex))
    }

    function dropdownSelectedString(selectionLine, searchString) {
        const fieldString = new RegExp(`${searchString}`, 'i');
        const startPos = selectionLine.search(fieldString)
        if ((startPos === -1) || (searchString.length === 0)) {
            return selectionLine
        }
        return `${selectionLine.slice(0, startPos)}<strong>${selectionLine.slice(startPos, startPos + searchString.length)}</strong>${selectionLine.slice(startPos + searchString.length)}`
    }


    function focus(e) {
        originalText = elInput.value.trim()
        elInput.addEventListener('keyup', keyUp)
        elInput.addEventListener('blur', blur)

        elUL.addEventListener('mousemove', mouseMove)
        elUL.addEventListener('mousedown', mouseDown)
    }


    function keyUp(e) {
        const COUNTRY_COUNT = 196
        let matches;
        let matchlist

        selectionLength = elUL.children.length
        let index = selectionActive()

        if (e.keyCode === 38) {
            // Up arrow
            if (selectionLength > 0) {
                // Arrows work only when the list is showing
                if (elUL.classList.contains('isvisible')) {
                    if (index === -1) {
                        index = selectionLength - 1
                        elUL.children[index].classList.add('active')
                        elInput.value = elUL.children[index].textContent
                    } else if (index === 0) {
                        elUL.children[index].classList.remove('active')
                        index = -1
                        elInput.value = originalText
                    } else {
                        elUL.children[index].classList.remove('active')
                        index--
                        elUL.children[index].classList.add('active')
                        elInput.value = elUL.children[index].textContent
                    }
                }
            }
        } else if (e.keyCode === 40) {
            // Down arrow
            if (selectionLength > 0) {
                // Arrows work only when the list is showing
                if (elUL.classList.contains('isvisible')) {
                    if (index === -1) {
                        index++
                        elUL.children[index].classList.add('active')
                        elInput.value = elUL.children[index].textContent
                    } else if (index === selectionLength - 1) {
                        elUL.children[index].classList.remove('active')
                        index = -1
                        elInput.value = originalText
                    } else {
                        elUL.children[index].classList.remove('active')
                        index++
                        elUL.children[index].classList.add('active')
                        elInput.value = elUL.children[index].textContent
                    }
                }
            }
        } else if (e.keyCode === 13) {
            // Enter
            // Enter toggles showing the drop down
            if (selectionLength <= 1) {
                elUL.classList.remove('isvisible')
            } else {
                elUL.classList.toggle('isvisible')
            }
        } else if (e.keyCode === 27) {
            // Escape
            escape()
        } else if (e.keyCode === 9) {
            // Tab

        } else {
            // Characters have been typed, this is where it finds the results

            const results = selectionFilter(elInput.value.trim())

            // This is mainly when the field gets focus from Shift+Tab, if there is only 1 item
            // in the drop down, don't show the drop down
            if ((originalText === elInput.value.trim()) &&
                (results.length === 1) && (!eventkeyAZ09(e.keyCode))) return

            originalText = elInput.value.trim()

            if ((results.length === COUNTRY_COUNT) || (results.length === 0)) {
                matches = []
                elUL.classList.remove('isvisible')
                for (let i = 0, len = elUL.children.length; i < len; i++) {
                    elUL.children[i] && elUL.children[i].remove();
                }
            } else {
                dropdownSelectedString

                // Letters typed are bold
                matches = results.map((cv) => dropdownSelectedString(cv, elInput.value.trim()))
                matchlist = matches.map((cv) => `<li>${cv}</li>`).join('')
                elUL.innerHTML = matchlist

                elUL.classList.add('isvisible')
            }
        }
    }

    function listClose() {
        elUL.classList.remove('isvisible')
    }

    function escape() {
        // Press Esc and it goes back to what was originally typed. Field focus stays.
        listClose()
        elInput.value = originalText

        if (!dropDownOptions.map((x) => x.toLowerCase()).includes(elInput.value.trim().toLowerCase())) {
            elInput.value = originalText
        } else {
            const dd = dropDownOptions.map((x) => x.toLowerCase())
                .findIndex((cv) => cv === elInput.value.trim().toLowerCase())
            elInput.value = dropDownOptions[dd]
        }
    }


    function blur(e) {
        /*
         * Before leaving the field, check if what's in the input is
         * in the drop down list
         */

        /* Selecting an item from drop down using the mouse click activates
         * mousedown on elUL and then input blur event. But the input box
         * gets the focus again so we don't want to run this function if there
         * was a selection with a mouseclick.
         */
        let arr = [];

        arr = [...elUL.children]

        if (arr.length === 1) {
            console.log('ONE')
            if ((elInput.value.trim() !== arr[0].textContent) &&
                (elInput.value.trim().toLowerCase() === arr[0].textContent.toLowerCase())) {
                elInput.value = arr[0].textContent
            }
        }

        if (!dropDownOptions.includes(elInput.value.trim())) {
            elInput.value = ''
        }
        elUL.classList.remove('isvisible')

        elUL.removeEventListener('mousedown', mouseDown)
        elUL.removeEventListener('mousemove', mouseMove)

        elInput.removeEventListener('keyup', keyUp)
        elInput.removeEventListener('blur', blur)
    }

    function mouseDown(e) {
        console.log('mouseDown')
        elInput.value = e.target.innerText
        originalText = e.target.innerText
    }

    function mouseMove() {
        let selectionHover = ''
        let index = -1
        if (elUL.children[0]) {
            selectionHover = (document.querySelector('.countrylist li:hover') == null) ?
                '' : document.querySelector('.countrylist li:hover').textContent
            for (let i = 0; i < elUL.children.length; i++) {
                elUL.children[i].classList.remove('active')
                if ((selectionHover !== '') && (selectionHover === elUL.children[i].textContent)) {
                    if (index !== -1) elUL.children[index].classList.remove('active')
                    index = i
                    elUL.children[index].classList.add('active')
                }
            }
        }
    }


    // For each field, focus and blur events are always on
    // As soon as the field gets focus, keyup event fires
    elInput.addEventListener('focus', focus)
}


searchDropDown('Country of birthSS', 'Country of birthSS', 2)

searchDropDown('Country of residence', 'Country of residence', 3)
