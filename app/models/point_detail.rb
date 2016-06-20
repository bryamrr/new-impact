class PointDetail < ActiveRecord::Base
  belongs_to :report
  belongs_to :activity_mode
  has_many :photos, :dependent => :destroy
  has_many :comments, :dependent => :destroy
  has_many :quantities, :dependent => :destroy

  validates :point, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :report, presence: true
end
