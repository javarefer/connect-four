/**
 * Connect Four Game for 2 players
 * Version 1.0
 * Author: Rahul Sapkal (rahul@javareference.com)
 * Copyright 2019
 * ---------------------------------------------------
 * This is a two player Connect Four Game
 */

import React from 'react';

//import images
import red from './red.png';
import blue from './blue.png';
import blueIn from './bluein.png';
import redIn from './redin.png';
import empty from './empty.png';

//import sounds
import win1Sound from './sound/win1.wav';
import win2Sound from './sound/win2.wav';
import win3Sound from './sound/win3.wav';
import win4Sound from './sound/win4.wav';
import win5Sound from './sound/win5.wav';
import win6Sound from './sound/win6.wav';
import win7Sound from './sound/win7.mp3';
import win8Sound from './sound/win8.wav';
import play1Sound from './sound/play1.wav';
import play2Sound from './sound/play2.wav';
import startSound from './sound/start.wav';
import drawSound from './sound/draw.wav';

//import css
import './App.css';

/**
 * Connect Four Game App Class
 */
class App extends React.Component{

  victoryDirection = {
    down_vertical: {rowMod: 1, colMod: 0},
    right_horizontal: {rowMod: 0, colMod: 1},
    left_horizontal: {rowMod: 0, colMod: -1},
    bottom_right_diagonal: {rowMod: 1, colMod: 1},
    top_left_diagonal: {rowMod: -1, colMod: -1},
    top_right_diagonal: {rowMod: -1, colMod: 1},
    bottom_left_diagonal: {rowMod: 1, colMod: -1}
  };

  winningCells = [];

