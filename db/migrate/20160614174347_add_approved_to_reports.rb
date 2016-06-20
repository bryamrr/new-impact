class AddApprovedToReports < ActiveRecord::Migration
  def change
    add_column :reports, :approved, :boolean, :default => false
  end
end
