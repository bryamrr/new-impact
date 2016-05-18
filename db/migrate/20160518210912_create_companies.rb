class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.string :email
      t.string :logo
      t.string :ruc

      t.timestamps null: false
    end
  end
end
