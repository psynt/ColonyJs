const FIND_RAT = 80;
const FIND_UNC = 60;
const FIND_SURV = 20;
const UNC_TO_COOKED = 3;
var game

function init(){
    $("#report").empty();
    game = {
        colony:{
            plus: function(second_colony){
                for (const prop in second_colony){
                    if(second_colony.hasOwnProperty(prop) && isFinite(second_colony[prop]) && this.hasOwnProperty(prop)) {
                        this[prop] += parseInt(second_colony[prop]);
                    }
                }
                return this;
            },
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


/**
 * Main Game loop
 * @returns {boolean}
 */
function passNight(){

    function scavenge() {
        function search(colonists){
            let found = {
                survivors: 0,
                rations: 0,
                uncooked: 0,
            }
            colonists.times(() => {
                found.survivors += roll(1, 100, 0) <= FIND_SURV;
                found.uncooked += roll(1, 100, 0) <= FIND_UNC;
                found.rations += roll(1, 100, 0) <= FIND_RAT;
            })
            return found;
        }

        let searchResults = search(parseInt($("#search").val()));
        say("Search found " + JSON.stringify(searchResults));
        game.colony.plus(searchResults);
    }

    function cook(){
        let cooking = Math.min(2 * parseInt($("#cook").val()), game.colony.uncooked);
        if (cooking > 0) {
            say("Cooking " + cooking + " raw food into " + cooking * UNC_TO_COOKED + " rations.");
            game.colony.uncooked -= cooking;
            game.colony.rations += cooking * UNC_TO_COOKED;
        }
    }

    function buildBarricades(){
        let building = parseInt($("#barricade").val());
        if (building > 0){
            say("Building " + building + " new barricades.");
            game.colony.barricades += building;
        }
    }

    function eatRations() {
        say("Colonists eat " + Math.min(game.colony.survivors, game.colony.rations) + " rations.");
        game.colony.rations -= game.colony.survivors;
    }

    function spawnZombies() {
        let zombies = roll(game.night, 4, 1);
        say(zombies + " zombies appear.");
        return zombies;
    }

    function fight(zombies) {
        let totalStrength = game.colony.survivors + game.colony.barricades;
        console.log("Zombies:" + zombies + "\nColony strength:" + totalStrength);

        if(game.colony.barricades > 0) {
            let barricadesDestroyed = roll(1, Math.min(game.colony.barricades, zombies), 0);
            if (barricadesDestroyed > 0) {
                say("The zombies manage to destroy " + barricadesDestroyed + " of the colony's barricades.");
                game.colony.barricades -= barricadesDestroyed;
            }
        }

        let res = totalStrength - zombies;
        if (res === 1 || res === 0){
            say("You barely manage to hold off the invasion");
        } else if (res > 0){
            say("You successfully defend the colony");
        } else {
            say(-res + " zombies break through your defenses, killing colonists.");
            game.colony.survivors += res; //res should be negative
        }
    }

    function starve() {
        if (game.colony.rations < 0){
            say(-game.colony.rations + " colonists go to bed on an empty stomach.");
            let dead = Math.min(game.colony.survivors, roll(2, Math.floor(-game.colony.rations/2), 0));
            say(dead + " of them don't wake up again.");
            game.colony.survivors -= dead;
            game.colony.rations = 0;
        }
    }

    // passNight()

    game.night++;
    say("===========================");
    say("Day:" + game.night);

    scavenge();
    buildBarricades();
    cook();
    eatRations();
    fight(spawnZombies());
    starve();

    return game.colony.survivors > 0;
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
        invalidInput();
    } else {
        alert(`Game Over!\nYou survived ${game.night} nights`);
        init();
        invalidInput();
    }
}
