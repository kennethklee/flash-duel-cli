// Some helper functions
var moveForward = function(action) {
    return action.move(0)
        || action.move(1)
        || action.move(2)
        || action.move(3)
        || action.move(4);
};

var moveBackwards = function(action) {
    return action.moveBackwards(0)
        || action.moveBackwards(1)
        || action.moveBackwards(2)
        || action.moveBackwards(3)
        || action.moveBackwards(4);
};

module.exports.playTurn = function(action, game) {
    var opponent = action.getPlayer('one'),
        distance = Math.abs(opponent.peice.position - action.player.peice.position);
        attack = action.player.hand.cards.indexOf(distance);

    for (var moveIndex = 0; moveIndex < 5; moveIndex++) {
        for (var attackIndex = moveIndex; attackIndex < 5; attackIndex++) {
            if (moveIndex !== attackIndex && action.player.hand.peekAt(moveIndex)[0] + action.player.hand.peekAt(attackIndex)[0] === distance) {
                return action.dashingStrike(moveIndex, attackIndex, opponent);    // Dashing strike if possible
            }
        }
    }

    if (~attack) {
        return action.attack(attack, opponent);
    }

    moveForward(action) || moveBackwards(action); // Forward!
};

module.exports.defend = function(defend, game) {
    // Check if can block
    var defense = defend.player.hand.cards.indexOf(defend.attackCards[0]);

    if (~defense) {
        defend.block(defense);

    } else {
        // Check if can retreat
        defend.retreat(0)
        || defend.retreat(1)
        || defend.retreat(2)
        || defend.retreat(3)
        || defend.retreat(4)
        || defend.die();
    }
};