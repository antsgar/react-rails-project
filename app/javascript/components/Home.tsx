import React from "react"
import useHome from "../hooks/useHome"
import { AUTHOR_LINK, BOOK_AUTHOR, BOOK_LINK, BOOK_TITLE, COVER_IMAGE_URL } from "../constants/constants"

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
    hasError,
  } = useHome()

  return (
    <>
      <div className="header">
        <div>
          <a href={BOOK_LINK}>
            <img src={COVER_IMAGE_URL} loading="lazy" className="book-cover" />
          </a>
          <h1>Ask {BOOK_TITLE}</h1>
        </div>
      </div>
      <div>
        <p className="text">
          This is an experiment in using AI to make {BOOK_AUTHOR}'s {BOOK_TITLE}'s content more accessible. Ask a
          question and AI'll answer it in real-time:
        </p>
        <form onSubmit={onSubmit}>
          <textarea
            name="question"
            className="question-box"
            value={questionContent}
            onChange={onQuestionContentChange}
            disabled={isLoading || isLuckyQuestionLoading || isTypingAnswer}
          />
          {hasError && (
            <p className="errorMessage">Oops! Something went wrong. Please try asking your question again.</p>
          )}
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
          Book by <a href={AUTHOR_LINK}>{BOOK_AUTHOR}</a> • Original project by{" "}
          <a href="https://twitter.com/shl">Sahil Lavingia</a> • Code by{" "}
          <a href="https://github.com/antsgar">Antonella Sgarlatta</a> •{" "}
          <a href="https://github.com/antsgar/react-rails-project">Fork on GitHub</a>
        </p>
      </footer>
    </>
  )
}

export default Home
