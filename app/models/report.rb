class Report < ActiveRecord::Base
  belongs_to :company
  belongs_to :user
  belongs_to :activity
  belongs_to :district
  belongs_to :province
  belongs_to :report_type
  has_many :expenses, :dependent => :destroy
  has_many :point_details, :dependent => :destroy

  validates :start_date, presence: true
  validates :end_date, presence: true
  validates :company, presence: true
  validates :user, presence: true
  validates :activity, presence: true
  validates :province, presence: true
  validates :report_type, presence: true

end
