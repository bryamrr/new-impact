class District < ActiveRecord::Base
  belongs_to :province
  has_many :users
  has_many :reports

  validates :name, presence: true
end
