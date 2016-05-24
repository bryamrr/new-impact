class QuantityType < ActiveRecord::Base
  has_many :quantities

  validates :name, presence: true
end
