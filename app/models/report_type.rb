class ReportType < ActiveRecord::Base
  has_many :reports

  validates :name, presence: true
end
