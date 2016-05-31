class Province < ActiveRecord::Base
  belongs_to :department
  has_many :districts
  has_many :reports
  has_many :users

  validates :name, presence: true
  validates :department, presence: true
end
