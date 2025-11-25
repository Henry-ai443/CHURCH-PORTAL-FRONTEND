import React, { useState, useEffect } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/fetch-quiz/"); // your DRF URL
      if (!response.ok) throw new Error("Failed to fetch questions");
      const data = await response.json();

      const formattedQuestions = data.results.map((q) => {
        const options = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
        return {
          question: q.question,
          options,
          correct_answer: q.correct_answer,
          category: q.category
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
      setStatusMessage(`❌ Incorrect! Correct answer: ${questions[currentIndex].correct_answer}`);
      setShowStatus(true);

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
      setShowStatus(true);
      setStatusMessage(`🏆 Quiz Finished! Your final score is ${score} / ${questions.length}`);
    }
  };

  if (!questions.length) return <p style={{ textAlign: "center" }}>Loading questions...</p>;

  return (
    <div style={{
      maxWidth: "700px",
      margin: "50px auto",
      padding: "20px",
      borderRadius: "12px",
      backgroundColor: "#f5f5f5",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    }}>
      {/* Welcome */}
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Are you ready to test your knowledge? 🤔
      </h2>

      {/* Status */}
      {showStatus && (
        <div style={{
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "#ffe6e6",
          color: "#d8000c",
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {statusMessage}
        </div>
      )}

      {/* Question */}
      {currentIndex < questions.length && !showStatus && (
        <div>
          <h4 style={{ color: "#666", marginBottom: "5px" }}>Category: {questions[currentIndex].category}</h4>
          <h3 style={{ color: "#444" }}>Question {currentIndex + 1}:</h3>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}
             dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }}>
          </p>

          {/* Options */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {questions[currentIndex].options.map((option, idx) => (
              <li key={idx} style={{ marginBottom: "12px" }}>
                <button
                  onClick={() => handleOptionClick(option)}
                  dangerouslySetInnerHTML={{ __html: option }}
                  style={{
                    width: "100%",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = "#e0e0e0"}
                  onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
                ></button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score */}
      <div style={{ marginTop: "30px", fontSize: "18px", textAlign: "center", color: "#333" }}>
        Score: {score} / {questions.length}
      </div>
    </div>
  );
};

export default Quiz;
