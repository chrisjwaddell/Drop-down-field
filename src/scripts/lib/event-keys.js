function eventkeyAZ09(keycode) {
    // this stops any key that is not a-z, A-Z, 0-9
    // Use with eventkeyEditing

    // Usage:
    // elAddText.addEventListener("keydown", e => {
    //   if (eventkeyAZ09(e.keyCode) === false) {
    //     e.preventDefault()
    //   }
    // })

    if ((keycode >= 65) && (keycode <= 90)) {
        return true
    }
    if (((keycode >= 48) && (keycode <= 57)) || ((keycode >= 96) && (keycode <= 105))) {
        return true
    }
    return false
}

export {
    eventkeyAZ09
}
