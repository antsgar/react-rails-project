import React from "react"

const Home = () => {
  return (
    <>
      <div className="header">
        <div>
          <a href="https://www.amazon.com/Minimalist-Entrepreneur-Great-Founders-More/dp/0593192397">
            <img src="/images/book-cover.png" loading="lazy" className="book-cover" />
          </a>
          <h1>Ask Sahil Lavignia's Book</h1>
        </div>
      </div>
      <div className="main">
        <p className="text">
          This is an experiment in using AI to make Sahil Lavignia's book's content more accessible. Ask a question and
          AI'll answer it in real-time:
        </p>
        <form action="/ask" method="post">
          <textarea
            name="question"
            className="question-box"
            defaultValue="What is The Minimalist Entrepreneur about?"
          />
          <div className="buttons-container">
            <button type="submit" className="button-primary">
              Ask question
            </button>
            <button className="button-secondary">I'm feeling lucky</button>
          </div>
        </form>
      </div>
      <footer>
        <p className="text credits">
          Book by <a href="https://twitter.com/shl">Sahil Lavingia</a> • Project by{" "}
          <a href="https://github.com/antsgar">Antonella Sgarlatta</a> • <a href="">Fork on GitHub</a>
        </p>
      </footer>
    </>
  )
}

export default Home
