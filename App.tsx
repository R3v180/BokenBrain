import React, { useState, useEffect } from 'react';
import data from './data.json';
import './style.css';

const durationOptions = [  { label: '1 minuto', value: 1 },  { label: '3 minutos', value: 3 },  { label: '5 minutos', value: 5 },];

const getCategories = () => {
  const allCategories = data.reduce((acc, curr) => {
    if (!acc.includes(curr.category)) {
      acc.push(curr.category);
    }
    return acc;
  }, []);

  return allCategories.map((category) => {
    return {
      label: category,
      value: category,
    };
  });
};

const App = () => {
  const [duration, setDuration] = useState(1);
  const [categories, setCategories] = useState(getCategories().map(c => c.value));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [lastQuestionAnswer, setLastQuestionAnswer] = useState('');

  useEffect(() => {
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      setGameOver(true);
    }
  }, [timeLeft]);

  const startGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(duration * 60);
    setGameOver(false);
    setShowAnswer(false);
    setLastAnswerCorrect(false);
    setLastQuestionAnswer('');
  };

  const checkAnswer = (answer) => {
    const correctAnswer = data[currentQuestion].answer;
    const isCorrect = answer === correctAnswer;
    if (isCorrect) {
      setScore(score + 10);
    } else {
      setScore(score - 5);
    }

    setShowAnswer(true);
    setLastAnswerCorrect(isCorrect);
    setLastQuestionAnswer(correctAnswer);
    setTimeout(() => {
      if (currentQuestion + 1 >= data.length) {
        setCurrentQuestion(0);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
      setShowAnswer(false);
      setLastAnswerCorrect(false);
      setLastQuestionAnswer('');
    }, 5000);
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = e.target.checked
      ? [...categories, e.target.value]
      : categories.filter((category) => category !== e.target.value);
    setCategories(selectedCategories);
  };

  const handleDialogClose = () => {
    if (score > highScore) {
      setHighScore(score);
    }
    setDuration(0);
    setCategories([]);
  };

  if (gameOver) {
    return (
      <div className="app">
        <div>
          <h1>Juego de preguntas y respuestas</h1>
          <div className="categorias">
            <h2>Categorías:</h2>
            {getCategories().map((category) => (
              <div key={category.value}>
                <label>
                  {category.label}
                  <input
                    type="checkbox"
                    value={category.value}
                    defaultChecked={true}
                    onChange={handleCategoryChange}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
          </div>
          <div className="duracion">
            <h2>Partida:</h2>
            {durationOptions.map((option) => (
              <div key={option.value}>
                <label>
                  {option.label}
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    defaultChecked={option.value === 1}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
            ))}
          </div>
          <button
            className="comenzar"
            onClick={startGame}
            disabled={!duration || categories.length === 0}
          >
            Nueva partida
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="puntuacion">
        <div>Puntuación: {score}</div>
        <div>Puntuación máxima: {highScore}</div>
        <div>
          Tiempo restante: {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? "0" : ""}
          {timeLeft % 60}
        </div>
      </div>
      {showAnswer && (
        <div
          className={`respuesta ${
            lastAnswerCorrect ? "correcta" : "incorrecta"
          }`}
        >
          {lastAnswerCorrect ? "Correcto!" : "Incorrecto."} La respuesta correcta es:{" "}
          {lastQuestionAnswer}.
        </div>
      )}
      <div className="pregunta">
        <div>{data[currentQuestion].question}</div>
        <div className="opciones">
          {data[currentQuestion].options.map((option) => (
            <div key={option}>
              <button className="opcion" onClick={() => checkAnswer(option)}>
                {option}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
