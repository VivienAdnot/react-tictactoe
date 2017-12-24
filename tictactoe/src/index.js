import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {
                    [0,1,2].map(row => {
                        return <div key={row} className="board-row">
                            {[0,1,2].map(column => {
                                return this.renderSquare(row * 3 + column);
                            })}
                        </div>
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                moveCoordinates: null
            }],
            stepIndex: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepIndex + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = (this.state.xIsNext) ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                moveCoordinates: {
                    row: this.getRow(i),
                    column: this.getColumn(i)
                }
            }]),
            stepIndex: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(stepIndex) {
        this.setState({
            stepIndex: stepIndex,
            xIsNext: (stepIndex % 2 === 0)
        });
    }

    getRow(index) {
        let result = 0;
        do {
            index-= 3;
            if(index >= 0) result++;
        } while (index >= 0);
        
        return result;
    }

    getColumn(index) {
        return index % 3;
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepIndex];
        
        const winner = calculateWinner(current.squares);

        const moves = history.map((historyItem, moveIndex) => {
            const description = moveIndex ?
                `Go to move #${moveIndex} : ${historyItem.moveCoordinates.row} - ${historyItem.moveCoordinates.column}` :
                'Go to game start';

            const classNameMaybeBoldText = (moveIndex === this.state.stepIndex) ? 'bold-text' : '';

            return (
                <li key={moveIndex}>
                    <button className={classNameMaybeBoldText} onClick={() => this.jumpTo(moveIndex)}>
                        {description}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
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

// ==============================================

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
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        let [a, b, c] = lines[i];
        //console.log(a, b, c);

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}