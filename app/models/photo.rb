class Photo < ActiveRecord::Base
  belongs_to :point_detail

  validates :url, presence: true
end
