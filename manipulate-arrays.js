exports.getRandom = function (arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm (ES6).
 */
exports.shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
    return array
}

// False no switch cards, true switch cards
exports.changeCard = function (difficulty) {
    var d = Math.random();
    var percent = 0.65;
    
    switch(difficulty) {
        case 1:
            if (d > percent) {
                return true
            } else {
                return false
            }
        case 2:
            if (d > percent**2) {
                return true
            } else {
                return false
            }
        case 3:
            if (d > percent**3) {
                return true
            } else {
                return false
            }
        case 4:
            if (d > percent**4) {
                return true
            } else {
                return false
            }
        case 5:
            if (d > percent**5) {
                return true
            } else {
                return false
            }
        case 6:
            if (d > percent**6) {
                return true
            } else {
                return false
            }
        case 7:
            if (d > percent**7) {
                return true
            } else {
                return false
            }
        case 8:
            if (d > percent**8) {
                return true
            } else {
                return false
            }
        case 9:
            if (d > percent**9) {
                return true
            } else {
                return false
            }
        default:
            return false
    }
}