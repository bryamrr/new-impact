class ActivityType < ActiveRecord::Base
  has_many :activity_types
  has_many :activity_modes

  validates :name, presence: true
end
