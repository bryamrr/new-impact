class Report < ActiveRecord::Base
  belongs_to :company
  belongs_to :user
  belongs_to :activity
  belongs_to :district
  belongs_to :report_type
end
