class Api::QuestionController < ApplicationController
  def create
    render json: { answer: "Dummy answer" }
  end
end
