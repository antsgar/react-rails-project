class Api::QuestionController < ApplicationController
  def initialize
    @chat_service = ChatService.new()
  end

  def create
    content = params[:question][:content]
    question = Question.find_by content: content
    unless question
      answer = @chat_service.ask(content)
      question = Question.create!({ :content => content, :answer => answer})
    end
    render json: question.to_json(only: %i[content answer])
  end

  def random
    question = Question.all.sample(1).first
    render json: question.to_json(only: %i[content answer])
  end
end
