import {
    createElementAtt,
} from './library/dom.js'

import {
    countries,
} from './country.js'


function listClose(ul) {
    ul.classList.remove('isvisible')
    for (let i = 0, len = ul.children.length; i < len; i++) {
        ul.children[i] && ul.children[i].remove();
    }
}


function escape(el, ul) {
    // Press Esc and it goes back to what was originally typed
    // console.log('escape')
    // console.log(`originalText is ${originalText}`)
    listClose(ul)

    el.value = el.getAttribute('data-txt')
    console.log(`elCountryInput1.value - ${el.value}`)
    // console.log(!countries.includes(elCountryInput1.value))

    if (!countries.map((x) => x.toLowerCase()).includes(el.value.trim().toLowerCase())) {
        console.log('not include')
        // el.value = ''
        // } else {
        //     console.log('included')
        //     const dd = countries.map((x) => x.toLowerCase()).findIndex((cv) => cv === el.value.trim().toLowerCase())
        //     console.log(`dd - ${dd}`)
        // el.value = countries[dd]
    }

    ul.removeEventListener('mousedown', mouseDown)
    ul.removeEventListener('mousemove', mouseMove)
    console.log('removed elUL events')
}


function enter(el, ul, i) {
    // console.log(el)
    // console.log(ul)
    // console.log(i)
    // console.log(ul.children[i].textContent)


    if (i === -1) {
        el.value = el.getAttribute('data-txt')
    } else {
        el.value = ul.children[i].textContent
        el.setAttribute('data-txt', el.value)
    }

    listClose(ul)

    ul.removeEventListener('mousedown', mouseDown)
    ul.removeEventListener('mousemove', mouseMove)
}


function selectionFind(el, ul, len) {
    if (el.nextElementSibling) {
        for (let i = 0; i < len; i++) {
            if (ul.children[i].classList.value === 'active') {
                return i
            }
        }
        return -1
    }
    return -1
}


function countriesFind(str) {
    let matches;
    let matchlist

    function dropdownSelectedString(selectionLine, searchString) {
        const fieldString = new RegExp(`${searchString}`, 'i');
        const startPos = selectionLine.search(fieldString)
        if ((startPos === -1) || (searchString.length === 0)) {
            return selectionLine
        }
        return `${selectionLine.slice(0, startPos)}<strong>${selectionLine.slice(startPos, startPos + searchString.length)}</strong>${selectionLine.slice(startPos + searchString.length)}`
    }

    let regex
    str.length > 2 ? regex = new RegExp(`.*${str}.*`, 'gi') : regex = new RegExp(`^${str}.*`, 'gi')
    const results = countries.filter((cv) => cv.match(regex))

    if ((results.length === countries.length) || (results.length === 0)) {
        matchlist = ''
    } else {
        // Letters typed are bold
        matches = results.map((cv) => dropdownSelectedString(cv, str.trim()))
        // if (elCountryInput1.value.length >= 3) debugger
        matchlist = matches.map((cv) => `<li>${cv}</li>`).join('')
    }
    return matchlist
}


function focus(e) {
    console.log('focus 3')
    const elCountryInput1 = e.target
    const elUL = e.target.nextSibling

    const selectionLength = elUL.children.length

    const originalText = elCountryInput1.value
    const matchResults = countriesFind(originalText)
    elUL.innerHTML = matchResults

    console.log(matchResults)
    if (matchResults === '') {
        elUL.classList.remove('isvisible')
        for (let i = 0, len = elUL.children.length; i < len; i++) {
            elUL.children[i] && elUL.children[i].remove();
        }
    } else {
        elUL.classList.add('isvisible')

        const index = selectionFind(elCountryInput1, elUL, selectionLength)

        // index = -1
    }

    // if (selectionLength !== 0) {
    console.log(`add mousemove event - selectionLength - ${selectionLength}`)
    elUL.addEventListener('mousemove', mouseMove)
    elUL.addEventListener('mousedown', mouseDown)
    // }
    elCountryInput1.addEventListener('keyup', keyUp)
    elCountryInput1.addEventListener('blur', blur)
}


