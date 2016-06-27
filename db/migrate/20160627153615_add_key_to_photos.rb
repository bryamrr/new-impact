class AddKeyToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :key, :string
  end
end
