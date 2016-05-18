class CreatePointDetails < ActiveRecord::Migration
  def change
    create_table :point_details do |t|
      t.string :point
      t.time :start_time
      t.time :end_time
      t.integer :scope
      t.decimal :sales
      t.integer :people
      t.string :product
      t.references :report, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
