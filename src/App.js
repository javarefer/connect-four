/**
 * Connect Four Game
 * Author: Rahul Sapkal (rahul@javareference.com)
 * Copyright 2019
 * ---------------------------------------------------
 * This is a two player Connect Four Game
 */

import React from 'react';
import red from './red.png';
import blue from './blue.png';
import blueIn from './bluein.png';
import redIn from './redin.png';
import empty from './empty.png';
import win1Sound from './sound/win1.wav';
import win2Sound from './sound/win2.wav';
import win3Sound from './sound/win3.wav';
import win4Sound from './sound/win4.wav';
import win5Sound from './sound/win5.wav';
import playTicSound from './sound/playtic.wav';
import play1Sound from './sound/play1.wav';
import play2Sound from './sound/play2.wav';
import startSound from './sound/start.wav';
import drawSound from './sound/draw.wav';
import './App.css';

/**
 * Connect Four Game App
 */
class App extends React.Component{

  winningCells = [];

  startSound = new Audio(startSound);
  playTicSound = new Audio(playTicSound);
  play1Sound = new Audio(play1Sound);
  play2Sound = new Audio(play2Sound);
  winSound = new Audio();
  winSounds = [win1Sound, win2Sound, win3Sound, win4Sound, win5Sound];
  drawSound = new Audio(drawSound);

  constructor(props) {
    super(props);

    this.state = {
      board : [],
      currentPlayer: 1,
      playerColor:['Blue', 'Red'],
      winner: 0,
      height: 6,
      width: 7,
      playInProgress: false
    };
  }

  componentDidMount() {
    this.newGame();
  }

  /**
   * This method is called when a player makes a play
   *
   * @param column
   * @param player
   */
  play(column, player) {
    if(this.state.playInProgress || (this.state.winner > 0) || (column < 1)){
        return;
    }

    if (player) {
      this.setState({currentPlayer : player});
    }

    let board = this.state.board;
    let found = false;
    let columnBlocked = false;

    let playRow, playCol = -1;

    for (let r=0; r<this.state.height; r++) {
      if (this.state.board[r][column-1] !== 0) {
        if(r >0) {
          playRow = r - 1;
          playCol = column-1;
          found = true;
        }
        else {
          columnBlocked = true;
        }
        break;
      }
    }
    if(!found) {
      playRow = board.length - 1;
      playCol = column-1;
    }

    if(!columnBlocked) {
      this.setState({playInProgress: true});
      this.visualizePlay(playRow, playCol, 0);
    }
  }

  /**
   * This function visualizes the play by moving the piece to the
   * appropriate spot. Once the piece is moved to the spot the play
   * in then processed to check for victory
   *
   * @param playRow
   * @param playCol
   * @param rowIndex
   */
  visualizePlay(playRow, playCol, rowIndex) {
    if(playRow >= rowIndex) {
      this.playTicSound.play();

      let board = this.state.board;

      if(rowIndex > 0) {
        board[rowIndex-1][playCol] = 0;
      }

      board[rowIndex][playCol] = this.state.currentPlayer;

      this.setState({board: board});

      setTimeout(()=>this.visualizePlay(playRow, playCol, ++rowIndex), 150);
    }
    else {
      this.processPlay(playRow, playCol);
    }
  }

  /**
   * Process the play after the piece is moved to the spot
   *
   * @param playRow
   * @param playCol
   */
  processPlay(playRow, playCol) {
    if (this.checkVictoryForPlay(playRow, playCol)) {
      this.setState({winner : this.state.currentPlayer});
      console.log("Winner is " + this.state.winner);
      this.setConnectFour();
      this.winSound.src = this.winSounds[Math.floor(Math.random() * Math.floor(5))];
      this.winSound.play();
    }
    else if (this.checkForDraw()) {
      this.drawSound.play();
      this.setState({winner : 3});
      console.log("It's a draw");
    }
    else {
      this.setCurrentPlayer();
    }

    this.setState({playInProgress: false});
  }

  checkForDraw() {
    return (this.state.board[0].indexOf(0) === -1);
  }

  /**
   * This method toggles the current player state after
   * every play
   */
  setCurrentPlayer() {
    if (this.state.currentPlayer === 1) {
      this.play1Sound.play();
      this.setState({currentPlayer: 2});
    }
    else {
      this.play2Sound.play();
      this.setState({currentPlayer: 1});
    }

    //console.log( this.state.currentPlayer);
  }

  /**
   * This function checks a winning scenario after
   * every move
   *
   * @param playRow
   * @param playCol
   * @returns {boolean}
   */
  checkVictoryForPlay (playRow, playCol) {
    return (this.checkVictoryDown(playRow, playCol) ||
            this.checkVictorySide(playRow, playCol) ||
            this.checkVictoryLeftDia(playRow, playCol) ||
            this.checkVictoryRightDia(playRow, playCol));
  }

  resetWinningCells (playRow, playCol) {
    this.winningCells = [{row: playRow, col: playCol}];
  }

  setConnectFour() {
    let board = this.state.board;

    for(let i=0; i<this.winningCells.length; i++) {
      board[this.winningCells[i].row][this.winningCells[i].col] = 3;
    }

    this.setState({board: board});
  }

