import React, { useState, useEffect } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Shuffle helper
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://church-portal-backend.onrender.com/api/quizes/fetch/"); // Adjust URL
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();

      const formattedQuestions = data.results.map((q) => {
        const options = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
        return {
          question: q.question,
          options,
          correct_answer: q.correct_answer,
        };
      });

      setQuestions(formattedQuestions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (option === questions[currentIndex].correct_answer) {
      setScore(score + 1);
      goToNextQuestion();
    } else {
      // Show correct answer status
      setStatusMessage(`Incorrect! Correct answer: ${questions[currentIndex].correct_answer}`);
      setShowStatus(true);

      // Wait 2 seconds then go to next question
      setTimeout(() => {
        setShowStatus(false);
        goToNextQuestion();
      }, 2000);
    }
  };

  const goToNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption("");
    } else {
      // All questions answered
      setShowStatus(true);
      setStatusMessage(`Quiz Finished! Your final score is ${score} / ${questions.length}`);
    }
  };

  if (!questions.length) return <p>Loading questions...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      {showStatus ? (
        <div style={{ margin: "20px 0", color: "red", fontWeight: "bold" }}>
          {statusMessage}
        </div>
      ) : null}

      {currentIndex < questions.length && !showStatus && (
        <div>
          <h3>Question {currentIndex + 1}:</h3>
          <p dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }}></p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {questions[currentIndex].options.map((option, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => handleOptionClick(option)}
                  dangerouslySetInnerHTML={{ __html: option }}
                  style={{ padding: "10px 20px", cursor: "pointer" }}
                ></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        Score: {score} / {questions.length}
      </div>
    </div>
  );
};

export default Quiz;
