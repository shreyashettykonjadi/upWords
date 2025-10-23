import React, { useState, useEffect } from "react";
import "./UpwordsGame.css"; // we'll add this next

const BOARD_SIZE = 10;

// letter frequencies (like Scrabble)
const LETTER_DISTRIBUTION = {
  A: 7, B: 2, C: 2, D: 3, E: 8, F: 2, G: 2, H: 2,
  I: 7, J: 1, K: 1, L: 3, M: 2, N: 5, O: 6, P: 2,
  Q: 1, R: 5, S: 4, T: 5, U: 3, V: 1, W: 2, X: 1,
  Y: 2, Z: 1, " ": 2
};

// generate letter bag
const generateTileBag = () => {
  const bag = [];
  for (const [letter, count] of Object.entries(LETTER_DISTRIBUTION)) {
    for (let i = 0; i < count; i++) bag.push(letter);
  }
  return bag.sort(() => Math.random() - 0.5);
};

// create empty board
const createBoard = () =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

export default function UpwordsGame() {
  const [board, setBoard] = useState(createBoard);
  const [tileBag, setTileBag] = useState(generateTileBag());
  const [playerTiles, setPlayerTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [message, setMessage] = useState("Welcome to Upwords 🎯");

  // initial tiles for player
  useEffect(() => {
    const drawTiles = tileBag.slice(0, 7);
    setPlayerTiles(drawTiles);
    setTileBag(tileBag.slice(7));
  }, []);

  // handle placing a tile
  const placeTile = (r, c) => {
    if (!selectedTile) return;
    if (board[r][c] !== null) {
      setMessage("Cell already occupied ❌");
      return;
    }
    const newBoard = board.map((row) => row.slice());
    newBoard[r][c] = selectedTile;
    setBoard(newBoard);
    setPlayerTiles((prev) => prev.filter((t, i) => i !== selectedTile.index));
    setSelectedTile(null);
    setMessage(`Placed tile "${selectedTile.letter}" ✅`);
  };

  // select a tile from rack
  const selectTile = (tile, index) => {
    setSelectedTile({ letter: tile, index });
    setMessage(`Selected "${tile}"`);
  };

  return (
    <div className="game-container">
      <h1 className="title">🧩 Upwords</h1>
      <p className="message">{message}</p>

      <div className="board">
        {board.map((row, rIdx) => (
          <div className="row" key={rIdx}>
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                className={`cell ${cell ? "filled" : ""}`}
                onClick={() => placeTile(rIdx, cIdx)}
              >
                {cell && <span className="tile">{cell}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>

      <h3 className="rack-title">Your Tiles</h3>
      <div className="rack">
        {playerTiles.map((tile, i) => (
          <button
            key={i}
            className={`rack-tile ${
              selectedTile?.index === i ? "selected" : ""
            }`}
            onClick={() => selectTile(tile, i)}
          >
            {tile}
          </button>
        ))}
      </div>

      <button
        className="reset-btn"
        onClick={() => {
          setBoard(createBoard());
          setPlayerTiles(tileBag.slice(0, 7));
          setTileBag(tileBag.slice(7));
          setMessage("Board reset 🔄");
        }}
      >
        Reset Board
      </button>
    </div>
  );
}
