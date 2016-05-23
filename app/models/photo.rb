class Photo < ActiveRecord::Base
  belongs_to :point_detail

  validates :url, presence: true
  validates :point_detail, presence: true
end
