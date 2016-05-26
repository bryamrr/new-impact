class AddProvinceRefToReports < ActiveRecord::Migration
  def change
    add_reference :reports, :province, index: true, foreign_key: true
  end
end
