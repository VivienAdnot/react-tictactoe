import React from 'react';

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
                        return (
                            <div key={row} className="board-row">
                                {[0,1,2].map(column => {
                                    return this.renderSquare(row * 3 + column);
                                })}
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

export default Board;