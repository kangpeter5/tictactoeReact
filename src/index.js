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
        let rows = [];
        for(var i=0; i<3; i++){
            let cell = []

            for(var j=0; j<3; j++){
                let rel

                if (i === 0) {
                    rel = j
                    cell.push(this.renderSquare(rel))
                }
                if (i === 1) {
                    rel = j + 3
                    cell.push(this.renderSquare(rel))
                }
                if (i === 2){
                    rel = j + 6
                    cell.push(this.renderSquare(rel))
                }
            }
            rows.push(
                <div className="board-row" rel={i}>{cell}</div>
            )
        }
        return (
            <div>
                {rows}
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
                chosen: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            ascOrder: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                chosen: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

        let num = step + 1;
        let selected = document.querySelector('.game-info .selected');
        let el = document.querySelector(".game-info li:nth-of-type(" + num + ")");

        if(selected !== null){
            selected.classList.remove('selected')
            el.classList.add('selected')
        } else {
            el.classList.add('selected')
        }
    }

    changeOrder(){
        this.setState({
            ascOrder: !this.state.ascOrder,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map( (step,move) => {
            let col = step.chosen % 3 + 1
            let row = Math.floor(step.chosen/3) + 1

            const desc = move ?
                'Go to move #' + move + " (col: "+ col + ", row:" + row+ ")" :
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
        if(!this.state.ascOrder){
            moves.sort(function(a,b){
                return b.key - a.key;
            });
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
                    <div className="status">{status}</div>
                    <div className="order">
                        <button onClick={ () => this.changeOrder() }>Change Order</button>
                    </div>
                    <ol className="list-moves">{moves}</ol>
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