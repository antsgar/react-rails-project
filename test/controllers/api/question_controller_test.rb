require "test_helper"

class Api::QuestionControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get api_question_create_url
    assert_response :success
  end
end
