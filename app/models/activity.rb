class Activity < ActiveRecord::Base
  belongs_to :company
  belongs_to :activity_type
end
