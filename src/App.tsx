import React, { useState, useEffect } from 'react';
import { ArrowBigUp, ArrowBigDown, RefreshCw, Trophy } from 'lucide-react';

function App() {
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [lastGuess, setLastGuess] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');

  useEffect(() => {
    generateNewNumber();
  }, []);

  const generateNewNumber = () => {
    setSecretNumber(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setLastGuess(null);
    setMessage('Tente adivinhar o número secreto entre 1 e 100!');
    setAttempts(0);
    setGameWon(false);
    setMessageType('info');
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    const numberGuess = parseInt(guess);
    
    if (isNaN(numberGuess) || numberGuess < 1 || numberGuess > 100) {
      setMessage('Por favor, digite um número válido entre 1 e 100.');
      setMessageType('error');
      return;
    }

    setLastGuess(numberGuess);
    setAttempts(prev => prev + 1);

    if (numberGuess === secretNumber) {
      setMessage(`Parabéns! Você acertou em ${attempts + 1} tentativas!`);
      setMessageType('success');
      setGameWon(true);
    } else if (numberGuess < secretNumber) {
      setMessage('Muito baixo! Tente novamente.');
      setMessageType('error');
    } else {
      setMessage('Muito alto! Tente novamente.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Jogo de Adivinhação
        </h1>

        <div className={`p-4 rounded-lg text-center transition-all duration-300 ${
          messageType === 'error' ? 'bg-red-100 text-red-700' :
          messageType === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {messageType === 'error' && lastGuess !== null && (
              lastGuess > secretNumber ? 
                <ArrowBigUp className="w-6 h-6" /> :
                <ArrowBigDown className="w-6 h-6" />
            )}
            {messageType === 'success' && <Trophy className="w-6 h-6" />}
            <p className="font-medium">{message}</p>
          </div>
        </div>

        <form onSubmit={handleGuess} className="space-y-4">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Digite seu palpite"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="100"
            disabled={gameWon}
          />
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={gameWon}
              className={`flex-1 px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                gameWon 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Adivinhar
            </button>
            
            {gameWon && (
              <button
                type="button"
                onClick={generateNewNumber}
                className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Jogar Novamente
              </button>
            )}
          </div>
        </form>

        <div className="text-center text-gray-600">
          Tentativas: {attempts}
        </div>
      </div>
    </div>
  );
}

export default App;