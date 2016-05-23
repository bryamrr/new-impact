class Comment < ActiveRecord::Base
  belongs_to :comment_type
  belongs_to :point_detail

  validates :for, presence: true
  validates :comment, presence: true
  validates :comment_type, presence: true
  validates :point_detail, presence: true
end
