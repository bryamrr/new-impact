class Quantity < ActiveRecord::Base
  belongs_to :quantity_type
  belongs_to :point_detail
end
