import {
    fieldDropDown,
} from './dropdown-1.js'


import {
    FieldDropDown,
} from './dropdown-2.js'

import {
    FieldDropDown3,
} from './dropdown-3.js'

const elOuter = document.querySelector('.container .outer');

fieldDropDown.render('Country of birth', 'Country of birth', elOuter)

fieldDropDown.render('Country of residence', 'Country of residence', elOuter)

console.log(typeof FieldDropDown)
const objTest = Object.create(FieldDropDown())
console.log(typeof objTest)
console.log(objTest)
console.log(objTest.render())
objTest.render('Country of birth 21', 'Country of birth 21', elOuter)

const objTest2 = Object.create(FieldDropDown())
objTest2.render('Country of birth 22', 'Country of birth 22', elOuter)
// debugger


FieldDropDown3('Country of birth 31', 'Country of birth 31', elOuter)


// const fdd1 = FieldDropDown.render('Country of birth 2', 'Country of birth 2', elOuter)

// const fdd2 = fieldDropDown.render('Country of residence 2', 'Country of residence 2', elOuter)
