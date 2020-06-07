Number.prototype.integer = function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
}
Number.prototype.times = function(f){
    if(!this) return;
    if(this <= 0) return;
    for (let i = 0 ; i<this ; i++){
        f(i);
    }
}

/**
 * @param n
 * @param s
 * @param p
 * @returns nds+p as in d&d notation
 */
function roll(n, s, p){ // nds+p
    return (n * (Math.random()*s + 1) + p).integer();
}

function invalidInput() {
    let total = $(".check[type=number]").map(function() {
        return parseInt(this.value);
    }).get().reduce((previousValue, currentValue) => previousValue + currentValue)
    let res = total > game.colony.survivors;
    $("#night").prop("disabled", res);
    return res;
}

function say(string){
    $("#report").prepend(string + "<br/>");
}

