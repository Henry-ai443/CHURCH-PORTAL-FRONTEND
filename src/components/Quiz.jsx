import React, { useState, useEffect } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // Fetch questions from DRF backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://church-portal-backend.onrender.com/api/quizes/fetch/"); // Adjust URL
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (option === questions[currentIndex].correct_option) {
      setScore(score + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption("");
    } else {
      setShowScore(true);
    }
  };

  if (!questions.length) return <p>Loading questions...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      {showScore ? (
        <div>
          <h2>Your Score: {score} / {questions.length}</h2>
        </div>
      ) : (
        <div>
          <h3>Question {currentIndex + 1}:</h3>
          <p>{questions[currentIndex].question}</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <button onClick={() => handleOptionClick("A")}>
                {questions[currentIndex].option_a}
              </button>
            </li>
            <li>
              <button onClick={() => handleOptionClick("B")}>
                {questions[currentIndex].option_b}
              </button>
            </li>
            <li>
              <button onClick={() => handleOptionClick("C")}>
                {questions[currentIndex].option_c}
              </button>
            </li>
            <li>
              <button onClick={() => handleOptionClick("D")}>
                {questions[currentIndex].option_d}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;
