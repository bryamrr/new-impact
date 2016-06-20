class Company < ActiveRecord::Base
  has_many :users
  has_many :reports
  has_many :activities, :dependent => :destroy

  validates :name, presence: true
end
