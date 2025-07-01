"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const initialBoard = Array(9).fill(null);

export default function Home() {
  const [board, setBoard] = useState<(string | null)[]>(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ P1: 0, P2: 0, draw: 0 });
  const [startingPlayer, setStartingPlayer] = useState<"P1" | "P2">("P1");
  const [showResult, setShowResult] = useState(false);
  const [round, setRound] = useState(1);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? "P1" : "P2";
    setBoard(newBoard);

    const newWinner = calculateWinner(newBoard);

    if (newWinner) {
      setScores((prev) => ({
        ...prev,
        [newWinner]: prev[newWinner as "P1" | "P2"] + 1,
      }));
      setStartingPlayer((prev) => (prev === "P1" ? "P2" : "P1"));
      setShowResult(true);
      setRound(prev => prev + 1); 
    } else if (newBoard.every((cell) => cell !== null)) {
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      setStartingPlayer((prev) => (prev === "P1" ? "P2" : "P1"));
      setShowResult(true);
      setRound(prev => prev + 1); 
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const handleNewGame = () => {
    setBoard(initialBoard);
    setXIsNext(startingPlayer === "P1");
  };

  const handleResetAll = () => {
    handleNewGame();
    setScores({ P1: 0, P2: 0, draw: 0 });
    setRound(1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-pink-50 p-4">
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              {winner ? (
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={
                      winner === "P1" ? "text-yellow-500" : "text-blue-500"
                    }
                  >
                    🎉 Winner!
                  </span>
                  {winner === "P1" ? (
                    <Sun className="w-16 h-16 text-yellow-500 animate-bounce" />
                  ) : (
                    <Moon className="w-16 h-16 text-blue-500 animate-bounce" />
                  )}
                  <span className="text-lg">
                    {winner === "P1"
                      ? "Sun shines bright!"
                      : "Moon takes over!"}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-gray-600 text-2xl">
                    🤝 It's a Draw!
                  </span>
                  <span className="text-sm text-gray-500">
                    Nobody wins, try again!
                  </span>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center mt-4">
            <Button
              className="bg-black text-white font-semibold"
              onClick={() => {
                setShowResult(false);
                handleNewGame();
              }}
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-4xl font-bold mb-1"> Tic-Tac-Toe</h1>
      <p className="text-sm text-gray-500 mb-2">Sun vs Moon — who will win?</p>
      <p className="text-xs mb-6 text-gray-400">Round {round}</p>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-xl shadow-sm">
          {board.map((cell, i) => (
            <Button
              key={i}
              className="w-24 h-24 text-2xl font-bold border border-gray-300 hover:bg-gray-100 rounded-lg"
              variant="ghost"
              onClick={() => handleClick(i)}
            >
              {cell === "P1" && <Sun className="w-16 h-16 text-yellow-500" />}
              {cell === "P2" && <Moon className="w-16 h-16 text-blue-500" />}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm text-center">
            <p className="text-lg font-semibold text-gray-700">
              {winner
                ? `Winner: ${winner === "P1" ? "🌞 Sun" : "🌙 Moon"}`
                : isDraw
                ? "Draw!"
                : `${xIsNext ? "🌞 Sun" : "🌙 Moon"}'s turn`}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center w-72">
            <p className="text-lg font-semibold mb-6">Score Board</p>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1">
                  🌞 Sun
                </p>
                <p className="text-3xl font-extrabold text-yellow-500 bg-yellow-100 rounded-lg px-3 py-1 mt-2 shadow-md">
                  {scores.P1}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1">
                  🤝 Draws
                </p>
                <p className="text-3xl font-extrabold text-gray-600 bg-gray-100 rounded-lg px-3 py-1 mt-2 shadow-md">
                  {scores.draw}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700 bg-gray-100 rounded-full px-3 py-1">
                  🌙 Moon
                </p>
                <p className="text-3xl font-extrabold text-blue-500 bg-blue-100 rounded-lg px-3 py-1 mt-2 shadow-md">
                  {scores.P2}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleResetAll}
              variant="outline"
              className="flex-1"
            >
              Reset All
            </Button>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Built with React 19, Next.js 15, Tailwind CSS, and shadcn/ui
      </p>
    </main>
  );
}

function calculateWinner(board: (string | null)[]) {
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
  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
