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
 * @param number
 * @param sides
 * @param plus
 * @returns nds+p as in d&d notation
 */
function roll(number, sides, plus){ // nds+p
    return (number * (Math.random()*sides + 1) + plus).integer();
}

function invalidInput() {
    let totalUsed = $(".check[type=number]").map(function() {
        return parseInt(this.value);
    }).get().reduce((previousValue, currentValue) => previousValue + currentValue)

    let res = totalUsed > game.colony.survivors;
    $("#night").prop("disabled", res);
    $("#total").val(totalUsed);
    return res;
}

function say(string){
    $("#report").prepend(string + "<br/>");
}

function populatePage(){
    $("#nights").text(game.night);
    $("#surv").text(game.colony.survivors);
    $("#raw").text(game.colony.uncooked);
    $("#rat").text(game.colony.rations);
    $("#bar").text(game.colony.barricades);
}

