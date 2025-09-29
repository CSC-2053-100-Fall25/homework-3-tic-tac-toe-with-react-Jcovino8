import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [message, setMessage] = useState('');

  const winner = calculateWinner(squares);

  function handleClick(i) {
    // block if game over or square taken
    if (winner || squares[i]) return;

    // count X moves already on board
    const xCount = squares.filter((v) => v === 'X').length;

    // Strategy enforcement only for Player X and only for first two X moves
    if (xIsNext) {
      // FIRST X MOVE: must be a corner
      if (xCount === 0) {
        if (!isCorner(i)) {
          setMessage('Not a good choice!');
          return; // prevent move
        } else {
          setMessage('Good choice!');
        }
      }

      // SECOND X MOVE: conditional logic based on O's move
      if (xCount === 1) {
        const firstX = squares.findIndex((v) => v === 'X');
        const oInCenter = squares[4] === 'O';

        if (oInCenter) {
          // must place on diagonal opposite corner from first X (0<->8, 2<->6)
          const mustBe = oppositeCorner(firstX);
          if (i !== mustBe) {
            setMessage('Not a good choice!');
            return; // prevent move
          } else {
            setMessage('Good choice!');
          }
        } else {
          // O is NOT in center:
          // X must place in a corner with a BLANK space between it and first X,
          // the blank space cannot be the center, and it must NOT be diagonal.
          // Valid seconds are row/column corners two apart from firstX.
          const { validSeconds, betweenIndexFor } = alignedCornerOptions(firstX);
          const isValidCorner = validSeconds.includes(i);

          if (!isValidCorner) {
            setMessage('Not a good choice!');
            return;
          }
          const between = betweenIndexFor(i);
          const betweenIsCenter = between === 4;
          const betweenOccupiedByO = squares[between] === 'O';
          const betweenOccupied = squares[between] != null;

          // Must be blank and not center; also don't place if O is between
          if (betweenIsCenter || betweenOccupied || betweenOccupiedByO) {
            setMessage('Not a good choice!');
            return;
          } else {
            setMessage('Good choice!');
          }
        }
      }
    }

    // If we reach here, move is allowed
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {message && <div className="message">{message}</div>}

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// ===== Helpers for strategy =====
function isCorner(i) {
  return i === 0 || i === 2 || i === 6 || i === 8;
}

function oppositeCorner(i) {
  // Only defined for corners
  switch (i) {
    case 0: return 8;
    case 8: return 0;
    case 2: return 6;
    case 6: return 2;
    default: return -1;
  }
}




function alignedCornerOptions(firstX) {
  let validSeconds = [];
  let betweenIndexFor = () => -1;

  switch (firstX) {
    case 0:
      validSeconds = [2, 6];
      betweenIndexFor = (second) => (second === 2 ? 1 : 3);
      break;
    case 2:
      validSeconds = [0, 8];
      betweenIndexFor = (second) => (second === 0 ? 1 : 5);
      break;
    case 6:
      validSeconds = [0, 8];
      betweenIndexFor = (second) => (second === 0 ? 3 : 7);
      break;
    case 8:
      validSeconds = [2, 6];
      betweenIndexFor = (second) => (second === 2 ? 5 : 7);
      break;
    default:
      validSeconds = [];
      betweenIndexFor = () => -1;
  }

  return { validSeconds, betweenIndexFor };
}

// ===== Winner calc (unchanged) =====
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