  /**
   * This method checks for connect four for given row and col.
   * It returns false if it's not a connect four
   * It returns true if it's a connect four
   * It returns undefined if it's not sure whether it is a connect four yet
   *
   * @param playRow
   * @param playCol
   * @returns {boolean|undefined}
   */
  checkConnectFour(playRow, playCol){
    let value = this.state.board[playRow][playCol];

    if ((value === 0) || ((value > 0) && (this.state.currentPlayer !== value))) {
      return false;
    }

    this.winningCells.push({row: playRow, col: playCol});

    if(this.winningCells.length === 4)
      return true;
    else
      return undefined;
  }

  checkVictoryDown(playRow, playCol) {
    this.resetWinningCells(playRow, playCol);

    //check down
    for (let r=playRow+1; r<this.state.height; r++) {
      let isConnectFour = this.checkConnectFour(r, playCol);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }
    return false;
  }

  checkVictorySide(playRow, playCol) {
    this.resetWinningCells(playRow, playCol);

    //check left side
    for (let c=playCol-1; c>=0; c--) {
      let isConnectFour = this.checkConnectFour(playRow, c);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }

    //check right side
    for (let c=(playCol+1); c<this.state.width; c++) {
      let isConnectFour = this.checkConnectFour(playRow, c);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }

    return false;
  }

  checkVictoryLeftDia(playRow, playCol) {
    this.resetWinningCells(playRow, playCol);

    //check left-top side
    for (let c=playCol-1, r=playRow-1; (c>=0 && r>=0); c--, r--) {
      let isConnectFour = this.checkConnectFour(r, c);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }

    //check right-bottom side
    for (let c=playCol+1, r=playRow+1; (c<this.state.width && r<this.state.height); c++, r++) {
      let isConnectFour = this.checkConnectFour(r, c);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }

    return false;
  }

  checkVictoryRightDia(playRow, playCol) {
    this.resetWinningCells(playRow, playCol);

    //check right-top side
    for (let c=playCol+1, r=playRow-1; (c<this.state.width && r>=0); c++, r--) {
      let isConnectFour = this.checkConnectFour(r, c);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }

    //check left-bottom side
    for (let c=playCol-1, r=playRow+1; (c>=0 && r<this.state.height); c--, r++) {
      let isConnectFour = this.checkConnectFour(r, c);
      if (isConnectFour === false)
        break;
      else if (isConnectFour === true)
        return true;
    }

    return false;
  }

  /**
   * Called when New Game button is clicke
   */
  newGame = () => {
    this.startSound.play();

    this.setState({winner : 0});
    const board = [];
    for(let i= 0; i<this.state.height; i++) {
      board.push(new Array(this.state.width).fill(0));
    }
    this.setState({board : board});
    this.setState({currentPlayer : 1});
  }

  renderResult() {
    switch (this.state.winner) {
      case 1: return (<div><img alt=" " className="App-winner" src={blue}/> {this.state.playerColor[this.state.winner-1]} wins!!! </div>);
      case 2: return (<div><img alt=" " className="App-winner" src={red}/> {this.state.playerColor[this.state.winner-1]} wins!!!</div>);
      case 3: return (<div><img alt=" " className="App-winner" src={blue}/><img alt=" " className="App-winner" src={red}/> It's a draw!!! Play again!</div>);
      default: return (<span/>);
    }
  }

  renderCell(item, mIndex, index) {
    let cellStyle = {marginLeft: '2px', marginRight: '2px'};
    let playBoardStyle = ((this.state.winner === 0) ? {cursor: 'pointer'} : (item === 3) ? {cursor: 'default', animation: 'App-logo-spin infinite 4s linear', opacity: '1.0'} : {cursor: 'default', opacity: '0.20'});
    let winImage = blue;

    if (item === 3) {
      if(this.state.winner === 2)
        winImage = red;
    }

    switch(item) {
      case 0: return (<span style={cellStyle}><img key={(mIndex.toString() + index.toString())} alt=" " style={playBoardStyle} onClick={() => this.play(index + 1)} src={empty}/></span>);
      case 1: return (<span style={cellStyle}><img key={(mIndex.toString() + index.toString())}  alt=" " style={playBoardStyle} onClick={() => this.play(index + 1)} src={blueIn}/></span>);
      case 2: return (<span style={cellStyle}><img key={(mIndex.toString() + index.toString())}  alt=" " style={playBoardStyle} onClick={() => this.play(index + 1)} src={redIn}/></span>);
      case 3: return (<span style={cellStyle}><img key={(mIndex.toString() + index.toString())}  alt=" " style={playBoardStyle} src={winImage}/></span>);
      default: return (<span/>);
    }
  }

  render() {
    const resultStyle = (this.state.winner === 0) ? {display: 'none'} : {};
    const playStyle = (this.state.winner === 0) ? {} : {display: 'none'};
    const buttonStyle = {cursor: 'pointer', fontSize: '16px'};

    return (
        <div className="App">
          <br/>
          <button style={buttonStyle} onClick={this.newGame}><b>New Game</b></button>
          <br/>
          <br/>
          <h2 style={playStyle}>{(this.state.currentPlayer === 1)?<img alt=" " className="App-currentPlay" src={blue}/>:(this.state.currentPlayer === 2)?<img alt=" " className="App-currentPlay" src={red}/>:<b/>} {this.state.playerColor[this.state.currentPlayer-1]}'s turn...</h2>
          <h2 style={resultStyle}>{this.renderResult()}</h2>
          {
            this.state.board.map((innerArray, mIndex) => (
                <div key={mIndex}>
                  {
                    innerArray.map((item, index) => (this.renderCell(item, mIndex, index)))
                  }
                </div>
              ))
          }
        </div>
    );
  }
}

export default App;