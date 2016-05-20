class Activity < ActiveRecord::Base
  belongs_to :company
  belongs_to :activity_type
  has_many :reports

  validates :name, presence: true
end
