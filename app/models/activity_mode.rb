class ActivityMode < ActiveRecord::Base
  belongs_to :activity_type
  has_many :point_details

  validates :name, presence: true
  validates :activity_type, presence: true
end
