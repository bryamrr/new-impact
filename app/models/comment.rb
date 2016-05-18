class Comment < ActiveRecord::Base
  belongs_to :comment_type
  belongs_to :point_detail
end
