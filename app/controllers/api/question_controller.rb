class Api::QuestionController < ApplicationController
  def create
    params.permit(:content)
    content = params[:content]
    question = Question.find_by content: content
    unless question
      question = Question.create!({ :content => content, :answer => "Dummy answer"})
    end
    render json: question
  end
end
