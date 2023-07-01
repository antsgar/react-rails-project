require 'csv'
require 'rubygems'
require 'pdf/reader'

BOOK_CONTENT_FILENAME = "book.pdf.pages.csv"
BOOK_CONTENT_HEADERS = ["title", "content"]

namespace :generate_csvs do
  desc "Generate csv containing book pages"
  task :generate_book_content_csv, [:filename] do |t, args|
    pages = load_pdf_pages(args[:filename])
    generate_csv(pages)
  end

  desc "Generate csv containing embeddings per page"
  task generate_embeddings_csv: :environment do
  end

  def load_pdf_pages(filename)
    reader = PDF::Reader.new(filename)
    return reader.pages
  end

  def generate_csv(pdf_pages)
    CSV.open(BOOK_CONTENT_FILENAME, "w", write_headers: true, headers: BOOK_CONTENT_HEADERS) do |csv|
      pdf_pages.each_with_index do |page, index|
        csv << ["Page #{index}", page.text]
      end
    end
  end

end
