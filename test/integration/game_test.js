const chai = require('chai');
const expect = chai.expect;

const app = require('../../src/app');
const gameState = require('../../src/league');

describe('league app', function () {
  it('prints empty game state', function () {
    const game = app.startGame(gameState.createLeague());

    expect(game.sendCommand('print')).to.equal('No players yet');
  });

  it('adds a player to the game and prints the new game state', function () {
    const game = app.startGame(gameState.createLeague());

    game.sendCommand('add player Calum');

    expect(game.sendCommand('print')).to.match(/^[^\w]+Calum[^\w]+$/);
  });

  it('adds a second player to the game on a new row and prints the new game state', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Calum');

    game.sendCommand('add player Kenny');

    expect(game.sendCommand('print')).to.match(/^[^\w]+Calum[^\w]+Kenny[^\w]+$/);
  });

  it('records a win', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Calum');
    game.sendCommand('add player Kenny');

    game.sendCommand('record win Kenny Calum');

    expect(game.sendCommand('print')).to.match(/^[^\w]+Kenny[^\w]+Calum[^\w]+$/);
  });

  it('Saves and retrieves game state from a local fs', function () {
    const game = app.startGame(gameState.createLeague());
    game.sendCommand('add player Calum');
    game.sendCommand('add player Kenny');
    game.sendCommand('save test/integration/save1.json');

    const newGame = app.startGame(gameState.createLeague());
    newGame.sendCommand('load test/integration/save1.json');

    expect(newGame.sendCommand('print')).to.match(/^[^\w]+Calum[^\w]+Kenny[^\w]+$/);
  });
});
