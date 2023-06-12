require('mocha-sinon');
const chai = require('chai');
const expect = chai.expect;

const app = require('../src/app');
const gameState = require('../src/league');
const leagueRenderer = require('../src/league_renderer');
const fileService = require('../src/file_service');

describe('app command processing', function () {
  it('prints the current state of the league', function () {
    const league = gameState.createLeague();
    const renderLeague = this.sinon.stub(leagueRenderer, 'render');
    renderLeague.withArgs(league).returns('rendered league');

    const game = app.startGame(league);
    expect(game.sendCommand('print')).to.equal('rendered league');
  });

  it('adds a new player', function () {
    const league = gameState.createLeague();
    const mockLeague = this.sinon.mock(league);
    mockLeague.expects('addPlayer').withArgs('Alice');

    const game = app.startGame(league);
    game.sendCommand('add player Alice');

    mockLeague.verify();
  });

  it('records a win', function () {
    const league = gameState.createLeague();
    const mockLeague = this.sinon.mock(league);
    mockLeague.expects('recordWin').withArgs('Alice', 'Bob');

    const game = app.startGame(league);
    game.sendCommand('record win Alice Bob');

    mockLeague.verify();
  });

  it('returns the winner', function () {
    const league = gameState.createLeague();
    const getWinnerStub = this.sinon.stub(league, 'getWinner');
    getWinnerStub.returns('The Winner');

    const game = app.startGame(league);

    expect(game.sendCommand('winner')).to.equal('The Winner');
  });

  it('saves the league', function () {
    const league = gameState.createLeague();
    const fileServiceMock = this.sinon.mock(fileService);
    fileServiceMock.expects('save').withArgs('saveFilePath.txt', league);

    const game = app.startGame(league);
    game.sendCommand('save saveFilePath.txt');

    fileServiceMock.verify();
  });

  it('loads the league', function () {
    const league = gameState.createLeague();
    const savedLeague = gameState.createLeague();
    savedLeague.addPlayer('Alice');
    savedLeague.addPlayer('Bob');

    const fileServiceLoadMock = this.sinon.mock(fileService);
    fileServiceLoadMock.expects('load').withArgs('saveFilePath.txt').returns(savedLeague);

    const mockRender = this.sinon.mock(leagueRenderer);
    mockRender.expects('render').withArgs(savedLeague);

    const game = app.startGame(league);
    game.sendCommand('load saveFilePath.txt');
    game.sendCommand('print');

    fileServiceLoadMock.verify();
    mockRender.verify();
  });
});
