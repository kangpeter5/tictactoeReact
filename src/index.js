import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" rel={props.rel} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                rel={i} 
                value={this.props.squares[i]}
                onClick={ () => this.props.onClick(i) } 
            />
        );
    }
  
    render() {
        return (
            <div>
                <div className="board-row" rel="1">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row" rel="2">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row" rel="3">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            colNum: 0,
            rowNum: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let rowNew = 0;
        let colNew = 0;

        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        if(i >= 0 && i <= 2){
            rowNew = 1;
            colNew = i+1;
        }
        if(i >= 3 && i <= 5){
            rowNew = 2;
            colNew = i-2;
        } 
        if(i >= 6 && i <= 8){
            rowNew = 3;
            colNew = i-5;
        }

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            colNum: colNew,
            rowNum: rowNew,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

        let num = step + 1;
        console.log("stepNumber:", num);
        
        let selected = document.querySelector('.game-info .selected');
        let el = document.querySelector(".game-info li:nth-of-type(" + num + ")");

        if(selected !== null){
            selected.classList.remove('selected');
            el.classList.add('selected');
        } else {
            el.classList.add('selected');
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map( (step,move) => {
            const desc = move ?
                'Go to move #' + move + " (col: "+ this.state.colNum + ", row:" + this.state.rowNum + ")" :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={ () => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if(winner){
            status = 'Winner: ' + winner;
        }else{
            status = 'Current player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}