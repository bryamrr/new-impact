class User < ActiveRecord::Base
  belongs_to :role
  belongs_to :company
  belongs_to :district
  has_many :reports

  validates :nick_name, presence: true
end
