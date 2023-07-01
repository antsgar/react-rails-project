require "test_helper"

class Api::QuestionControllerTest < ActionDispatch::IntegrationTest
  EXAMPLE_QUESTIONS = [
    {
      content: "How do I get more customers?",
      answer:
        "Focus on delivering value and solving a real problem for your customers."
    },
    {
      content: "What is The Minimalist Entrepreneur about?",
      answer:
        "The Minimalist Entrepreneur is a book about how to start and grow a business with less stress and fewer resources."
    }
  ]

  test "should create new question" do
    post "/api/question",
         params: {
           question: {
             content: EXAMPLE_QUESTIONS[0][:content]
           }
         }
    json_response = @response.parsed_body
    assert_equal EXAMPLE_QUESTIONS[0][:content], json_response["content"]
    assert_not_empty json_response["answer"]
  end

  test "should retrieve answer from the database if question exists" do
    Question.create!(
      {
        content: EXAMPLE_QUESTIONS[1][:content],
        answer: EXAMPLE_QUESTIONS[1][:answer]
      }
    )
    post "/api/question",
         params: {
           question: {
             content: EXAMPLE_QUESTIONS[1][:content]
           }
         }
    json_response = @response.parsed_body
    assert_equal EXAMPLE_QUESTIONS[1][:content], json_response["content"]
    assert_equal EXAMPLE_QUESTIONS[1][:answer], json_response["answer"]
  end

  test "should return random answer from database" do
    Question.create!(
      {
        content: EXAMPLE_QUESTIONS[0][:content],
        answer: EXAMPLE_QUESTIONS[0][:answer]
      }
    )
    Question.create!(
      {
        content: EXAMPLE_QUESTIONS[1][:content],
        answer: EXAMPLE_QUESTIONS[1][:answer]
      }
    )
    get "/api/question/random"
    json_response = @response.parsed_body
    assert_includes [
                      EXAMPLE_QUESTIONS[0][:content],
                      EXAMPLE_QUESTIONS[1][:content]
                    ],
                    json_response["content"]
    assert_includes [
                      EXAMPLE_QUESTIONS[0][:answer],
                      EXAMPLE_QUESTIONS[1][:answer]
                    ],
                    json_response["answer"]
  end
end
