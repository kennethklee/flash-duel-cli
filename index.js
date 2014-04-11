var Game = require('flash-duel').Game,
    game = new Game('1v1'),
    computer = require('./computer');

var createMenu = function() {
    var menu = require('terminal-menu')({ width: 70, x: 4, y: 2 });
    menu.createStream().pipe(process.stdout);
    menu.reset();
    return menu;
};

var printBoard = function(menu) {
    var topNumbers = '';
    for(var i = 0; i < 18; i++) {
        // This needs to be improved
        if (i < 10) {
            topNumbers += '| ' + (i + 1);
        } else {
            topNumbers += '|' + (i + 1);
        }
    };
    menu.write(topNumbers + '\n');

    var playerPositions = '';
    for(var up = 0; up < game.players[0].peice.position - 1; up++) {
        playerPositions += '   ';
    }
    playerPositions += '  >';

    for(var down = game.players[0].peice.position; down < game.players[1].peice.position; down++) {
        playerPositions += '   ';
    }
    playerPositions += '<';
    menu.write(playerPositions + '\n');
};

var printStat = function(menu) {
    menu.write('Your Position: ' + game.players[0].peice.position + '\n');
    menu.write('Opponent Position: ' + game.players[1].peice.position + '\n');
    menu.write('Opponent is holding ' + game.players[1].hand.cards.length + ' cards\n');
    menu.write('\n')
    menu.write('Your Hand: ' + game.players[0].hand.cards.join(', ') + '\n');
};

var showActionMenu = function(callback) {
    var menu = createMenu();
    printBoard(menu);
    printStat(menu);

    menu.write('\n');
    menu.write('Your Turn\n');
    menu.write('---------\n');

    menu.add('MOVE FORWARD');
    menu.add('MOVE BACKWARDS');
    menu.add('PUSH');
    menu.add('ATTACK');
    menu.add('DASHING STRIKE');
    menu.add('EXIT');

    menu.on('select', function(label) {
        menu.close();

        callback(label)
    });
};

var showDefendMenu = function(defend, callback) {
    var menu = createMenu();
    printBoard(menu);
    printStat(menu);

    menu.write('\n');
    menu.write('Opponent does an ' + defend.attackType + ' attack!\n');
    menu.write('\n');
    menu.write('Defend\n');
    menu.write('------\n');

    menu.add('BLOCK');
    menu.add('RETREAT');
    menu.add('DIE');
    menu.add('EXIT');

    menu.on('select', function(label) {
        menu.close();

        callback(label)
    });
};

game.on('init', function(err) {
    var turn = function(action) {
        showActionMenu(function(label) {
            switch(label) {
                case 'MOVE FORWARD':
                    action.move(0);
                    console.log('forward!');
                    break;

                case 'MOVE BACKWARDS':
                    action.moveBackwards(0);
                    console.log('backwords!');
                    break;

                case 'PUSH':
                    action.push(0);
                    console.log('push!');
                    break;

                case 'ATTACK':
                    action.attack(0);
                    console.log('attack!');
                    break;

                default:
                    game.end();
                    break;
            };
        });
    };

    var defend = function(defend) {
        showDefendMenu(defend, function(label) {
            console.log(label);
            game.end();
        });
    };

    var endGame = function() {
        menu.close();
        console.log('Game done!');
    };

    game.players[0].on('turn', turn);
    game.players[1].on('turn', computer.playTurn);

    game.players[0].on('defend', defend);
    game.players[1].on('defend', computer.defend);

    var menu = createMenu();
    menu.write('Flash Duel\n');
    menu.write('==========\n');

    menu.add('START');
    menu.add('EXIT');

    game.on('end', endGame);

    menu.on('select', function (label) {
        if (label === 'START') {
            menu.close();
            game.start();
        }
        menu.close();
    });

});
