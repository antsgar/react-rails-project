require 'csv'
require 'matrix'

class Api::QuestionController < ApplicationController
  MAX_CONTEXT_LEN = 500
  DELIMITER = "\n"
  DELIMITER_LEN = 1

  def initialize
    @ai_service = AiService.new()
    @embeddings_csv = CSV.parse(File.read("book.pdf.embeddings.csv"), headers: true, converters: :numeric)
    @book_csv = CSV.parse(File.read("book.pdf.pages.csv"), headers: true)
  end

  def create
    content = params[:question][:content]
    question = Question.find_by content: content
    unless question
      context = get_context(content)
      answer = @ai_service.ask_question(content, context)
      question = Question.create!({ :content => content, :answer => answer })
    end
    render json: question.to_json(only: %i[content answer])
  end

  def random
    question = Question.all.sample(1).first
    render json: question.to_json(only: %i[content answer])
  end

  private

  def get_pages_indexes_sorted_by_relevance(question_embedding_vector)
    dot_products = []
    @embeddings_csv.each do |page_embedding|
      # Don't include first element of the array which is the page number
      page_embedding_vector = Vector.elements(page_embedding[1..])
      dot_product = question_embedding_vector.dot(page_embedding_vector)
      dot_products.push(dot_product)
    end
    indexes = dot_products.map.with_index.sort.map(&:last)
    return indexes
  end

  def get_page_content(index)
    return @book_csv[index]["content"]
  end

  def get_context(content)
    question_embedding = @ai_service.get_embedding(content)
    question_embedding_vector = Vector.elements(question_embedding)
    page_indexes_by_relevance = get_pages_indexes_sorted_by_relevance(question_embedding_vector)
    context_len = 0
    context = ""
    page_indexes_by_relevance.each do |index|
      page_content = get_page_content(index)
      page_tokens = page_content.split
      page_len = page_tokens.size
      if (context_len + page_len + DELIMITER_LEN) > MAX_CONTEXT_LEN
        space_left = MAX_CONTEXT_LEN - context_len
        context.concat(page_tokens[0..space_left - 1].join(" "))
        break
      end
      context.concat(page_content)
      context.concat(DELIMITER)
      context_len += page_len + DELIMITER_LEN
    end
    return context
  end
end
