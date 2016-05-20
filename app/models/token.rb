class Token < ActiveRecord::Base
  belongs_to :user
  has_many :reports
  has_many :tokens
end