  startSound = new Audio(startSound);
  play1Sound = new Audio(play1Sound);
  play2Sound = new Audio(play2Sound);
  winSound = new Audio();
  winSounds = [win1Sound, win2Sound, win3Sound, win4Sound, win5Sound, win6Sound, win7Sound, win8Sound];
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
      playInProgress: false,
      themes: ['Light', 'Dark'],
      currentTheme: 0,
    };
  }

  /**
   * Start new game on this life cycle hook
   */
  componentDidMount() {
    this.newGame();
  }

  /**
   * This function returns true is the play on this column is allowed
   *
   * @param playColumn
   * @returns {boolean}
   */
  checkAllowPlay(playColumn){
    //Dont allow play if
    //- Another play is in progress OR
    //- The game has a winner OR
    //- Invalid column OR
    //- The column is fully played
    return !(this.state.playInProgress ||
             (this.state.winner > 0) ||
             (playColumn < 0) ||
             (this.state.board[0][playColumn] !== 0));
  }

  /**
   * This function is called when a player makes a play on a particular column
   * to find the valid cell down that column to land the piece. The column index
   * is passed to this function.
   *
   * First check if the play is valid. If yes then go row by row in the column to
   * find valid cell for the piece
   *
   * @param playColumn
   */
  play(playColumn) {
    if (this.checkAllowPlay(playColumn)) {
      //Find valid cell to land the piece
      let playRow;

      //Start from the 2nd row, we already checked the 1st row
      for (let currentRow = 1; currentRow < this.state.height; currentRow++) {
        if (this.state.board[currentRow][playColumn] !== 0) {
          playRow = currentRow - 1;
          break;
        }
      }
      //If playRow is not set that means the entire column is empty
      //place the piece on the last row of the play column
      if (playRow === undefined) {
        playRow = this.state.height - 1;
      }

      this.setState({playInProgress: true});
      //visualize the play with play row and play column
      this.visualizePlay(playRow, playColumn, 0);
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
      //this.playTicSound.play();

      let board = this.state.board;

      if(rowIndex > 0) {
        board[rowIndex-1][playCol] = 0;
      }

      board[rowIndex][playCol] = this.state.currentPlayer;

      this.setState({board: board});

      setTimeout(()=>this.visualizePlay(playRow, playCol, ++rowIndex), 100);
    }
    else {
      this.processPlay(playRow, playCol);
    }
  }

  /**
   * Process the play after every move
   *
   * @param playRow
   * @param playCol
   */
  processPlay(playRow, playCol) {
    if (this.checkVictoryForPlay(playRow, playCol)) {
      //play random winning sound
      this.winSound.src = this.winSounds[Math.floor(Math.random() * Math.floor(8))];
      this.winSound.play();

      this.setState({winner : this.state.currentPlayer});
      this.setConnectFour();

      console.log("Winner is " + this.state.winner);
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

  /**
   * This function check for a draw scenario after every move by checking if
   * the first row in the board data structure is all filled with values
   *
   * @returns {boolean}
   */
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
   * This function sets the winning four cells on the board data structure
   */
  setConnectFour() {
    let board = this.state.board;

    for(let i=0; i<this.winningCells.length; i++) {
      board[this.winningCells[i].row][this.winningCells[i].col] = 3;
    }

    this.setState({board: board});
  }

  /**
   * This function checks for connect four for given row and col.
   * It returns false if it's not a connect four
   * It returns true if it's a connect four
   * It returns undefined if it's not sure whether it is a connect four yet
   *
   * @param playRow
   * @param playCol
   * @returns {boolean|undefined}
   */
  checkConnectFour = (playRow, playCol) => {
    console.log(playRow + "   " + playCol);
    let value = this.state.board[playRow][playCol];

    if ((value === 0) || ((value > 0) && (this.state.currentPlayer !== value))) {
      return false;
    }

    this.winningCells.push({row: playRow, col: playCol});

    if(this.winningCells.length === 4)
      return true;
    else
      return undefined;
  };

  /**
   * This function checks a winning scenario after every move
   *
   * @param playRow
   * @param playCol
   * @returns {boolean}
   */
  checkVictoryForPlay (playRow, playCol) {
    return (this.checkVictory(playRow, playCol, true)(this.victoryDirection.down_vertical) ||
        this.checkVictory(playRow, playCol, true)(this.victoryDirection.left_horizontal) ||
        this.checkVictory(playRow, playCol)(this.victoryDirection.right_horizontal) ||
        this.checkVictory(playRow, playCol, true)(this.victoryDirection.top_left_diagonal) ||
        this.checkVictory(playRow, playCol)(this.victoryDirection.bottom_right_diagonal) ||
        this.checkVictory(playRow, playCol, true)(this.victoryDirection.top_right_diagonal) ||
        this.checkVictory(playRow, playCol)(this.victoryDirection.bottom_left_diagonal)
    );
  }

  /**
   * This function returns a function that checks for the victory
   * in given direction
   *
   * @param playRow
   * @param playCol
   * @param resetCells
   * @returns {function(...[*]=)}
   */
  checkVictory = (playRow, playCol, resetWinningCells) => {
    if (resetWinningCells) {
      //Reset winning cells
      this.winningCells = [{row: playRow, col: playCol}];
    }

    return (direction) => {
      for (let r=playRow+direction.rowMod, c=playCol+direction.colMod; ; r+=direction.rowMod, c+=direction.colMod) {
        if(((direction.rowMod === 1) && (r>=this.state.height)) ||
           ((direction.rowMod === -1) && (r<0)) ||
           ((direction.colMod === 1) && (c>=this.state.width)) ||
           ((direction.colMod === -1) && (c<0))) {
          break;
        }

        let isConnectFour = this.checkConnectFour(r, c);
        if (isConnectFour === false)
          break;
        else if (isConnectFour === true)
          return true;
      }
      return false;
    }
  };

  /**
   * This function starts a new game by initializing all the state variables
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
  };

  /**
   * Toggle Game Theme from Dark to Light
   */
  changeTheme = () => {
    if(this.state.currentTheme === 0) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';

      this.setState({currentTheme : 1});
    }
    else
    {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';

      this.setState({currentTheme : 0});
    }
  };

  /**
   * This function renders the result of the game win or draw
   *
   * @returns {*}
   */
  renderResult() {
    switch (this.state.winner) {
      case 1: return (<div><img alt=" " className="App-winner" src={blue}/> {this.state.playerColor[this.state.winner-1]} wins!!! </div>);
      case 2: return (<div><img alt=" " className="App-winner" src={red}/> {this.state.playerColor[this.state.winner-1]} wins!!!</div>);
      case 3: return (<div><img alt=" " className="App-winner" src={blue}/><img alt=" " className="App-winner" src={red}/> It's a draw!!! Play again!</div>);
      default: return (<span/>);
    }
  }

  /**
   * This function renders a cell on the board
   *
   * @param item
   * @param mIndex
   * @param index
   * @returns {*}
   */
  renderCell(item, mIndex, index) {
    let playBoardStyle = ((this.state.winner === 0) ? {cursor: 'pointer'} : (item === 3) ? {cursor: 'default', animation: 'App-logo-spin infinite 4s linear', opacity: '1.0'} : {cursor: 'default', opacity: '0.20'});
    let winImage = blue;

    if (item === 3) {
      if(this.state.winner === 2)
        winImage = red;
    }

    switch(item) {
      case 0: return (<img key={(mIndex.toString() + index.toString())} alt=" " style={playBoardStyle} onClick={() => this.play(index)} src={empty}/>);
      case 1: return (<img key={(mIndex.toString() + index.toString())}  alt=" " style={playBoardStyle} onClick={() => this.play(index)} src={blueIn}/>);
      case 2: return (<img key={(mIndex.toString() + index.toString())}  alt=" " style={playBoardStyle} onClick={() => this.play(index)} src={redIn}/>);
      case 3: return (<img key={(mIndex.toString() + index.toString())}  alt=" " style={playBoardStyle} src={winImage}/>);
      default: return (<span/>);
    }
  }

  /**
   * This function renders the board
   *
   * @returns {*}
   */
  render() {
    const resultStyle = (this.state.winner === 0) ? {display: 'none'} : {};
    const playStyle = (this.state.winner === 0) ? {} : {display: 'none'};
    const gameTitleStyle = (this.state.currentTheme === 0) ? {color: 'black', fontSize: '14px', fontWeight: 'bolder'} : {color: 'white', fontSize: '14px', fontWeight: 'bolder'};

    return (
        <div className="App">
          <div className="Game-header">
            <span style={gameTitleStyle}>CONNECT FOUR</span>
            <span className="Game-button-panel">
              <button className="Game-button" onClick={this.newGame}><b>New Game</b></button>
              <button id="themeButton" className="Game-button" onClick={this.changeTheme}><b>{this.state.themes[this.state.currentTheme]}</b></button>
            </span>
          </div>
          <div className="Game-container">
            <h2 style={playStyle}>{(this.state.currentPlayer === 1)?<img alt=" " className="App-currentPlay" src={blue}/>:(this.state.currentPlayer === 2)?<img alt=" " className="App-currentPlay" src={red}/>:<b/>} {this.state.playerColor[this.state.currentPlayer-1]}'s turn...</h2>
            <h2 style={resultStyle}>{this.renderResult()}</h2>
            {
              this.state.board.map((innerArray, mIndex) => (
                  <div className="Board-row" key={mIndex}>
                    {
                      innerArray.map((item, index) => (this.renderCell(item, mIndex, index)))
                    }
                  </div>
                ))
            }
          </div>
        </div>
    );
  }
}

export default App;