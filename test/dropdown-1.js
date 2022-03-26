import {
    createElementAtt,
} from './library/dom.js'

import {
    countries,
} from './country.js'

const fieldDropDown = {
    render: function countryInsert(fieldname, placeholder, fieldcontainer) {
        // DOM code to insert field.....
        console.log('RENDER')

        const elField1 = createElementAtt(fieldcontainer, 'div', ['field'], [], '')
        createElementAtt(elField1, 'label', [], [], fieldname)
        const elCountryInput1 = createElementAtt(elField1, 'input', [], [
            ['type', 'text'],
            ['placeholder', placeholder],
            ['autofocus', ''],
            ['aria-autocomplete', 'both'],
            ['autocapitalize', 'none'],
            ['autocomplete', 'off'],
            ['autocorrect', 'off'],
            ['spellcheck', 'false'],
            ['value', ''],
        ], '')
        const elUL = createElementAtt(elField1, 'ul', ['countrylist'], [], '')
        let selectionLength
        let originalText


        function selectionFind() {
            if (elCountryInput1.nextElementSibling) {
                for (let i = 0; i < selectionLength; i++) {
                    if (elUL.children[i].classList.value === 'active') {
                        return i
                    }
                }
                return -1
            }
            return -1
        }

        function countriesFind(str) {
            let regex
            str.length > 2 ? regex = new RegExp(`.*${str}.*`, 'gi') : regex = new RegExp(`^${str}.*`, 'gi')
            return countries.filter((cv) => cv.match(regex))
        }

        function focus() {
            console.log('focus')
            // console.dir(elCountryInput1)
            elCountryInput1.addEventListener('keyup', keyUp)
            elCountryInput1.addEventListener('blur', blur)
        }


        function keyUp(e) {
            const COUNTRY_COUNT = 196

            selectionLength = elUL.children.length
            let index = selectionFind()

            if (e.keyCode === 38) {
                // Up arrow
                if (selectionLength > 0) {
                    if (index === -1) {
                        index = selectionLength - 1
                        elUL.children[index].classList.add('active')
                        elCountryInput1.value = elUL.children[index].textContent
                    } else if (index === 0) {
                        elUL.children[index].classList.remove('active')
                        index = -1
                        elCountryInput1.value = originalText
                    } else {
                        elUL.children[index].classList.remove('active')
                        index--
                        elUL.children[index].classList.add('active')
                        elCountryInput1.value = elUL.children[index].textContent
                    }
                }
            } else if (e.keyCode === 40) {
                // Down arrow
                if (selectionLength > 0) {
                    if (index === -1) {
                        index++
                        elUL.children[index].classList.add('active')
                        elCountryInput1.value = elUL.children[index].textContent
                    } else if (index === selectionLength - 1) {
                        elUL.children[index].classList.remove('active')
                        index = -1
                        elCountryInput1.value = originalText
                    } else {
                        elUL.children[index].classList.remove('active')
                        index++
                        elUL.children[index].classList.add('active')
                        elCountryInput1.value = elUL.children[index].textContent
                    }
                }
            } else if (e.keyCode === 27) {
                // Escape
                escape()
            } else {
                // Characters have been typed, this is where it finds the results
                originalText = elCountryInput1.value
                let matches;
                let
                    matchlist

                const results = countriesFind(elCountryInput1.value)
                if ((results.length === COUNTRY_COUNT) || (results.length === 0)) {
                    matches = []
                    elUL.classList.remove('isvisible')
                    for (let i = 0, len = elUL.children.length; i < len; i++) {
                        elUL.children[i] && elUL.children[i].remove();
                    }
                } else {
                    dropdownSelectedString

                    // Letters typed are bold
                    matches = results.map((cv) => dropdownSelectedString(cv, elCountryInput1.value))
                    matchlist = matches.map((cv) => `<li>${cv}</li>`).join('')
                    elUL.innerHTML = matchlist
                    elUL.classList.add('isvisible')

                    selectionLength = elUL.children.length
                    index = selectionFind()

                    if (selectionLength !== 0) {
                        console.log(`add mousemove event - selectionLength - ${selectionLength}`)
                        elUL.addEventListener('mousemove', mouseMove)
                        elUL.addEventListener('mousedown', mouseDown)
                    }
                    index = -1
                }
            }
        }

        function listClose() {
            elUL.classList.remove('isvisible')
            for (let i = 0, len = elUL.children.length; i < len; i++) {
                elUL.children[i] && elUL.children[i].remove();
            }
        }

        function escape() {
            // Press Esc and it goes back to what was originally typed
            // console.log('escape')
            console.log(`originalText is ${originalText}`)
            listClose()
            elCountryInput1.value = originalText
            console.log(`elCountryInput1.value - ${elCountryInput1.value}`)
            // console.log(!countries.includes(elCountryInput1.value))

            if (!countries.map((x) => x.toLowerCase()).includes(elCountryInput1.value.toLowerCase())) {
                console.log('not include')
                elCountryInput1.value = ''
            } else {
                console.log('included')
                const dd = countries.map((x) => x.toLowerCase()).findIndex((cv) => cv === elCountryInput1.value.toLowerCase())
                console.log(`dd - ${dd}`)
                elCountryInput1.value = countries[dd]
            }

            elUL.removeEventListener('mousedown', mouseDown)
            elUL.removeEventListener('mousemove', mouseMove)
            console.log('removed elUL events')
        }


        function blur() {
            // elUL.classList.remove('isvisible')
            /* Selecting an item from drop down using the mouse click activates
             * mousedown on elUL and then input blur event. But the input box
             * gets the focus again so we don't want to run this function if there
             * was a selection with a mouseclick.
             */
            console.log('blur')
            let arr = [];

            arr = [...elUL.children]
            if (arr.findIndex((cv) => cv === 'active') !== -1) {
                escape()
                console.log('blur')
                if (!countries.includes(elCountryInput1.value)) {
                    elCountryInput1.value = ''
                }

                elCountryInput1.removeEventListener('keyup', keyUp)
                elCountryInput1.removeEventListener('blur', blur)
                // elUL.removeEventListener('click', click)
            } else {
                listClose()
                // elCountryInput1.focus()
                // window.setTimeout(() => document.querySelectorAll('.field input')[1].focus(), 0);
            }
        }

        function mouseDown(e) {
            console.log('mouseDown')
            elCountryInput1.value = e.target.innerText
            originalText = e.target.innerText
        }

        function mouseMove() {
            let selectionHover = ''
            let index = -1
            if (elUL.children[0]) {
                selectionHover = (document.querySelector('.countrylist li:hover') == null) ? '' : document.querySelector('.countrylist li:hover').textContent
                for (let i = 0; i < elUL.children.length; i++) {
                    // console.log(`i is ${i}, elUL.children.length is ${elUL.children.length}, selectionHover is ${selectionHover}`)
                    elUL.children[i].classList.remove('active')
                    if ((selectionHover !== '') && (selectionHover === elUL.children[i].textContent)) {
                        if (index !== -1) elUL.children[index].classList.remove('active')
                        index = i
                        // console.log(`found - index - ${index}`)
                        elUL.children[index].classList.add('active')
                    }
                }
            }
        }


        function dropdownSelectedString(selectionLine, searchString) {
            const fieldString = new RegExp(`${searchString}`, 'i');
            const startPos = selectionLine.search(fieldString)
            if ((startPos === -1) || (searchString.length === 0)) {
                return selectionLine
            }
            return `${selectionLine.slice(0, startPos)}<strong>${selectionLine.slice(startPos, startPos + searchString.length)}</strong>${selectionLine.slice(startPos + searchString.length)}`
        }



        elCountryInput1.addEventListener('focus', focus)

        // function focus() {
        //     elCountryInput1.addEventListener('keyup', keyUp)
        //     elCountryInput1.addEventListener('blur', blur)
        // }

        // function keyUp(e) {
        //     console.log('keyUp')
        // }

        // function blur(e) {
        //     console.log('blur')
        // }
    },

}

export {
    fieldDropDown,
}
