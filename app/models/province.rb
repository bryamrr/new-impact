class Province < ActiveRecord::Base
  belongs_to :department
  has_many :districts

  validates :name, presence: true
  validates :department, presence: true
end
