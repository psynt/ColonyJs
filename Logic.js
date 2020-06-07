const FIND_RAT = 80;
const FIND_UNC = 50;
const FIND_SURV = 10;
var game

function invalidInput() {
    let total = $(".check[type=number]").map(function() {
        return parseInt(this.value);
    }).get().reduce((previousValue, currentValue) => previousValue + currentValue)
    let res = total > game.colony.survivors;
    $("#night").prop("disabled", res);
    return res;
}

function populatePage(){
    document.getElementById("nights").textContent=game.night;
    document.getElementById("surv").textContent=game.colony.survivors;
    document.getElementById("rat").textContent=game.colony.rations;
}

function init(){
    $("#report").empty();
    $("#report").prepend("============NEW============<br/>");
    game = {
        colony:{
            survivors: 11,
            rations: 20,
            uncooked: 0,
            barricades: 0,
        },
        night: 0,
    }
    populatePage();
    invalidInput();
}

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

/**
 * Search for colonists
 * @param colonists
 * @returns {{rations: number, survivors: number}}
 */
function search(colonists){
    let found = {
        survivors: 0,
        rations: 0,
    }
    colonists.times(i => {
        found.survivors += roll(1, 100, 0) <= FIND_SURV;
        found.uncooked += roll(1, 100, 0) <= FIND_UNC;
        found.rations += roll(1, 100, 0) <= FIND_RAT;
    })
    return found;
}

/**
 * Main Game loop
 * @returns {boolean}
 */
function passNight(){
    game.night++;
    $("#report").prepend("===========================<br/>");
    $("#report").prepend("Day:" + game.night + "<br/>");

    let searchers = document.getElementById("search").value;
    let searchResults = search(parseInt(searchers));
    $("#report").prepend("Search found " + JSON.stringify(searchResults) + "<br/>");
    game.colony.rations += searchResults.rations;
    game.colony.survivors += searchResults.survivors;
    game.colony.uncooked += searchResults.uncooked;

    let zombies = roll(game.night, 4, 1);
    $("#report").prepend(zombies + " zombies appear.<br/>")
    let totalStrength = game.colony.survivors;

    return totalStrength > zombies;
}

/**
 * Pre-main game loop
 */
function play() {
    if(invalidInput())
        return;
    if (passNight()) {
        $("#report").prepend("You survive another night! Well done!<br/>")
        populatePage();
    } else {
        alert("Game Over!");
        init();
    }
}
