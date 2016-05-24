class Department < ActiveRecord::Base
  has_many :provinces

  validates :name, presence: true
end
