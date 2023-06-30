import React, { ChangeEvent } from "react"
import { act, renderHook, waitFor } from "@testing-library/react"
import useHome from "../hooks/useHome"

const TEST_CONTENT = "Test content"
const TEST_ANSWER = "Test answer"

describe("useHome hook", () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            content: TEST_CONTENT,
            answer: TEST_ANSWER,
          }),
      }) as Promise<Response>
    })
  })

  test("should update question content on change", async () => {
    const { result } = renderHook(() => useHome())

    act(() => {
      result.current.onQuestionContentChange({
        target: {
          value: TEST_CONTENT,
        },
      } as ChangeEvent<HTMLTextAreaElement>)
    })
    await waitFor(() => {
      expect(result.current.questionContent).toEqual(TEST_CONTENT)
    })
  })

  test("should call api to create question and set answer on submit", async () => {
    const { result } = renderHook(() => useHome())

    act(() => {
      result.current.onSubmit({
        preventDefault: () => null,
      } as unknown as React.FormEvent<HTMLFormElement>)
    })
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/question",
        expect.objectContaining({
          body: expect.stringContaining(result.current.questionContent),
        })
      )
      expect(result.current.answer).toEqual(TEST_ANSWER)
      expect(result.current.hasError).toEqual(false)
    })
  })

  test("should call api to get random question", async () => {
    const { result } = renderHook(() => useHome())

    act(() => {
      result.current.onLuckyQuestionClick({
        preventDefault: () => null,
      } as unknown as React.MouseEvent<HTMLButtonElement>)
    })
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/question/random")
      expect(result.current.questionContent).toEqual(TEST_CONTENT)
      expect(result.current.answer).toEqual(TEST_ANSWER)
      expect(result.current.hasError).toEqual(false)
    })
  })

  test("should return errored state if error has occurred", async () => {
    const { result } = renderHook(() => useHome())

    global.fetch = jest.fn().mockImplementationOnce(() => {
      return Promise.reject() as Promise<Response>
    })

    act(() => {
      result.current.onSubmit({
        preventDefault: () => null,
      } as unknown as React.FormEvent<HTMLFormElement>)
    })
    await waitFor(() => {
      expect(result.current.hasError).toEqual(true)
    })
  })

  afterAll(() => {
    ;(global.fetch as jest.Mock).mockClear()
  })
})
