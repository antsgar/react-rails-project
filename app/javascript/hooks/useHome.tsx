import React, { useState } from "react"

type Question = {
  content: string
  answer: string
}

type UseHomeReturn = {
  onSubmit: (event: SubmitEvent) => Promise<void>
  onLuckyQuestionClick: (event: SubmitEvent) => Promise<void>
  onAskAnotherQuestionClick: () => void
  onQuestionContentChange: (event: React.FormEvent<HTMLTextAreaElement>) => void
  questionContent: string
  answer: string
  isTypingAnswer: boolean
}

const useHome = (): UseHomeReturn => {
  const [answer, setAnswer] = useState<string>()
  const [questionContent, setQuestionContent] = useState<string>("What is The Minimalist Entrepreneur about?")
  const [isTypingAnswer, setIsTypingAnswer] = useState(false)

  const setAnswerWithTypewriterEffect = (newAnswer: string): void => {
    setAnswer("")
    const answerArr = newAnswer.split("")
    setIsTypingAnswer(true)
    const interval = setInterval(() => {
      if (answerArr.length > 0) {
        setAnswer((answer: string) => `${answer}${answerArr.shift()}`)
      } else {
        clearInterval(interval)
        setIsTypingAnswer(false)
      }
    }, 50)
  }

  const onSubmit = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault()
    const tokenElement = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
    const token = tokenElement.content
    const response = await fetch("/api/question", {
      method: "POST",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: {
          content: questionContent,
        },
      }),
    })
    const question: Question = await response.json()
    setAnswerWithTypewriterEffect(question.answer)
  }

  const onLuckyQuestionClick = async (event: SubmitEvent): Promise<void> => {
    event.preventDefault()
    const response = await fetch("/api/question/random")
    const question: Question = await response.json()
    setQuestionContent(question.content)
    setAnswerWithTypewriterEffect(question.answer)
  }

  const onAskAnotherQuestionClick = (): void => {
    setAnswer(undefined)
  }

  const onQuestionContentChange = (event: React.FormEvent<HTMLTextAreaElement>): void => {
    setQuestionContent(event.target.value)
  }

  return {
    onSubmit,
    onLuckyQuestionClick,
    onAskAnotherQuestionClick,
    onQuestionContentChange,
    questionContent,
    answer,
    isTypingAnswer,
  }
}

export default useHome
