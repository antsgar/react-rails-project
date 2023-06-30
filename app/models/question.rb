class Question < ApplicationRecord
  validates :content, presence: true, length: { minimum: 1 }
  validates :answer, presence: true, length: { minimum: 1 }
end
