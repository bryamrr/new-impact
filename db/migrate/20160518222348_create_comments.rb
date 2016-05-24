class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :for
      t.references :comment_type, index: true, foreign_key: true
      t.references :point_detail, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
