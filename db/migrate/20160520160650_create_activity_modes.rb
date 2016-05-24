class CreateActivityModes < ActiveRecord::Migration
  def change
    create_table :activity_modes do |t|
      t.string :name
      t.text :info
      t.references :activity_type, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
