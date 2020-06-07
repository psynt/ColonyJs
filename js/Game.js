const FIND_RAT = 80;
const FIND_UNC = 50;
const FIND_SURV = 10;
var game

function populatePage(){
    $("#nights").text(game.night);
    $("#surv").text(game.colony.survivors);
    $("#raw").text(game.colony.uncooked);
    $("#rat").text(game.colony.rations);
    $("#bar").text(game.colony.barricades);
}

function init(){
    $("#report").empty();
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

function search(colonists){
    let found = {
        survivors: 0,
        rations: 0,
        uncooked: 0,
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
    say("===========================");
    say("Day:" + game.night);

    let searchers = $("#search").val();
    let searchResults = search(parseInt(searchers));
    say("Search found " + JSON.stringify(searchResults));
    game.colony.rations += searchResults.rations;
    game.colony.survivors += searchResults.survivors;
    game.colony.uncooked += searchResults.uncooked;

    debugger;
    let ck = parseInt($("#cook").val());
    let cooking = Math.min(parseInt($("#cook").val()), game.colony.uncooked);
    say("Cooking " + cooking + " raw food into " + cooking * 2 + " rations.");
    game.colony.uncooked -= cooking;
    game.colony.rations += cooking * 2;

    say("Colonists eat " + Math.min(game.colony.survivors, game.colony.rations) + " rations.");
    game.colony.rations -= game.colony.survivors;
    let zombies = roll(game.night, 4, 1);
    say(zombies + " zombies appear.");
    let totalStrength = game.colony.survivors;

    if (game.colony.rations < 0){
        let dead = roll(2, Math.floor(-game.colony.rations/2), 1);
        say(-game.colony.rations + " colonists go to bed on an empty stomach.");
        say(dead + " of them don't wake up again.");
        game.colony.rations = 0;
    }

    return totalStrength > zombies;
}

/**
 * Pre-main game loop
 */
function play() {
    if(invalidInput())
        return;
    if (passNight()) {
        say("You survive another night! Well done!")
        populatePage();
    } else {
        alert("Game Over!");
        init();
    }
}
