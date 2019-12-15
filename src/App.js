import React from 'react';
import red from './red.png';
import blue from './blue.png';
import blueIn from './bluein.png';
import redIn from './redin.png';
import empty from './empty.png';
import './App.css';

class App extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      board : [],
      currentPlayer: 1,
      playerColor:['Blue', 'Red'],
      winner: 0,
      height: 6,
      width: 7
    };

    for(var i= 0; i<this.state.height; i++) {
      this.state.board.push(new Array(this.state.width).fill(0));
    }
  }

  play(column, player) {

    if((this.state.winner > 0) || (column < 1)){
        return;
    }

    if (player) {
      this.setState({currentPlayer : player});
    }

    let board = this.state.board;
    let found = false;
    let columnBlocked = false;

    let playRow, playCol = -1;

    for (var r=0; r<this.state.height; r++) {
      if (board[r][column-1] === 0)
        continue;
      else if (this.state.board[r][column-1] !== 0) {
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
      board[playRow][playCol] = this.state.currentPlayer;
    }

    this.setState({board: board});

    if(!columnBlocked) {
      if (!this.checkVictoryForPlay(playRow, playCol)) {
        this.setCurrentPlayer();
      }
    }
  }

  setCurrentPlayer() {
    if (this.state.currentPlayer === 1)
      this.setState({currentPlayer : 2});
    else
      this.setState({currentPlayer : 1});

    console.log( this.state.currentPlayer);
  }

  checkVictoryForPlay (playRow, playCol) {

    if(this.checkVictoryDown(playRow, playCol) ||
        this.checkVictorySide(playRow, playCol) ||
        this.checkVictoryLeftDia(playRow, playCol) ||
        this.checkVictoryRightDia(playRow, playCol)) {

      this.setState({winner : this.state.currentPlayer});
      return true;
    }

    return false;
  }

  checkVictoryDown(playRow, playCol) {
    //check down
    let count = 1;

    for (let r=playRow+1; r<this.state.height; r++) {
      let value = this.state.board[r][playCol];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    return false;
  }

  checkVictorySide(playRow, playCol) {
    let count = 1;

    //check left side
    for (let c=playCol-1; c>=0; c--) {
      let value = this.state.board[playRow][c];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    //check right side
    for (let c=(playCol+1); c<this.state.width; c++) {
      let value = this.state.board[playRow][c];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    return false;
  }

  checkVictoryLeftDia(playRow, playCol) {
    let count = 1;

    //check left-top side
    for (let c=playCol-1, r=playRow-1; (c>=0 && r>=0); c--, r--) {
      let value = this.state.board[r][c];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    //check right-bottom side
    for (let c=playCol+1, r=playRow+1; (c<this.state.width && r<this.state.height); c++, r++) {
      let value = this.state.board[r][c];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    return false;
  }

  checkVictoryRightDia(playRow, playCol) {
    let count = 1;

    //check right-top side
    for (let c=playCol+1, r=playRow-1; (c<this.state.width && r>=0); c++, r--) {
      let value = this.state.board[r][c];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    //check left-bottom side
    for (let c=playCol-1, r=playRow+1; (c>=0 && r<this.state.height); c--, r++) {
      let value = this.state.board[r][c];

      if ((value === 0) || ((value >0) && (this.state.currentPlayer !== value))) {
        break;
      }
      count++;
      if (count === 4) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check the victory horizontally. This function can be improved
   */
  checkHorizontal() {
    let count = 0;
    let currentPlayer = -1;
    for (let r=0; r<this.state.height; r++) {
      for (let c=0; c<this.state.width; c++) {
        let value = this.state.board[r][c];
        console.log(value + " " + count + " " + currentPlayer);
        if (value > 0) {
          if (currentPlayer === value){
            count++;

            if (count === 4) {
              this.setState({winner : currentPlayer});
              return true;
            }
          }
          else {
            currentPlayer = value;
            count = 1;
          }
        }
        else {
          currentPlayer = -1;
          count = 0;
        }
      }
    }

    return false;
  }

  /**
   * Check the victory vertically. This function can be improved
   */
  checkVertical(){
    var count = 0;
    var currentPlayer = -1;
    for (var c=0; c<this.state.width; c++) {
      for (var r=0; r<this.state.height; r++) {
        var value = this.state.board[r][c];
        console.log(value + " " + count + " " + currentPlayer);
        if (value > 0) {
          if (currentPlayer === value){
            count++;

            if (count === 4) {
              this.setState({winner : currentPlayer});
              return true;
            }
          }
          else {
            currentPlayer = value;
            count = 1;
          }
        }
        else {
          currentPlayer = -1;
          count = 0;
        }
      }
    }

    return false;
  }

  /**
   * Check the victory diagonally. T
   *  Ran out of time
   */
  checkDiagonal() {
    // The game is functional for Horizontal and Vertical.
    //Sorry ran out of time
  }

  /**
   * Print the winner
   */
  printVictory() {
    console.log("Winner is " + this.state.winner);
  }

  /**
   * Check Victory
   */
  checkVictory() {
    if (!this.checkHorizontal()) {
      if (!this.checkVertical()) {
        if (!this.checkDiagonal()) {
          return false;
        }
      }
    }

    this.printVictory();
    return true;
  }

  newGame = () => {
    this.setState({winner : 0});
    var board = new Array();
    for(var i= 0; i<this.state.height; i++) {
      board.push(new Array(this.state.width).fill(0));
    }
    this.setState({board : board});
    this.setState({currentPlayer : 1});
  }

  render() {
    var resultStyle = (this.state.winner === 0)? {display: 'none'} : {};
    var playStyle = (this.state.winner === 0)? {} : {display: 'none'};
    var buttonStyle = {cursor: 'pointer'};
    var playBoardStyle = (this.state.winner === 0)? {cursor: 'pointer'} : {cursor: 'default' , opacity: '0.50'};
    var playBarClass = (this.state.winner === 0) ? 'App-current' : 'App-winner';

    return (
        <div className="App">
          <br/>
          <button style={buttonStyle} onClick={this.newGame}><b>New Game</b></button>
          <br/>
          <br/>
          <h2 style={playStyle}>{(this.state.currentPlayer === 1)?<img className="App-currentPlay" src={blue}/>:(this.state.currentPlayer === 2)?<img className="App-currentPlay" src={red}/>:<b/>} {this.state.playerColor[this.state.currentPlayer-1]}'s turn...</h2>
          <h2 style={resultStyle}>{(this.state.currentPlayer === 1)?<img className="App-winner" src={blue}/>:(this.state.currentPlayer === 2)?<img className="App-winner" src={red}/>:<b/>} {this.state.playerColor[this.state.winner-1]} wins!!!</h2>
          {
            this.state.board.map((innerArray) => (
                <div >
                  {
                    innerArray.map((item, index) => (item === 0)?<img style={playBoardStyle} onClick={() => this.play(index + 1)} src={empty}/>:(item === 1)?<img style={playBoardStyle} onClick={() => this.play(index + 1)} src={blueIn}/>:<img style={playBoardStyle} onClick={() => this.play(index + 1)} src={redIn}/>)
                  }
                </div>
              ))
          }
        </div>
    );
  }
}

export default App;
