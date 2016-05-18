class CreateQuantities < ActiveRecord::Migration
  def change
    create_table :quantities do |t|
      t.integer :used
      t.integer :remaining
      t.references :quantity_type, index: true, foreign_key: true
      t.references :point_detail, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
