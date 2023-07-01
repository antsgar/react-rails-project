class AiService
  CHAT_MODEL = "gpt-3.5-turbo"
  EMBEDDINGS_MODEL = "text-search-curie-doc-001"
  SYSTEM_MESSAGE = Rails.configuration.x.chat_prompt
  EXAMPLE_QUESTIONS = Rails.configuration.x.chat_example_questions

  def initialize
    @client = OpenAI::Client.new
  end

  def ask_question(content, context)
    messages = [{ role: "system", content: "#{SYSTEM_MESSAGE}#{context}" }]
    EXAMPLE_QUESTIONS.eacxwh do |question|
      messages.append(
        { role: "user", content: question[:content] },
        { role: "assistant", content: question[:answer] }
      )
    end
    messages.push({ role: "user", content: content })
    response =
      @client.chat(parameters: { model: CHAT_MODEL, messages: messages })
    return response["choices"][0]["message"]["content"]
  end

  def get_embedding(input)
    response =
      @client.embeddings(parameters: { model: EMBEDDINGS_MODEL, input: input })
    return response["data"][0]["embedding"]
  end
end
