class PointDetail < ActiveRecord::Base
  belongs_to :report
  has_many :photos
  has_many :comments
  has_many :quantities

  validates :point, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
end
