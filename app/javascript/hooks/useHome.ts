import { ChangeEventHandler, FormEventHandler, MouseEventHandler, useState } from "react"

type Question = {
  content: string
  answer: string
}

type UseHomeReturn = {
  onSubmit: FormEventHandler<HTMLFormElement>
  onLuckyQuestionClick: MouseEventHandler<HTMLButtonElement>
  onAskAnotherQuestionClick: () => void
  onQuestionContentChange: ChangeEventHandler<HTMLTextAreaElement>
  questionContent: string
  answer: string | undefined
  isLoading: boolean
  isLuckyQuestionLoading: boolean
  isTypingAnswer: boolean
  hasError: boolean
}

const useHome = (): UseHomeReturn => {
  const [answer, setAnswer] = useState<string>()
  const [questionContent, setQuestionContent] = useState<string>("What is The Minimalist Entrepreneur about?")
  const [isLoading, setIsLoading] = useState(false)
  const [isLuckyQuestionLoading, setIsLuckyQuestionLoading] = useState(false)
  const [isTypingAnswer, setIsTypingAnswer] = useState(false)
  const [hasError, setHasError] = useState(false)

  const setAnswerWithTypewriterEffect = (newAnswer: string): void => {
    setAnswer("")
    const answerArr = newAnswer.split("")
    setIsTypingAnswer(true)
    const interval = setInterval(() => {
      if (answerArr.length > 0) {
        setAnswer((answer: string | undefined) => `${answer ?? ""}${answerArr.shift()}`)
      } else {
        clearInterval(interval)
        setIsTypingAnswer(false)
      }
    }, 50)
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setHasError(false)
    setIsLoading(true)
    try {
      const tokenElement = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
      const token = tokenElement?.content
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
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const onLuckyQuestionClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()
    setHasError(false)
    setIsLuckyQuestionLoading(true)
    try {
      const response = await fetch("/api/question/random")
      const question: Question = await response.json()
      setQuestionContent(question.content)
      setAnswerWithTypewriterEffect(question.answer)
    } catch {
      setHasError(true)
    } finally {
      setIsLuckyQuestionLoading(false)
    }
  }

  const onAskAnotherQuestionClick = (): void => {
    setAnswer(undefined)
  }

  const onQuestionContentChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setQuestionContent(event.target.value)
  }

  return {
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
  }
}

export default useHome