function keyUp(e) {
    console.log('keyup 3')
    // const COUNTRY_COUNT = 196

    const elCountryInput1 = e.target
    const elUL = e.target.nextSibling

    let originalText = elCountryInput1.getAttribute('data-txt')
    console.log(originalText)

    let selectionLength = elUL.children.length


    // console.dir(elThis)
    let index = selectionFind(elCountryInput1, elUL, selectionLength)

    switch (e.keyCode) {
        case 38:
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
            break

        case 40:
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
            break

        case 27:
            // Escape
            escape(elCountryInput1, elUL)
            break

        case 13:
            // Enter
            console.log('enter')
            console.log(index)
            enter(elCountryInput1, elUL, index)
            break

        default:
            // Characters have been typed, this is where it finds the results
            // console.log(e.keyCode)
            originalText = elCountryInput1.value
            elCountryInput1.setAttribute('data-txt', originalText)

            // console.log(countriesFind(originalText))
            // if (originalText.length >= 3) debugger

            let matchResults = countriesFind(originalText)
            elUL.innerHTML = matchResults
            if (matchResults = '') {
                elUL.classList.remove('isvisible')

                selectionLength = elUL.children.length
                index = selectionFind(elCountryInput1, elUL, selectionLength)

                if (selectionLength !== 0) {
                    console.log(`add mousemove event - selectionLength - ${selectionLength}`)
                    elUL.addEventListener('mousemove', mouseMove)
                    elUL.addEventListener('mousedown', mouseDown)
                }
                index = -1
            } else {
                elUL.classList.add('isvisible')

                const index = selectionFind(elCountryInput1, elUL, selectionLength)

                // index = -1
            }
    }
}


function blur(e) {
    // elUL.classList.remove('isvisible')
    /* Selecting an item from drop down using the mouse click activates
     * mousedown on elUL and then input blur event. But the input box
     * gets the focus again so we don't want to run this function if there
     * was a selection with a mouseclick.
     */
    console.log('blur 3')

    const elCountryInput1 = e.target
    console.log(elCountryInput1)
    const elUL = e.target.nextSibling

    if (!countries.map((x) => x.toLowerCase()).includes(elCountryInput1.value.trim().toLowerCase())) {
        console.log('not include')
        elCountryInput1.value = ''
    }

    listClose(elUL)


    // let arr = [];

    // arr = [...elUL.children]
    // if (arr.findIndex((cv) => cv === 'active') !== -1) {
    //     escape(elCountryInput1, elUL)
    //     if (!countries.includes(elCountryInput1.value)) {
    //         elCountryInput1.value = ''
    //     }

    //     elCountryInput1.removeEventListener('keyup', keyUp)
    //     elCountryInput1.removeEventListener('blur', blur)
    // } else {
    //     listClose(elUL)
    // }
}


function mouseDown(e) {
    console.log('mouseDown 3')
    const elCountryInput1 = e.target.parentNode.previousSibling
    const elUL = e.target.parentNode
    console.log(elCountryInput1)
    const selectedText = e.target.textContent
    elCountryInput1.setAttribute('data-txt', selectedText)
    elCountryInput1.value = selectedText

    // elCountryInput1.setAttribute('data-txt', elCountryInput1.value)

    // console.log(e.target)
    // console.log(e.target.parentNode)

    // originalText = e.target.innerText
}

function mouseMove(e) {
    let selectionHover = ''
    let index = -1

    // console.log(e.target)
    // console.log(e.target.parentNode)

    const elCountryInput1 = e.target.parentNode.parentNode
    const elUL = e.target.parentNode

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


function FieldDropDown3(fieldname, placeholder, fieldcontainer) {
    let elCountryInput1

    function render(fieldname, placeholder, fieldcontainer) {
        // DOM code to insert field.......
        console.log('RENDER 3 ')

        const elField1 = createElementAtt(fieldcontainer, 'div', ['field'], [], '')
        createElementAtt(elField1, 'label', [], [], fieldname || 'Untitled')
        elCountryInput1 = createElementAtt(elField1, 'input', [], [
            ['type', 'text'],
            ['placeholder', placeholder || fieldname || 'Enter text'],
            ['autofocus', ''],
            ['aria-autocomplete', 'both'],
            ['autocapitalize', 'none'],
            ['autocomplete', 'off'],
            ['autocorrect', 'off'],
            ['spellcheck', 'false'],
            ['value', ''],
            ['data-txt', ''],
        ], '')
        const elUL = createElementAtt(elField1, 'ul', ['countrylist'], [], '')
        let originalText
    }

    function bindEvents() {
        elCountryInput1.addEventListener('focus', focus)
    }

    render(fieldname, placeholder, fieldcontainer)
    bindEvents()
}


export {
    FieldDropDown3,
}
