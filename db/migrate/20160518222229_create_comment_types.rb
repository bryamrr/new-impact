class CreateCommentTypes < ActiveRecord::Migration
  def change
    create_table :comment_types do |t|
      t.string :name
      t.text :info

      t.timestamps null: false
    end
  end
end
