class Api::QuestionController < ApplicationController
  def create
    question = Question.create!({ :content => params[:content], :answer => "Dummy answer"})
    render json: question
  end
end
