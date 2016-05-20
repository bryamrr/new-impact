class Company < ActiveRecord::Base
  has_many :users
  has_many :reports
  has_many :activities

  validates :name, presence: true
end
