class Expense < ActiveRecord::Base
  belongs_to :report
  belongs_to :item
  belongs_to :voucher
end
