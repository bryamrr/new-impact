class PointDetail < ActiveRecord::Base
  belongs_to :report
  belongs_to :activity_mode
  has_many :photos
  has_many :comments
  has_many :quantities

  validates :point, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :report, presence: true
  validates :activity_mode, presence: true
end
