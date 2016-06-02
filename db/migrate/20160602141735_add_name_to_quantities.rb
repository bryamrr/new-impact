class AddNameToQuantities < ActiveRecord::Migration
  def change
    add_column :quantities, :name, :string
  end
end
