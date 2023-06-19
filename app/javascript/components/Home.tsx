import React, { useState } from "react"

type Question = {
  content: string
  answer?: string
}

const Home = () => {
  const [answer, setAnswer] = useState<string>()
  const [questionContent, setQuestionContent] = useState<string>("What is The Minimalist Entrepreneur about?")

  const onSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault()
    const tokenElement: HTMLMetaElement = document.querySelector('meta[name="csrf-token"]')
    const token = tokenElement.content
    const response = await fetch("/api/question", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: questionContent,
      }),
    })
    const createdQuestion: Question = await response.json()
    setAnswer(createdQuestion.answer)
  }

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
      <div>
        <p className="text">
          This is an experiment in using AI to make Sahil Lavignia's book's content more accessible. Ask a question and
          AI'll answer it in real-time:
        </p>
        <form onSubmit={onSubmit}>
          <textarea
            name="question"
            className="question-box"
            value={questionContent}
            onChange={(event: React.FormEvent<HTMLTextAreaElement>) => setQuestionContent(event.target.value)}
          />
          {!answer && (
            <div className="buttons-container">
              <button type="submit" className="button-primary">
                Ask question
              </button>
              <button className="button-secondary">I'm feeling lucky</button>
            </div>
          )}
        </form>
        {answer && (
          <>
            <p>
              <strong>Answer:</strong> <span>{answer}</span>
            </p>

            <button className="button button-primary">Ask another question</button>
          </>
        )}
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
