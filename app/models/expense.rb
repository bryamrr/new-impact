class Expense < ActiveRecord::Base
  belongs_to :report
  belongs_to :item
  belongs_to :voucher

  validates :subtotal, presence: true
  validates :total, presence: true
end
