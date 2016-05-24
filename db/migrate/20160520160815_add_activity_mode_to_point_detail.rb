class AddActivityModeToPointDetail < ActiveRecord::Migration
  def change
    add_reference :point_details, :activity_mode, index: true, foreign_key: true
  end
end
