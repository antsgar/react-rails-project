import React from "react"

const Home = () => {
  return (
    <>
      <div className="header">
        <div className="logo">
          <a href="https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397">
            <img src="/images/book-cover.png" loading="lazy" />
          </a>
          <h1>Ask Sahil Lavignia's Book</h1>
        </div>
      </div>
      <div className="main">
        <p className="credits">
          This is an experiment in using AI to make Sahil Lavignia's book's content more accessible. Ask a question and
          AI'll answer it in real-time:
        </p>
        <form action="/ask" method="post">
          <textarea name="question" id="question" defaultValue="What is The Minimalist Entrepreneur about?" />
          <div className="buttons">
            <button type="submit" id="ask-button">
              Ask question
            </button>
            <button id="lucky-button">I'm feeling lucky</button>
          </div>
        </form>
        <p id="answer-container" className="hidden">
          <strong>Answer:</strong> <span id="answer"></span>{" "}
          <button id="ask-another-button">Ask another question</button>
        </p>
      </div>
      <footer>
        <p className="credits">
          Book by <a href="https://twitter.com/shl">Sahil Lavingia</a> • Project by{" "}
          <a href="https://github.com/antsgar">Antonella Sgarlatta</a> • <a href="">Fork on GitHub</a>
        </p>
      </footer>
    </>
  )
}

export default Home
