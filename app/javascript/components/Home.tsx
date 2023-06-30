import React from "react"
import useHome from "../hooks/useHome"

const Home = () => {
  const {
    onSubmit,
    onLuckyQuestionClick,
    onAskAnotherQuestionClick,
    onQuestionContentChange,
    questionContent,
    answer,
    isLoading,
    isLuckyQuestionLoading,
    isTypingAnswer,
  } = useHome()

  return (
    <>
      <div className="header">
        <div>
          <a href="https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397">
            <img src="/images/book-cover.png" loading="lazy" className="book-cover" />
          </a>
          <h1>Ask The Minimalist Entrepreneur</h1>
        </div>
      </div>
      <div>
        <p className="text">
          This is an experiment in using AI to make Sahil Lavignia's The Minimalist Entrepreneur's content more
          accessible. Ask a question and AI'll answer it in real-time:
        </p>
        <form onSubmit={onSubmit}>
          <textarea
            name="question"
            className="question-box"
            value={questionContent}
            onChange={onQuestionContentChange}
            disabled={isLoading || isLuckyQuestionLoading || isTypingAnswer}
          />
          {answer ? (
            <>
              <p className="answer">
                <strong>Answer:</strong> <span>{answer}</span>
              </p>
              {!isTypingAnswer && (
                <button className="button button-primary" onClick={onAskAnotherQuestionClick}>
                  Ask another question
                </button>
              )}
            </>
          ) : (
            <div className="buttons-container">
              <button type="submit" className="button-primary" disabled={isLoading}>
                {isLoading ? "Asking..." : "Ask question"}
              </button>
              <button className="button-secondary" onClick={onLuckyQuestionClick} disabled={isLuckyQuestionLoading}>
                {isLuckyQuestionLoading ? "Asking..." : "I'm feeling lucky"}
              </button>
            </div>
          )}
        </form>
      </div>
      <footer>
        <p className="text credits">
          Book & original project by <a href="https://twitter.com/shl">Sahil Lavingia</a> • Project by{" "}
          <a href="https://github.com/antsgar">Antonella Sgarlatta</a> • <a href="">Fork on GitHub</a>
        </p>
      </footer>
    </>
  )
}

export default Home
