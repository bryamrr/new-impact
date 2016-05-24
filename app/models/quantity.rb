class Quantity < ActiveRecord::Base
  belongs_to :quantity_type
  belongs_to :point_detail

  validates :used, presence: true
  validates :quantity_type, presence: true
  validates :point_detail, presence: true
end
