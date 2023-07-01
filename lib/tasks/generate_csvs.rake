BOOK_CONTENT_FILENAME = "book.pdf.pages.csv"
BOOK_CONTENT_HEADERS = %w[title content]
EMBEDDINGS_FILENAME = "book.pdf.embeddings.csv"
EMBEDDINGS_HEADERS = ["title"]

namespace :generate_csvs do
  desc "Generate csv containing book pages"
  task :generate_book_content_csv, [:filename] do |t, args|
    require "csv"
    require "rubygems"
    require "pdf/reader"
    pages = load_pdf_pages(args[:filename])
    generate_book_content_csv(pages)
  end

  desc "Generate csv containing embeddings per page"
  task generate_embeddings_csv: :environment do
    require "csv"
    require "rubygems"
    book_content = CSV.parse(File.read(BOOK_CONTENT_FILENAME), headers: true)
    ai_service = AiService.new()
    embeddings = load_embeddings(book_content, ai_service)
    generate_embeddings_csv(embeddings)
  end

  def load_pdf_pages(filename)
    reader = PDF::Reader.new(filename)
    return reader.pages
  end

  def generate_book_content_csv(pdf_pages)
    CSV.open(
      BOOK_CONTENT_FILENAMEFILENAME,
      "w",
      write_headers: true,
      headers: BOOK_CONTENT_HEADERS
    ) do |csv|
      pdf_pages.each_with_index do |page, index|
        csv << ["Page #{index}", page.text]
      end
    end
  end

  def load_embeddings(book_content, ai_service)
    embeddings = []
    book_content.each do |page|
      page_embeddings = ai_service.get_embedding(page["content"])
      embeddings.push(page_embeddings)
    end
    return embeddings
  end

  def generate_embeddings_csv(embeddings)
    headers = EMBEDDINGS_HEADERS.concat([*0..embeddings[0].size] - 1)
    CSV.open(
      EMBEDDINGS_FILENAME,
      "w",
      write_headers: true,
      headers: headers
    ) do |csv|
      embeddings.each_with_index do |embedding, index|
        csv_row = ["Page #{index}"]
        csv_row.concat(embedding)
        csv << csv_row
      end
    end
  end
end
